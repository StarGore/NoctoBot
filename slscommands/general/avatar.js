const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('avatar')
        .setDescription('Get the avatar URL of the selected user, or your own avatar.')
        .addUserOption(option => option.setName('target').setDescription('The user\'s avatar to show')),
    async execute(interaction) {
        await interaction.deferReply();

        const user = interaction.options.getUser('target') || interaction.user;
        const avatarEmbed = new EmbedBuilder()
            .setColor('#892eeb')
            .setAuthor({ name: user.username, iconURL: user.displayAvatarURL() })
            .setImage(user.displayAvatarURL({ dynamic: true, size: 512 }));

        await interaction.editReply({ embeds: [avatarEmbed] });
    },
};
