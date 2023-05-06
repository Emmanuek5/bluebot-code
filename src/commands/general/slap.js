const { ChatInputCommandInteraction, SlashCommandBuilder, EmbedBuilder } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('slap')
    .setDescription('Slap a user')
    .addUserOption((options) => options.setName('target').setDescription('The target member to slap').setRequired(true))
    .addStringOption((option) => option.setName('robintext').setDescription('what the target says').setRequired(true))
    .addStringOption((option) => option.setName('batmantext').setDescription('what you say back').setRequired(true)),
  /**
   *
   * @param {ChatInputCommandInteraction} interaction
   */
  async execute(interaction) {
    const Member = interaction.member;
    const batmanimg = Member.avatarURL({ format: 'png' });
    const batmantext = interaction.options.getString('batmantext');
    const Target = interaction.options.getUser('target');
    const robinimg = Target.avatarURL({ format: 'png' });
    const robintext = interaction.options.getString('robintext');

    const Embed = new EmbedBuilder()
      .setColor('Random')
      .setImage(
        encodeURI(
          `https://vacefron.nl/api/batmanslap?text1=${robintext}&text2=${batmantext}&batman=${batmanimg}&robin=${robinimg}`
        )
      )
      .setTimestamp();

    await interaction.reply({ embeds: [Embed] }).catch(console.error);
  },
};
