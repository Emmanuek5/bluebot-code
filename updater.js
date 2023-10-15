#!/usr/bin/env node
const { execSync } = require("child_process");
const { config } = require("dotenv");
config();
if (process.env.DEV) return;

console.log("Starting updater...");

const runCommand = command => {
  try {
    execSync(command, { stdio: "inherit" });
  } catch (error) {
    console.log(`Failed to run command: ${command}`);
    return false;
  }
  return true;
};

const command = "git pull";
runCommand(command);
runCommand("npm run deploy");

setInterval(() => {
  const command = "git pull";

  if (runCommand(command)) {
    console.log("Successfully updated!");
  } else {
    console.log("Failed to update!");
  }
  return;
}, 10000);
