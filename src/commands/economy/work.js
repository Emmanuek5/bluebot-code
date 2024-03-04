const {
  SlashCommandBuilder,
  EmbedBuilder,
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
} = require("discord.js");
const { Economy } = require("../../economy/base");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("work")
    .setDescription("Work for money")
    .addSubcommand(subcommand => subcommand.setName("list").setDescription("List available jobs"))
    .addSubcommand(subcommand =>
      subcommand
        .setName("apply")
        .setDescription("Apply for a job")
        .addStringOption(option =>
          option.setName("job").setDescription("The job you want to apply for").setRequired(true)
        )
    ),

  async execute(interaction, client) {
    const { user, options } = interaction;
    const eco = client.economy;
    let Data = await eco.findUser(user.id);
    const embed = new EmbedBuilder();

    if (!Data) {
      return interaction.reply({
        content: "You don't have an economy profile yet",
        ephemeral: true,
      });
    }

    if (interaction.options.getSubcommand() === "list") {
      let jobs = eco.WorkSystem.getJobs();
      let fields = [];
      jobs.forEach(job => {
        fields.push({
          name: job.name,
          value: `Pay: $${job.salary}, Time: ${job.duration} seconds`,
          inline: true,
        });
      });

      let components = [];
      // Limit fields to 20
      if (fields.length > 20) {
        fields = fields.slice(0, 20);
        components.push(
          new ActionRowBuilder().addComponents(
            new ButtonBuilder().setCustomId("work-next").setLabel("Next >>").setStyle("Primary")
          )
        );
      }

      embed.setTitle("Work");
      embed.setColor("Blue");
      embed.setDescription("Available jobs");
      embed.addFields(fields);

      interaction.reply({ embeds: [embed], components: components });
    } else if (interaction.options.getSubcommand() === "apply") {
      const jobName = options.getString("job");

      // Check if the job exists
      const job = eco.WorkSystem.getJob(jobName);
      if (!job) {
        return interaction.reply({
          content: "Job not found",
          ephemeral: true,
        });
      }

      // Apply for the job
      await interaction.deferReply();
      const message = await interaction.editReply({
        content: `Working as a **${job.name}** for ${job.duration} seconds ...`,
      });

      // Countdown timer
      const endTime = Date.now() + job.duration * 1000; // Convert seconds to milliseconds
      const interval = 1000; // Update interval in milliseconds

      const updateTimer = setInterval(() => {
        const remainingTime = Math.max(0, Math.ceil((endTime - Date.now()) / 1000));
        if (remainingTime === 0) {
          clearInterval(updateTimer);
          return;
        }
        interaction.editReply({
          content: `Working as a **${job.name}** for ${remainingTime} seconds ...`,
        });
      }, interval);

      await eco.work(user, jobName).then(async message => {
        clearInterval(updateTimer);
        interaction.editReply({
          content: message,
        });
      });
    }
  },
};
