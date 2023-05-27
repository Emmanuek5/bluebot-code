const mongoose  = require('mongoose');

const economySChema = new mongoose.Schema({
    Guild: String,
    User: String,
    Bank: String,
    Wallet: Number
})

module.exports = mongoose.model("Economy", economySChema);


