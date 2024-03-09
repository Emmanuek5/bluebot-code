const { AutoPoster } = require("topgg-autoposter");
const { WebSocket } = require("ws");
const websocket = new WebSocket("ws://clovenbots.com/", {
  headers: {
    Authorization: process.env.CLOVEN_TOKEN,
  },
});
module.exports = {
  async execute(client) {
    const ap = new AutoPoster(process.env.TOPGG_TOKEN, client);
    function connectWebSocket() {
      const websocket = new WebSocket(config.details.websocket, {
        headers: {
          Authorization: "Bearer " + config.details.token,
        },
      });

      websocket.on("close", (code, reason) => {
        console.log("WebSocket closed. Reconnecting...");
        setTimeout(connectWebSocket, 1000); // Reconnect after 1 second
      });

      websocket.on("error", err => {
        console.log("WebSocket error:", err);
      });

      websocket.on("open", () => {
        console.log("Connected to WebSocket");
        websocket.send(
          JSON.stringify({
            type: "update",
            botid: client.user.id,
            stats: {
              serverCount: client.guilds.cache.size,
              userCount: client.users.cache.size,
              channelCount: client.channels.cache.size,
            },
          })
        );
      });
    }
    connectWebSocket();
    ap.on("autopost-start", () => {
      console.log("Started auto posting stats to Top.gg!");
    });

    ap.on("posted", () => {
      console.log("Posted stats to Top.gg!");
    });

    client.on("guildCreate", async guild => {
      connectWebSocket();
    });

    client.on("guildDelete", async guild => {
      connectWebSocket();
    });
  },
};
