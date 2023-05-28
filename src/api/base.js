const levels = require("discord.js-leveling/models/levels");


class Api {
  constructor(client, client_secret, app) {
    this.url = "https://discord.com/api/v/9/";
    this.client_id = process.env.CLIENT_ID;
    this.client_secret = client_secret;
    this.client = client;
    this.app = app;
  }

  async start() {
    //creating the token
    this.app.post("/api/v1/auth/create", async (req, res) => {
      const { Authentication } = require("./Authentication/Auth");
      const id = req.body.id;
      const token = new Authentication().create(id).then(token => {
      
          console.log(id, token);
          res.send(token).status(200);
        });
      
    });

    //checking the api for information
    this.app.post("/api/v1/user", async (req, res) => {
      const { Authentication } = require("./Authentication/Auth");
      const tokenraw = req.headers.authorization;
      const token = tokenraw.replace("Bearer ", "").replace("Bot ", "");
      const validate = new Authentication().validate(token).then(result => {
        if (!result) res.send("Please provide a valid token").status(401);
        const id = req.body.id
        if(!id) res.send("Please provide a valid id").status(401); 
        const user = this.client.users.cache.get(id);
        res.send(user).status(200);
      });

      this.app.post("/api/v1/user/economy", async (req,res)=>{
        const { Authentication } = require("./Authentication/Auth");
        const ecoSChema = require("../models/economy");
      const tokenraw = req.headers.authorization;
      const token = tokenraw.replace("Bearer ", "").replace("Bot ", "");
        const validate = new Authentication().validate(token).then(result => {
          if (!result) res.send("Please provide a valid token").status(401);
          const id = req.body.id
          if(!id) res.send("Please provide a valid id").status(401); 
         const user =   ecoSChema.findOne({User: id})
         if (!user) res.send("User does not have an economy profile").status(401);
         res.send(user).status(200);
        });
    })    

          this.app.post("/api/v1/user/xp", async (req, res) => {
            const { Authentication } = require("./Authentication/Auth");
          const Levels = require("discord.js-leveling");
        const tokenraw = req.headers.authorization;
        const token = tokenraw.replace("Bearer ", "").replace("Bot ", "");
            const validate = new Authentication().validate(token).then(result => {
              if (!result) res.send("Please provide a valid token").status(401);
              const id = req.body.id;
              const guildid = req.body.guildid;
              if (!id) res.send("Please provide a valid id").status(401);
              if (!guildid) res.send("Please provide a valid guildid").status(401);
              Levels.fetch(id, guildid).then(xp => {
                res.send(xp).status(200);
              }
              )
             
            });
          });    





      this.app.post("/api/v1/guilds", async (req, res) => {
        const { Authentication } = require("./Authentication/Auth");
    const tokenraw = req.headers.authorization;
    const token = tokenraw.replace("Bearer ", "").replace("Bot ", "");
        const validate = new Authentication().validate(token).then(result => {
          if (!result) res.send("Please provide a valid token").status(401);
          const guilds= this.client.guilds.cache.get();
          res.send(guilds).status(200);
        });



      })


      
      
    

    
  })

}
}

module.exports = { Api };
