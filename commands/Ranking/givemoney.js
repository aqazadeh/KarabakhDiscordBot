const { Embed } = require("../../handlers/functions");
module.exports = {
    name: "givemoney",
    category: "Ranking",
    usage: "givemoney",
    aliases: ["givemoney"],
    description: "Bir kullanıcıya para gönderir",
    cooldown: 1,
    memberpermissions: ["MANAGE_GUILD"],


    run: async(client, message, args, setting, rank) => {
        try {
            const user = message.mentions.users.first();
            if (!user) {
                return message.channel.send({
                    embeds: [Embed("error", message.author.tag, message.author.displayAvatarURL(), `❌ **Lütfen bir kullanıcıyı etiketleyin**`)]
                }).then(msg => {
                    setTimeout(() => {
                        msg.delete().catch((e) => { console.log(String(e).grey) })
                    }, 5000)
                })
            }
            if (args[1] && typeof Number(args[1]) != 'number') {
                return message.channel.send({
                    embeds: [Embed("error", message.author.tag, message.author.displayAvatarURL(), `❌ **Lütfen bir sayı girin**`)]
                }).then(msg => {
                    setTimeout(() => {
                        msg.delete().catch((e) => { console.log(String(e).grey) })
                    }, 5000)
                })
            }

            const userData = await client.rank.findOne({ where: { guild_id: message.guild.id, user_id: user.id } });
            const count = Number(args[1]);
            await client.rank.update({ money: userData.get(`money`) + count }, { where: { guild_id: message.member.guild.id, user_id: user.id } }).then(() => {
                return message.channel.send({
                    embeds: [Embed("success", message.author.tag, message.author.displayAvatarURL(), `✅ **${message.member} kullanıcısı ${user} kullanıcısına ${count} coin para gönderdi**`)]
                }).then(msg => {
                    setTimeout(() => {
                        msg.delete().catch((e) => { console.log(String(e).grey) })
                    }, 5000)
                })
            })

        } catch (e) {
            console.log(String(e.stack).bgRed)
        }
    }
}