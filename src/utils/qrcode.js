const qrcode = require("qrcode");
const qr = require("qr-image");
const { createWriteStream } = require("fs");
const { join } = require("path");
const { rand } = require("../functions/functions");
const Jimp = require("jimp");
const qrCode = require("qrcode-reader");
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
async function readQRCode(filePath) {
  try {
    // Read the image and create a buffer
    const buffer = fs.readFileSync(filePath);

    // Parse the image using Jimp.read() method
    const image = await Jimp.read(buffer);

    // Create an instance of the qrcode-reader module
    const qrDecoder = new qrCode();
    const value = await new Promise((resolve, reject) => {
      qrDecoder.callback = (err, value) => {
        if (err) {
          reject(err);
        } else {
          resolve(value);
        }
      };
      // Decoding the QR code
      qrDecoder.decode(image.bitmap);
    });

    // Retrieve the decrypted value
    const qrCodeValue = value.result;

    return qrCodeValue;
  } catch (error) {
    console.error("Error while reading QR code:", error);
    throw new Error("An error occurred while reading the QR code.");
  }
}

module.exports = {
  generateQRCode,
  readQRCode,
};
