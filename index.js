process.on("unhandledRejection", (reason, promise) => {
  console.log("Unhandled Rejection at: Promise", promise, "reason:", reason);
});

process.on("uncaughtException", function (error) {
  console.error("An uncaught exception occurred:", error);
});
const {
  Client,
  GatewayIntentBits,
  Collection,
  Events,
  ClientPresence,
  ActivityType,
  Partials,
  PermissionsBitField,
} = require("discord.js");
const client = new Client({
  partials: [Partials.Channel, Partials.GuildMember, Partials.Message],
  intents: [
    GatewayIntentBits.DirectMessages,
    GatewayIntentBits.DirectMessageReactions,
    GatewayIntentBits.DirectMessageTyping,
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildBans,
    GatewayIntentBits.GuildIntegrations,
    GatewayIntentBits.GuildInvites,
    GatewayIntentBits.GuildWebhooks,
    GatewayIntentBits.GuildPresences,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
    GatewayIntentBits.GuildVoiceStates,
    GatewayIntentBits.GuildMessageReactions,
    GatewayIntentBits.GuildMessageTyping,
    GatewayIntentBits.GuildMembers,
  ],
});
const server = require("./server");
client.app = server.app;
const clienthandler = require("./src/events/clienthandler");
clienthandler.client(client, server.app);

let botName = client.username;
process.env.BOT_NAME = botName;
require("./updater");
const fs = require("fs");
const last_used = new Map();

const commandhandler = require("./src/events/createcommands");
const serverSchema = require("./src/models/server");

const leaveandjoinhandler = require("./src/events/leaveandjoinhandler");
const mongoose = require("mongoose");
const messagehand = require("./src/events/messagehandler.js");
const { Api } = require("./load");

require("dotenv").config();
const fetch = require("node-fetch");

const { InventorySystem } = require("./src/economy/InventoryManager/class.js");
const { sleep } = require("./src/functions/functions");
const { Economy } = require("./src/economy/base.js");
const { execute } = require("./src/events/ready.js");

// Define the rate limit settings
const RATE_LIMIT = 7; // Maximum number of messages allowed within a time period
const RATE_PERIOD = 15; // Time period in seconds

if (process.env.TOKEN !== "undefined") {
  require("dotenv").config();
}

client.on("ready", async () => {
  execute(client, server.app);
});

mongoose.set("strictQuery", false);
mongoose.connect(process.env.DATABASE_URL, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const db = mongoose.connection;
db.on("error", error => console.error(error));
db.once("open", () => console.log("Connected To Database"));

client.on("messageCreate", async message => {
  if (message.author.bot || !message.guild) return;
  const user_id = message.author.id;
  // Check if the user has exceeded the rate limit
  if (last_used.has(user_id)) {
    const user_data = last_used.get(user_id);
    const current_time = Date.now();
    if (current_time - user_data.time < RATE_PERIOD * 1000) {
      if (user_data.count == 5) {
        message.channel.send(
          `${message.author}, Slow Down Jeez. You Really Don't Need To Type This Fast.`
        );
      }
      user_data.count++;
      if (user_data.count > RATE_LIMIT) {
        const mute_role = message.guild.roles.cache.find(role => role.name === "Muted"); // Change this to the name of your muted role
        if (!mute_role) {
          await message.reply("Error: Muted role not found.");
          return;
        }
        const member = message.member;

        if (member.permissions.has(PermissionsBitField.Flags.Administrator)) {
          message.channel.send({ content: "I Can't Mute This User :sob:" });
          return;
        }
        await member.timeout(5000 * 10 - 200, "Spaming");
        if (member.roles.cache.some(role => role.name === mute_role.name)) {
          return; // The user is already muted
        }
        await member.roles.add(mute_role);
        await message.reply("You have been muted for 5 minutes for spamming.");
        setTimeout(() => {
          member.roles.remove(mute_role);
          message.reply("You have been unmuted.");
        }, 5 * 60 * 1000); // Unmute the user after 5 minutes
      }
    } else {
      // If the user hasn't exceeded the rate limit, reset their message count and update the last_used Map
      user_data.time = current_time;
      user_data.count = 1;
    }
  } else {
    // If the user hasn't sent a message before, add them to the last_used Map with a message count of 1
    last_used.set(user_id, { time: Date.now(), count: 1 });
  }

  messagehand.messages(client, message);
});

client.on("guildMemberAdd", member => {
  leaveandjoinhandler.join(client, member);
});

client.on("guildMemberRemove", member => {
  leaveandjoinhandler.leave(client, member);
});

commandhandler.createcommands(client);

const api = require("./src/routes/api.js");
api.client = client;
server.app.use("/api/", api);

server.api.setClient(client);

client.login(process.env.TOKEN);
