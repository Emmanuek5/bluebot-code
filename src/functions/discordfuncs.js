function getOwner(interaction) {
  return interaction.client.users.cache.get(interaction.guild.ownerId);
}
