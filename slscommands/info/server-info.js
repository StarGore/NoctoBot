const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('server-info')
        .setDescription('Displays information about the server.'),
    async execute(interaction) {
        await interaction.deferReply();

        const { guild } = interaction;
        const owner = await guild.fetchOwner();

        const serverInfoEmbed = new EmbedBuilder()
            .setColor('#892eeb')
            .setTitle(`${guild.name} Server Information`)
            .setThumbnail(guild.iconURL({ dynamic: true }))
            .addFields(
                { name: 'Server Name', value: guild.name, inline: true },
                { name: 'Server ID', value: guild.id, inline: true },
                { name: 'Owner', value: owner.user.tag, inline: true },
                { name: 'Total Members', value: `${guild.memberCount}`, inline: true },
                { name: 'Creation Date', value: guild.createdAt.toDateString(), inline: true },
                { name: 'Region', value: guild.preferredLocale, inline: true }
            )
            .setTimestamp();

        await interaction.editReply({ embeds: [serverInfoEmbed] });
    }
};
