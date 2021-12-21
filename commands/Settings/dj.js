const { MessageEmbed } = require("discord.js");
const ee = require("../../botconfig/embed.json");
module.exports = {
    name: "dj", //the command name for execution & for helpcmd [OPTIONAL]

    category: "Settings",
    aliases: ["djrole", "role", "drole", "djs", "dj-role"],
    usage: "dj <add/remove> <@Role>",

    cooldown: 1, //the command cooldown for execution & for helpcmd [OPTIONAL]
    description: "Dj'leri yönetir!", //the command description for helpcmd [OPTIONAL]
    memberpermissions: ["MANAGE_GUILD"], //Only allow members with specific Permissions to execute a Commmand [OPTIONAL]


    run: async(client, message, args, setting) => {
        try {
            const data = setting.get("music");
            //things u can directly access in an interaction!
            const { member } = message;
            const { guild } = member;
            if (!args[0]) {
                return message.reply({
                    embeds: [new MessageEmbed()
                        .setColor(ee.wrongcolor)
                        .setFooter(ee.footertext, ee.footericon)
                        .setTitle(` **Lütfen bir __Yöntem + Yetki__ ekleyin!**`)
                        .setDescription(`**Kullanımı:**\n> \`dj <add/remove> <@Role>\``)
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
                        .setDescription(`**Kullanımı:**\n> \`dj <add/remove> <@Role>\``)
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
                        .setDescription(`**Kullanımı:**\n> \`dj <add/remove> <@Role>\``)
                    ],
                });
            }

            if (add_remove == "add") {

                if (data.djrole.includes(Role.id)) {
                    return message.reply({
                        embeds: [
                            new MessageEmbed()
                            .setColor(ee.wrongcolor)
                            .setFooter(ee.footertext, ee.footericon)
                            .setTitle(` **Bu Rol zaten bir DJ-ROLE!**`)
                        ],
                    })
                }

                data.djrole.push(Role.id)
                await client.db.update({ music: data }, { where: { guild_id: guild.id } }).then(() => {
                    let djs = data.djrole.map(r => `<@&${r}>`);
                    if (djs.length == 0) djs = "`atanmadı`";
                    else djs.join(", ");
                    return message.reply({
                        embeds: [
                            new MessageEmbed()
                            .setColor(ee.color)
                            .setFooter(ee.footertext, ee.footericon)
                            .setTitle(`**Yetki \`${Role.name}\` eklendi!**`)
                            .addField(`🎧 **DJ Yetkileri:**`, `>>> ${djs}`, true)
                        ],
                    })
                })
            } else {
                if (!data.djrole.includes(Role.id)) {
                    return message.reply({
                        embeds: [
                            new MessageEmbed()
                            .setColor(ee.wrongcolor)
                            .setFooter(ee.footertext, ee.footericon)
                            .setTitle(` **Bu Rol henüz bir DJ Yetkisi değildir!**`)
                        ],
                    })
                }
                const index = data.djrole.indexOf(Role.id);
                data.djrole.splice(index, 1);
                await client.db.update({ music: data }, { where: { guild_id: guild.id } }).then(() => {
                    let djs = data.djrole.map(r => `<@&${r}>`);
                    if (djs.length == 0) djs = "`atanmadı`";
                    else djs.join(", ");
                    return message.reply({
                        embeds: [
                            new MessageEmbed()
                            .setColor(ee.color)
                            .setFooter(ee.footertext, ee.footericon)
                            .setTitle(`**Yetki \`${Role.name}\` silindi!**`)
                            .addField(`🎧 **DJ Yetkileri:**`, `>>> ${djs}`, true)
                        ],
                    })
                })
            }

        } catch (e) {
            console.log(String(e.stack).bgRed)
        }
    }
}