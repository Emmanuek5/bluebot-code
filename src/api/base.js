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
      const token = req.headers.authorization;
      const validate = new Authentication().validate(token)
      if (!validate) res.send("Please provide a valid token").status(401) 
    

    
  })

}
}

module.exports = { Api };
