const { MessageEmbed } = require("discord.js");
const config = require("../../botconfig/config.json");
const ee = require("../../botconfig/embed.json");
const settings = require("../../botconfig/settings.json");
module.exports = {
    name: "unban", //the command name for the Slash Command
    category: "Mod",
    usage: "unban",
    aliases: ["unban"],
    description: "Bir Kullanıcı Engelini Kaldırır", //the command description for Slash Command Overview
    cooldown: 1,
    memberpermissions: ["BAN_MEMBERS"], //Only allow specific Users with a Role to execute a Command [OPTIONAL]

    run: async(client, message, args) => {
        try {
            //things u can directly access in an interaction!
            const mMember = args[0];
            if (!mMember.length) {
                return message.reply({
                    embeds: [new MessageEmbed()
                        .setColor(ee.wrongcolor)
                        .setFooter(ee.footertext, ee.footericon)
                        .setTitle(` **Lütfen bir kullanıcıyı ID'si girin**`)
                        .setDescription(`**Kullanımı:**\n> \`${client.settings.get(message.guild.id, "prefix")}unban  <@ID>\``)
                    ],
                });
            }
            message.guild.members.unban(mMember).then(() => {
                return message.reply({
                    embeds: [new MessageEmbed()
                        .setColor(ee.color)
                        .setFooter(ee.footertext, ee.footericon)
                        .setTitle(` **Kullanıcı Engeli Kaldırıldı**`)
                    ],
                });
            }).catch(e => {
                return message.reply({
                    embeds: [new MessageEmbed()
                        .setColor(ee.color)
                        .setFooter(ee.footertext, ee.footericon)
                        .setTitle(` **Kullanıcı Engeli Kaldırılamadı**`)
                    ],
                });
            })

        } catch (e) {
            console.log(String(e.stack).bgRed)
        }
    }
}