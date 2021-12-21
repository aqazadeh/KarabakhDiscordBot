const { Embed } = require("../../handlers/functions.js");
module.exports = {
    name: "unban",
    category: "Mod",
    usage: "unban",
    aliases: ["unban"],
    description: "Bir Kullanıcı Engelini Kaldırır",
    cooldown: 5,
    memberpermissions: ["BAN_MEMBERS"],

    run: async(client, message, args) => {
        try {
            const mMember = args[0];
            if (!mMember == undefined) {
                return message.channel.send({
                    embeds: [Embed("error", message.author.tag, message.author.displayAvatarURL(), `**Lütfen bir kullanıcıyı ID'si girin**`)]
                }).then(msg => {
                    setTimeout(() => {
                        msg.delete().catch((e) => { console.log(String(e).grey) })
                    }, 5000)
                })
            }
            message.guild.members.unban(mMember).then(() => {
                return message.channel.send({
                    embeds: [Embed("success", message.author.tag, message.author.displayAvatarURL(), `**Kullanıcı Engeli Kaldırıldı**`)]
                }).then(msg => {
                    setTimeout(() => {
                        msg.delete().catch((e) => { console.log(String(e).grey) })
                    }, 5000)
                })
            }).catch(e => {
                return message.channel.send({
                    embeds: [Embed("error", message.author.tag, message.author.displayAvatarURL(), `**Kullanıcı Engeli Kaldırılamadı**`)]
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