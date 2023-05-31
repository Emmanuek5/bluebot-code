const {Economy } = require('../base');


class inventoryManager extends Economy {
 
    constructor(){
        this.invendb = require("../../models/inventory")
        super()
        this.shop = 1058300450253832272;
    }
    
    createInventory(user){
        const inv = new this.invendb({
              user: user,
            items: []
        })

        inv.save()
        .catch(err => console.log(err))
        return inv;
    }

    addItemtoUser(user, item = {name, amount, price, description,amount}){
        this.invendb.findOneAndUpdate({user: user}, {$push: {items: item}}, {upsert: true})
      
    }

    createItem(user,item ={name, amount, price, description}){
        this.invendb.findOneAndUpdate({user: user}, {$push: {items: item}}, {upsert: true})
    }

    removeItem(user, item = {name, amount, price, description}){
        this.invendb.findOneAndUpdate({user: user}, {$pull: {items: item}}, {upsert: true})
    }

    reduceAmountofItem(user, item = {name, amount, price, description}){
        this.invendb.findOneAndUpdate({user: user}, {$pull: {items: item}}, {upsert: true})

    }
    
    addAmountofItem(user, item = {name, amount, price, description}){
        this.invendb.findOneAndUpdate({user: user}, {$pull: {items: item}}, {upsert: true})
    }

}





module.exports = {inventoryManager};