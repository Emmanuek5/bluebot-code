const { Client, Message, EmbedBuilder } = require("discord.js");
const { findSwearWords } = require("../utils/swearfinder");
const fetch = require("node-fetch");
const { sleep } = require("../functions/functions");

async function bully(client, message) {
  const channel = message.channel;
  const guild = message.guild;
  const { username, id, avatarURL } = message.author;
  const { content } = message;
  const clause = content.toLowerCase();
  // Check for swear words
  const foundSwearWord = findSwearWords(message);
  if (foundSwearWord) {
    channel.send(`Hey ${username}, you can't say that! That Hurt My Feelings!`);
    return;
  }
  if (clause.includes("hey") || clause.includes("hello") || clause.includes("wassup")) {
    channel.send(`Hello ${username}`);
  }

  // Check for hate statements
  if (content.toLowerCase().includes("i hate you")) {
    channel.send(`What did I do to you ${username}!? I'm sorry!`);
    return;
  }

  // Check for love statements
  if (content.toLowerCase().includes("i love you")) {
    channel.send(`I love you too ${username}!`);
    return;
  }

  // Check for suicidal statements
  if (
    content.toLowerCase().includes("i want to die") ||
    content.toLowerCase().includes("i want to kill myself")
  ) {
    channel.send(`Hey ${username}, don't say that!, You Are Very IMPORTANT and Well miss you`);
    return;
  }

  // Check for apologies
  if (content.toLowerCase().includes("sorry" || "sry")) {
    channel.send(`It's okay ${username}!`);
    return;
  }

  if (content.toLowerCase().includes("kill yourself")) {
    channel.send(`Why I Don't See Any Reason To`);
    return;
  }

  // Check for jokes
  if (content.toLowerCase == "joke") {
    // Get a random joke from the API
    const joke = await fetch(process.env.JOKE_API);
    const jokejson = await joke.json();
    const { setup, delivery } = jokejson;

    channel.send(setup).then(async msg => {
      await sleep(3000);
      msg.edit(delivery);
    });
  }
}

module.exports = { bully };
