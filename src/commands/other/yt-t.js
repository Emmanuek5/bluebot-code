const { SlashCommandBuilder, Invite } = require('discord.js');
require('dotenv').config();
const fetch = require('node-fetch');
module.exports = {
  data: new SlashCommandBuilder().setName('yt-t').setDescription('Youtube Watch Together').setDMPermission(),
  async execute(interaction, client) {
    const { guild, user } = interaction;
    const channel = interaction.member.voice.channel;

    if (!channel) {
      return interaction.reply('Please join a voice channel first');
    }
    fetch(`https://discord.com/api/v8/channels/${channel.id}/invites`, {
      method: 'POST',
      body: JSON.stringify({
        max_age: 0,
        max_uses: 0,
        target_application_id: '755600276941176913',
        target_type: 2,
        temporary: false,
        validate: null,
      }),
      headers: {
        Authorization: `Bot ${process.env.TOKEN}`,
        'Content-Type': 'application/json',
      },
    }).then(async (res) => {
      const data = await res.json();
      interaction.reply({ content: `https://discord.com/invite/${data.code}` });
    });
  },
};
