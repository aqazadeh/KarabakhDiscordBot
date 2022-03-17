const { Embed } = require("../../handlers/functions");
module.exports = {
    name: "addend",
    category: "Music",
    usage: "addend",
    aliases: ["addend"],
    description: "Mecvut Şarkıyı Sıranın sonuna ekler!",
    cooldown: 15,
    run: async(client, message, args) => {
        try {
            const { member, guildId } = message;
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
                await client.distube.play(channel, newQueue.songs[0].url).then(() => {
                    return message.channel.send({
                        embeds: [Embed("error", message.author.tag, message.author.displayAvatarURL(), `✅ **Mecvut Şarkıyı sıranın sonuna eklendi**`)]
                    }).then(msg => {
                        setTimeout(() => {
                            msg.delete().catch((e) => { console.log(String(e).grey) })
                        }, 5000)
                    })
                })
            } catch (e) {
                console.log(e.stack ? e.stack : e)
            }
        } catch (e) {
            console.log(String(e.stack).bgRed)
        }
    }
}