const { MessageEmbed } = require("discord.js");
const ee = require("../../botconfig/embed.json");
const { check_if_dj } = require("../../handlers/functions");
module.exports = {
    name: "volume", //the command name for the Slash Command

    category: "Music",
    aliases: ["vol"],
    usage: "volume <newVolume>",

    description: "Müziğin Sesini ayarlar", //the command description for Slash Command Overview
    cooldown: 10,



    run: async(client, message, args) => {
        try {
            //things u can directly access in an interaction!
            const { member, guildId } = message;
            const { guild } = member;
            const { channel } = member.voice;
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
                if (check_if_dj(client, member, newQueue.songs[0])) {
                    return message.reply({
                        embeds: [new MessageEmbed()
                            .setColor(ee.wrongcolor)
                            .setFooter(ee.footertext, ee.footericon)
                            .setTitle(` **Siz bir DJ veya Şarkı İsteyen değilsiniz!**`)
                            .setDescription(`**DJ Yetkisi:**\n> ${check_if_dj(client, member, newQueue.songs[0])}`)
                        ],
                    });
                }
                if (!args[0]) {
                    return message.reply({
                        embeds: [new MessageEmbed()
                            .setColor(ee.wrongcolor)
                            .setFooter(ee.footertext, ee.footericon)
                            .setTitle(` **Lütfen bir müzik ses yüksekliği ekleyin!**`)
                            .setDescription(`**Kullanımı:**\n> \`${client.settings.get(message.guild.id, "prefix")}volume <Percentage>\``)
                        ],
                    });
                }
                let volume = Number(args[0])
                if (volume > 150 || volume < 0) return message.reply({
                    embeds: [
                        new MessageEmbed().setColor(ee.wrongcolor).setTitle(` **Ses yüksekliği \`0\` ile \`150\` arasında olmalıdır!**`)
                    ],

                })
                await newQueue.setVolume(volume);
                message.reply({
                    embeds: [new MessageEmbed()
                        .setColor(ee.color)
                        .setTimestamp()
                        .setTitle(`🔊 **Ses Seviyesini \`${volume}\` Olarak Değiştirdi!**`)
                        .setFooter(`💢 Eylem yapan: ${member.user.tag}`, member.user.displayAvatarURL({ dynamic: true }))
                    ]
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