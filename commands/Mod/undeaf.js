const { MessageEmbed } = require("discord.js");
const config = require("../../botconfig/config.json");
const ee = require("../../botconfig/embed.json");
const settings = require("../../botconfig/settings.json");
module.exports = {
    name: "undeaf", //the command name for the Slash Command
    category: "Mod",
    usage: "undeaf <User> <Time>",
    aliases: ["undeaf"],
    description: "Bir kullanıcıyı sağır modundan çıkarır", //the command description for Slash Command Overview
    cooldown: 1,
    memberpermissions: ["MUTE_MEMBERS"], //Only allow specific Users with a Role to execute a Command [OPTIONAL]

    run: async(client, message, args) => {
        try {
            //things u can directly access in an interaction!
            let member = message.mentions.members.first()
                // console.log(member);
                // return
            if (!member) {
                return message.channel.send({
                    embeds: [new MessageEmbed()
                        .setColor(ee.wrongcolor)
                        .setFooter(ee.footertext, ee.footericon)
                        .setTitle(`❌ **Bahsedilen kullanıcı bu Kanalda bulunamadı.**`)
                    ],
                })
            }

            try {

                if (member.voice.channelId === null) {
                    return message.channel.send({
                        embeds: [new MessageEmbed()
                            .setColor(ee.wrongcolor)
                            .setFooter(ee.footertext, ee.footericon)
                            .setTitle(`❌ **Kullanıcı ses kanalında değil**`)
                        ],
                    })
                }

                member.voice.setDeaf(false).then(() => {
                    return message.channel.send({
                        embeds: [new MessageEmbed()
                            .setColor(ee.color)
                            .setFooter(ee.footertext, ee.footericon)
                            .setTitle(`✅ **Üye sağırlaştırılması iptal edildi!**`)
                            .setDescription(`**${message.member} adlı kullanıcı ${member} kullanıcısının sağır modunu kapattı!**`)
                        ],
                    });
                }).catch(e => {
                    return message.channel.send({
                        embeds: [new MessageEmbed()
                            .setColor(ee.wrongcolor)
                            .setFooter(ee.footertext, ee.footericon)
                            .setTitle(`❌ **Kullanıcı yetkisi benim yetkimden daha yüksek. Kullanıcı sesi kapatılamadı**`)
                        ],
                    })
                })

            } catch (e) {
                return message.channel.send({
                    embeds: [new MessageEmbed()
                        .setColor(ee.wrongcolor)
                        .setFooter(ee.footertext, ee.footericon)
                        .setTitle(`❌ **Ses Odasi Bulunamadi!**`)
                        .setDescription(`**Ses odası ismi yanlış. Yeniden Deneyin!`)
                    ],
                })
            }




        } catch (e) {
            console.log(String(e.stack).bgRed)
        }
    }
}