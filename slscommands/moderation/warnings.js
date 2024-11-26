const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const Warning = require('../../models/Warning');
const requiredRoleID = '1251668512418697229'; 

module.exports = {
    data: new SlashCommandBuilder()
        .setName('warnings')
        .setDescription('Fetches warnings for a specific user or the last 10 warnings for the server.')
        .addUserOption(option => 
            option.setName('target')
                .setDescription('The user to fetch warnings for')
                .setRequired(false)),
    async execute(interaction) {
        const member = interaction.guild.members.cache.get(interaction.user.id);
        const hasRequiredRole = member.roles.cache.has(requiredRoleID);

        console.log(`User ${interaction.user.tag} attempting to use /warnings command`);

        if (!hasRequiredRole) {
            console.log(`User ${interaction.user.tag} does not have the required role.`);
            await interaction.reply({ content: 'You do not have permission to use this command.', ephemeral: true });
            return;
        }

        try {
            console.log('Warnings command received');
            const options = interaction.options;
            console.log('Options:', options);

            const targetUser = options.getUser('target');
            console.log('Target user:', targetUser ? `${targetUser.tag} (${targetUser.id})` : 'None');

            await interaction.deferReply({ ephemeral: true });

            let replyContent = '';
            let embed = null;

            if (targetUser) {
                console.log(`Fetching warnings for user: ${targetUser.tag} (${targetUser.id})`);

                const warnings = await Warning.find({ userId: targetUser.id });
                console.log(`Warnings for user ${targetUser.tag}:`, warnings.length);

                if (warnings.length === 0) {
                    replyContent = `No warnings found for ${targetUser.tag}.`;
                } else {
                    embed = new EmbedBuilder()
                        .setColor(0x892eeb)
                        .setTitle(`Warnings for ${targetUser.tag}`)
                        .setDescription(warnings.map((warn, index) => 
                            `**${index + 1}.** ${warn.reason} - <t:${Math.floor(new Date(warn.timestamp).getTime() / 1000)}:F>`
                        ).join('\n'))
                        .setTimestamp();
                }
            } else {
                console.log('Fetching the last 10 warnings for the server');

                const warnings = await Warning.find({ guildId: interaction.guild.id }).sort({ timestamp: -1 }).limit(10);
                console.log('Last 10 warnings:', warnings.length);

                if (warnings.length === 0) {
                    replyContent = 'No warnings found in this server.';
                } else {
                    const warningDescriptions = await Promise.all(warnings.map(async (warn, index) => {
                        const user = await interaction.client.users.fetch(warn.userId);
                        return `**${index + 1}.** **${warn.reason}** - <@${warn.userId}>`
                    }));

                    embed = new EmbedBuilder()
                        .setColor(0x892eeb)
                        .setTitle('Last 10 Warnings in the Server')
                        .setDescription(warningDescriptions.join('\n'))
                        .setTimestamp();
                }
            }

            if (replyContent) {
                await interaction.editReply({ content: replyContent });
            } else if (embed) {
                await interaction.editReply({ embeds: [embed] });
            }
        } catch (error) {
            console.error('Error executing warnings command:', error);
            if (!interaction.replied && !interaction.deferred) {
                await interaction.reply({ content: 'An error occurred while executing this command.', ephemeral: true });
            } else {
                await interaction.followUp({ content: 'An error occurred while executing this command.', ephemeral: true });
            }
        }
    },
};
