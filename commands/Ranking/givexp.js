const { MessageEmbed, MessageAttachment } = require("discord.js");
const Canvas = require("../../handlers/canvas/index");
const ee = require("../../botconfig/embed.json");
module.exports = {
    name: "givexp", //the command name for the Slash Command
    category: "Ranking",
    usage: "givexp",
    aliases: ["givexp"],
    description: "Bir kullanıcıya rütbe puanı verir", //the command description for Slash Command Overview
    cooldown: 1,
    memberpermissions: ["MANAGE_GUILD"], //Only allow members with specific Permissions to execute a Commmand [OPTIONAL]


    run: async(client, message, args) => {
        try {
            //things u can directly access in an interaction!


            const user = message.mentions.users.first();
            if (!user) {
                return message.reply({
                    embeds: [new MessageEmbed()
                        .setColor(ee.wrongcolor)
                        .setFooter(ee.footertext, ee.footericon)
                        .setTitle(` **❌ Lütfen bir kullanıcıyı etiketleyin**`)
                        .setDescription(`**Kullanımı:**\n> \`${client.settings.get(message.guild.id, "prefix")}givexp <@Üye> <Miktar>\``)
                    ],
                });
            }
            if (args[1] && !Number.isInteger(parseInt(args[1]))) {
                return message.reply({
                    embeds: [new MessageEmbed()
                        .setColor(ee.wrongcolor)
                        .setFooter(ee.footertext, ee.footericon)
                        .setTitle(` **❌ Lütfen bir say girin**`)
                        .setDescription(`**Kullanımı:**\n> \`${client.settings.get(message.guild.id, "prefix")}givexp <@Üye> <Miktar>\``)
                    ],
                });
            }

            const key = `${message.guild.id}-${user.id}`;
            const count = parseInt(args[1]);
            //console.log(args)
            try {

                client.points.math(key, "+", count, "points");
                return message.reply({
                    embeds: [
                        new MessageEmbed()
                        .setColor(ee.color)
                        .setFooter(ee.footertext, ee.footericon)
                        .setTitle(`**✅ Başarılı\`**`)
                        .setDescription(`**${message.member} kullanıcısı ${user} kullanıcısına ${count} seviye puanı gönderdi**`)
                    ],
                })
            } catch (e) {
                client.points.ensure(`${key}`, {
                    user: user.id,
                    guild: message.guild.id,
                    username: user.username ? user.username : user.tag,
                    avatar: user.displayAvatarURL({ dynamic: false, format: 'png' }),
                    points: 0,
                    level: 1,
                    levelPoint: 200,
                    messages: 0,
                    money: 0,
                    status: "Çaylak"

                });

                client.points.math(key, "+", count, "points");
                return message.reply({
                    embeds: [
                        new MessageEmbed()
                        .setColor(ee.color)
                        .setFooter(ee.footertext, ee.footericon)
                        .setTitle(`**✅ Başarılı\`**`)
                        .setDescription(`**${message.member} kullanıcısı ${user} kullanıcısına ${count} seviye puanı gönderdi**`)

                    ],
                })
            }

        } catch (e) {
            console.log(String(e.stack).bgRed)
        }
    }
}