const { PermissionsBitField } = require('discord.js');
const BlacklistWord = require('../../models/BlacklistWord');

module.exports = {
    name: 'messageCreate',
    async execute(client, message) {
        if (message.author.bot) return;

        try {
            const blacklistedWords = await BlacklistWord.find();
            const words = blacklistedWords.map(word => word.word.toLowerCase());

            for (const word of words) {
                if (message.content.toLowerCase().includes(word)) {
                    if (message.guild) {
                        const botMember = message.guild.members.cache.get(client.user.id) || await message.guild.members.fetch(client.user.id);
                        const botPermissions = message.channel.permissionsFor(botMember);

                        if (!botPermissions || !botPermissions.has(PermissionsBitField.Flags.ManageMessages)) {
                            console.log('Missing permissions to delete messages.');
                            return;
                        }

                        try {
                            await message.delete();
                            const replyMessage = await message.channel.send(`${message.author}, your message contained a blacklisted word and was deleted.`);
                            setTimeout(async () => {
                                try {
                                    await replyMessage.delete();
                                } catch (error) {
                                    console.error(`Failed to delete the reply message: ${error}`);
                                }
                            }, 10000); 
                        } catch (error) {
                            console.error(`Failed to delete message: ${error}`);
                        }
                    }
                    break;
                }
            }
        } catch (error) {
            console.error('Error checking for blacklisted words:', error);
        }
    },
};
