# Push current branch to github.com/vietdung6/gengfandomnew using PAT in $env:GITHUB_TOKEN
# Usage: powershell -ExecutionPolicy Bypass -File scripts/push-gengfandomnew.ps1

$ErrorActionPreference = "Stop"

if (-not $env:GITHUB_TOKEN) {
  Write-Error "Missing GITHUB_TOKEN environment variable. Set a PAT with repo scope, then rerun."
}

# Show status summary
git status -sb

# Ensure we have commits to push (ahead of remote)
$status = git status -sb
if ($status -notmatch "\[ahead") {
  Write-Output "Nothing to push (not ahead of remote)."
  exit 0
}

# Push HEAD to master on target repo
$remoteUrl = "https://$($env:GITHUB_TOKEN)@github.com/vietdung6/gengfandomnew.git"
Write-Output "Pushing to $remoteUrl (master)..."
git push $remoteUrl HEAD:master

Write-Output "Done."
