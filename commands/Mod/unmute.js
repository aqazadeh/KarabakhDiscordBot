const { Embed } = require("../../handlers/functions.js");
module.exports = {
    name: "unmute",
    category: "Mod",
    usage: "unmute <User>",
    aliases: ["unmute"],
    description: "Bir Kullanıcının sesini aktiflestirir",
    cooldown: 1,
    memberpermissions: ["MUTE_MEMBERS"],

    run: async(client, message, args) => {
        try {
            let member = message.mentions.members.first()
            if (!member) {
                return message.channel.send({
                    embeds: [Embed("error", message.author.tag, message.author.displayAvatarURL(), `**Lütfen bir kullanıcıyı etiketleyin**`)]
                }).then(msg => {
                    setTimeout(() => {
                        msg.delete().catch((e) => { console.log(String(e).grey) })
                    }, 5000)
                })
            }
            member.voice.setMute(false).then(() => {
                return message.channel.send({
                    embeds: [Embed("success", message.author.tag, message.author.displayAvatarURL(), `✅ **${message.member} adlı kullanıcı ${member} kullanıcısın sesini açtı!**`)]
                }).then(msg => {
                    setTimeout(() => {
                        msg.delete().catch((e) => { console.log(String(e).grey) })
                    }, 5000)
                })
            }).catch(e => {
                return message.channel.send({
                    embeds: [Embed("error", message.author.tag, message.author.displayAvatarURL(), `❌ **Kullanıcı yetkisi benim yetkimden daha yüksek. Kullanıcı sesi kapatılamadı**`)]
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