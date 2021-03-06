const { check_if_not_dj, Embed } = require("../../handlers/functions");
module.exports = {
        name: "autoplay",
        category: "Music",
        aliases: ["autoplay"],
        usage: "autoplay",
        description: "Otomatik oynatma",
        cooldown: 5,
        run: async(client, message, args, settings) => {
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
                        if (check_if_not_dj(client, member, newQueue.songs[0], settings)) {
                            return message.channel.send({
                                embeds: [Embed("error", message.author.tag, message.author.displayAvatarURL(), `❌ **Siz bir DJ veya Şarkı İsteyen değilsiniz!**`)]
                            }).then(msg => {
                                setTimeout(() => {
                                    msg.delete().catch((e) => { console.log(String(e).grey) })
                                }, 5000)
                            })
                        }
                        await newQueue.toggleAutoplay();
                        return message.channel.send({
                                    embeds: [Embed("success", message.author.tag, message.author.displayAvatarURL(), `✅ **Otomatik Oyntma ${newQueue.autoplay ? `Açık` : ` Kapalı`}!**`)]
                }).then(msg => {
                    setTimeout(() => {
                        msg.delete().catch((e) => { console.log(String(e).grey) });
                    }, 5000);
                });
            } catch (e) {
                console.log(e.stack ? e.stack : e)
            }
        } catch (e) {
            console.log(String(e.stack).bgRed)
        }
    }
}