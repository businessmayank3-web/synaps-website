$ErrorActionPreference = "Stop"
Write-Host "Downloading MinGit..."
Invoke-WebRequest -Uri "https://github.com/git-for-windows/git/releases/download/v2.45.1.windows.1/MinGit-2.45.1-64-bit.zip" -OutFile "mingit.zip"
Write-Host "Extracting MinGit..."
Expand-Archive -Path mingit.zip -DestinationPath mingit -Force
$git = "$pwd\mingit\cmd\git.exe"

& $git add components/ui/Navbar.tsx
& $git add components/sections/FinalCTA.tsx
& $git commit -m "Link all buttons to sign-in page"
& $git push origin main
Write-Host "Done!"
