const serverSchema = require("../models/server");
const commandSchema = require("../models/commands");
const mongoose = require("mongoose");
const { Manager } = require("erela.js");
const {
  Client,
  GatewayIntentBits,
  Collection,
  Events,
  ClientPresence,
  ActivityType,
  PermissionFlagsBits,
  PermissionsBitField,
  ChannelType,
  Status,
} = require("discord.js");
require("dotenv").config();
const Level = require("discord.js-leveling");
const { add } = require("./serveradd");
const { Economy } = require("../economy/base");
const { execute } = require("./guildDelete");

function client(client, app) {
  client.on("ready", async () => {
    const economy = new Economy();

    client.economy = economy;

    const commandarray = client.commands;
    commandarray.forEach(command => {
      const data = {
        name: command.data.name,
        description: command.data.description,
        permissions: command.data.permissions,
        usage: command.usage,
      };
      commandSchema.findOne({ name: data.name }, async (err, res) => {
        if (err) throw err;
        if (res) {
          res.name = data.name;
          res.description = data.description;
          res.permissions = data.permissions;
          res.usage = data.usage;
          res.save();
        } else {
          const newData = new commandSchema({
            name: data.name,
            description: data.description,
            permissions: data.permissions,
            usage: data.usage,
          });
          newData.save();
        }
      });
    });

    client.manager.init(client.user.id);

    Level.setURL(process.env.DATABASE_URL);
    var log = "";

    console.log(`\u001b[32m ----------------------------------------
\u001b[31m Bot: ${client.user.username}
\u001b[34m Servers: ${client.guilds.cache.size}
\u001b[33m Users: ${client.users.cache.size}
\u001b[36m Channels: ${client.channels.cache.size}
\u001b[35m Webserver: ${process.env.URL + process.env.PORT}
\u001b[35m Database: ${process.env.DATABASE_URL}
\u001b[35m Number of Commands: ${client.commands.size}
 \u001b[31m   Welcome  ${client.user.username}! 
\u001b[32m ----------------------------------------`);

    let botName = client.user.username;
    process.env.BOT_NAME = botName;
    process.env.BOT_AVATAR = client.user.displayAvatarURL();
    let serverCount = client.guilds.cache.size;
    process.env.SERVER_COUNT = serverCount;

    let userCount = client.users.cache.size;
    //
    process.env.USER_COUNT = userCount;

    let channelCount = client.channels.cache.size;
    process.env.CHANNEL_COUNT = channelCount;
    //set the bot status to Playing with {usercount} users
  });

  client.on("guildCreate", async guild => {
    add(guild, client);

    const server = await serverSchema.findOne({
      guildID: guild.id,
    });

    if (!server) {
      const newServer = new serverSchema({
        guildID: guild.id,
        guildName: guild.name,
        guildIcon: guild.iconURL(),
        guildMemberCount: guild.memberCount,
        guildOwner: guild.ownerId,
      });

      await newServer.save();
    }

    client.emit("Update", guild);
  });

  client.on("guildDelete", guild => {
    execute(guild, client);
    client.emit("Update", guild);
  });

  client.on("guildUpdate", async (oldGuild, newGuild) => {
    const data = await serverSchema.findOne({
      guildID: oldGuild.id,
    });

    data.guildName = newGuild.name;
    data.guildIcon = newGuild.iconURL;
    (data.guildOwner = newGuild.ownerId),
      (data.guildMemberCount = newGuild.memberCount),
      (data.guildIcon = newGuild.iconURL()),
      await data.save();
  });

  client.on("raw", d => client.manager.updateVoiceState(d));
  const nodes = require("../../nodes.json");

  client.manager = new Manager({
    // The nodes to connect to, optional if using default lavalink options
    nodes: nodes,

    // Method to send voice data to Discord
    send: (id, payload) => {
      const guild = client.guilds.cache.get(id);
      // NOTE: FOR ERIS YOU NEED JSON.stringify() THE PAYLOAD
      if (guild) guild.shard.send(payload);
    },
  });

  client.manager.on("nodeConnect", node => {
    console.log(`Node ${node.options.identifier} connected`);
  });

  client.manager.on("nodeError", (node, error) => {
    console.log(`Node ${node.options.identifier} error: ${error.message}`);
  });

  client.manager.on("trackStart", (player, track) => {
    console.log(`Now playing: ${track.title} from ${player.guild.name}`);
  });
}
module.exports = {
  client: client,
};
