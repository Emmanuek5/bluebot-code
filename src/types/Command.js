const { SlashCommandBuilder, ChatInputCommandInteraction, Client } = require("discord.js");

class Command extends SlashCommandBuilder {
  constructor() {
    super();
    this.execute = async () => {};
    this.data = this;
  }

  /**
   * Set the executor for the function.
   *
   * @param {function(ChatInputCommandInteraction, Client)} execute - The function to set as the executor
   * @memberof Command
   * @name Command#setExecutor
   * @return {Object} this - The instance of the object for chaining
   */
  setExecutor(execute) {
    this.execute = execute;
    return this;
  }

  loadData() {
    this.data = new SlashCommandBuilder()
      .setName(this.name)
      .setDescription(this.description)
      .setDMPermission(this.dm_permission)
      .setDefaultMemberPermissions(this.default_member_permissions);
    this.data.options = this.options;
    this.data.description_localizations = this.description_localizations;
    this.data.name_localizations = this.name_localizations;
    this.data.toJSON = () => {
      return {
        ...this.data,
      };
    };
  }
}

module.exports = Command;
