const { SlashCommandBuilder } = require('@discordjs/builders');
const { EmbedBuilder, PermissionsBitField } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('ban')
        .setDescription('Ban a member from the server.')
        .addUserOption(option => 
            option.setName('target')
                .setDescription('The member to ban')
                .setRequired(true))
        .addStringOption(option => 
            option.setName('reason')
                .setDescription('The reason for banning')
                .setRequired(false)),

    async execute(interaction) {
        await interaction.deferReply();

        if (!interaction.member.permissions.has(PermissionsBitField.Flags.BanMembers)) {
            return interaction.editReply({ content: 'You do not have permission to use this command.', ephemeral: true });
        }

        const target = interaction.options.getUser('target');
        const reason = interaction.options.getString('reason') || 'No reason provided';
        const member = interaction.guild.members.cache.get(target.id);

        if (!member) {
            return interaction.editReply({ content: 'Member not found.', ephemeral: true });
        }

        try {

            await target.send(`You have been banned from \`${interaction.guild.name}\`.\nReason: ${reason}`);


            await member.ban({ reason });

            const embed = new EmbedBuilder()
                .setColor('#892eeb')
                .setDescription(`${target.tag} has been banned.\nReason: ${reason}`);

            await interaction.editReply({ embeds: [embed] });

            const logEmbed = new EmbedBuilder()
                .setColor('#892eeb')
                .setTitle('User Banned')
                .addFields(
                    { name: 'Banned User', value: `<@${target.id}>` },
                    { name: 'Banned By', value: `<@${interaction.user.id}>` },
                    { name: 'Reason', value: reason },
                    { name: 'Time', value: `<t:${Math.floor(Date.now() / 1000)}:F>` }
                );

            const logChannel = interaction.guild.channels.cache.get('1220748658748817438');
            if (logChannel) {
                logChannel.send({ embeds: [logEmbed] });
            }
        } catch (error) {
            console.error(error);
            interaction.editReply({ content: 'There was an error trying to ban this member.', ephemeral: true });
        }
    },
};