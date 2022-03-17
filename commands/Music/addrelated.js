const { Embed } = require("../../handlers/functions")
module.exports = {
    name: "addrelated",
    category: "Music",
    usage: "addrelated",
    description: "Geçerli Şarkıya benzer/ilgili bir şarkı ekleyin!",
    cooldown: 2,
    run: async(client, message, args) => {
        try {
            const { member, guildId } = message;
            const { channel } = member.voice;

 
            if (channel.userLimit != 0 && channel.full) {
                return message.channel.send({
                    embeds: [Embed("error", message.author.tag, message.author.displayAvatarURL(), `❌ **Ses Kanalın dolu. Giriş yapamıyorum**!**`)]
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
                let thenewmsg = await message.reply({
                    content: `🔍 Karabakh BOT şarkıyı arıyor... **${newQueue.songs[0].name}**`,
                }).catch(e => {
                    console.log(e)
                })
                await newQueue.addRelatedSong();
                await thenewmsg.edit({
                    content: `👍 Eklendi: **${newQueue.songs[newQueue.songs.length - 1].name}**`,
                }).catch(e => {
                    console.log(e)
                })
            } catch (e) {
                console.log(e.stack ? e.stack : e)
            }
        } catch (e) {
            console.log(String(e.stack).bgRed)
        }
    }
}