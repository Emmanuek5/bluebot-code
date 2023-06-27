import { download } from "./functions";
import fs from "fs";

describe('download', () => {
  it('should download a file and save it to the downloads folder', async () => {
    // Test case to download a file and check if it exists in the downloads folder
    const link = 'https://fsgresources.blueobsidian.repl.co/logo.png';
    const content = 'logo.png';
    const filePath = await download(link, content);
    const fileExists = await fs.promises.access(filePath + content, fs.constants.F_OK);
    expect(fileExists).toBeUndefined();
  });

  it('should return the path to the downloaded file', async () => {
    // Test case to check if the function returns the path to the downloaded file
    const link = 'https://fsgresources.blueobsidian.repl.co/logo.png';
    const content = 'file.pdf';
    const filePath = await download(link, content);
    expect(filePath).toContain('/data/downloads/');
  });
});