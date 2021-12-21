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
                await client.distube.playVoiceChannel(channel, newQueue.songs[0].url).then(() => {
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