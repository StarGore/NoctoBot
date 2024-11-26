const { SlashCommandBuilder, EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require('discord.js');
const fs = require('fs');
const path = require('path');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('help')
        .setDescription('Display a help menu with commands.'),
    async execute(interaction) {
        try {
            console.log('Help command received'); 


            if (!interaction.deferred && !interaction.replied) {
                await interaction.deferReply();  
            }

            const slscommandsPath = path.join(__dirname, '../../slscommands');
            const categories = fs.readdirSync(slscommandsPath).filter(file => fs.lstatSync(path.join(slscommandsPath, file)).isDirectory());
            console.log(`Categories found: ${categories}`);  

            const categoryButtons = categories.map(category => new ButtonBuilder()
                .setCustomId(category)
                .setLabel(capitalizeWords(category))
                .setEmoji(getEmojiObject(emotes[category] || '❓'))
                .setStyle(ButtonStyle.Primary)
            );

            const categoryDescriptions = categories.map(category => ({
                name: `${emotes[category] || '❓'} ${capitalizeWords(category)}`,
                value: `Click the ${emotes[category] || '❓'} button below to view commands.`
            }));

            const row = new ActionRowBuilder()
                .addComponents(categoryButtons);

            const helpEmbed = new EmbedBuilder()
                .setColor('#892eeb')
                .setTitle('Help - Command Categories')
                .setDescription('Select a category by clicking the corresponding emote button below:')
                .addFields(categoryDescriptions)
                .setThumbnail(interaction.client.user.displayAvatarURL({ dynamic: true }))
                .setFooter({ text: 'Use the buttons below to select a category.', iconURL: interaction.client.user.displayAvatarURL({ dynamic: true }) })
                .setTimestamp();


            if (interaction.deferred) {
                await interaction.editReply({ embeds: [helpEmbed], components: [row] });
            } else {
                await interaction.reply({ embeds: [helpEmbed], components: [row] });
            }
        } catch (error) {
            console.error('Error executing help command:', error);
            if (!interaction.replied && !interaction.deferred) {
                await interaction.reply({ content: 'An error occurred while executing this command.', ephemeral: true });
            } else if (interaction.deferred) {
                await interaction.followUp({ content: 'An error occurred while executing this command.', ephemeral: true });
            }
        }
    },
};

function capitalizeWords(str) {
    return str.replace(/\b\w/g, char => char.toUpperCase());
}

const emotes = {
    general: '📋',
    moderation: '<:ASAPi_bans:857642865382653973>',
    info: 'ℹ️',
    misc: '<:OnlineGlobal:857346280422506537>',
    valorant: '<:Valorant:1251811223033614357>'

};

function getEmojiObject(emoji) {
    const match = emoji.match(/^<:(\w+):(\d+)>$/);
    if (match) {
        return { name: match[1], id: match[2] };
    }
    return { name: emoji }; 
}
