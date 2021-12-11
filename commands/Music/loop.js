const { MessageEmbed } = require("discord.js");
const ee = require("../../botconfig/embed.json");
const { check_if_dj } = require("../../handlers/functions");
module.exports = {
    name: "loop", //the command name for the Slash Command

    category: "Music",
    aliases: ["repeat", "repeatmode", "l"],
    usage: "loop <song/queue/off>",

    description: "Şarkı/Liste Döngüsünü Etkinleştir/Devre Dışı Bırak", //the command description for Slash Command Overview
    cooldown: 5,


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
                            .setTitle(` **Lütfen geçerli Seçenekler ekleyin!**`)
                            .setDescription(`**Kullanımı:**\n> \`${client.settings.get(message.guild.id, "prefix")}loop <song/queue/off>\``)
                        ],
                    });
                }
                let loop = String(args[0])
                if (!["off", "song", "queue"].includes(loop.toLowerCase())) {
                    return message.reply({
                        embeds: [new MessageEmbed()
                            .setColor(ee.wrongcolor)
                            .setFooter(ee.footertext, ee.footericon)
                            .setTitle(` **Lütfen geçerli Seçenekler ekleyin!**`)
                            .setDescription(`**Kullanımı:**\n> \`${client.settings.get(message.guild.id, "prefix")}loop <song/queue/off>\``)
                        ],
                    });
                }
                if (loop.toLowerCase() == "off") loop = 0;
                else if (loop.toLowerCase() == "song") loop = 1;
                else if (loop.toLowerCase() == "queue") loop = 2;
                await newQueue.setRepeatMode(loop);
                if (newQueue.repeatMode == 0) {
                    message.reply({
                        embeds: [new MessageEmbed()
                            .setColor(ee.color)
                            .setTimestamp()
                            .setTitle(` **Disabled the Loop Mode!**`)
                            .setFooter(`💢 Eylem yapan: ${member.user.tag}`, member.user.displayAvatarURL({ dynamic: true }))
                        ]
                    })
                } else if (newQueue.repeatMode == 1) {
                    message.reply({
                        embeds: [new MessageEmbed()
                            .setColor(ee.color)
                            .setTimestamp()
                            .setTitle(`🔁 **__Şarkı__-Döngüsü** etkinleştirildi ||(**Liste Döngüsü** devre dışı bırakıldı)||`)
                            .setFooter(`💢 Eylem yapan: ${member.user.tag}`, member.user.displayAvatarURL({ dynamic: true }))
                        ]
                    })
                } else {
                    message.reply({
                        embeds: [new MessageEmbed()
                            .setColor(ee.color)
                            .setTimestamp()
                            .setTitle(`🔂 **__Liste__-Döngüsünü Etkinleştirdi!** ||(**Şarkı Döngüsünü Devre Dışı Bıraktı**)||`)
                            .setFooter(`💢 Eylem yapan: ${member.user.tag}`, member.user.displayAvatarURL({ dynamic: true }))
                        ]
                    })
                }
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