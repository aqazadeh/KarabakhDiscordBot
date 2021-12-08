const {
    MessageEmbed,
    Message
} = require("discord.js");
const ee = require("../../botconfig/embed.json");
module.exports = {
    name: "role", //the command name for the Slash Command
    category: "Mod",
    usage: "role <@Üye> <Add/Del> <@Yetki",
    aliases: ["role"],
    description: "Bir Kullanıcıya Yetki verir veya kaldırır", //the command description for Slash Command Overview
    cooldown: 1,
    memberpermissions: ["MANAGE_ROLES"], //Only allow specific Users with a Role to execute a Command [OPTIONAL]

    run: async(client, message, args) => {
        try {
            //things u can directly access in an interaction!
            console.log(args[1])

            const member = message.mentions.members.first();
            const role = message.mentions.roles.first();
            console.log(role.id)
            if (!member) {
                return message.channel.send({
                    embeds: [new MessageEmbed()
                        .setColor(ee.wrongcolor)
                        .setFooter(ee.footertext, ee.footericon)
                        .setTitle(`❌ **Lütfen yetki vermek istediğiniz kullanıcıyı etiketleyin**`)
                        .setDescription(`**Kullanımı:**\n> \`${client.settings.get(message.guild.id, "prefix")}role <@Üye> <add/del> <@Yetki\``)
                    ],
                })
            }
            if (!role) {
                return message.channel.send({
                    embeds: [new MessageEmbed()
                        .setColor(ee.wrongcolor)
                        .setFooter(ee.footertext, ee.footericon)
                        .setTitle(`❌ **Lütfen kullanıcıya vermek istediğiniz yetkiyi etiketleyin**`)
                        .setDescription(`**Kullanımı:**\n> \`${client.settings.get(message.guild.id, "prefix")}role <@Üye> <add/del> <@Yetki\``)
                    ],
                })
            }
            if (!args[1]) {
                return message.channel.send({
                    embeds: [new MessageEmbed()
                        .setColor(ee.wrongcolor)
                        .setFooter(ee.footertext, ee.footericon)
                        .setTitle(`❌ **Hatalı işlem. Lütfen yetki vermek için \`add\` almak için \`del\` kullanın**`)
                        .setDescription(`**Kullanımı:**\n> \`${client.settings.get(message.guild.id, "prefix")}role <@Üye> <add/del> <@Yetki\``)
                    ],
                })
            }
            if (message.guild.me.roles.highest.comparePositionTo(role) <= 0) {
                return message.channel.send({
                    embeds: [new MessageEmbed()
                        .setColor(ee.wrongcolor)
                        .setFooter(ee.footertext, ee.footericon)
                        .setTitle(`❌ **Hatalı işlem.**`)
                        .setDescription(`**Rol Şu Anda Benden Yüksek Bu nedenle Kullanıcıya Eklenemiyor**`)
                    ],
                });
            }

            if (args[1].toLowerCase() === "add") {
                await member.roles.add(role.id)
                    .then(() => {
                        return message.channel.send({
                            embeds: [new MessageEmbed()
                                .setColor(ee.color)
                                .setFooter(ee.footertext, ee.footericon)
                                .setTitle(`✅ **Yetkilendirme Başarılı!**`)
                                .setDescription(`**${message.member} adlı kullanıcı ${member} kullanıcısının ${role} yetkisini verdi!**`)
                            ],
                        });
                    })
                    .catch(e => {
                        return message.channel.send({
                            embeds: [new MessageEmbed()
                                .setColor(ee.wrongcolor)
                                .setFooter(ee.footertext, ee.footericon)
                                .setTitle(`❌ **Bir Hata Olustu Muhtemelen Rol Atanamadı**`)
                            ],
                        })
                    })
            } else if (args[1].toLowerCase() === "del") {
                await member.roles.remove(role.id)
                    .then(() => {
                        return message.channel.send({
                            embeds: [new MessageEmbed()
                                .setColor(ee.color)
                                .setFooter(ee.footertext, ee.footericon)
                                .setTitle(`✅ **Yetki Silme Başarılı!**`)
                                .setDescription(`**${message.member} adlı kullanıcı ${member} kullanıcısının ${role} yetkisini aldı!**`)
                            ],
                        });
                    })
                    .catch(e => {
                        return message.channel.send({
                            embeds: [new MessageEmbed()
                                .setColor(ee.wrongcolor)
                                .setFooter(ee.footertext, ee.footericon)
                                .setTitle(`❌ **Bir Hata Olustu Muhtemelen Rol Alınamadı**`)
                            ],
                        })
                    })
            } else {
                return message.channel.send({
                    embeds: [new MessageEmbed()
                        .setColor(ee.wrongcolor)
                        .setFooter(ee.footertext, ee.footericon)
                        .setTitle(`❌ **Hatalı işlem. Lütfen yetki vermek için \`add\` almak için \`del\` kullanın**`)
                        .setDescription(`**Kullanımı:**\n> \`${client.settings.get(message.guild.id, "prefix")}role <@Üye> <add/del> <@Yetki\``)
                    ],
                })
            }
        } catch (e) {
            console.log(String(e.stack).bgRed)
        }
    }
}