const commandSchema = require('../models/commands');

function getCommands() {
  return commandSchema.find();
}
function addCommands(data) {
  const newCommand = new commandSchema(data);
  newCommand.save();
}

module.exports = {
  getCommands,
  addCommands,
};
