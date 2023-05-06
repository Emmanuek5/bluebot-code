const { SlashCommandBuilder } = require('discord.js');
const fetch = require('node-fetch');
const { sleep } = require('../../functions/functions');

module.exports = {
  data: new SlashCommandBuilder().setName('joke').setDescription('Gives a random joke'),
  async execute(interaction, client) {
    await interaction.deferReply();
    const joke = await fetch(process.env.JOKE_API);
    const jokejson = await joke.json();
    const { setup, delivery } = jokejson;
    interaction.editReply(setup).then(async (msg) => {
      const mgg = msg;
      await sleep(3000).then(() => {
        mgg.edit(delivery);
      });
    });
  },
};
