const levels = require("discord.js-leveling/models/levels");

class Api {
  constructor(client, client_secret, app) {
    this.url = "https://discord.com/api/v/9/";
    this.client_id = process.env.CLIENT_ID;
    this.client_secret = client_secret;
    this.client = client;
    this.app = app;
    this.economyhandler = require("../economy/base");
    this.economy = new this.economyhandler.Economy();
    this.routes = {
      "/api/v1/auth/create": {
        method: "POST",
      },
      "/api/v1/user": {
        method: "POST",
      },
      "/api/v1/user/economy": {
        method: "POST",
      },
      "/api/v1/user/xp": {
        method: "POST",
      },
      "/api/v1/guilds": {
        method: "POST",
      },
      "/api/v1/guild/invite": {
        method: "POST",
      },
    };
  }

  /**
   * Start the server and define the API routes.
   *
   * @param {void}
   * @return {void}
   */
  async start() {
  for (let i = 0; i < this.routes.length; i++) {
    console.log("Registering Route:"+ this.routes[i])
  }   
  }

  setClient(client){
    this.client = client
  }



async handler(req,res,method) {
 
      try {
        const { Authentication } = require("./Authentication/Auth");
        const path = req.path
        switch (path) {
          case "/api/v1/auth/create":
            // Route logic for creating authentication tokens
            if (this.routes["/api/v1/auth/create"].method == method) {
                 const id = req.body.id;
            let token = new Authentication().create(id).then(token => {
              console.log(id, token);
              res.send(token).status(200);
            });
            token = "";
          }else{
            res.send("Usage: "+this.routes["/api/v1/auth/create"].method.toUpperCase + ": "+ path)
          }
      
            break;

          case "/api/v1/user":
       if (this.routes["/api/v1/user"].method == method) {
             // Route logic for checking user information

            const tokenraw = req.headers.authorization;
            console.log(tokenraw);
            token = tokenraw.replace("Bearer ", "").replace("Bot ", "");
            console.log(token);
            const validate = new Authentication().validate(token).then(result => {
              if (!result) return res.send("Please provide a valid token").status(401);
              const id = req.body.id;
              if (!id) return res.send("Please provide a valid id").status(401);
              const user = this.client.users.cache.get(id);
              res.send(user).status(200);
            });
            token = "";
            break;
       }else{

               res.send(
                 "Usage: " + this.routes["/api/v1/user"].method.toUpperCase + ": " + path
               );
        
       }
          case "/api/v1/user/economy":
            // Route logic for retrieving user economy
          if(this.routes["/api/v1/user/economy"].method == method){
              try {
                const ecoSchema = require("../models/economy");
                const tokenRaw = req.headers.authorization;
                const token = tokenRaw.replace("Bearer ", "").replace("Bot ", "");
                console.log(token, tokenRaw);

                const validate = new Authentication().validate(token).then(async result => {
                  if (!result) {
                    return res.status(401).send("Please provide a valid token");
                  }

                  const id = req.body.id;
                  if (!id) {
                    return res.status(401).send("Please provide a valid id");
                  }

                  try {
                    const user = await ecoSchema.findOne({ User: id });

                    if (!user) {
                      return res.status(401).send("User does not have an economy profile");
                    }

                    const data = {
                      balance: user.Wallet + user.Bank,
                      wallet: user.Wallet,
                      bank: user.Bank,
                      guild: user.Guild,
                    };

                    res.status(200).json(data);
                  } catch (error) {
                    console.error(error);
                    res.status(500).send("An error occurred while retrieving user economy data");
                  }
                });
              } catch (error) {
                console.log(error);
                res.send("An error occurred while retrieving the economy").status(500);
              }
          }else{
            res.send("Usage: "+this.routes["/api/v1/user/economy"].method.toUpperCase + ": "+ path)
          }
            break;

          case "/api/v1/user/xp":
            // Route logic for retrieving user XP
            try {
              const Levels = require("discord.js-leveling");
              const tokenraw = req.headers.authorization;
              const token = tokenraw.replace("Bearer ", "").replace("Bot ", "");
              const validate = new Authentication().validate(token).then(result => {
                if (!result) return res.send("Please provide a valid token").status(401);
                const id = req.body.id;
                const guildid = req.body.guildid;
                if (!id) return res.send("Please provide a valid id").status(401);
                if (!guildid) res.send("Please provide a valid guildid").status(401);
                Levels.fetch(id, guildid).then(xp => {
                  res.send(xp).status(200);
                });
              });
            } catch (error) {
              console.log(error);
              res.send("An error occurred while retrieving the xp").status(500);
            }
            break;

          case "/api/v1/guilds":
          if(this.routes["/api/v1/guilds"].method == method){
            // Route logic for retrieving bot's guilds
            try {
              const tokenraw = req.headers.authorization;
              if (!tokenraw) {
                res.status(400).send("No Authoriation Provied");
                return;
              }
              const token = tokenraw.replace("Bearer ", "").replace("Bot ", "");
              const validate = new Authentication().validate(token).then(result => {
                if (!result) return res.send("Please provide a valid token").status(401);
                const guilds = [];
                this.client.guilds.cache.forEach(guild => {
                  const data = {
                    id: guild.id,
                    name: guild.name,
                    icon: guild.iconURL(),
                    membercount: guild.memberCount,
                  };
                  guilds.push(data);
                });
                res.send(guilds).status(200);
              });
            } catch (error) {
              console.log(error);
              res.send("An error occurred while retrieving the guilds").status(500);
            }
          }else{
            res.send("Usage: "+this.routes["/api/v1/guilds"].method + ": "+ path)
          }
            break;

          case "/api/v1/guild/invite":
            // Route logic for creating guild invites
         if (this.routes["/api/v1/guild/invite"].method == method) {
             try {
               const tokenraw = req.headers.authorization;
               const token = tokenraw.replace("Bearer ", "").replace("Bot ", "");
               const validate = new Authentication().validate(token).then(async result => {
                 if (!result) return res.send("Please provide a valid token").status(401);
                 const id = req.body.id;
                 if (!id) return res.send("Please provide a valid id").status(401);
                 const guild = this.client.guilds.cache.get(id);

                 const invite = await guild.invites.create(guild.systemChannelId, {
                   unique: true,
                   maxAge: 0,
                 });
                 res.send(invite).status(200);
               });
             } catch (error) {
               console.log(error);
               res.send("An error occurred while creating the invite").status(500);
             }
          
         }else{
            res.send("Usage: "+this.routes["/api/v1/guild/invite"].method + ": "+ path)
         }
            break;

          // Add more cases for other routes if needed

          default:
            // Return 404 for unknown routes
            res.status(404).send("Not Found");
            break;
        }
      } catch (error) {
        console.log(error);
        res.status(500).send("Internal Server Error");
      }
}

}

module.exports = { Api };
