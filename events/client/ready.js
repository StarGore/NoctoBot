const Bot = require("../../models/bot.js");
const Discord = require("discord.js");
const User = require('../../models/user');

module.exports = async client => {

  
  module.exports = (client) => {
    console.log(`Logged in as ${client.user.tag}!`);

    client.guilds.cache.forEach(guild => {
        console.log(`Server: ${guild.name} (ID: ${guild.id})`);
    });
};
}
