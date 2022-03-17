const { check_if_dj, Embed } = require("../../handlers/functions");
const FiltersSettings = require("../../botconfig/filters.json");
module.exports = {
    name: "customspeed",
    category: "Music",
    usage: "speed <speedamount (0 - 2)>",
    aliases: ["customspeed"],
    description: "Changes the Speed of the Song!",
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
                if (!args[0]) {
                    return message.channel.send({
                        embeds: [Embed("error", message.author.tag, message.author.displayAvatarURL(), `❌ **Lütfen 0+ ile 2 arasında bir Hız Miktarı ekleyin!**`)]
                    }).then(msg => {
                        setTimeout(() => {
                            msg.delete().catch((e) => { console.log(String(e).grey) })
                        }, 5000)
                    })
                }
                let speed_amount = parseInt(args[0])
                if (speed_amount <= 0 || speed_amount > 2) {
                    return message.channel.send({
                        embeds: [Embed("error", message.author.tag, message.author.displayAvatarURL(), `❌ **Lütfen 0+ ile 2 arasında bir Hız Miktarı ekleyin!**`)]
                    }).then(msg => {
                        setTimeout(() => {
                            msg.delete().catch((e) => { console.log(String(e).grey) })
                        }, 5000)
                    })
                }
                FiltersSettings.customspeed = `atempo=${speed_amount}`;
                client.distube.filters = FiltersSettings;
                if (newQueue.filters.includes("customspeed")) {
                    await newQueue.setFilter(["customspeed"]);
                }
                await newQueue.setFilter(["customspeed"]);
                return message.channel.send({
                    embeds: [Embed("error", message.author.tag, message.author.displayAvatarURL(), `✅ **Şarkı hızı ${speed_amount} olarak ayarlandı!**`)]
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