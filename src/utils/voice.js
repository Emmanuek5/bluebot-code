const {
  joinVoiceChannel,
  getVoiceConnections,
  getVoiceConnection,
  createAudioPlayer,
  createAudioResource,
  NoSubscriberBehavior,
  VoiceConnectionStatus,
} = require("@discordjs/voice");
const EmbedBuilder = require("discord.js");
const youtube = require("ytdl-core");
const { entersState, AudioPlayerStatus } = require("@discordjs/voice");

const { join } = require("path");
const player = createAudioPlayer({
  behaviors: {
    noSubscriber: NoSubscriberBehavior.Pause,
  },
});

async function play(interaction) {
  const channel = interaction.options.getChannel("channel");
  const song = interaction.options.getString("song");
  const VoiceConnection = joinVoiceChannel({
    channelId: channel.id,
    guildId: interaction.guildId,
    adapterCreator: interaction.guild.voiceAdapterCreator,
    selfDeaf: false,
    selfMute: false,
  });

  let resource = createAudioResource("/home/bobsidian/music/test.mp3", {
    metadata: {
      title: "test",
    },
  });

  const connection = getVoiceConnection(interaction.guildId);

  console.log(connection);
  player.play(resource);
  connection.subscribe(player);
  await entersState(player, AudioPlayerStatus.Playing, 5_000);

  player.on(AudioPlayerStatus.Idle, () => {
    connection.destroy();
    player.stop();
  });
}

module.exports = { play };
