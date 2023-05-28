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
      console.log(tokenraw);
      const token = tokenraw.replace("Bearer ", "").replace("Bot ", "");
      console.log(token);
      const validate = new Authentication().validate(token).then(result => {
        if (!result) return res.send("Please provide a valid token").status(401);
        const id = req.body.id;
        if (!id) return res.send("Please provide a valid id").status(401);
        const user = this.client.users.cache.get(id);
        res.send(user).status(200);
      });
    });

    // retrive user economy
    this.app.post("/api/v1/user/economy", async (req, res) => {
        const { Authentication } = require("./Authentication/Auth");
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
    });

    //retrive user xp
    this.app.post("/api/v1/user/xp", async (req, res) => {
      const { Authentication } = require("./Authentication/Auth");
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
    });

    //retrive bots guilds
    this.app.post("/api/v1/guilds", async (req, res) => {
      const { Authentication } = require("./Authentication/Auth");
      const tokenraw = req.headers.authorization;
      const token = tokenraw.replace("Bearer ", "").replace("Bot ", "");
      const validate = new Authentication().validate(token).then(result => {
        if (!result) return res.send("Please provide a valid token").status(401);
        const guilds = [];
        this.client.guilds.cache.forEach((guild) => {
           
            const data = {
                id: guild.id,
                name: guild.name,
                icon: guild.iconURL(),
                icon: guild.iconURL(),
                membercount: guild.memberCount,
            }
            guilds.push(data);
           
        })
         res.send(guilds).status(200);
      });
    });

this.app.post("/api/v1/guild/invite", async (req, res) => {
    const { Authentication } = require("./Authentication/Auth");
  const tokenraw = req.headers.authorization;
  const token = tokenraw.replace("Bearer ", "").replace("Bot ", "");
  const validate = new Authentication().validate(token).then(result => {
    if (!result) return res.send("Please provide a valid token").status(401);
    const id = req.body.id;
    if (!id) return res.send("Please provide a valid id").status(401);
    const guild = this.client.guilds.cache.get(id);
    const invite = guild.channels.cache.random().createInvite({ maxAge: 0 });
    res.send(invite).status(200);
  });

})


  }
}

module.exports = { Api };
