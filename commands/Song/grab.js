const {
    MessageEmbed,
    Message
} = require("discord.js");
const config = require("../../botconfig/config.json");
const ee = require("../../botconfig/embed.json");
const settings = require("../../botconfig/settings.json");
const {
    check_if_dj
} = require("../../handlers/functions")
module.exports = {
    name: "grab", //the command name for the Slash Command
    category: "Song",
    usage: "grab",
    aliases: ["take", "steal"],
    description: "Jumps to a specific Position in the Song", //the command description for Slash Command Overview
    cooldown: 10,


    run: async(client, message, args) => {
        try {
            //things u can directly access in an interaction!
            const {
                member,
                channelId,
                guildId,
                applicationId,
                commandName,
                deferred,
                replied,
                ephemeral,
                options,
                id,
                createdTimestamp
            } = message;
            const {
                guild
            } = member;
            const {
                channel
            } = member.voice;
            if (!channel) return message.reply({
                embeds: [
                    new MessageEmbed().setColor(ee.wrongcolor).setTitle(`**Lütfen önce ses kanalına giriş yapın**`)
                ],

            })
            if (channel.guild.me.voice.channel && channel.guild.me.voice.channel.id != channel.id) {
                return message.reply({
                    embeds: [new MessageEmbed()
                        .setColor(ee.wrongcolor)
                        .setFooter(ee.footertext, ee.footericon)
                        .setTitle(`Benim ses Kanalıma giriş yap!`)
                        .setDescription(`<#${guild.me.voice.channel.id}>`)
                    ],
                });
            }
            try {
                let newQueue = client.distube.getQueue(guildId);
                if (!newQueue || !newQueue.songs || newQueue.songs.length == 0) return message.reply({
                    embeds: [
                        new MessageEmbed().setColor(ee.wrongcolor).setTitle(`**Şu anda şarkı çalmıyorum!**`)
                    ],

                })
                let newTrack = newQueue.songs[0];
                member.send({
                    content: `${client.settings.get(guild.id, "prefix")}play ${newTrack.url}`,
                    embeds: [
                        new MessageEmbed().setColor(ee.color)
                        .setTitle(newTrack.name)
                        .setURL(newTrack.url)
                        .addField(`⏱ Süre:`, `>>> \`${newQueue.formattedCurrentTime} / ${newTrack.formattedDuration}\``, true)
                        .addField(`❔ Müziği indir:`, `>>> [\`Click here\`](${newTrack.streamURL})`, true)
                        .setThumbnail(`https://img.youtube.com/vi/${newTrack.id}/mqdefault.jpg`)
                        .setFooter(`Şarkı açan: ${guild.name}`, guild.iconURL({
                            dynamic: true
                        })).setTimestamp()
                    ]
                }).then(() => {
                    message.reply({
                        content: `📪 **Şarkı yakalandı! Mesajlarını kontrol et!**`,
                    })
                }).catch(e => {
                    message.reply({
                        content: ` **sana mesaj atamıyorum!**`,
                    })
                })
            } catch (e) {
                console.log(e.stack ? e.stack : e)
                message.reply({
                    content: ` | Hata: `,
                    embeds: [
                        new MessageEmbed().setColor(ee.wrongcolor)
                        .setDescription(`\`\`\`${e}\`\`\``)
                    ],

                })
            }
        } catch (e) {
            console.log(String(e.stack).bgRed)
        }
    }
}