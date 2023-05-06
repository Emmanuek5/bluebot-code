const { REST, Routes } = require('discord.js');

if (process.env.TOKEN !== 'undefined') {
  require('dotenv').config();
}

const rest = new REST({ version: '10' }).setToken(process.env.TOKEN);

if (process.argv[2] === undefined) {
  console.log('Please provide a command id');
} else {
  console.log('Deleting command');
  const commandId = process.argv[2];

  const clientId = process.env.CLIENT_ID;

  // for global commands
  rest
    .delete(Routes.applicationCommand(clientId, commandId))
    .then(() => console.log('Successfully deleted application command'))
    .catch(console.error);
}

//get the command id from the arguments
