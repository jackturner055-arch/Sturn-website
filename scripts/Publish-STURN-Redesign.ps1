# STURN Redesign — merge, publish and verify Render deployment
# This script is downloaded and run directly by the one-line PowerShell command.
$ErrorActionPreference = "Stop"
$RepoPath = Join-Path $HOME "Sturn-website"
$FeatureBranch = "redesign/full-site-release-20261023-021147"
$ProductionBranch = "main"
$SiteUrl = "https://sturn-website.onrender.com"
$ExpectedMarker = "Cooling the compute."
$TimeoutMinutes = 8

function Stop-WithMessage([string]$Message) {
    Write-Host ""
    Write-Host "STOPPED: $Message" -ForegroundColor Red
    exit 1
}
function Invoke-Git([string[]]$GitArgs) {
    & git -C $RepoPath @GitArgs
    if ($LASTEXITCODE -ne 0) { throw "Git command failed: git $($GitArgs -join ' ')" }
}

Write-Host "STURN redesign publisher" -ForegroundColor Cyan
Write-Host "Repository: $RepoPath"
Write-Host "Feature:    $FeatureBranch"
Write-Host "Target:     origin/$ProductionBranch"
Write-Host ""

if (-not (Test-Path (Join-Path $RepoPath ".git"))) {
    Stop-WithMessage "Could not find the existing repository at '$RepoPath'. Expected $HOME\Sturn-website. No changes were made."
}
if (-not (Get-Command git -ErrorAction SilentlyContinue)) {
    Stop-WithMessage "Git is not installed or not on PATH. Install Git for Windows, reopen PowerShell, and retry."
}
if (-not (Get-Command node -ErrorAction SilentlyContinue) -or -not (Get-Command npm -ErrorAction SilentlyContinue)) {
    Stop-WithMessage "Node.js/npm was not found on PATH. Install Node.js 20 LTS, reopen PowerShell, and retry."
}

$porcelain = & git -C $RepoPath status --porcelain
if ($LASTEXITCODE -ne 0) { Stop-WithMessage "Unable to inspect Git working-tree status." }
if ($porcelain) {
    Write-Host $porcelain
    Stop-WithMessage "Your local repository has uncommitted changes. Commit or safely stash them first; this script will not overwrite them."
}
$origin = (& git -C $RepoPath remote get-url origin).Trim()
if ($LASTEXITCODE -ne 0 -or $origin -notmatch "github\.com[:/]jackturner055-arch/Sturn-website(?:\.git)?$") {
    Stop-WithMessage "The origin remote is not the expected STURN repository (jackturner055-arch/Sturn-website). Found: $origin"
}

$stamp = Get-Date -Format "yyyyMMdd-HHmmss"
$backupDir = Join-Path $HOME "STURN-Backups"
New-Item -ItemType Directory -Force -Path $backupDir | Out-Null
$bundlePath = Join-Path $backupDir "before-redesign-merge-$stamp.bundle"

Write-Host "[1/6] Fetching branches and creating a recoverable Git backup..." -ForegroundColor Cyan
Invoke-Git @("fetch", "origin", "--prune")
Invoke-Git @("bundle", "create", $bundlePath, "--all")
Write-Host "Backup created: $bundlePath" -ForegroundColor Green

$remoteFeature = & git -C $RepoPath show-ref --verify --quiet "refs/remotes/origin/$FeatureBranch"
if ($LASTEXITCODE -ne 0) { Stop-WithMessage "The expected redesign branch was not found on origin. No production changes were made." }
$remoteMain = (& git -C $RepoPath rev-parse "origin/$ProductionBranch").Trim()
$featureHead = (& git -C $RepoPath rev-parse "origin/$FeatureBranch").Trim()
$base = (& git -C $RepoPath merge-base "origin/$ProductionBranch" "origin/$FeatureBranch").Trim()
if ($LASTEXITCODE -ne 0 -or $base -ne $remoteMain) {
    Stop-WithMessage "The redesign branch is not a simple forward merge from the current main branch. Review branches before proceeding."
}

$tempWorktree = Join-Path ([System.IO.Path]::GetTempPath()) ("sturn-release-" + $stamp)
Write-Host "[2/6] Preparing an isolated release workspace..." -ForegroundColor Cyan
Invoke-Git @("worktree", "add", "-b", "sturn/release-$stamp", $tempWorktree, "origin/$ProductionBranch")

try {
    Write-Host "[3/6] Merging the redesign and running project checks..." -ForegroundColor Cyan
    & git -C $tempWorktree merge --no-ff --no-edit "origin/$FeatureBranch"
    if ($LASTEXITCODE -ne 0) {
        & git -C $tempWorktree merge --abort 2>$null
        throw "Git could not merge the redesign automatically. Production main was not changed."
    }
    Push-Location $tempWorktree
    try {
        & npm run check
        if ($LASTEXITCODE -ne 0) { throw "Project syntax checks failed. Production main was not changed." }
        & node --check server.js
        if ($LASTEXITCODE -ne 0) { throw "Node server syntax check failed. Production main was not changed." }
    } finally { Pop-Location }

    Write-Host "[4/6] Publishing the merge commit to origin/main..." -ForegroundColor Cyan
    & git -C $tempWorktree push origin "HEAD:refs/heads/$ProductionBranch"
    if ($LASTEXITCODE -ne 0) { throw "Push to main failed. Check Git output; production may still be unchanged." }
    Write-Host "Redesign merge pushed to main." -ForegroundColor Green
} catch {
    Write-Host ""
    Write-Host "PUBLISH FAILED: $($_.Exception.Message)" -ForegroundColor Red
    Write-Host "Your original working folder was not switched or overwritten."
    Write-Host "Backup: $bundlePath"
    exit 1
} finally {
    & git -C $RepoPath worktree remove --force $tempWorktree 2>$null
    & git -C $RepoPath branch -D "sturn/release-$stamp" 2>$null
}

Write-Host "[5/6] Waiting for the existing Render auto-deploy..." -ForegroundColor Cyan
Write-Host "The existing Render service is configured to deploy from main; the push should trigger deployment."
$deadline = (Get-Date).AddMinutes($TimeoutMinutes)
$deployed = $false
while ((Get-Date) -lt $deadline) {
    Start-Sleep -Seconds 12
    try {
        $ready = Invoke-WebRequest -Uri "$SiteUrl/ready?release=$stamp" -TimeoutSec 15 -UseBasicParsing
        $home = Invoke-WebRequest -Uri "$SiteUrl/?release=$stamp" -TimeoutSec 20 -UseBasicParsing
        if ($ready.StatusCode -eq 200 -and $ready.Content.Trim() -eq "ok" -and $home.StatusCode -eq 200 -and $home.Content.Contains($ExpectedMarker)) {
            $deployed = $true
            break
        }
    } catch {}
    Write-Host "Deployment not confirmed yet; checking again..."
}
Write-Host ""
if ($deployed) {
    Write-Host "[6/6] SUCCESS: the redesigned homepage is responding on Render." -ForegroundColor Green
    Write-Host "Live site: $SiteUrl"
    Write-Host "Health check: $SiteUrl/ready"
} else {
    Write-Host "[6/6] The merge was pushed, but the redesigned homepage was not confirmed within $TimeoutMinutes minutes." -ForegroundColor Yellow
    Write-Host "Check Render deployment logs; the source change remains on origin/main."
    Write-Host "Live site: $SiteUrl"
}
Write-Host "Git backup: $bundlePath"
