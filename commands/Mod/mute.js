const { Embed } = require("../../handlers/functions.js");
module.exports = {
    name: "mute",
    category: "Mod",
    usage: "mute <@User>",
    aliases: ["mute"],
    description: "Bir Kullanıcının sesini kapatır!",
    cooldown: 5,
    memberpermissions: ["MUTE_MEMBERS"],

    run: async(client, message, args, settings) => {
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

            if (member.voice.channelId === null) {
                return message.channel.send({
                    embeds: [Embed("error", message.author.tag, message.author.displayAvatarURL(), `❌ **Kullanıcı ses kanalında değil**`)]
                }).then(msg => {
                    setTimeout(() => {
                        msg.delete().catch((e) => { console.log(String(e).grey) })
                    }, 5000)
                })
            }
            await member.voice.setMute(true).then(() => {
                return message.channel.send({
                    embeds: [Embed("success", message.author.tag, message.author.displayAvatarURL(), `✅ **${message.member} adlı kullanıcı ${member} kullanıcısın sesini kapatdı!**`)]
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