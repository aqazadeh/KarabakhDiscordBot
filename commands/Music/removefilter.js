const { check_if_dj, Embed } = require("../../handlers/functions");
const FiltersSettings = require("../../botconfig/filters.json");
module.exports = {
        name: "removefilter",
        category: "Music",
        usage: "removefilter <Filter1 Filter2>",
        aliases: ["removefilter"],
        description: "Sıradan bir Filtreyi Kaldırır",
        cooldown: 5,
        run: async(client, message, args) => {
                try {
                    const { member, guildId, guild } = message;
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
                let toRemove = [];
                filters.forEach((f) => {
                    if (newQueue.filters.includes(f)) {
                        toRemove.push(f)
                    }
                })
                if (!toRemove || toRemove.length == 0) {
                    return message.channel.send({
                        embeds: [Embed("error", message.author.tag, message.author.displayAvatarURL(), `❌ **Filtrelerde bulunan bir Filtre eklemediniz.** \n Tüm Fitreler: ${newQueue.filters.map(f => `\`${f}\``).join("\n")}`)]
                    }).then(msg => {
                        setTimeout(() => {
                            msg.delete().catch((e) => { console.log(String(e).grey) })
                        }, 10000)
                    });
                }
                await newQueue.setFilter(toRemove);
                return message.channel.send({
                    embeds: [Embed("success", message.author.tag, message.author.displayAvatarURL(), `♨️ **${toRemove.length} Filtre silindi!**`)]
                }).then(msg => {
                    setTimeout(() => {
                        msg.delete().catch((e) => { console.log(String(e).grey) })
                    }, 5000)
                });
            } catch (e) {
                console.log(e.stack ? e.stack : e)
            }
        } catch (e) {
            console.log(String(e.stack).bgRed)
        }
    }
}