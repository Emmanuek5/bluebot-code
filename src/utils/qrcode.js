const qrcode = require("qrcode");
const qr = require("qr-image");
const { createWriteStream } = require("fs");
const { join } = require("path");
const { rand } = require("../functions/functions");
const fs = require("fs");
/**
 * Asynchronously generates a QR code from the provided text and saves it to a file.
 *
 * @param {string} text - The text to encode in the QR code.
 * @return {Promise<string>} - A Promise that resolves with the path to the generated QR code file.
 */
async function generateQRCode(text) {
  try {
    // Generate the QR code
    const qrCodeBuffer = await qrcode.toBuffer(text);
    const outputPath = join(__dirname, "../data/qrcodes");

    // Save the QR code to a file
    const outputFilePath = join(outputPath, `qrcode-${rand(1, 1000000)}.png`);
    const qrCodeFileStream = createWriteStream(outputFilePath);

    qrCodeFileStream.write(qrCodeBuffer);
    qrCodeFileStream.end();

    return new Promise(resolve => {
      qrCodeFileStream.on("finish", () => {
        resolve(outputFilePath);
      });
    });
  } catch (error) {
    console.error("Error while generating QR code:", error);
    throw new Error("An error occurred while generating the QR code.");
  }
}

/**
 * Reads a QR code image file and returns its data as a Promise.
 *
 * @param {string} filePath - the path to the QR code image file
 * @return {Promise<string>} a Promise that resolves with the QR code data as a string
 */
function readQRCode(filePath) {
  return new Promise((resolve, reject) => {
    // Read the QR code image file
    const qrCodeStream = qr.image(fs.createReadStream(filePath));

    let qrCodeData = "";

    qrCodeStream.on("data", chunk => {
      qrCodeData += chunk;
    });

    qrCodeStream.on("end", () => {
      resolve(qrCodeData);
    });

    qrCodeStream.on("error", error => {
      reject(error);
    });
  });
}

module.exports = {
  generateQRCode,
  readQRCode,
};
