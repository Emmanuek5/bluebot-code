const {SlashCommandBuilder} = require("discord.js")

module.exports = {
    data: new SlashCommandBuilder()
    .setName("additem")
    .setDescription("Adds an item to the shop")
    .addStringOption(option => option.setName("item").setDescription("The item to add").setRequired(true))
    .addNumberOption(option => option.setName("price").setDescription("The price of the item").setRequired(true)),
    async execute(interaction, client) {
        const item = interaction.options.getString("item")
        const price = interaction.options.getNumber("price")
        const {user} = interaction
        const {Economy} = require("../../economy/base")
        const eco = new Economy()

       try {
         if (user.id == "738471887902081064") {
           const ecouser = eco.findUser(process.env.CLIENT_ID);
           if (!ecouser) return;
           const itemdata = {
            name: item,
            price: price
           }
           eco.InventorySystem.addItem(ecouser.id, itemdata, price);
           interaction.reply("Item added to the shop!");
         }
       } catch (error) {
        interaction.reply("An error occured");
        
        console.log(error);
       }


    }
}