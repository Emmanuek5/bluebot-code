


class Api  {
    constructor(client, client_secret, app){
        this.url = "https://discord.com/api/v/9/";
        this.client_id = client.user.id;
        this.client_secret = client_secret;
        this.client = client;
        this.app= app;
    }

    start(){
        this.app.post("/api/v1/auth/create", (req, res) => {
            const { Authentication } = require("./Authentication/Auth");
            const id = req.body.id;
            const token = new Authentication().create(id)
            res.send(token).status(200)
        })


    }

}

module.exports = {Api};