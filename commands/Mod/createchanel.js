const {
    MessageEmbed,
    Message
} = require("discord.js");
const ee = require("../../botconfig/embed.json");
module.exports = {
    name: "newchannel", //the command name for the Slash Command
    category: "Mod",
    usage: "newchannel <text/voice> <isim>",
    aliases: ["newchannel"],
    description: "Yeni Bir Kanal Oluşturur", //the command description for Slash Command Overview
    cooldown: 1,
    memberpermissions: ["MANAGE_GUILD"], //Only allow specific Users with a Role to execute a Command [OPTIONAL]

    run: async(client, message, args) => {
        try {
            console.log(args)
                //things u can directly access in an interaction!
            if (!args) {
                return message.channel.send({
                    embeds: [new MessageEmbed()
                        .setColor(ee.wrongcolor)
                        .setFooter(ee.footertext, ee.footericon)
                        .setTitle(`❌ **Hatalı işlem. Kanal oluştumak için \`text\` almak için \`voice\` kullanın**`)
                        .setDescription(`**Kullanımı:**\n> \`${client.settings.get(message.guild.id, "prefix")}newchannel <text/voice> <isim>\``)
                    ],
                })
            }
            const channelType = args.shift().toLowerCase();
            if (channelType === "voice") {
                args = args.join(" ");

                message.guild.channels.create(String(args), { type: 'GUILD_VOICE' })
                    .then(() => {
                        return message.channel.send({
                            embeds: [new MessageEmbed()
                                .setColor(ee.color)
                                .setFooter(ee.footertext, ee.footericon)
                                .setTitle(`✅ **Ses kanalı oluşturma başarılı!**`)
                                .setDescription(`**${message.member} adlı kullanıcı \`${args}\` odasını olusturdu!**`)
                            ],
                        });
                    })
                    .catch(e => {
                        return message.channel.send({
                            embeds: [new MessageEmbed()
                                .setColor(ee.wrongcolor)
                                .setFooter(ee.footertext, ee.footericon)
                                .setTitle(`❌ **Ses kanalı oluşturma Başarısız!**`)
                            ],
                        })
                    })
            }
            if (channelType === "text") {
                args = args.join(" ");
                message.guild.channels.create(String(args), { type: 'GUILD_TEXT' })
                    .then(() => {
                        return message.channel.send({
                            embeds: [new MessageEmbed()
                                .setColor(ee.color)
                                .setFooter(ee.footertext, ee.footericon)
                                .setTitle(`✅ **Yazı Kanal olusturma başarılı!**`)
                                .setDescription(`**${message.member} adlı kullanıcı \`${args}\` odasını olusturdu!**`)
                            ],
                        });
                    })
                    .catch(e => {
                        return message.channel.send({
                            embeds: [new MessageEmbed()
                                .setColor(ee.wrongcolor)
                                .setFooter(ee.footertext, ee.footericon)
                                .setTitle(`❌ **Yazı kanalı oluşturma Başarısız!**`)
                            ],
                        })
                    })
            } else {
                return message.channel.send({
                    embeds: [new MessageEmbed()
                        .setColor(ee.wrongcolor)
                        .setFooter(ee.footertext, ee.footericon)
                        .setTitle(`❌ **Hatalı işlem. Kanal oluştumak için \`text\` almak için \`voice\` kullanın**`)
                        .setDescription(`**Kullanımı:**\n> \`${client.settings.get(message.guild.id, "prefix")}newchannel <text/voice> <isim>\``)
                    ],
                })
            }

        } catch (e) {
            console.log(String(e.stack).bgRed)
        }
    }
}