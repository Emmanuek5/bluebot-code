const fs = require("fs");
const path = require("path");
const {
  Client,
  GatewayIntentBits,
  Collection,
  Events,
  ClientPresence,
  ActivityType,
  Colors,
} = require("discord.js");
const { appHandler } = require("./Appshandler");
const { EmbedBuilder } = require("@discordjs/builders");
function createcommands(client) {
  client.commands = new Collection();

  const commandsPath = path.join(__dirname, "../commands");
  const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith(".js"));

  for (const file of commandFiles) {
    const filePath = path.join(commandsPath, file);
    const command = require(filePath);
    // Set a new item in the Collection with the key as the command name and the value as the exported module
    if ("data" in command && "execute" in command) {
      client.commands.set(command.data.name, command);
    } else {
      console.log(
        `[WARNING] The command at ${filePath} is missing a required "data" or "execute" property.`
      );
    }
  }

  const economyPath = path.join(__dirname, "../commands/economy");
  const economyFiles = fs.readdirSync(economyPath).filter(file => file.endsWith(".js"));

  for (const file of economyFiles) {
    const filePath = path.join(economyPath, file);
    const command = require(filePath);
    // Set a new item in the Collection with the key as the command name and the value as the exported module
    if ("data" in command && "execute" in command) {
      client.commands.set(command.data.name, command);
    } else {
      console.log(
        `[WARNING] The command at ${filePath} is missing a required "data" or "execute" property.`
      );
    }
  }

  const musicPath = path.join(__dirname, "../commands/music");
  const musicFiles = fs.readdirSync(musicPath).filter(file => file.endsWith(".js"));
  for (const file of musicFiles) {
    const filePath = path.join(musicPath, file);
    const command = require(filePath);
    // Set a new item in the Collection with the key as the command name and the value as the exported module
    if ("data" in command && "execute" in command) {
      client.commands.set(command.data.name, command);
    } else {
      console.log(
        `[WARNING] The command at ${filePath} is missing a required "data" or "execute" property.`
      );
    }
  }

  const otherPath = path.join(__dirname, "../commands/other");
  const otherFiles = fs.readdirSync(otherPath).filter(file => file.endsWith(".js"));
  for (const file of otherFiles) {
    const filePath = path.join(otherPath, file);

    const command = require(filePath);
    // Set a new item in the Collection with the key as the command name and the value as the exported module
    if ("data" in command && "execute" in command) {
      client.commands.set(command.data.name, command);
    } else {
      console.log(
        `[WARNING] The command at ${filePath} is missing a required "data" or "execute" property.`
      );
    }
  }

  const xpPath = path.join(__dirname, "../commands/xp");
  const xpFiles = fs.readdirSync(xpPath).filter(file => file.endsWith(".js"));
  for (const file of xpFiles) {
    const filePath = path.join(xpPath, file);

    const command = require(filePath);
    // Set a new item in the Collection with the key as the command name and the value as the exported module
    if ("data" in command && "execute" in command) {
      client.commands.set(command.data.name, command);
    } else {
      console.log(
        `[WARNING] The command at ${filePath} is missing a required "data" or "execute" property.`
      );
    }
  }

  const ticketPath = path.join(__dirname, "../commands/tickets");
  const ticketFiles = fs.readdirSync(ticketPath).filter(file => file.endsWith(".js"));
  for (const file of ticketFiles) {
    const filePath = path.join(ticketPath, file);

    const command = require(filePath);
    // Set a new item in the Collection with the key as the command name and the value as the exported module
    if ("data" in command && "execute" in command) {
      client.commands.set(command.data.name, command);
    } else {
      console.log(
        `[WARNING] The command at ${filePath} is missing a required "data" or "execute" property.`
      );
    }

    const generalPath = path.join(__dirname, "../commands/general");
    const generalFiles = fs.readdirSync(generalPath).filter(file => file.endsWith(".js"));
    for (const file of generalFiles) {
      const filePath = path.join(generalPath, file);

      const command = require(filePath);
      // Set a new item in the Collection with the key as the command name and the value as the exported module
      if ("data" in command && "execute" in command) {
        client.commands.set(command.data.name, command);
      } else {
        console.log(
          `[WARNING] The command at ${filePath} is missing a required "data" or "execute" property.`
        );
      }
    }
    //scan the command
    const moderationrolesPath = path.join(__dirname, "../commands/moderation/roles");
    const moderationrolesFiles = fs
      .readdirSync(moderationrolesPath)
      .filter(file => file.endsWith(".js"));
    for (const file of moderationrolesFiles) {
      const filePath = path.join(moderationrolesPath, file);

      const command = require(filePath);
      // Set a new item in the Collection with the key as the command name and the value as the exported module
      if ("data" in command && "execute" in command) {
        client.commands.set(command.data.name, command);
      } else {
        console.log(
          `[WARNING] The command at ${filePath} is missing a required "data" or "execute" property.`
        );
      }
    }

    const moderationrolesPath1 = path.join(__dirname, "../commands/moderation/channels");
    const moderationrolesFiles1 = fs
      .readdirSync(moderationrolesPath1)
      .filter(file => file.endsWith(".js"));
    for (const file of moderationrolesFiles1) {
      const filePath = path.join(moderationrolesPath1, file);

      const command = require(filePath);
      // Set a new item in the Collection with the key as the command name and the value as the exported module
      if ("data" in command && "execute" in command) {
        client.commands.set(command.data.name, command);
      } else {
        console.log(
          `[WARNING] The command at ${filePath} is missing a required "data" or "execute" property.`
        );
      }
    }

    client.on("interactionCreate", async interaction => {
      if (interaction.isUserContextMenuCommand()) {
        appHandler(interaction, client);
        return;
      }

      if (interaction.isButton() || interaction.isStringSelectMenu()) {
        const buttonhandler = require("./buttonhandlers");
        buttonhandler.buttons(interaction, client);
        return;
      } else {
        const command = interaction.client.commands.get(interaction.commandName);

        if (!command) {
          console.error(`No command matching ${interaction.commandName} was found.`);
          return;
        }

        try {
          await command.execute(interaction, client);
        } catch (error) {
          const config = require("../../config.json");

          const channel = client.channels.cache.get(config.error_channel);

          // Include the error stack
          const embed = new EmbedBuilder();
          embed.setTitle(`There was an error while executing ${interaction.command}  command!`);
          embed
            .setDescription(`${error.name}: ${error.message}\n\n${error.stack}`)
            .setColor(Colors.Red)
            .setAuthor({ name: "Error" })
            .setTimestamp()

            .setFooter({ text: interaction.guild.name });

          channel.send({ embeds: [embed] });
        }
      }
    });
  }
}

module.exports = {
  createcommands: createcommands,
};
