const mongoose = require('mongoose');

const inventorySchema = new mongoose.Schema({
        User:{ type:String, required:true, unique:true},
        items:{ type:Array, required:true},
    
    })

    module.exports = mongoose.model('inventory',inventorySchema);