const { EmbedBuilder } = require('discord.js');
const fs = require('fs');
const path = require('path');

module.exports = {
    name: 'interactionCreate',
    async execute(client, interaction) {
        if (!interaction.isButton()) return;

        try {
            const category = interaction.customId;
            const commandFiles = fs.readdirSync(path.join(__dirname, `../slscommands/${category}`)).filter(file => file.endsWith('.js'));

            const commands = commandFiles.map(file => {
                const command = require(path.join(__dirname, `../slscommands/${category}/${file}`));
                return `\`${command.data.name}\`: ${command.data.description}`;
            }).join('\n');

            const categoryEmbed = new EmbedBuilder()
                .setColor('#892eeb')
                .setTitle(`Commands in ${capitalizeWords(category)}`)
                .setDescription(commands || 'No commands found in this category.')
                .setTimestamp();

            await interaction.update({ embeds: [categoryEmbed], components: [] });
        } catch (error) {
            console.error('Error handling button interaction:', error);
            await interaction.reply({ content: 'An error occurred while processing this interaction.', ephemeral: true });
        }
    }
};

function capitalizeWords(str) {
    return str.replace(/\b\w/g, char => char.toUpperCase());
}
