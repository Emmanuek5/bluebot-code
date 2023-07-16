const path = require("path");
const fs = require("fs");
const request = require("request");
const axios = require("axios");
function sleep(params) {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      resolve();
    }, params);
  });
}

/**
 * Generate a random number between the given minimum and maximum values
 *
 * @param {number} min - The minimum value of the range
 * @param {number} max - The maximum value of the range
 * @return {string} A random number between min and max as a string
 */
function rand(min, max) {
  //create a random number between min and max and convert it to a string
  let random = Math.floor(Math.random() * (max - min + 1) + min).toString();
  //return the random number
  return random;
}

function mute(client, id, guild, channel, username, message) {}

function checkAuthenticated(req, res, next) {
  if (req.isAuthenticated()) {
    return next();
  } else {
    res.redirect("/login");
  }
}

function checkNotAuthenticated(req, res, next) {
  if (req.isAuthenticated()) {
    return res.redirect("/dashboard");
  } else {
    next();
  }
}

/**
 * Downloads a file from a given link and saves it to the "downloads" folder.
 *
 * @param {string} link - The link to the file to download.
 * @return {Promise<string>} A promise that resolves with the path to the downloaded file.
 */
async function download(link) {
  const filename = path.basename(link);
  const filePath = path.join(__dirname, "../data/downloads", filename + ".png");
  console.log(filePath);
  try {
    const response = await axios({
      method: "GET",
      url: link,
      responseType: "stream",
    });

    const writer = fs.createWriteStream(filePath);
    response.data.pipe(writer);

    return new Promise((resolve, reject) => {
      writer.on("finish", () => resolve(filePath));
      writer.on("error", reject);
    });
  } catch (error) {
    // Handle and log the error
    console.error("An error occurred during download:", error);
    throw error; // Rethrow the error to propagate it further if needed
  }
}

/**
 * Downloads a file from a given link and saves it locally to the downloads folder in the data folder.
 *
 * @param {string} link - The URL of the file to be downloaded.
 * @return {Promise<string>} Returns a Promise containing the filepath of the downloaded file.
 */
async function downloadfile(link) {
  const filename = path.basename(link);

  console.log(filename);

  return new Promise((resolve, reject) => {
    const file = fs.createWriteStream(path.join(__dirname, "../data/downloads/" + filename));
    const downloadRequest = request(link);

    downloadRequest.on("response", response => {
      if (response.statusCode !== 200) {
        reject(new Error("Failed to download the file. Status code: " + response.statusCode));
      }
    });

    downloadRequest.pipe(file);

    file.on("finish", () => {
      file.close();
      resolve(path.join(__dirname, "../data/downloads/" + filename));
    });

    file.on("error", err => {
      reject(err);
    });
  });
}
/**
 * Deletes a file from the given file path.
 *
 * @param {string} filepath - The path of the file to be deleted.
 * @return {void}
 */
function deletefile(filepath) {
  fs.unlinkSync(filepath);
}

/**
 * Logs a GPT message to a JSON file.
 *
 * @param {string} role - The role of the message.
 * @param {string} message - The content of the message.
 * @param {string} channelid - The ID of the channel.
 * @return {Array} - The updated array of logged messages.
 */
function logGptMessage(role, message, channelid) {
  const file = path.join(__dirname, "../data/gpt-conversations/log-" + channelid + ".json");

  if (!fs.existsSync(file)) {
    fs.writeFileSync(file, "[]");
  }

  const data = JSON.parse(fs.readFileSync(file));

  data.push({
    role: role,
    content: message,
  });

  fs.writeFileSync(file, JSON.stringify(data));

  return data;
}

module.exports = {
  sleep,
  rand,
  checkAuthenticated,
  checkNotAuthenticated,
  download,
  deletefile,
  downloadfile,
  logGptMessage,
};
