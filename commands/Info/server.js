const { MessageEmbed } = require("discord.js");
const ee = require("../../botconfig/embed.json");
const lang = require("../../lang/tr.json");
module.exports = {
    name: "server", //the command name for the Slash Command
    category: "Info",
    usage: "server",
    aliases: ["server"],
    example: ["server"],
    description: lang.server.generaldescription, //the command description for Slash Command Overview
    cooldown: 10,
    memberpermissions: [], //Only allow specific Users with a Role to execute a Command [OPTIONAL]

    run: async(client, message, args) => {
        try {
            let bannedMembersCount;
            await message.guild.bans.fetch().then((bannedUsers) => {

                bannedMembersCount = bannedUsers.size;
            });
            const owner = message.guild.ownerId;
            const voiceChanel = message.guild.channels.cache.filter(ch => ch.type === 'GUILD_VOICE').size;
            const textChannel = message.guild.channels.cache.filter(ch => ch.type === 'GUILD_TEXT').size;
            const embed = new MessageEmbed()
                .setColor(ee.color)
                .setTitle(`${message.guild.name}`)
                .addField(lang.server.serverID, `${message.guild.id}`, true)
                .addField(lang.server.owner, `<@${owner}>`, true)
                .addField(lang.server.channels, lang.server.textChannels + String(textChannel) + `\n` + lang.server.voiceChannels + String(voiceChanel), true)
                .addField(lang.server.members, String(message.guild.memberCount), true)
                .addField(lang.server.roles, String(message.guild.roles.cache.size), true) //a70f3e9169546b2c67d301aaeef38.gif
                .addField(lang.server.bannedMembers, String(bannedMembersCount), true) //a70f3e9169546b2c67d301aaeef38.gif
                .setThumbnail(message.guild.iconURL())
                .setFooter(ee.footertext, ee.footericon);
            return message.channel.send({ embeds: [embed] })
        } catch (e) {
            console.log(String(e.stack).bgRed)
        }
    }
}