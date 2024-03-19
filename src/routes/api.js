const express = require("express");
const router = express.Router();
const serverSchema = require("../models/server");

router.client = null;

router.get("/servers", async (req, res) => {
  const data = [];
  for (const [id, guild] of router.client.guilds.cache) {
    data.push({
      id,
      name: guild.name,
      icon: guild.iconURL(),
      memberCount: guild.memberCount,
    });
  }
  res.status(200).json(data);
});

router.get("/server/:id", async (req, res) => {
  try {
    const id = req.params.id;
    const guild = await router.client.guilds.fetch(id);
    if (!guild) {
      res.status(404).json({ error: "Guild not found" });
      return;
    }
    const dbData = await serverSchema.findOne({ guildID: guild.id }).exec();

    const data = {
      id,
      name: guild.name,
      icon: guild.iconURL(),
      memberCount: guild.memberCount,
      settings: {
        botName: dbData.botName,
        prefix: dbData.prefix,
        welcome: {
          enabled: dbData.welcomeMessage.enabled,
          type: dbData.welcomeMessage.type,
          channelId: dbData.welcomeChannel,
          role: dbData.welcomeMessage.role,
          text: dbData.welcomeMessage.text,
        },
        leave: {
          enabled: dbData.leaveMessage.enabled,
          type: dbData.leaveMessage.type,
          channelId: dbData.goodbyeChannel,
          text: dbData.leaveMessage.text,
        },
      },
      channels: [],
      roles: [],
    };

    for (const [id, channel] of guild.channels.cache) {
      data.channels.push({
        id,
        name: channel.name,
        type: channel.type,
      });
    }

    for (const [id, role] of guild.roles.cache) {
      data.roles.push({
        id,
        name: role.name,
        color: role.color,
        hoist: role.hoist,
        mentionable: role.mentionable,
        permissions: role.permissions.toArray(),
        position: role.position,
        managed: role.managed,
        mentionable: role.mentionable,
        tags: role.tags,
      });
    }
    res.status(200).json(data);
  } catch (error) {
    res.status(400).json({ error: "An error occurred" });
    console.log(error);
  }
});

router.post("/server/:id/", async (req, res) => {
  try {
    const id = req.params.id;
    const guild = await router.client.guilds.fetch(id);
    if (!guild) {
      res.status(404).json({ error: "Guild not found" });
      return;
    }

    const { settings } = req.body;

    if (settings.botName || settings.prefix) {
      const { botName, prefix } = settings;
      // Update server settings
      const guild = await router.client.guilds.cache.get(id);
      const user = await guild.members.cache.find(member => member.id === router.client.user.id);
      user.setNickname(botName);
      await serverSchema.findOneAndUpdate({ guildID: guild.id }, { botName, prefix });
      res.status(200).json({ message: "Server settings updated" });
    } else if (settings.welcome) {
      // Update welcome message settings
      const { enabled, type, channelId, role, text } = settings.welcome;

      await serverSchema.findOneAndUpdate(
        { guildID: guild.id },
        {
          welcomeMessage: { enabled, type, role, text },
          welcomeChannel: channelId,
        }
      );
      res.status(200).json({ message: "Welcome message settings updated" });
    } else if (settings.leave) {
      const { enabled, type, channelId, text } = settings.leave;
      await serverSchema.findOneAndUpdate(
        { guildID: guild.id },
        {
          leaveMessage: { enabled, type, text },
          goodbyeChannel: channelId,
        }
      );
      res.status(200).json({ message: "Leave message settings updated" });
    } else {
      res.status(400).json({ error: "Invalid request body" });
    }
  } catch (error) {
    res.status(500).json({ error: "An error occurred" });
    console.log(error);
  }
});

module.exports = router;
