const { SlashCommandBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('enlarge-emote')
        .setDescription('Enlarges a specified emote')
        .addStringOption(option =>
            option.setName('emote')
                .setDescription('The emote to enlarge')
                .setRequired(true)),
    async execute(interaction) {
        await interaction.deferReply();

        const emote = interaction.options.getString('emote');
        const emoteRegex = /<:(\w+):(\d+)>|<a:(\w+):(\d+)>/;

        const match = emote.match(emoteRegex);
        if (!match) {
            return interaction.editReply({ content: 'Please provide a valid emote.', ephemeral: true });
        }

        const isAnimated = Boolean(match[3]);
        const emoteId = match[2] || match[4];
        const emoteUrl = `https://cdn.discordapp.com/emojis/${emoteId}.${isAnimated ? 'gif' : 'png'}`;

        await interaction.editReply(emoteUrl);
    }
};
