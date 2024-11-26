const { SlashCommandBuilder, EmbedBuilder, PermissionsBitField } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('timeout')
        .setDescription('Timeout a user for a specified duration')
        .addUserOption(option => 
            option.setName('target')
                .setDescription('The user to timeout')
                .setRequired(true))
        .addIntegerOption(option => 
            option.setName('duration')
                .setDescription('Duration of the timeout in minutes')
                .setRequired(true))
        .addStringOption(option => 
            option.setName('reason')
                .setDescription('Reason for the timeout')
                .setRequired(false)),
    cooldown: 60, // Cooldown in seconds
    async execute(interaction) {
        await interaction.deferReply(); 

        const target = interaction.options.getUser('target');
        const duration = interaction.options.getInteger('duration');
        const reason = interaction.options.getString('reason') || 'No reason provided';


        if (!interaction.member.permissions.has(PermissionsBitField.Flags.ModerateMembers)) {
            return interaction.editReply({ content: 'You do not have permission to use this command.', ephemeral: true });
        }


        const member = interaction.guild.members.cache.get(target.id);

        if (!member) {
            return interaction.editReply({ content: 'User not found in this server.', ephemeral: true });
        }

        if (member.roles.highest.position >= interaction.member.roles.highest.position) {
            return interaction.editReply({ content: 'You cannot timeout someone with an equal or higher role.', ephemeral: true });
        }


        const timeoutDuration = duration * 60 * 1000;

        try {

            await target.send(`You have been timed out in \`${interaction.guild.name}\` for ${duration} minutes.\nReason: ${reason}`);


            await member.timeout(timeoutDuration, reason);

            const embed = new EmbedBuilder()
                .setTitle('User Timed Out')
                .addFields(
                    { name: 'User', value: `<@${target.id}>`, inline: true },
                    { name: 'Duration', value: `${duration} minutes`, inline: true },
                    { name: 'Reason', value: reason, inline: true },
                )
                .setColor('#892eeb')
                .setTimestamp();


            await interaction.editReply({ embeds: [embed] });


            const logEmbed = new EmbedBuilder()
                .setColor('#892eeb')
                .setTitle('User Timed Out')
                .addFields(
                    { name: 'Timed Out User', value: `<@${target.id}>` },
                    { name: 'Timed Out By', value: `<@${interaction.user.id}>` },
                    { name: 'Duration', value: `${duration} minutes` },
                    { name: 'Reason', value: reason },
                    { name: 'Time', value: `<t:${Math.floor(Date.now() / 1000)}:F>` }
                );

            const logChannel = interaction.guild.channels.cache.get('1220748658748817438');
            if (logChannel) {
                logChannel.send({ embeds: [logEmbed] });
            }
        } catch (error) {
            console.error('Error timing out user:', error);
            await interaction.editReply({ content: 'There was an error while trying to timeout this user.', ephemeral: true });
        }
    }
};
