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
} = require('discord.js');
const {Api} = require('./load.js');
require('./updater');
const fs = require('fs');
const last_used = new Map();
const clienthandler = require('./src/events/clienthandler');
const commandhandler = require('./src/events/createcommands');
const serverSchema = require('./src/models/server');
const server = require('./server');
const leaveandjoinhandler = require('./src/events/leaveandjoinhandler');
const mongoose = require('mongoose');
const messagehand = require('./src/events/messagehandler.js');

require("dotenv").config();
const fetch = require("node-fetch")
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


    process.on('unhandledRejection', (reason, promise) => {
      console.log('Unhandled Rejection at: Promise', promise, 'reason:', reason);
    });




fetch('https://api.whatismyip.com/ip.php?key=d45eb681c66f717566b468a43e96199c')
  .then(response => response.text())
  .then(data => console.log(data))
  .catch(error => console.error(error));

// Define the rate limit settings
const RATE_LIMIT = 7; // Maximum number of messages allowed within a time period
const RATE_PERIOD = 20; // Time period in seconds

if (process.env.TOKEN !== 'undefined') {
  require('dotenv').config();
}
//every 5 mins delete all the files in the downloads folder 


client.on('messageCreate', async (message) => {
  
  if (message.author.bot || !message.guild) return;
  const user_id = message.author.id;
  // Check if the user has exceeded the rate limit
  if (last_used.has(user_id)) {
    const user_data = last_used.get(user_id);
    const current_time = Date.now();
    if (current_time - user_data.time < RATE_PERIOD * 1000) {
      if (user_data.count == 5) {
        message.channel.send(`${message.author}, Slow Down Jeez. You Really Don't Need To Type This Fast.`);
      }
      user_data.count++;
      console.log(user_data.count);
      if (user_data.count > RATE_LIMIT) {
        const mute_role = message.guild.roles.cache.find((role) => role.name === 'Muted'); // Change this to the name of your muted role
        if (!mute_role) {
          await message.reply('Error: Muted role not found.');
          return;
        }
        const member = message.member;

        if (member.permissions.has(PermissionsBitField.Flags.Administrator)) {
          message.channel.send({ content: "I Can't Mute This User :sob:" });
          return;
        }
        await member.timeout(5000 * 10 - 200, 'Spaming');
        if (member.roles.cache.some((role) => role.name === mute_role.name)) {
          return; // The user is already muted
        }
        await member.roles.add(mute_role);
        await message.reply('You have been muted for 5 minutes for spamming.');
        setTimeout(() => {
          member.roles.remove(mute_role);
          message.reply('You have been unmuted.');
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

client.on('guildMemberAdd', (member) => {
  leaveandjoinhandler.join(client, member);
});

client.on('guildMemberRemove', (member) => {
  leaveandjoinhandler.leave(client, member);
});

clienthandler.client(client);
commandhandler.createcommands(client);

client.login(process.env.TOKEN);
new Api(client, process.env.TOKEN, server.app).start();