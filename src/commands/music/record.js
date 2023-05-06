const { SlashCommandBuilder } = require('@discordjs/builders');
const { EmbedBuilder,Colors } = require('discord.js');
const { joinVoiceChannel, createAudioResource } = require('@discordjs/voice');
const serverSchema = require('../../models/server');
module.exports = {
  usage: 'Usage: /record - Records the current voice channel',
  data: new SlashCommandBuilder().setName('record').setDescription('Records the current voice channel'),
  async execute(interaction) {
   await interaction.deferReply();
    const { guild, member, options } = interaction;
    const user = {}
    const serverInfo = await serverSchema.findOne({
      guildID: guild.id,
    });
    
    const voiceChannel = member.voice.channel;
    if (!voiceChannel) {
      
      const embed = new EmbedBuilder()
        .setColor(Colors.Red)
        .setDescription('You Are Not In A Voice Channel');
      await interaction.editReply({ embeds: [embed] });
      return;
    }
    
  const connection = joinVoiceChannel({
    channelId: interaction.member.voice.channel.id,
    guildId: interaction.guild.id,
    adapterCreator: interaction.guild.voiceAdapterCreator,
  });
  const audioReceiver = connection.receiver;
  const audioReadableStream = audioReceiver.createReadableStream(interaction.member.user.id, { mode: 'pcm' });
  const audioResource = createAudioResource(audioReadableStream, { inlineVolume: true });
  const writableStream = fs.createWriteStream('recorded_audio.pcm');

  audioResource.play();
  audioResource.pipe(writableStream);

  await interaction.editReply({ content: 'Recording started!', ephemeral: true });
 setTimeout(() => {
    audioResource.stop();
    connection.destroy();
    writableStream.close();
    interaction.followUp({ content: 'Recording stopped!', ephemeral: true });
  }, 10000);
}
}

    

