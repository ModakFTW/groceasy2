Write-Host "Adding all changes to git..." -ForegroundColor Green
git add .

Write-Host "Committing changes..." -ForegroundColor Green
git commit -m "Auto-commit: Updated files $(Get-Date -Format 'yyyy-MM-dd HH:mm')"

Write-Host "Pushing to GitHub..." -ForegroundColor Green
git push

Write-Host "Done! All changes have been pushed to GitHub." -ForegroundColor Cyan
Read-Host "Press Enter to continue"