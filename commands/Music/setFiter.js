const { check_if_dj, Embed } = require("../../handlers/functions");
const FiltersSettings = require("../../botconfig/filters.json");
module.exports = {
        name: "setfilter",
        category: "Music",
        usage: "setfilter <Filter1 Filter2>",
        aliases: ["setfilter"],
        description: "Tüm Filtreleri ayarlar (üzerine yazar)",
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
                        let filters = args;
                        if (filters.some(a => !FiltersSettings[a])) {
                            return message.channel.send({
                                        embeds: [Embed("error", message.author.tag, message.author.displayAvatarURL(), `❌ **Birden Çok Filtre tanımlamak için aralarına bir BOŞLUK ekleyin!** \n Tüm Fitreler: ${Object.keys(FiltersSettings).map(f => `\`${f}\``).join("\n")}`)]
                            }).then(msg => {
                                setTimeout(() => {
                                    msg.delete().catch((e) => { console.log(String(e).grey) })
                                }, 10000)
                            });
                        }
                        let amount = filters.length;
                        let toAdded = filters;
                        newQueue.filters.forEach((f) => {
                            if (!filters.includes(f)) {
                                toAdded.push(f)
                            }
                        })
                        if (!toAdded || toAdded.length == 0) {
                            return message.channel.send({
                                embeds: [Embed("error", message.author.tag, message.author.displayAvatarURL(), `❌ **Filtrelerde bulunan bir Filtre eklemediniz.** \n Tüm Fitreler: ${newQueue.filters.map(f => `\`${f}\``).join("\n")}`)]
                            }).then(msg => {
                                setTimeout(() => {
                                    msg.delete().catch((e) => { console.log(String(e).grey) })
                                }, 10000)
                            });
                        }
                        await newQueue.setFilter(filters);
                        return message.channel.send({
                            embeds: [Embed("success", message.author.tag, message.author.displayAvatarURL(), `♨️ **${amount} Filtre eklendi!**`)]
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