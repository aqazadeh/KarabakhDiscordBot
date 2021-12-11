const { MessageEmbed } = require("discord.js");
const ee = require("../../botconfig/embed.json");
const { check_if_dj } = require("../../handlers/functions");
module.exports = {
    name: "move", //the command name for the Slash Command

    category: "Music",
    usage: "move <WhatSong> <ToWhere>",

    description: "Bir Şarkıyı başka bir sıraya taşır", //the command description for Slash Command Overview
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
                            .setTitle(` **Lütfen bir Şarkı Konumu ekleyin!**`)
                            .setDescription(`**Kullanımı:**\n> \`${client.settings.get(message.guild.id, "prefix")}move <SongPosition> <ToPosition>\``)
                        ],
                    });
                }
                if (!args[1]) {
                    return message.reply({
                        embeds: [new MessageEmbed()
                            .setColor(ee.wrongcolor)
                            .setFooter(ee.footertext, ee.footericon)
                            .setTitle(` **Lütfen bir Taşınacak Konum ekleyin!**`)
                            .setDescription(`**Kullanımı:**\n> \`${client.settings.get(message.guild.id, "prefix")}play <SongPosition> <ToPosition>\``)
                        ],
                    });
                }
                let songIndex = Number(args[0]);
                if (!songIndex) {
                    return message.reply({
                        embeds: [new MessageEmbed()
                            .setColor(ee.wrongcolor)
                            .setFooter(ee.footertext, ee.footericon)
                            .setTitle(` **Bir Şarkı-Konum NUMARASI ekleyin!**`)
                            .setDescription(`**Kullanımı:**\n> \`${client.settings.get(message.guild.id, "prefix")}move <SongPosition> <ToPosition>\``)
                        ],
                    });
                }
                let position = Number(args[1]);
                if (!position) {
                    return message.reply({
                        embeds: [new MessageEmbed()
                            .setColor(ee.wrongcolor)
                            .setFooter(ee.footertext, ee.footericon)
                            .setTitle(` **Bir Şarkı-Konum NUMARASI ekleyin!**`)
                            .setDescription(`**Kullanımı:**\n> \`${client.settings.get(message.guild.id, "prefix")}play <SongPosition> <ToPosition>\``)
                        ],
                    });
                }
                if (position >= newQueue.songs.length || position < 0) position = -1;
                if (songIndex > newQueue.songs.length - 1) return message.reply({
                    embeds: [
                        new MessageEmbed().setColor(ee.wrongcolor).setTitle(` **Bu Şarkı mevcut değil!**`)
                        .setDescription(`**Listedeki son Şarkı Dizin'e sahiptir: \`${newQueue.songs.length}\`**`)
                    ],

                })
                if (position == 0) return message.reply({
                    embeds: [
                        new MessageEmbed().setColor(ee.wrongcolor).setTitle(` **Şarkı Çalmadan Önce Şarkı hareket ettirilemiyor!**`)
                    ],

                })
                let song = newQueue.songs[songIndex];
                //remove the song
                newQueue.songs.splice(songIndex);
                //Add it to a specific Position
                newQueue.addToQueue(song, position)
                message.reply({
                    embeds: [new MessageEmbed()
                        .setColor(ee.color)
                        .setTimestamp()
                        .setTitle(`📑**${song.name}**, **_${newQueue.songs[position - 1].name}_'den hemen sonra **\`${position}th\`** Yere taşındı!**`)
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