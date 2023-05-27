const {SlashCommandBuilder} = require("discord.js")


const {SlashCommandBuilder} = require("@discordjs/builders")

module.exports = {
    data: new SlashCommandBuilder()
        .setName("change-avatar")
        .setDescription("Change The Bots Avatar")
        .addAttachmentOption((option) => option.setName("avatar").setDescription("The Attachment").setRequired(true))
        ,
        async execute(interaction,client) {
            const attachment = interaction.options.getAttachment("avatar")
        
            if (interaction.user.id != "738471887902081064") {
                interaction.reply("You Are Not Allowed To Use This Command")         
            }

         try {
               await interaction.deferReply();

               client.user.setAvatar(attachment.url);
               await interaction.editReply("Avatar Changed");

         } catch (error) {
             console.log(error);
             await interaction.editReply("Something Went Wrong"); 
            
         }
       
        }}