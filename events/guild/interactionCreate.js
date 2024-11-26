const { EmbedBuilder, InteractionType } = require('discord.js');
const fs = require('fs');
const path = require('path');

module.exports = {
    name: 'interactionCreate',
    async execute(client, interaction) {
        console.log(`Interaction received: ${interaction.type}`); 

        if (interaction.type === InteractionType.MessageComponent) {
            try {
                const category = interaction.customId;
                console.log(`Button interaction received: ${category}`);  

                const slscommandsPath = path.join(__dirname, '../../slscommands');
                const commandFiles = fs.readdirSync(path.join(slscommandsPath, category)).filter(file => file.endsWith('.js'));
                const commands = commandFiles.map(file => {
                    const command = require(path.join(slscommandsPath, category, file));
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
                if (!interaction.replied && !interaction.deferred) {
                    await interaction.reply({ content: 'An error occurred while processing this interaction.', ephemeral: true });
                }
            }
        } else if (interaction.type === InteractionType.ApplicationCommand) {
            try {
                console.log(`Command interaction received: ${interaction.commandName}`);  

                const command = client.commands.get(interaction.commandName);
                if (!command) throw new Error(`No command matching ${interaction.commandName} was found.`);

                await command.execute(interaction);
            } catch (error) {
                console.error(`Error executing ${interaction.commandName}:`, error);
                if (!interaction.replied && !interaction.deferred) {
                    await interaction.reply({ content: 'There was an error while executing this command!', ephemeral: true });
                } else if (interaction.deferred) {
                    await interaction.followUp({ content: 'There was an error while executing this command!', ephemeral: true });
                }
            }
        }
    },
};

function capitalizeWords(str) {
    return str.replace(/\b\w/g, char => char.toUpperCase());
}
