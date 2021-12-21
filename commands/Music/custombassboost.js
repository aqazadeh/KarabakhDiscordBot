const { check_if_dj, Embed } = require("../../handlers/functions");
const FiltersSettings = require("../../botconfig/filters.json");
module.exports = {
    name: "custombassboost",
    category: "Music",
    usage: "custombassboost <(0-20)>",
    aliases: ["custombassboost"],
    description: "Özel bir Bas güçlendirme ayarlar!",
    cooldown: 5,
    run: async(client, message, args) => {
        try {
            const { member, guildId, guild } = message;
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
                if (check_if_dj(client, member, newQueue.songs[0])) {
                    return message.channel.send({
                        embeds: [Embed("error", message.author.tag, message.author.displayAvatarURL(), `❌ **Siz bir DJ veya Şarkı İsteyen değilsiniz!**`)]
                    }).then(msg => {
                        setTimeout(() => {
                            msg.delete().catch((e) => { console.log(String(e).grey) })
                        }, 5000)
                    })
                }
                if (!args[0]) {
                    return message.channel.send({
                        embeds: [Embed("error", message.author.tag, message.author.displayAvatarURL(), `❌ **Lütfen 0+ ile 20 arasında Bass Miktarı ekleyin!**`)]
                    }).then(msg => {
                        setTimeout(() => {
                            msg.delete().catch((e) => { console.log(String(e).grey) })
                        }, 5000)
                    })
                }
                let bass_gain = parseInt(args[0])

                if (bass_gain > 20 || bass_gain < 0) {
                    return message.channel.send({
                        embeds: [Embed("error", message.author.tag, message.author.displayAvatarURL(), `❌ **Bass değeri 0 ile 20 arasında olmalıdır!**`)]
                    }).then(msg => {
                        setTimeout(() => {
                            msg.delete().catch((e) => { console.log(String(e).grey) })
                        }, 5000)
                    })
                }
                FiltersSettings.custombassboost = `bass=g=${bass_gain},dynaudnorm=f=200`;
                client.distube.filters = FiltersSettings;
                if (newQueue.filters.includes("custombassboost")) {
                    await newQueue.setFilter(["custombassboost"]);
                }
                await newQueue.setFilter(["custombassboost"]);
                return message.channel.send({
                    embeds: [Embed("success", message.author.tag, message.author.displayAvatarURL(), `✅ **Bass seviyesi ${bass_gain} ayarlandı!**`)]
                }).then(msg => {
                    setTimeout(() => {
                        msg.delete().catch((e) => { console.log(String(e).grey) })
                    }, 5000)
                })
            } catch (e) {
                console.log(e.stack ? e.stack : e)
            }
        } catch (e) {
            console.log(String(e.stack).bgRed)
        }
    }
}