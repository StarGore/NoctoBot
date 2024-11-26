const { SlashCommandBuilder } = require('@discordjs/builders');
const { EmbedBuilder } = require('discord.js');
const BlacklistWord = require('../../models/BlacklistWord'); 

module.exports = {
    data: new SlashCommandBuilder()
        .setName('blacklist')
        .setDescription('Manages the blacklist of words.')
        .addSubcommand(subcommand =>
            subcommand
                .setName('add')
                .setDescription('Add a word to the blacklist.')
                .addStringOption(option =>
                    option.setName('word')
                        .setDescription('The word to blacklist')
                        .setRequired(true)))
        .addSubcommand(subcommand =>
            subcommand
                .setName('remove')
                .setDescription('Remove a word from the blacklist.')
                .addStringOption(option =>
                    option.setName('word')
                        .setDescription('The word to remove from the blacklist')
                        .setRequired(true)))
        .addSubcommand(subcommand =>
            subcommand
                .setName('list')
                .setDescription('List all blacklisted words.')),

    async execute(interaction) {
        const requiredRoleID = '1251668512418697229';
        const member = interaction.guild.members.cache.get(interaction.user.id);

        if (!member.roles.cache.has(requiredRoleID)) {
            await interaction.reply({
                content: 'You do not have permission to use this command.',
                ephemeral: true
            });
            return;
        }

        const subcommand = interaction.options.getSubcommand();
        const word = interaction.options.getString('word');
        const userId = interaction.user.id;

        await interaction.deferReply({ ephemeral: true });

        if (subcommand === 'add') {
            try {
                const newWord = new BlacklistWord({ word, addedBy: userId });
                await newWord.save();

                const embed = new EmbedBuilder()
                    .setColor('#892eeb')
                    .setDescription(`The word "${word}" has been added to the blacklist.`);

                await interaction.editReply({ embeds: [embed] });
            } catch (error) {
                if (error.code === 11000) {
                    await interaction.editReply({ content: `The word "${word}" is already blacklisted.`, ephemeral: true });
                } else {
                    console.error('Error adding word to blacklist:', error);
                    await interaction.editReply({ content: 'There was an error adding the word to the blacklist.', ephemeral: true });
                }
            }
        } else if (subcommand === 'remove') {
            try {
                console.log(`Attempting to remove word: ${word}`);
                const result = await BlacklistWord.findOneAndDelete({ word });

                if (result) {
                    console.log(`Successfully removed word: ${word}`);
                    const embed = new EmbedBuilder()
                        .setColor('#892eeb')
                        .setDescription(`The word "${word}" has been removed from the blacklist.`);

                    await interaction.editReply({ embeds: [embed] });
                } else {
                    console.log(`Word not found in blacklist: ${word}`);
                    await interaction.editReply({ content: `The word "${word}" was not found in the blacklist.`, ephemeral: true });
                }
            } catch (error) {
                console.error('Error removing word from blacklist:', error);
                await interaction.editReply({ content: 'There was an error removing the word from the blacklist.', ephemeral: true });
            }
        } else if (subcommand === 'list') {
            try {
                const words = await BlacklistWord.find().select('word -_id');
                const wordList = words.map(w => w.word).join('\n');

                const embed = new EmbedBuilder()
                    .setColor('#892eeb')
                    .setTitle('Blacklisted Words')
                    .setDescription(wordList || 'No words are currently blacklisted.');

                await interaction.editReply({ embeds: [embed] });
            } catch (error) {
                console.error('Error retrieving blacklist:', error);
                await interaction.editReply({ content: 'There was an error retrieving the blacklist.', ephemeral: true });
            }
        }
    },
};
