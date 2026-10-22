[CmdletBinding()]
param(
    [Parameter(Mandatory = $true)]
    [ValidateNotNullOrEmpty()]
    [string]$Message,

    [string]$Branch = '',

    [switch]$Merge
)

Set-StrictMode -Version Latest
$ErrorActionPreference = 'Stop'

function Require-Command([string]$Name) {
    if (-not (Get-Command $Name -ErrorAction SilentlyContinue)) {
        throw "Required command '$Name' was not found. Install it and reopen PowerShell."
    }
}

Require-Command 'git'
Require-Command 'gh'

$repoRoot = (Resolve-Path (Join-Path $PSScriptRoot '..')).Path
Push-Location $repoRoot
try {
    $inside = (& git rev-parse --is-inside-work-tree 2>$null)
    if ($LASTEXITCODE -ne 0 -or $inside -ne 'true') {
        throw "This script must run inside the repository that contains it."
    }

    & gh auth status
    if ($LASTEXITCODE -ne 0) {
        throw "GitHub CLI is not authenticated. Run 'gh auth login' and 'gh auth setup-git'."
    }

    $currentBranch = (& git branch --show-current).Trim()
    if ($currentBranch -eq 'main' -or $currentBranch -eq 'master') {
        if ([string]::IsNullOrWhiteSpace($Branch)) {
            $Branch = 'work/' + (Get-Date -Format 'yyyyMMdd-HHmmss')
        }
        Write-Host "Creating branch $Branch..." -ForegroundColor Cyan
        & git switch -c $Branch
        if ($LASTEXITCODE -ne 0) { throw "Could not create branch '$Branch'." }
    }
    elseif ([string]::IsNullOrWhiteSpace($Branch)) {
        $Branch = $currentBranch
        Write-Host "Using current branch '$Branch'." -ForegroundColor Cyan
    }
    else {
        throw "Already on branch '$currentBranch'. Refusing to switch branches with possible uncommitted work. Rerun without -Branch, or commit/stash changes and switch manually."
    }

    & git add --all
    if ($LASTEXITCODE -ne 0) { throw "git add failed." }

    & git diff --cached --check
    if ($LASTEXITCODE -ne 0) { throw "Whitespace check failed. Review the output before committing." }

    $staged = @(& git diff --cached --name-only)
    if ($staged.Count -eq 0) {
        throw "No staged changes found. Nothing to commit."
    }

    Write-Host "Files to be committed:" -ForegroundColor Cyan
    $staged | ForEach-Object { Write-Host "  $_" }

    & git commit -m $Message
    if ($LASTEXITCODE -ne 0) { throw "Commit failed." }

    & git push -u origin $Branch
    if ($LASTEXITCODE -ne 0) { throw "Push failed. Review the error; do not force-push." }

    $prUrl = (& gh pr view --json url --jq .url 2>$null)
    if ($LASTEXITCODE -ne 0 -or [string]::IsNullOrWhiteSpace($prUrl)) {
        & gh pr create --fill --base main
        if ($LASTEXITCODE -ne 0) { throw "Pull request creation failed. The branch is pushed; open a PR manually if needed." }
        $prUrl = (& gh pr view --json url --jq .url).Trim()
    }

    Write-Host "`nPull request: $prUrl" -ForegroundColor Green

    if ($Merge) {
        Write-Host "Attempting normal squash merge. GitHub rules and required checks still apply..." -ForegroundColor Yellow
        & gh pr merge --auto --squash --delete-branch
        if ($LASTEXITCODE -ne 0) {
            throw "Merge was not completed. Review the pull request and checks on GitHub. No force merge was attempted."
        }
        Write-Host "Merge command completed. Sync your local main branch before the next change." -ForegroundColor Green
    }
    else {
        Write-Host "Not merging automatically. Review the PR and checks; merge on GitHub when ready." -ForegroundColor Yellow
    }
}
finally {
    Pop-Location
}
