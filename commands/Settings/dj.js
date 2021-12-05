const { MessageEmbed } = require("discord.js");
const ee = require("../../botconfig/embed.json");
module.exports = {
    name: "dj", //the command name for execution & for helpcmd [OPTIONAL]

    category: "Settings",
    aliases: ["djrole", "role", "drole", "djs", "dj-role"],
    Kullanımı: "dj <add/remove> <@Role>",

    cooldown: 1, //the command cooldown for execution & for helpcmd [OPTIONAL]
    description: "Dj'leri yönetir!", //the command description for helpcmd [OPTIONAL]
    memberpermissions: ["MANAGE_GUILD"], //Only allow members with specific Permissions to execute a Commmand [OPTIONAL]


    run: async(client, message, args) => {
        try {
            //things u can directly access in an interaction!
            const {
                member,
            } = message;
            const {
                guild
            } = member;
            if (!args[0]) {
                return message.reply({
                    embeds: [new MessageEmbed()
                        .setColor(ee.wrongcolor)
                        .setFooter(ee.footertext, ee.footericon)
                        .setTitle(` **Lütfen bir __Yöntem + Yetki__ ekleyin!**`)
                        .setDescription(`**Kullanımı:**\n> \`${client.settings.get(message.guild.id, "prefix")}dj <add/remove> <@Role>\``)
                    ],
                });
            }
            let add_remove = args[0].toLowerCase();
            if (!["add", "remove"].includes(add_remove)) {
                return message.reply({
                    embeds: [new MessageEmbed()
                        .setColor(ee.wrongcolor)
                        .setFooter(ee.footertext, ee.footericon)
                        .setTitle(` **Lütfen geçerli bir __Yöntem + Yetki__ ekleyin!**`)
                        .setDescription(`**Kullanımı:**\n> \`${client.settings.get(message.guild.id, "prefix")}dj <add/remove> <@Role>\``)
                    ],
                });
            }
            let Role = message.mentions.roles.first();
            if (!Role) {
                return message.reply({
                    embeds: [new MessageEmbed()
                        .setColor(ee.wrongcolor)
                        .setFooter(ee.footertext, ee.footericon)
                        .setTitle(` **Lütfen bir __Yöntem + Yetki__ ekleyin!**`)
                        .setDescription(`**Kullanımı:**\n> \`${client.settings.get(message.guild.id, "prefix")}dj <add/remove> <@Role>\``)
                    ],
                });
            }
            client.settings.ensure(guild.id, {
                djroles: []
            });
            if (add_remove == "add") {
                if (client.settings.get(guild.id, "djroles").includes(Role.id)) {
                    return message.reply({
                        embeds: [
                            new MessageEmbed()
                            .setColor(ee.wrongcolor)
                            .setFooter(ee.footertext, ee.footericon)
                            .setTitle(` **Bu Rol zaten bir DJ-ROLE!**`)
                        ],
                    })
                }
                client.settings.push(guild.id, Role.id, "djroles");
                var djs = client.settings.get(guild.id, `djroles`).map(r => `<@&${r}>`);
                if (djs.length == 0) djs = "`atanmadı`";
                else djs.join(", ");
                return message.reply({
                    embeds: [
                        new MessageEmbed()
                        .setColor(ee.color)
                        .setFooter(ee.footertext, ee.footericon)
                        .setTitle(`**Yetki \`${Role.name}\` eklendi ${client.settings.get(guild.id, "djroles").length - 1} DJ Yetkisi!**`)
                        .addField(`🎧 **DJ Yetki${client.settings.get(guild.id, "djroles").length > 1 ? "leri": "si"}:**`, `>>> ${djs}`, true)
                    ],
                })
            } else {
                if (!client.settings.get(guild.id, "djroles").includes(Role.id)) {
                    return message.reply({
                        embeds: [
                            new MessageEmbed()
                            .setColor(ee.wrongcolor)
                            .setFooter(ee.footertext, ee.footericon)
                            .setTitle(` **Bu Rol henüz bir DJ Yetkisi değildir!**`)
                        ],
                    })
                }
                client.settings.remove(guild.id, Role.id, "djroles");
                var djs = client.settings.get(guild.id, `djroles`).map(r => `<@&${r}>`);
                if (djs.length == 0) djs = "`atanmadı`";
                else djs.join(", ");
                return message.reply({
                    embeds: [
                        new MessageEmbed()
                        .setColor(ee.color)
                        .setFooter(ee.footertext, ee.footericon)
                        .setTitle(`**Yetki \`${Role.name}\` silindi ${client.settings.get(guild.id, "djroles").length - 1} DJ Yetkisi!**`)
                        .addField(`🎧 **DJ Yetki${client.settings.get(guild.id, "djroles").length > 1 ? "leri": "si"}:**`, `>>> ${djs}`, true)
                    ],
                })
            }

        } catch (e) {
            console.log(String(e.stack).bgRed)
        }
    }
}