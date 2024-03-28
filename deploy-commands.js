if (process.env.TOKEN !== "undefined") {
  require("dotenv").config();
}
const { log } = require("console");
const { REST, Routes } = require("discord.js");
// get commans from commands folder
const fs = require("fs");
const commands = [];
const custom = fs.readFileSync("src/commands/custom.json", "utf-8");
const jsonval = JSON.parse(custom);
jsonval.forEach(command => {
  commands.push(command);
});
const xpFiles = fs.readdirSync("src/commands/xp").filter(file => file.endsWith(".js"));
for (const file of xpFiles) {
  const command = require(`./src/commands/xp/${file}`);
  commands.push(command.data.toJSON());
}

const economyFiles = fs.readdirSync("src/commands/economy").filter(file => file.endsWith(".js"));
for (const file of economyFiles) {
  const command = require(`./src/commands/economy/${file}`);
  commands.push(command.data.toJSON());
}
const commandFiles = fs.readdirSync("src/commands").filter(file => file.endsWith(".js"));
for (const file of commandFiles) {
  const command = require(`./src/commands/${file}`);
  commands.push(command.data.toJSON());
}

const otherFiles = fs.readdirSync("src/commands/other").filter(file => file.endsWith(".js"));
for (const file of otherFiles) {
  const command = require(`./src/commands/other/${file}`);
  commands.push(command.data.toJSON());
}
const musicFiles = fs.readdirSync("src/commands/music").filter(file => file.endsWith(".js"));
for (const file of musicFiles) {
  const command = require(`./src/commands/music/${file}`);
  commands.push(command.data.toJSON());
}
const ticketFiles = fs.readdirSync("src/commands/tickets").filter(file => file.endsWith(".js"));
for (const file of ticketFiles) {
  const command = require(`./src/commands/tickets/${file}`);
  commands.push(command.data.toJSON());
}
const generalFiles = fs.readdirSync("src/commands/general").filter(file => file.endsWith(".js"));
for (const file of generalFiles) {
  const command = require(`./src/commands/general/${file}`);
  commands.push(command.data.toJSON());
}
const moderationFiles = fs
  .readdirSync("src/commands/moderation/roles")
  .filter(file => file.endsWith(".js"));
for (const file of moderationFiles) {
  const command = require(`./src/commands/moderation//roles/${file}`);
  commands.push(command.data.toJSON());
}

const moderationFiles1 = fs
  .readdirSync("src/commands/moderation/channels")
  .filter(file => file.endsWith(".js"));
for (const file of moderationFiles1) {
  const command = require(`./src/commands/moderation/channels/${file}`);
  commands.push(command.data.toJSON());
}

const rest = new REST({ version: "10" }).setToken(process.env.TOKEN);
(async () => {
  try {
    console.log("Started refreshing application (/) commands.");
    await rest.put(Routes.applicationCommands(process.env.CLIENT_ID), { body: commands });
    console.log(
      `Successfully reloaded application (/) commands. Number of commands: ${commands.length}`
    );
  } catch (error) {
    console.error(error);
  }
})();
