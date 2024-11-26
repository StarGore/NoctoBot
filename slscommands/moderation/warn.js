const { SlashCommandBuilder, EmbedBuilder } = require('@discordjs/builders');
const Warning = require('../../models/Warning');
const requiredRoleID = '1251668512418697229'; 
const logChannelID = '1220748658748817438'; 

module.exports = {
    data: new SlashCommandBuilder()
        .setName('warn')
        .setDescription('Warn a user.')
        .addUserOption(option => option.setName('target').setDescription('The user to warn').setRequired(true))
        .addStringOption(option => option.setName('reason').setDescription('Reason for the warning').setRequired(true)),
    async execute(interaction) {
        const member = interaction.guild.members.cache.get(interaction.user.id);
        const hasRequiredRole = member.roles.cache.has(requiredRoleID);

        console.log(`User ${interaction.user.tag} attempting to use /warn command`);

        if (!hasRequiredRole) {
            console.log(`User ${interaction.user.tag} does not have the required role.`);
            await interaction.reply({ content: 'You do not have permission to use this command.', ephemeral: true });
            return;
        }

        const target = interaction.options.getUser('target');
        const reason = interaction.options.getString('reason');
        const guildId = interaction.guild.id;
        const moderatorId = interaction.user.id;
        const userId = target.id;

        try {
            await interaction.deferReply({ ephemeral: true });

            const warning = new Warning({
                userId,
                guildId,
                moderatorId,
                reason
            });

            await warning.save();

            try {
                await target.send(`You have been warned for: \`${reason}\``);
            } catch (error) {
                console.error(`Could not send DM to ${target.tag}:`, error);
            }

            const warnEmbed = new EmbedBuilder()
                .setColor(0x892eeb)
                .setTitle('User Warned')
                .addFields(
                    { name: 'User', value: `<@${userId}>`, inline: true },
                    { name: 'Moderator', value: `<@${moderatorId}>`, inline: true },
                    { name: 'Reason', value: reason, inline: true },
                    { name: 'Date', value: `<t:${Math.floor(Date.now() / 1000)}:F>`, inline: true }
                )
                .setTimestamp();

            const logChannel = interaction.guild.channels.cache.get(logChannelID);
            if (logChannel) {
                await logChannel.send({ embeds: [warnEmbed] });
            }

            await interaction.editReply({ content: `Warned ${target.tag} for: ${reason}` });
        } catch (error) {
            console.error('Error executing warn command:', error);
            if (!interaction.replied && !interaction.deferred) {
                await interaction.reply({ content: 'An error occurred while executing this command.', ephemeral: true });
            } else {
                await interaction.followUp({ content: 'An error occurred while executing this command.', ephemeral: true });
            }
        }
    },
};
