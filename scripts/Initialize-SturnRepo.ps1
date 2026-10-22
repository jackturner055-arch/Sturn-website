[CmdletBinding()]
param(
    [Parameter(Mandatory = $true)]
    [ValidatePattern('^https://github\.com/[^/]+/[^/]+(\.git)?$')]
    [string]$RepositoryUrl,

    [string]$DestinationPath = (Join-Path (Split-Path -Parent (Split-Path -Parent $PSScriptRoot)) 'Sturn-website')
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

$kitRoot = (Resolve-Path (Join-Path $PSScriptRoot '..')).Path
$destinationFull = [System.IO.Path]::GetFullPath($DestinationPath)

if (Test-Path $destinationFull) {
    throw "Destination already exists: $destinationFull . Choose a new destination or inspect it manually; this script will not overwrite it."
}

Write-Host "Checking GitHub CLI authentication..." -ForegroundColor Cyan
& gh auth status
if ($LASTEXITCODE -ne 0) {
    throw "GitHub CLI is not authenticated. Run 'gh auth login' and 'gh auth setup-git', then retry."
}

Write-Host "Cloning repository..." -ForegroundColor Cyan
& git clone $RepositoryUrl $destinationFull
if ($LASTEXITCODE -ne 0) { throw "git clone failed." }

Push-Location $destinationFull
try {
    $tracked = @(& git ls-files)
    if ($tracked.Count -gt 0) {
        throw "Repository is not empty. Bootstrap is intentionally limited to empty repositories."
    }

    & git checkout -B main
    if ($LASTEXITCODE -ne 0) { throw "Could not prepare main branch." }

    Get-ChildItem -LiteralPath $kitRoot -Force |
        Where-Object { $_.Name -notin @('.git', 'SturnDistribution-Starter-Kit.zip') } |
        ForEach-Object {
            Copy-Item -LiteralPath $_.FullName -Destination $destinationFull -Recurse -Force
        }

    & git add --all
    if ($LASTEXITCODE -ne 0) { throw "git add failed." }

    & git diff --cached --check
    if ($LASTEXITCODE -ne 0) { throw "Whitespace check failed. Fix the reported files before committing." }

    & git commit -m "chore: initialise SturnDistribution workflow"
    if ($LASTEXITCODE -ne 0) { throw "Initial commit failed." }

    & git push -u origin main
    if ($LASTEXITCODE -ne 0) { throw "Push failed. Review the error; do not force-push." }
}
finally {
    Pop-Location
}

Write-Host "`nBootstrap complete." -ForegroundColor Green
Write-Host "Repository: $destinationFull"
Write-Host "Next: cd into the repository and use .\scripts\Publish-Change.ps1 for future changes."
