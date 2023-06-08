require("dotenv").config();
class Economy {
constructor(){
    this.db = require("../models/economy")
    this.startingbalance = 1000
    this.maxbalance = 100000000
    this.minbalance = 0
    this.minbet = 10
    this.maxbet = 10000
    this.maxitems = 1000
    this.getshopid = process.env.CLIENT_ID
    this.minitems = 1

    this.defaultItems = {name:"boot",price:100,amount:1};
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
if (inv.findUser(user)) return false;
inv.saveUserWithDefaultItems(user, this.defaultItems);
return data;
} 



findUser(user){
    const { InventorySystem } = require("./InventoryManager/class");
    let inv = new InventorySystem();
 
    const data = this.db.findOne({User: user});
    if (!data) return false;
         inv.saveUserWithDefaultItems(user, this.defaultUser); 
    return data;

}

getBalance(user){
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

removeMoney(user, amount){
    const data = this.db.findOne({User: user});
if (!data) return false;
if (!data.Wallet >= amount) return false;
data.Wallet -= amount;
data.save();
return data;
}


getUserItems(user){
    const data = this.InventorySystem.getInventory(user)
    return data;
}

gable(user,item,amount){
   const gamble = this.InventorySystem.gambleItem(user)
   if (!gamble) { this.removeMoney(user, amount); return false}
   return gamble;
}


buyItemfromShop(user, item, amount){
    const data = this.InventorySystem.getItemInfo(this.getshopid,item)
    if (!data) return "Item not found";
     if (this.getBalance(user, this.getshopid) < data.price) return false,"You Dont Have Enough Money";
     const users = this.removeMoney(user,data.price)
     this.InventorySystem.buyItem(user,this.getshopid,item,amount)

}                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                    


}








module.exports= {Economy}