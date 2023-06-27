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
  //download the file from the link and save it locally to the downloads folder in data folder
  console.log(link);
  const filename = path.basename(link);
  console.log(filename);
  const file = fs.createWriteStream(
    path.join(__dirname, "../data/downloads/" + rand(1, 999999) + ".png")
  );
  request(link).pipe(file);
  file.on("finish", () => {
    file.close();
  });

  return path.join(__dirname, "../data/downloads/" + rand(1, 999999) + ".png");
}
/**
 * Downloads a file from a given link and saves it locally to the downloads folder in the data folder.
 *
 * @param {string} link - The URL of the file to be downloaded.
 * @return {Promise<string>} Returns a Promise containing the filepath of the downloaded file.
 */
async function downloadtxt(link) {
  //download the file from the link and save it locally to the downloads folder in data folder
  const filename = path.basename(link);
  /**
   * Downloads a file from a given link and saves it locally to the downloads folder in the data folder.
   *
   * @param {string} link - The URL of the file to be downloaded.
   * @return {Promise<string>} Returns a Promise containing the filepath of the downloaded file.
   */
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
