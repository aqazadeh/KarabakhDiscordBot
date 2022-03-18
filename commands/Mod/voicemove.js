const { Embed } = require("../../handlers/functions.js");
module.exports = {
    name: "voicemove",
    category: "Mod",
    usage: "voicemove <User> <Channel>",
    aliases: ["voicemove", "vmove"],
    description: "Bir Kullanıcıyı başka bir kanala taşır",
    cooldown: 1,
    memberpermissions: ["MOVE_MEMBERS"],

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
            args.shift()
            try {
                let channel = message.guild.channels.cache.find(c => c.name.toLowerCase() == args.join(" ").toLocaleLowerCase());
                if (!channel.type === "voice") {
                    return message.channel.send({
                        embeds: [Embed("error", message.author.tag, message.author.displayAvatarURL(), `❌ **Ses kanalı bulunamadı. Metin kanalından değil ses kanalından bahsettiğinizden emin olun!**`)]
                    }).then(msg => {
                        setTimeout(() => {
                            msg.delete().catch((e) => { console.log(String(e).grey) })
                        }, 5000)
                    })
                }

                member.voice.setChannel(channel).then(() => {
                    return message.channel.send({
                        embeds: [Embed("success", message.author.tag, message.author.displayAvatarURL(), `✅ **${member} adlı kullanıcı ${channel} odasına taşındı!**`)]
                    }).then(msg => {
                        setTimeout(() => {
                            msg.delete().catch((e) => { console.log(String(e).grey) })
                        }, 5000)
                    })
                }).catch(e => {
                    return message.channel.send({
                        embeds: [Embed("error", message.author.tag, message.author.displayAvatarURL(), `❌ **Kullanıcı Yetkisi Benim Yetkimden daha yuksek. Kullanıcı Ses Kanalı degiştirilemedi**`)]
                    }).then(msg => {
                        setTimeout(() => {
                            msg.delete().catch((e) => { console.log(String(e).grey) })
                        }, 5000)
                    })
                })

            } catch (e) {
                return message.channel.send({
                    embeds: [Embed("error", message.author.tag, message.author.displayAvatarURL(), `❌ **Ses Odasi Bulunamadi. Ses odası ismi yanlış. Yeniden Deneyin!**`)]
                }).then(msg => {
                    setTimeout(() => {
                        msg.delete().catch((e) => { console.log(String(e).grey) })
                    }, 5000)
                })
            }
        } catch (e) {
            console.log(String(e.stack).bgRed)
        }
    }
}