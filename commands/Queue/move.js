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
        name: "move", //the command name for the Slash Command

        category: "Queue",
        usage: "move <WhatSong> <ToWhere>",

        description: "Moves one Song to another Place", //the command description for Slash Command Overview
        cooldown: 10,
        requiredroles: [], //Only allow specific Users with a Role to execute a Command [OPTIONAL]
        alloweduserids: [], //Only allow specific Users to execute a Command [OPTIONAL]
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
                    if (check_if_dj(client, member, newQueue.songs[0])) {
                        return message.reply({
                            embeds: [new MessageEmbed()
                                .setColor(ee.wrongcolor)
                                .setFooter(ee.footertext, ee.footericon)
                                .setTitle(` **Siz bir DJ veya Şarkı İsteyen değilsiniz!**`)
                                .setDescription(`**DJ-ROLES:**\n> ${check_if_dj(client, member, newQueue.songs[0])}`)
                            ],
                        });
                    }
                    if (!args[0]) {
                        return message.reply({
                            embeds: [new MessageEmbed()
                                .setColor(ee.wrongcolor)
                                .setFooter(ee.footertext, ee.footericon)
                                .setTitle(` **Please add a Song-Position!**`)
                                .setDescription(`**Usage:**\n> \`${client.settings.get(message.guild.id, "prefix")}move <SongPosition> <ToPosition>\``)
                            ],
                        });
                    }
                    if (!args[1]) {
                        return message.reply({
                            embeds: [new MessageEmbed()
                                .setColor(ee.wrongcolor)
                                .setFooter(ee.footertext, ee.footericon)
                                .setTitle(` **Please add a To-Move-Position!**`)
                                .setDescription(`**Usage:**\n> \`${client.settings.get(message.guild.id, "prefix")}play <SongPosition> <ToPosition>\``)
                            ],
                        });
                    }
                    let songIndex = Number(args[0]);
                    if (!songIndex) {
                        return message.reply({
                            embeds: [new MessageEmbed()
                                .setColor(ee.wrongcolor)
                                .setFooter(ee.footertext, ee.footericon)
                                .setTitle(` **Please add a Song-Position NUMBER!**`)
                                .setDescription(`**Usage:**\n> \`${client.settings.get(message.guild.id, "prefix")}move <SongPosition> <ToPosition>\``)
                            ],
                        });
                    }
                    let position = Number(args[1]);
                    if (!position) {
                        return message.reply({
                            embeds: [new MessageEmbed()
                                .setColor(ee.wrongcolor)
                                .setFooter(ee.footertext, ee.footericon)
                                .setTitle(` **Please add a To-Move-Position NUMBER!**`)
                                .setDescription(`**Usage:**\n> \`${client.settings.get(message.guild.id, "prefix")}play <SongPosition> <ToPosition>\``)
                            ],
                        });
                    }
                    if (position >= newQueue.songs.length || position < 0) position = -1;
                    if (songIndex > newQueue.songs.length - 1) return message.reply({
                        embeds: [
                            new MessageEmbed().setColor(ee.wrongcolor).setTitle(` **This Song does not exist!**`)
                            .setDescription(`**The last Song in the Queue has the Index: \`${newQueue.songs.length}\`**`)
                        ],

                    })
                    if (position == 0) return message.reply({
                        embeds: [
                            new MessageEmbed().setColor(ee.wrongcolor).setTitle(` **Cannot move Song before Playing Song!**`)
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
                            .setTitle(`📑 Moved **${song.name}** to the **\`${position}th\`** Place right after **_${newQueue.songs[position - 1].name}_!**`)
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
    /**
     * @INFO
     * Bot Coded by Tomato#6966 | https://github.com/Tomato6966/Discord-Js-Handler-Template
     * @INFO
     * Work for Milrato Development | https://milrato.eu
     * @INFO
     * Please mention Him / Milrato Development, when using this Code!
     * @INFO
     */