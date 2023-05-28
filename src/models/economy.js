const mongoose  = require('mongoose');

const economySChema = new mongoose.Schema({
    Guild: String,
    User: {
type: String,
unique: true
    },
    Bank: String,
    Wallet: Number
})

module.exports = mongoose.model("Economy", economySChema);


