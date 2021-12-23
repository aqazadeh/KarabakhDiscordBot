var { Embed } = require("../../handlers/functions");
module.exports = {
    name: "server",
    category: "Info",
    usage: "server",
    aliases: ["server"],
    example: ["server"],
    description: "Server Bilgisini gösterir!",
    cooldown: 10,
    run: async(client, message, args) => {
        try {
            let bannedMembersCount;
            await message.guild.bans.fetch().then((bannedUsers) => {

                bannedMembersCount = bannedUsers.size;
            });
            const owner = message.guild.ownerId;
            const voiceChanel = message.guild.channels.cache.filter(ch => ch.type === 'GUILD_VOICE').size;
            const textChannel = message.guild.channels.cache.filter(ch => ch.type === 'GUILD_TEXT').size;
            const embed = Embed(
                    message.guild.name, message.author.tag,
                    message.author.displayAvatarURL(),
                    `[**Benim kendi sunucuna davet etmek için tıkla!**](https://discord.com/api/oauth2/authorize?client_id=${client.user.id}&permissions=8&scope=bot)`
                )
                .addField(`**🆔 Server ID**`, `${message.guild.id}`, true)
                .addField(`**👑 Kurucu**`, `<@${owner}>`, true)
                .addField(`**📣 Kanallar**`, `Text: ` + String(textChannel) + `\n` + `Ses: ` + String(voiceChanel), true)
                .addField(`**🧑🏼‍🤝‍🧑🏻 Üyeler: **`, String(message.guild.memberCount), true)
                .addField(`**🔐 Yetkiler**`, String(message.guild.roles.cache.size), true)
                .addField(`**❌ Engellenmiş Üye**`, String(bannedMembersCount), true)
                .setThumbnail(message.guild.iconURL());

            return message.channel.send({ embeds: [embed] })
        } catch (e) {
            console.log(String(e.stack).bgRed)
        }
    }
}