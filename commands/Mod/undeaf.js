const { Embed } = require("../../handlers/functions.js");
module.exports = {
    name: "undeaf",
    category: "Mod",
    usage: "undeaf <User>",
    aliases: ["undeaf"],
    description: "Bir kullanıcıyı sağır modundan çıkarır",
    cooldown: 1,
    memberpermissions: ["MUTE_MEMBERS"],

    run: async(client, message, args) => {
        try {
            let member = message.mentions.members.first()
            if (!member) {
                return message.channel.send({
                    embeds: [Embed("error", message.author.tag, message.author.displayAvatarURL(), `❌ **Bahsedilen kullanıcı bu Kanalda bulunamadı.**`)]
                }).then(msg => {
                    setTimeout(() => {
                        msg.delete().catch((e) => { console.log(String(e).grey) })
                    }, 5000)
                })
            }

            member.voice.setDeaf(false).then(() => {
                return message.channel.send({
                    embeds: [Embed("error", message.author.tag, message.author.displayAvatarURL(), `**${message.member} adlı kullanıcı ${member} kullanıcısının sağır modundan çıkarıldı!**`)]
                }).then(msg => {
                    setTimeout(() => {
                        msg.delete().catch((e) => { console.log(String(e).grey) })
                    }, 5000)
                })
            }).catch(e => {
                return message.channel.send({
                    embeds: [Embed("error", message.author.tag, message.author.displayAvatarURL(), `❌ **Kullanıcı yetkisi benim yetkimden daha yüksek. Kullanıcı sağır modundan çıkarılamadı!**`)]
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