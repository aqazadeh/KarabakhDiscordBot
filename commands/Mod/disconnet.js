const { Embed } = require("../../handlers/functions.js");
module.exports = {
    name: "disconnect",
    category: "Mod",
    usage: "disconnect <@User>",
    aliases: ["disconnect"],
    description: "Bir Kullanıcının sesini kapatır",
    cooldown: 1,
    memberpermissions: ["MOVE_MEMBERS"],

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

            if (member.voice.channelId === null) {
                return message.channel.send({
                    embeds: [Embed("error", message.author.tag, message.author.displayAvatarURL(), `❌ **Kullanıcı ses kanalında değil**`)]
                }).then(msg => {
                    setTimeout(() => {
                        msg.delete().catch((e) => { console.log(String(e).grey) })
                    }, 5000)
                })
            }

            member.voice.disconnect().then(() => {
                return message.channel.send({
                    embeds: [Embed("success", message.author.tag, message.author.displayAvatarURL(), `**${message.member} adlı kullanıcı ${member} kullanıcısın ses kanalından çıkardı!**`)]
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