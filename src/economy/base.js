
class Economy {
constructor(){
    this.db = require("../models/economy")
    this.startingbalance = 1000
    this.maxbalance = 100000000
    this.minbalance = 0
    this.minbet = 10
    this.maxbet = 10000
    this.maxitems = 1000
    this.minitems = 1
    this.defaultItems = []
    this.InventorHandler = require("./InventoryManager/class");
    this.InventorySystem =new  this.InventorHandler.InventorySystem()
}
/**
 * 
 * @param {String} user 
 * @param {String} guild
 * 
 * The User and Guild are both strings and the IDs  
 */

create(user, guild){
const {InventorySystem} = require("./InventoryManager/class")
let inv = new InventorySystem()
    const data = this.db.create({
      Guild: guild,
      User: user,
      Wallet: this.startingbalance,
      Bank: 0,
    })
if (!data) return false;
inv.saveUserWithDefaultItems(user,this.defaultItems )
return data;
}

findUser(user){
    const { InventorySystem } = require("./InventoryManager/class");
    let inv = new InventorySystem();
    if (!this.InventorySystem.getInventory(user)) inv.saveUserWithDefaultItems(user)
    const data = this.db.findOne({User: user});
    if (!data) return false;
    return data;

}

getBalance(user, guild){
    const data = this.db.findOne({User: user});
if (!data) return false;
return data.Wallet + data.Bank;
}
updateBalance(user, guild, amount){
    const data = this.db.findOne({User: user});
if (!data) return false;
data.Wallet += amount;
data.save();
return data;
}

setBalance(user, guild, amount){
    const data = this.db.findOne({User: user});
if (!data) return false;
data.Wallet = amount;
data.save();
return data;
}

addMoney(user, guild, amount){
    const data = this.db.findOne({User: user});
if (!data) return false;
data.Bank += amount;
data.save();
return data;
}

removeMoney(user, guild, amount){
    const data = this.db.findOne({User: user});
if (!data) return false;
data.Bank -= amount;
data.save();
return data;
}


getUserItems(user){
    const data = this.InventorySystem.getInventory(user)
    return data;
}







}




module.exports= {Economy}