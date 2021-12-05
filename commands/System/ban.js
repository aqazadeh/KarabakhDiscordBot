const {
    MessageEmbed
} = require("discord.js");
const ee = require("../../botconfig/embed.json");

module.exports = {
    name: "ban", //the command name for the Slash Command
    category: "System",
    Kullanımı: "ban",
    aliases: ["ban"],
    description: "Bir kullaniciyi Sunucudan Engeller", //the command description for Slash Command Overview
    cooldown: 1,
    memberpermissions: ["BAN_MEMBERS"], //Only allow specific Users with a Role to execute a Command [OPTIONAL]

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
                        .setDescription(`**Kullanımı:**\n> \`${client.settings.get(message.guild.id, "prefix")}ban  <@Üye>\``)
                    ],
                });
            }
            message.guild.members.ban(mMember).then(() => {
                return message.reply({
                    embeds: [new MessageEmbed()
                        .setColor(ee.color)
                        .setFooter(ee.footertext, ee.footericon)
                        .setTitle(` **Kullanıcı Sunucudan Engellendi**`)
                    ],
                });
            }).catch(() => {
                return message.reply({
                    embeds: [new MessageEmbed()
                        .setColor(ee.color)
                        .setFooter(ee.footertext, ee.footericon)
                        .setTitle(` **Kullanıcı Yetkisi Benim Yetkimden daha yuksek. Kullanıcı Engellenemedi**`)
                    ],
                });
            })

        } catch (e) {
            console.log(String(e.stack).bgRed)
        }
    }
}