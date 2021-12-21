const { check_if_dj, Embed } = require("../../handlers/functions");
module.exports = {
    name: "rewind",
    category: "Music",
    usage: "rewind <TimeInSec>",
    aliases: ["rwd"],
    description: "X Saniye için Geri Sarma",
    cooldown: 10,
    run: async(client, message, args) => {
        try {
            const { member, guildId } = message;
            const { guild } = member;
            const { channel } = member.voice;
            if (!channel) {
                return message.channel.send({
                    embeds: [Embed("error", message.author.tag, message.author.displayAvatarURL(), `❌ **Lütfen önce ses kanalına giriş yapın**`)]
                }).then(msg => {
                    setTimeout(() => {
                        msg.delete().catch((e) => { console.log(String(e).grey) })
                    }, 5000)
                })
            }
            if (channel.guild.me.voice.channel && channel.guild.me.voice.channel.id != channel.id) {
                return message.channel.send({
                    embeds: [Embed("error", message.author.tag, message.author.displayAvatarURL(), `❌ **Benim ses Kanalıma giriş yap! Lütfen** <#${channel.guild.me.voice.channel.id}> **kanalına giriş yap!**`)]
                }).then(msg => {
                    setTimeout(() => {
                        msg.delete().catch((e) => { console.log(String(e).grey) })
                    }, 5000)
                })
            }
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
                        embeds: [Embed("error", message.author.tag, message.author.displayAvatarURL(), `❌ **Lütfen bir Geri Sarma Süresi ekleyin!**`)]
                    }).then(msg => {
                        setTimeout(() => {
                            msg.delete().catch((e) => { console.log(String(e).grey) })
                        }, 5000)
                    })
                }
                if (check_if_dj(client, member, newQueue.songs[0])) {
                    return message.channel.send({
                        embeds: [Embed("error", message.author.tag, message.author.displayAvatarURL(), `❌ **Siz bir DJ veya Şarkı İsteyen değilsiniz!**`)]
                    }).then(msg => {
                        setTimeout(() => {
                            msg.delete().catch((e) => { console.log(String(e).grey) })
                        }, 5000)
                    })
                }
                let seekNumber = Number(args[0])
                let seektime = newQueue.currentTime - seekNumber;
                if (seektime < 0) seektime = 0;
                if (seektime >= newQueue.songs[0].duration - newQueue.currentTime) seektime = 0;

                await newQueue.seek(seektime).then(() => {
                    return message.channel.send({
                        embeds: [Embed("success", message.author.tag, message.author.displayAvatarURL(), `⏮ **Şarkıyı \`${seekNumber}\` saniye geri aldı!**`)]
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