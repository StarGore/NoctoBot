const { SlashCommandBuilder } = require('@discordjs/builders');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('ping')
        .setDescription('Replies with Pong!'),
    async execute(interaction) {
        try {
            console.log('Ping command received'); 
            await interaction.reply('Pong!'); 
        } catch (error) {
            console.error('Error executing ping command:', error);
            if (!interaction.replied && !interaction.deferred) {
                await interaction.reply({ content: 'An error occurred while executing this command.', ephemeral: true });
            } else if (interaction.deferred) {
                await interaction.followUp({ content: 'An error occurred while executing this command.', ephemeral: true });
            }
        }
    },
};
