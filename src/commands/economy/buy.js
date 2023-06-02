const {SlashCommandBuilder,EmbedBuilder} = require("discord.js")

module.exports = {
  data: new SlashCommandBuilder()
    .setName("buy")
    .setDescription("Buy an item from a user or Shop")
    .addSubcommand(subcommand =>
      subcommand.setName("user").setDescription("Buy an item from a user ")
    )
    .addSubcommand(subcommand =>
      subcommand
        .setName("shop")
        .setDescription("Buy an item from Shop")
        .addStringOption(option =>
          option.setName("item").setDescription("The Item You Want To Buy").setRequired(true)
        )
        .addNumberOption(option =>
          option.setName("amount").setDescription("Amount of item to buy").setRequired("true")
        )
    ),
  async execute(interaction, client) {
    const { guild, options, user } = interaction;
    const command = interaction.options.getSubcommand();
    const number = interaction.options.getNumber("amount");
    const item = interaction.options.getString("item");
    const { Economy } = require("../../economy/base");

    try {
        
    if (command == "shop") {
      const eco = new Economy();
      const user = eco.findUser(user.id);
      if (!user) return interaction.reply({ content: "You Don't Have An Economy Account" });
      let itemdata = eco.InventorySystem.getItemInfo(process.env.CLIENT_ID);
      if (!itemdata)  return interaction.reply({content: "The item Does not exist check the spelling and try again"}) 
     if (!user.Wallet >= item.price)  return interaction.reply({ content: "You Don't Have Enough Money in Your Wallet" });
      const result =  eco.buyItemfromShop(user.id,item,number)
      if (result) {
        const embed = new EmbedBuilder()
        .setTitle("Successful Purchase")
        .setDescription(`You Have Purchased ${item} at $${item.price}`)
        .setColor("Green")
        .setTimestamp()
        .setFooter({text: "Buy"});
        interaction.reply({embeds: [embed]})
      
      }
    }

    } catch (err) {
        interaction.reply({content: "There Was an Error" + err})
    }

  },
};