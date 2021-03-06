const { MessageEmbed } = require("discord.js");
const { Embed } = require("../../handlers/functions");
module.exports = {
    name: "grab",
    category: "Music",
    usage: "grab",
    aliases: ["grab"],
    description: "Jumps to a specific Position in the Song",
    cooldown: 10,
    run: async(client, message, args, settings) => {
        try {
            const { member, guildId } = message;
            const { guild } = member;
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
                let newTrack = newQueue.songs[0];
                member.send({
                    content: `play ${newTrack.url}`,
                    embeds: [
                        new MessageEmbed().setColor(`#C219D8`)
                        .setTitle(newTrack.name)
                        .setURL(newTrack.url)
                        .addField(`⏱ Süre:`, `>>> \`${newTrack.formattedDuration}\``, true)
                        .addField(`❔ Müziği indir:`, `>>> [\`Buraya Tikla İndir\`](${newTrack.streamURL})`, true)
                        .setThumbnail(`https://img.youtube.com/vi/${newTrack.id}/mqdefault.jpg`)
                        .setFooter({text: guild.name, iconURL: guild.iconURL({ dynamic: true })})
                        .setTimestamp()
                    ]
                }).then(() => {
                    message.reply({
                        content: `📪 **Şarkı özelden iletildi! Mesajlarını kontrol et!**`,
                    })
                }).catch(e => {
                    message.reply({
                        content: ` **Sana mesaj atamıyorum!**`,
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