const { check_if_not_dj, Embed } = require("../../handlers/functions");
module.exports = {
    name: "seek",
    category: "Music",
    usage: "seek <TimeInSec>",
    aliases: ["sek"],
    description: "Şarkıda belirli bir Pozisyona arar!",
    cooldown: 10,



    run: async(client, message, args, settings) => {
        try {
            const { member, guildId } = message;
            const { guild } = member;
            const { channel } = member.voice;

 
            try {
                let newQueue = client.distube.getQueue(guildId);
                if (!newQueue || !newQueue.songs || newQueue.songs.length == 0) {
                    return message.channel.send({
                        embeds: [Embed("error", message.author.tag, message.author.displayAvatarURL(), `❌ **Şuan şarkı çalmıyorum!**`)]
                    }).then(msg => {
                        setTimeout(() => {
                            msg.delete().catch((e) => { console.log(String(e).grey) })
                        }, 5000)
                    })
                }
                if (!args[0]) {
                    return message.channel.send({
                        embeds: [Embed("error", message.author.tag, message.author.displayAvatarURL(), `❌ **Lütfen bir Arama Numarası Pozisyon Süresi ekleyin!**`)]
                    }).then(msg => {
                        setTimeout(() => {
                            msg.delete().catch((e) => { console.log(String(e).grey) })
                        }, 5000)
                    })
                }
                let seekNumber = Number(args[0])
                if (seekNumber > newQueue.songs[0].duration || seekNumber < 0) {
                    return message.channel.send({
                        embeds: [Embed("error", message.author.tag, message.author.displayAvatarURL(), `❌ **Arama Konumu, \`0\` ile \`${newQueue.songs[0].duration}\` arasında olmalıdır!**`)]
                    }).then(msg => {
                        setTimeout(() => {
                            msg.delete().catch((e) => { console.log(String(e).grey) })
                        }, 5000)
                    })
                }
                if (check_if_not_dj(client, member, newQueue.songs[0], settings)) {
                    return message.channel.send({
                        embeds: [Embed("error", message.author.tag, message.author.displayAvatarURL(), `❌ **Siz bir DJ veya Şarkı İsteyen değilsiniz!**`)]
                    }).then(msg => {
                        setTimeout(() => {
                            msg.delete().catch((e) => { console.log(String(e).grey) })
                        }, 5000)
                    })
                }
                await newQueue.seek(seekNumber).then(() => {
                    return message.channel.send({
                        embeds: [Embed("success", message.author.tag, message.author.displayAvatarURL(), `⏭ ** Şarkı \`${seekNumber}\` saniyeye atlandı!**`)]
                    }).then(msg => {
                        setTimeout(() => {
                            msg.delete().catch((e) => { console.log(String(e).grey) })
                        }, 5000)
                    })
                });
            } catch (e) {
                console.log(e.stack ? e.stack : e)
            }
        } catch (e) {
            console.log(String(e.stack).bgRed)
        }
    }
}