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
const axios = require("axios");
const qs = require("qs");

function client(client) {
  client.on("ready", async () => {
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

    let data = qs.stringify({
      server_count: process.env.SERVER_COUNT,
    });

    let config = {
      method: "post",
      maxBodyLength: Infinity,
      url: "https://discords.com/bots/api/bot/1058300450253832272",
      headers: {
        Authorization:
          "4367bac5939ad6963a7997b825a0f98e6d396730f617c6a7565ad1825c0b41ffc6455827f5397c2c6b191411cb4154f790a18cb3839c80560bc8d898a99b7628",
        "Content-Type": "application/x-www-form-urlencoded",
      },
      data: data,
    };

    axios
      .request(config)
      .then(response => {
        console.log(JSON.stringify(response.data));
      })
      .catch(error => {
        console.log(error);
      });

    client.manager.init(client.user.id);
    mongoose.set("strictQuery", false);
    mongoose.connect(process.env.DATABASE_URL, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    Level.setURL(process.env.DATABASE_URL);
    var log = "";

    const db = mongoose.connection;
    db.on("error", error => console.error(error));
    db.once("open", () => (log = "Connected To Database"));

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
    let serverCount = client.guilds.cache.size;
    process.env.SERVER_COUNT = serverCount;

    let userCount = client.users.cache.size;
    //
    process.env.USER_COUNT = userCount;

    let channelCount = client.channels.cache.size;
    process.env.CHANNEL_COUNT = channelCount;
    //set the bot status to Playing with {usercount} users
    const options = {
      type: ActivityType.Watching,
      name: `${process.env.SERVER_COUNT} servers and >help`,
      status: "idle",
    };

    setTimeout(() => {
      client.user.setPresence({ activities: [options] });
    }, 10000);
  });

  const CurrencySystem = require("currency-system");
  const cs = new CurrencySystem();
  CurrencySystem.cs
    .on("debug", (debug, error) => {
      console.log(debug);
      if (error) console.error(error);
    })
    .on("userFetch", (user, functionName) => {
      console.log(`( ${functionName} ) Fetched User:  ${client.users.cache.get(user.userID).tag}`);
    })
    .on("userUpdate", (oldData, newData) => {
      console.log("User Updated: " + client.users.cache.get(newData.userID).tag);
    });
  cs.setMongoURL(process.env.DATABASE_URL);
  // Set Default Bank Amount when a new user is created!
  cs.setDefaultBankAmount(1000);
  cs.setDefaultWalletAmount(1000);
  //  Its bank space limit (can be changed according to per user) here 0 means infinite.
  cs.setMaxBankAmount(0);
  // Set Default Maximum Amount of Wallet Currency a user can have! (can be changed according to per user) here 0 means infinite.
  cs.setMaxWalletAmount(0);
  // Search for new npm package updates on bot startup! Latest version will be displayed in console.
  cs.searchForNewUpdate(true);
  client.on("guildCreate", async guild => {
    add(guild, client);

    console.log(
      `New guild joined: ${guild.name} (id: ${guild.id}). This guild has ${guild.memberCount} members!`
    );

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

    let botName = client.user.username;
    botName = botName.replace(/#[0-9]{4}/, "");
    process.env.BOT_NAME = botName;

    let serverCount = client.guilds.cache.size;
    process.env.SERVER_COUNT = serverCount;

    let userCount = client.users.cache.size;
    process.env.USER_COUNT = userCount;

    let channelCount = client.channels.cache.size;
    process.env.CHANNEL_COUNT = channelCount;
    const options = {
      type: ActivityType.Watching,
      name: `${process.env.SERVER_COUNT} servers and >help`,
      status: "idle",
    };
    client.user.setPresence({ activities: [options] });
    let data = qs.stringify({
      server_count: process.env.SERVER_COUNT,
    });

    let config = {
      method: "post",
      maxBodyLength: Infinity,
      url: "https://discords.com/bots/api/bot/1058300450253832272",
      headers: {
        Authorization:
          "4367bac5939ad6963a7997b825a0f98e6d396730f617c6a7565ad1825c0b41ffc6455827f5397c2c6b191411cb4154f790a18cb3839c80560bc8d898a99b7628",
        "Content-Type": "application/x-www-form-urlencoded",
      },
      data: data,
    };

    axios
      .request(config)
      .then(response => {
        console.log(JSON.stringify(response.data));
      })
      .catch(error => {
        console.log(error);
      });
  });

  client.on("guildDelete", guild => {
    console.log(`I have been removed from: ${guild.name} (id: ${guild.id})`);
    // remove the server from the database
    serverSchema.findOneAndDelete(
      {
        guildID: guild.id,
      },
      (err, data) => {
        if (err) throw err;
        if (data) {
          console.log(`Server ${guild.name} has been removed from the database.`);
        }
      }
    );
    let data = qs.stringify({
      server_count: process.env.SERVER_COUNT,
    });

    let config = {
      method: "post",
      maxBodyLength: Infinity,
      url: "https://discords.com/bots/api/bot/1058300450253832272",
      headers: {
        Authorization:
          "4367bac5939ad6963a7997b825a0f98e6d396730f617c6a7565ad1825c0b41ffc6455827f5397c2c6b191411cb4154f790a18cb3839c80560bc8d898a99b7628",
        "Content-Type": "application/x-www-form-urlencoded",
      },
      data: data,
    };

    axios
      .request(config)
      .then(response => {
        console.log(JSON.stringify(response.data));
      })
      .catch(error => {
        console.log(error);
      });

    let serverCount = client.guilds.cache.size;
    process.env.SERVER_COUNT = serverCount;

    let userCount = client.users.cache.size;
    process.env.USER_COUNT = userCount;

    let channelCount = client.channels.cache.size;
    process.env.CHANNEL_COUNT = channelCount;
    const options = {
      type: ActivityType.Watching,
      name: `${process.env.SERVER_COUNT} servers and >help`,
      status: "idle",
    };
    client.user.setPresence({ activities: [options] });
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
  client.emotes = {
    play: "▶️",
    stop: "⏹️",
    queue: "📄",
    success: "☑️",
    repeat: "🔁",
    error: "❌",
  };
  client.on("raw", d => client.manager.updateVoiceState(d));

  const nodes = [
    {
      host: process.env.LAVALINK_HOST,
      port: 443,
      password: process.env.LAVALINK_PASSWORD,
      secure: true,
    },
  ];

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
  // Emitted whenever a node connects
  client.manager.on("nodeConnect", node => {
    console.log(`\u001b[31m Node "${node.options.identifier}" connected.`);
  });

  // Emitted whenever a node encountered an error
  client.manager.on("nodeError", (node, error) => {
    console.log(
      ` \u001b[31mNode "${node.options.identifier}" encountered an error: ${error.message}.`
    );
  });

  // When a track starts
  client.manager.on("trackStart", (player, track) => {
    console.log(`\u001b[31m Track started on guild ${player.guild} - ${track.title}`);
  });
}
module.exports = {
  client: client,
};
