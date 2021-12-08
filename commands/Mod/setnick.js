const {
    MessageEmbed,
    Message
} = require("discord.js");
const ee = require("../../botconfig/embed.json");
module.exports = {
    name: "setnick", //the command name for the Slash Command
    category: "Mod",
    usage: "setnick <@Üye> <isim>",
    aliases: ["setnick"],
    description: "Bir Kullanıcının Sunucu İsmini Değiştirir", //the command description for Slash Command Overview
    cooldown: 1,
    memberpermissions: ["MANAGE_NICKNAMES"], //Only allow specific Users with a Role to execute a Command [OPTIONAL]

    run: async(client, message, args) => {
        try {
            //things u can directly access in an interaction!

            const member = message.mentions.members.first();

            if (!member) {
                return message.channel.send({
                    embeds: [new MessageEmbed()
                        .setColor(ee.wrongcolor)
                        .setFooter(ee.footertext, ee.footericon)
                        .setTitle(`❌ **Lütfen yetki vermek istediğiniz kullanıcıyı etiketleyin**`)
                        .setDescription(`**Kullanımı:**\n> \`${client.settings.get(message.guild.id, "prefix")}setnick <@Üye> <isim>\``)
                    ],
                })
            }
            args.shift();
            if (!args) {
                return message.channel.send({
                    embeds: [new MessageEmbed()
                        .setColor(ee.wrongcolor)
                        .setFooter(ee.footertext, ee.footericon)
                        .setTitle(`❌ **Hatalı işlem. Lütfen yetki vermek için \`add\` almak için \`del\` kullanın**`)
                        .setDescription(`**Kullanımı:**\n> \`${client.settings.get(message.guild.id, "prefix")}setnick <@Üye> <isim>\``)
                    ],
                })
            }
            member.setNickname(args.join(" "))
                .then(() => {
                    return message.channel.send({
                        embeds: [new MessageEmbed()
                            .setColor(ee.color)
                            .setFooter(ee.footertext, ee.footericon)
                            .setTitle(`✅ **Üye ismi değistirme başarılı!**`)
                            .setDescription(`**${message.member} adlı kullanıcı ${member} kullanıcısının ismini \`${args.join(" ")}\`!**`)
                        ],
                    });
                }).catch(e => {
                    return message.channel.send({
                        embeds: [new MessageEmbed()
                            .setColor(ee.wrongcolor)
                            .setFooter(ee.footertext, ee.footericon)
                            .setTitle(`❌ **Kullanıcı Yetkisi Benim Yetkimden daha yuksek. Kullanıcı isimi değiştirilemedi.**`)
                        ],
                    })
                })
        } catch (e) {
            console.log(String(e.stack).bgRed)
        }
    }
}