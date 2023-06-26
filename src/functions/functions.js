const path = require("path");
const fs = require("fs");
const request = require("request");

function sleep(params) {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      resolve();
    }, params);
  });
}

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
  // Create the "downloads" folder if it doesn't exist
  const downloadsFolderPath = path.join(__dirname, "../data/downloads");
  if (!fs.existsSync(downloadsFolderPath)) {
    fs.mkdirSync(downloadsFolderPath);
  }

  // Extract filename from link and create file path in downloads folder
  const filename = path.basename(link);
  const filePath = path.join(downloadsFolderPath, `${filename}.png`);

  // Create write stream to file and pipe request to write stream
  const file = fs.createWriteStream(filePath);
  const response = await new Promise((resolve, reject) => {
    request(link)
      .pipe(file)
      .on("finish", () => {
        resolve();
        console.log("Done");
      })
      .on("error", error => reject(error));
  });

  // Log downloaded file path and return it
  console.log(`File downloaded and saved to: ${filePath}`);
  return filePath;
}

async function downloadtxt(link) {
  //download the file from the link and save it locally to the downloads folder in data folder
  const filename = path.basename(link);
  console.log(filename);
  const file = fs.createWriteStream(path.join(__dirname, "../data/downloads/" + filename));
  request(link).pipe(file);
  file.on("finish", () => {
    file.close();
  });
  await sleep(5000);
  const filepath = path.join(__dirname, "../data/downloads/" + filename);

  return filepath;
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

module.exports = {
  sleep,
  rand,
  checkAuthenticated,
  checkNotAuthenticated,
  download,
  deletefile,
  downloadtxt,
};
