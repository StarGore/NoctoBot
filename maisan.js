const { Client, GatewayIntentBits, Collection } = require('discord.js');
const mongoose = require('mongoose');
const fs = require('fs');
const path = require('path');
const config = require('./config.json');

const client = new Client({
    intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages, GatewayIntentBits.MessageContent, GatewayIntentBits.GuildMembers]
});

client.commands = new Collection();


const commandFolders = fs.readdirSync('./slscommands');
for (const folder of commandFolders) {
    const commandFiles = fs.readdirSync(`./slscommands/${folder}`).filter(file => file.endsWith('.js'));
    for (const file of commandFiles) {
        const command = require(`./slscommands/${folder}/${file}`);
        client.commands.set(command.data.name, command);
    }
}


const eventFolders = fs.readdirSync('./events');
for (const folder of eventFolders) {
    const eventFiles = fs.readdirSync(`./events/${folder}`).filter(file => file.endsWith('.js'));
    for (const file of eventFiles) {
        const event = require(`./events/${folder}/${file}`);
        client.on(event.name, (...args) => event.execute(client, ...args));
    }
}

client.once('ready', () => {
    console.log(`Logged in as ${client.user.tag}!`);
    
    client.guilds.cache.forEach(guild => {
        console.log(`Bot is in server: ${guild.name}`);
    });
});

mongoose.connect(config.mongoUri).then(() => {
    console.log('MongoDB connected...');
}).catch(err => {
    console.error('Failed to connect to MongoDB', err);
});

client.login(config.token);
