// Import necessary dependencies
const axios = require("axios");
const fs = require("fs");
const path = require("path");

// Mock dependencies
jest.mock("axios");
jest.mock("fs");

// Import the download function
const { download } = require("../functions/functions");

// Define a test for the download function
describe("download", () => {
  const link = "https://fsgresources.blueobsidian.repl.co/logo.png";

  it("should download a file and return the file path", async () => {
    // Mock successful Axios response
    const response = {
      data: {
        pipe: jest.fn(),
      },
    };
    axios.mockResolvedValue(response);

    // Mock successful write stream
    const writer = {
      on: jest.fn(),
    };
    fs.createWriteStream.mockReturnValue(writer);

    // Call the download function
    const result = await download(link);

    // Assertions
    expect(axios).toHaveBeenCalledWith({
      method: "GET",
      url: link,
      responseType: "stream",
    });
    expect(fs.createWriteStream).toHaveBeenCalledWith(
      path.join(__dirname, "../data/downloads", "image.png")
    );
    expect(response.data.pipe).toHaveBeenCalledWith(writer);
    expect(writer.on).toHaveBeenCalledWith("finish", expect.any(Function));

    // Resolve the "finish" event to trigger the promise resolution
    writer.on.mock.calls[0][1]();

    // Check the returned result
    expect(result).toBe(path.join(__dirname, "../data/downloads", "image.png"));
  });

  it("should throw an error if the download fails", async () => {
    // Mock unsuccessful Axios response
    const error = new Error("Failed to download");
    axios.mockRejectedValue(error);

    // Call the download function and expect it to throw an error
    await expect(download(link)).rejects.toThrow(error);

    // Assertions
    expect(axios).toHaveBeenCalledWith({
      method: "GET",
      url: link,
      responseType: "stream",
    });
    expect(fs.createWriteStream).not.toHaveBeenCalled();
  });
});
