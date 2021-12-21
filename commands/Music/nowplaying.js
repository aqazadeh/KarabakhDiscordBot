const { MessageEmbed } = require("discord.js");
const { Embed } = require("../../handlers/functions");
module.exports = {
    name: "nowplaying",
    category: "Music",
    usage: "nowplaying",
    aliases: ["nowplaying"],
    description: "Geçerli Çalmakta olan Şarkıyı gösterir",
    cooldown: 5,
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
                let newTrack = newQueue.songs[0];
                message.reply({
                    content: `play ${newTrack.url}`,
                    embeds: [
                        new MessageEmbed().setColor(`#C219D8`)
                        .setTitle(newTrack.name)
                        .setURL(newTrack.url)
                        .addField(`💡 İsteyen:`, `>>> ${newTrack.user}`, true)
                        .addField(`⏱ Süre:`, `>>> \`${newQueue.formattedCurrentTime} / ${newTrack.formattedDuration}\``, true)
                        .addField(`❔ Müziği indir:`, `>>> [\`Buraya Tıkla\`](${newTrack.streamURL})`, true)
                        .addField(`:thumbsup: Beğenenler:`, `>>> \`${newTrack.likes}\``, true)
                        .addField(`:thumbsdown: Beğenmeyenler:`, `>>> \`${newTrack.dislikes}\``, true)
                        .setThumbnail(`https://img.youtube.com/vi/${newTrack.id}/mqdefault.jpg`)
                        .setFooter(`Şarkı İsteyen: ${guild.name}`, guild.iconURL({
                            dynamic: true
                        })).setTimestamp()
                    ]
                }).catch((e) => {
                    onsole.log(e.stack ? e.stack : e)
                })
            } catch (e) {
                console.log(e.stack ? e.stack : e);
            }
        } catch (e) {
            console.log(String(e.stack).bgRed)
        }
    }
}