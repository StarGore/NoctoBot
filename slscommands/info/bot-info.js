const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const os = require('os');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('bot-info')
        .setDescription('Displays statistics about the bot.'),
    async execute(interaction) {
        await interaction.deferReply();

        const uptime = process.uptime();
        const memoryUsage = process.memoryUsage();
        const totalMemory = os.totalmem();
        const freeMemory = os.freemem();
        const usedMemory = totalMemory - freeMemory;

        const embed = new EmbedBuilder()
            .setTitle('Noctobot Info')
            .setColor('#892eeb')
            .addFields(
                { name: 'Uptime', value: `${Math.floor(uptime / 60)} minutes` },
                { name: 'Memory Usage', value: `${(memoryUsage.heapUsed / 1024 / 1024).toFixed(2)} MB / ${(memoryUsage.heapTotal / 1024 / 1024).toFixed(2)} MB` },
                { name: 'Total System Memory', value: `${(totalMemory / 1024 / 1024 / 1024).toFixed(2)} GB` },
                { name: 'Used System Memory', value: `${(usedMemory / 1024 / 1024 / 1024).toFixed(2)} GB` },
                { name: 'Free System Memory', value: `${(freeMemory / 1024 / 1024 / 1024).toFixed(2)} GB` }
            )
            .setTimestamp();

        await interaction.editReply({ embeds: [embed] });
    },
};
