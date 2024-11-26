const { SlashCommandBuilder, EmbedBuilder, PermissionsBitField, UserFlagsBitField } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('user-info')
        .setDescription('Displays information about a user.')
        .addUserOption(option => 
            option.setName('target')
                .setDescription('The user you want to get information about.')
                .setRequired(false)),
    async execute(interaction) {
        await interaction.deferReply(); 

        const target = interaction.options.getUser('target') || interaction.user;
        const member = await interaction.guild.members.fetch(target.id);

        const badgeEmojis = {
            DISCORD_EMPLOYEE: '<:Employee:930568347748286485>',
            PARTNERED_SERVER_OWNER: '<:Partnered:930566143981269022>',
            HYPESQUAD_EVENTS: '<:Hypesquad:930566353184759879>',
            BUGHUNTER_LEVEL_1: '<:BugHunter1:930566499947671593>',
            BUGHUNTER_LEVEL_2: '<:BugHunter2:930568474231717928>',
            PremiumEarlySupporter: '<:EarlySupporter:930567227982348338>',
            TEAM_USER: '👥',
            VerifiedBot: '<:Bot:928368897411907654>',
            VERIFIED_DEVELOPER: '<:Developer:930565432266592276>',
            Nitro: '<:NitroIcon:937467695413231616>',
            BOOSTING: '<:BoostIcon:937458483798867969>',
            ActiveDeveloper: '<:ActiveDeveloper:1252650694322683914>'
        };


        const hypesquadEmojis = {
            HypeSquadOnlineHouse1: '<:BraveryLogo:930566888034033664>',
            HypeSquadOnlineHouse2: '<:BrillianceLogo:930566894723932280>',
            HypeSquadOnlineHouse3: '<:BalanceLogo:930566901657141330>'
        };


        let badges = target.flags.toArray().map(flag => badgeEmojis[flag] || hypesquadEmojis[flag] || flag).join(' ') || '';


        if (target.avatar && target.avatar.startsWith('a_') || member.avatar && member.avatar.startsWith('a_') || member.banner?.startsWith('a_')) {
            badges += ` ${badgeEmojis['Nitro']}`;
        }


        if (member.premiumSince) {
            badges += ` ${badgeEmojis['BOOSTING']}`;
        }


        const roles = member.roles.cache
            .filter(role => role.id !== interaction.guild.id)
            .map(role => role.toString())
            .join(', ');


        const keyPermissionsMap = {
            'ADMINISTRATOR': 'Administrator',
            'MANAGE_GUILD': 'Manage Server',
            'MANAGE_ROLES': 'Manage Roles',
            'MANAGE_CHANNELS': 'Manage Channels',
            'MANAGE_MESSAGES': 'Manage Messages',
            'KICK_MEMBERS': 'Kick Members',
            'BAN_MEMBERS': 'Ban Members'
        };


        const acknowledgements = member.permissions.has(PermissionsBitField.Flags.Administrator) ? 'Server Admin' : 'None';

        const userInfoEmbed = new EmbedBuilder()
            .setColor('#892eeb')
            .setTitle(`${target.username}#${target.discriminator}`)
            .setThumbnail(target.displayAvatarURL({ dynamic: true }))
            .addFields(
                { name: 'Username', value: `${target.tag}`, inline: false },
                { name: 'Badges', value: badges || 'None', inline: false },
                { name: 'Server join date', value: `<t:${Math.floor(member.joinedTimestamp / 1000)}:F>`, inline: false },
                { name: 'Account created', value: `<t:${Math.floor(target.createdTimestamp / 1000)}:F>`, inline: false },
                { name: 'Roles', value: roles || 'None', inline: false },
                { name: 'Acknowledgements', value: acknowledgements, inline: false }
            )
            .setFooter({ text: `ID: ${target.id} • ${new Date().toLocaleDateString()}`, iconURL: interaction.user.displayAvatarURL({ dynamic: true }) });

        await interaction.editReply({ embeds: [userInfoEmbed] });
    }
};
