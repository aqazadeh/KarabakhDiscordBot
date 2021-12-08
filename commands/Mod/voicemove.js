const { MessageEmbed } = require("discord.js");
const config = require("../../botconfig/config.json");
const ee = require("../../botconfig/embed.json");
const settings = require("../../botconfig/settings.json");
module.exports = {
    name: "voicemove", //the command name for the Slash Command
    category: "Mod",
    usage: "voicemove <User> <Channel>",
    aliases: ["voicemove"],
    description: "Bir Kullanıcıyı başka bir kanala taşır", //the command description for Slash Command Overview
    cooldown: 1,
    memberpermissions: ["MOVE_MEMBERS"], //Only allow specific Users with a Role to execute a Command [OPTIONAL]

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
            args.shift()
            try {
                let channel = message.guild.channels.cache.find(c => c.name.toLowerCase() === args.join(" ").toLocaleLowerCase());
                // console.log(member.voice);

                if (!channel.ktype === "voice") {
                    return message.channel.send({
                        embeds: [new MessageEmbed()
                            .setColor(ee.wrongcolor)
                            .setFooter(ee.footertext, ee.footericon)
                            .setTitle(`❌ **Ses kanalı bulunamadı. Metin kanalından değil ses kanalından bahsettiğinizden emin olun!**`)
                        ],
                    })
                }

                member.voice.setChannel(channel).then(() => {
                    return message.channel.send({
                        embeds: [new MessageEmbed()
                            .setColor(ee.color)
                            .setFooter(ee.footertext, ee.footericon)
                            .setTitle(`✅ **Üye kanalı değistirme başarılı!**`)
                            .setDescription(`**${member} adlı kullanıcı ${channel} odasına taşındı!**`)
                        ],
                    });
                }).catch(e => {
                    return message.channel.send({
                        embeds: [new MessageEmbed()
                            .setColor(ee.wrongcolor)
                            .setFooter(ee.footertext, ee.footericon)
                            .setTitle(`❌ **Kullanıcı Yetkisi Benim Yetkimden daha yuksek. Kullanıcı Ses Kanalı degiştirilemedi**`)
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