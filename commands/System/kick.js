const {
    MessageEmbed,
    Message
} = require("discord.js");
const config = require("../../botconfig/config.json");
const ee = require("../../botconfig/embed.json");
const settings = require("../../botconfig/settings.json");
module.exports = {
    name: "kick", //the command name for the Slash Command
    category: "System",
    Kullanımı: "ban",
    aliases: ["kick"],
    description: "Bir kullaniciyi Sunucudan Atar", //the command description for Slash Command Overview
    cooldown: 1,
    memberpermissions: ["KICK_MEMBERS"], //Only allow specific Users with a Role to execute a Command [OPTIONAL]

    run: async(client, message, args) => {
        try {
            //things u can directly access in an interaction!
            const mMember = message.mentions.members.first();
            if (!mMember) {
                return message.reply({
                    embeds: [new MessageEmbed()
                        .setColor(ee.wrongcolor)
                        .setFooter(ee.footertext, ee.footericon)
                        .setTitle(` **Lütfen bir kullanıcıyı etiketleyin**`)
                        .setDescription(`**Kullanımı:**\n> \`${client.settings.get(message.guild.id, "prefix")}kick  <@Üye>\``)
                    ],
                });
            }
            mMember.kick().then(() => {
                return message.reply({
                    embeds: [new MessageEmbed()
                        .setColor(ee.color)
                        .setFooter(ee.footertext, ee.footericon)
                        .setTitle(` **Kullanıcı Sunucudan Atıldı**`)
                    ],
                });
            }).catch(() => {
                return message.reply({
                    embeds: [new MessageEmbed()
                        .setColor(ee.color)
                        .setFooter(ee.footertext, ee.footericon)
                        .setTitle(` **Kullanıcı Yetkisi Benim Yetkimden daha yuksek. Kullanıcı Atılamadı**`)
                    ],
                });
            })

        } catch (e) {
            console.log(String(e.stack).bgRed)
        }
    }
}