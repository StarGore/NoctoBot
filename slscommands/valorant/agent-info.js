const { SlashCommandBuilder } = require('discord.js');
const axios = require('axios');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('agent-info')
        .setDescription('Displays information about a Valorant agent.')
        .addStringOption(option =>
            option.setName('agent')
                .setDescription('The name of the agent')
                .setRequired(true)),
    async execute(interaction) {
        const agentName = interaction.options.getString('agent').toLowerCase();
        
        try {
            const response = await axios.get(`https://valorant-api.com/v1/agents?isPlayableCharacter=true`);
            const agents = response.data.data;
            const agent = agents.find(a => a.displayName.toLowerCase() === agentName);

            if (!agent) {
                return interaction.followUp({ content: 'Please provide a valid agent name.', ephemeral: true });
            }

            const agentInfoEmbed = {
                color: 0x892eeb,
                title: agent.displayName,
                description: agent.description,
                thumbnail: {
                    url: agent.displayIcon,
                },
                fields: agent.abilities.map(ability => ({
                    name: ability.displayName,
                    value: ability.description,
                    inline: true
                })),
                image: {
                    url: agent.fullPortrait,
                },
                footer: {
                    text: `Role: ${agent.role.displayName}`,
                },
                timestamp: new Date(),
            };

            await interaction.reply({ embeds: [agentInfoEmbed] });
        } catch (error) {
            console.error(error);
            await interaction.followUp({ content: 'There was an error fetching the agent information.', ephemeral: true });
        }
    }
};
