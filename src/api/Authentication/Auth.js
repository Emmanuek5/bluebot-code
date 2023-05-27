const {Api} = require('@api/base');
const tokenSchema = require('@models/tokens');
const crypto = require('node:crypto');
class Authentication extends Api {
    constructor() {
        super();
    }

    async create(id){
        const user = this.client.users.cache.get(id);
        const tokenw = await tokenSchema.findOne({user: user.id});
        if (tokenw)  return tokenw.token;
          let usertoken = crypto.randomBytes(32).toString('hex');
        const token = new tokenSchema({
            userid: user.id,
            token: usertoken,

        })

        await token.save();
         return usertoken;
    }

    async validate(token){
        const tokenw = await tokenSchema.findOne({token: token});
        if (!tokenw) return false;
        return true;
    }


    

}

module.exports = {Authentication}