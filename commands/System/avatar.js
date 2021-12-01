const { MessageEmbed } = require("discord.js");
const config = require("../../botconfig/config.json");
const ee = require("../../botconfig/embed.json");
const settings = require("../../botconfig/settings.json");
module.exports = {
    name: "avatar", //the command name for the Slash Command
    category: "System",
    usage: "avatar",
    aliases: ["avatar"],
    description: "Bir kullaniciyi Sunucudan Engeller", //the command description for Slash Command Overview
    cooldown: 1,
    requiredroles: [], //Only allow specific Users with a Role to execute a Command [OPTIONAL]
    alloweduserids: [], //Only allow specific Users to execute a Command [OPTIONAL]
    run: async(client, message, args) => {
        try {
            //things u can directly access in an interaction!
            const mMember = message.mentions.members.first();
            if (!mMember) {
                message.reply({
                    embeds: [new MessageEmbed()
                        .setColor(ee.color)
                        .setFooter(ee.footertext, ee.footericon)
                        .setTitle(`${message.author.username} **Tarafindan görüntülendi**`)
                        .setImage(message.author.displayAvatarURL({ size: 4096 }))
                    ],
                });
            } else {
                message.reply({
                    embeds: [new MessageEmbed()
                        .setColor(ee.color)
                        .setFooter(ee.footertext, ee.footericon)
                        .setTitle(`${message.author.username} **Tarafindan görüntülendi**`)
                        .setImage(mMember.displayAvatarURL({ size: 4096 }))
                    ],
                });
            }

        } catch (e) {
            console.log(String(e.stack).bgRed)
        }
    }
}