const { SlashCommandBuilder, Colors } = require("discord.js");

module.exports = {
  data: new SlashCommandBuilder().setName("help").setDescription("Get help with commands"),
  async execute(interaction, client) {
    const { user, guild } = interaction;

    let help_message = "";
    help_message += "# The Blue Bot\n";
    help_message += "The Best Discord Bot for Ai, Moderation, Economy, Fun, and more.\n\n";
    help_message += "## Commands:\n";
    help_message += "### 🤖 Ai\n";
    help_message += "- /imagine - Generate Ai Images\n";
    help_message += "- /ask-gpt - Ask The Ai A Question\n";
    help_message += "- /gpt-channel - Opens a Private Ai Chatroom\n\n";
    help_message += "### 🛠️ Moderation\n";
    help_message += "- /lock - Locks A Channel\n";
    help_message += "- /unlock - Unlocks A Channel\n";
    help_message += "- /clear - Clears all the messages in a Channel\n";
    help_message += "- /panel - Creates A Reaction Role Panel\n";
    help_message += "- /addrole - Adds A Role To The Reaction Role Panel\n";
    help_message += "- /removerole - Removes A Role From The Reaction Role Panel\n";
    help_message += "- /map - Maps The Servers Channels\n\n";
    help_message += "### 💰 Economy\n";
    help_message += "- /balance - Check Your Balance\n";
    help_message += "- /withdraw - Withdraw Money From Your Bank\n";
    help_message += "- /transfer - Transfer Money To Another User or To Your Bank\n";
    help_message += "- /work - Work A Job For Money\n";
    help_message += "- /daily - Claim Your Daily Money\n";
    help_message += "- /weekly - Claim Your Weekly Money\n";
    help_message += "- /monthly - Claim Your Monthly Money\n";
    help_message += "- /shop - Open The Shop\n";
    help_message += "- /buy - Buy Something From The Shop\n";
    help_message += "- /inventory - View Your Inventory\n";
    help_message += "- /sell - Sell Something To The Shop\n";
    help_message += "- /beg - Beg For Money\n";
    help_message += "- /gamble - Gamble Your Money With The Odds Of Multiplying Your Money\n\n";
    help_message += "### 😂 Fun\n";
    help_message += "- /joke - Get A Joke\n";
    help_message += "- /meme - Get A Meme\n";
    help_message += "- /slap - Slap Someone\n\n";
    help_message += "### ℹ️ General\n";
    help_message += "- /help - Get Help With Commands\n";
    help_message += "- /ping - Check The Latency Of The Bot\n";

    interaction.reply({ content: help_message });
  },
};
