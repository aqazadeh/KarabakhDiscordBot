const { MessageEmbed } = require("discord.js");
const ee = require("../../botconfig/embed.json");
module.exports = {
    name: "botchannel", //the command name for execution & for helpcmd [OPTIONAL]

    category: "Settings",
    aliases: ["botchannel"],
    usage: "botchannel <add/del> ?<Channel Name>",

    cooldown: 1, //the command cooldown for execution & for helpcmd [OPTIONAL]
    description: "Server'a giriş çıkış mesajlarını bildirmek!", //the command description for helpcmd [OPTIONAL]
    memberpermissions: ["MANAGE_GUILD"], //Only allow members with specific Permissions to execute a Commmand [OPTIONAL]


    run: async(client, message, args) => {
        try {
            //things u can directly access in an interaction!
            const { member } = message;
            const { guild } = member;
            console.log(client.InOut.get(guild.id, "channel"))
            if (!args[0] || !args[1]) {
                return message.reply({
                    embeds: [new MessageEmbed()
                        .setColor(ee.wrongcolor)
                        .setFooter(ee.footertext, ee.footericon)
                        .setTitle(` **Geçersiz İşlem!**`)
                        .setDescription(`**Kullanımı:**\n> \`${client.settings.get(message.guild.id, "prefix")}botchannel <add/del> ?<Channel Name>\``)
                    ],
                });
            }
            let add_remove = args[0].toLowerCase();
            if (!["add", "del"].includes(add_remove)) {
                return message.reply({
                    embeds: [new MessageEmbed()
                        .setColor(ee.wrongcolor)
                        .setFooter(ee.footertext, ee.footericon)
                        .setTitle(` **Lütfen geçerli bir __Yöntem + Yetki__ ekleyin!**`)
                        .setDescription(`**Kullanımı:**\n> \`${client.settings.get(message.guild.id, "prefix")}dj <add/remove> <@Role>\``)
                    ],
                });
            }

            let channelID = member.guild.channels.cache.filter(ch => ch.name === args[1].toLowerCase()).first();
            //guild.channels.cache.filter(ch => ch.type === 'GUILD_TEXT').first()
            if (channelID === undefined) {
                return message.reply({
                    embeds: [new MessageEmbed()
                        .setColor(ee.wrongcolor)
                        .setFooter(ee.footertext, ee.footericon)
                        .setTitle(` **Geçersiz İşlem!**`)
                        .setDescription(`**Kullanımı:**\n> \`${client.settings.get(message.guild.id, "prefix")}botchannel <add/del> ?<Channel Name>\``)
                    ],
                });
            }
            if (!channelID.type == 'GUILD_TEXT') {
                return message.reply({
                    embeds: [new MessageEmbed()
                        .setColor(ee.wrongcolor)
                        .setFooter(ee.footertext, ee.footericon)
                        .setTitle(` **Geçersiz İşlem!**`)
                        .setDescription(`Lütfen Mesaj kanalı belirtin. Ses Kanalı Değil!`)
                    ],
                });
            }
            client.InOut.ensure(member.guild.id, {
                channel: null

            })
            if (add_remove == "del") {

                return message.reply({
                    embeds: [
                        new MessageEmbed()
                        .setColor(ee.color)
                        .setFooter(ee.footertext, ee.footericon)
                        .setTitle(`**İşlem başarılı!**`)
                        .setDescription(`**Varasılan Kanal Silindi`)
                    ],
                })

            } else if (add_remove == "add") {

                return message.reply({
                    embeds: [
                        new MessageEmbed()
                        .setColor(ee.color)
                        .setFooter(ee.footertext, ee.footericon)
                        .setTitle(`**Kanal ${channelID.name} başarıyla eklendi!**`)
                        .setDescription(`**Varasılan Kanal:** ${channelID}`)
                    ],
                })

            }


        } catch (e) {
            console.log(String(e.stack).bgRed)
        }
    }
}