const { MessageEmbed } = require("discord.js");
const ee = require("../../botconfig/embed.json");
module.exports = {
    name: "defaultvolume", //the command name for execution & for helpcmd [OPTIONAL]
    category: "Settings",
    aliases: ["dvolume"],
    Kullanımı: "defaultvolume <Percentage>",
    cooldown: 1, //the command cooldown for execution & for helpcmd [OPTIONAL]
    description: "Botun Ses Yüksekliğini tanımlar!", //the command description for helpcmd [OPTIONAL]
    memberpermissions: ["MANAGE_GUILD "], //Only allow members with specific Permissions to execute a Commmand [OPTIONAL]


    run: async(client, message, args) => {
        try {
            //things u can directly access in an interaction!
            const { member } = message;
            const { guild } = member;
            if (!args[0]) {
                return message.reply({
                    embeds: [
                        new MessageEmbed()
                        .setColor(ee.wrongcolor)
                        .setFooter(ee.footertext, ee.footericon)
                        .setTitle(` **Please add a Volume!**`)
                        .setDescription(`**Kullanımı:**\n> \`${client.settings.get(guild.id, "prefix")}defaultvolume <percentage>\``)
                    ],
                })
            }
            let volume = Number(args[0]);
            client.settings.ensure(guild.id, {
                defaultvolume: 50
            });

            if (!volume || (volume > 150 || volume < 1)) {
                return message.reply({
                    embeds: [
                        new MessageEmbed()
                        .setColor(ee.wrongcolor)
                        .setFooter(ee.footertext, ee.footericon)
                        .setTitle(` **Ses yüksekliği \`1\` ve \`150\` arasında olmalıdır !**`)
                    ],
                })
            }
            client.settings.set(guild.id, volume, "defaultvolume");
            return message.reply({
                embeds: [
                    new MessageEmbed()
                    .setColor(ee.color)
                    .setFooter(ee.footertext, ee.footericon)
                    .setTitle(`**Varsayılan Ses yüksekliği olarak ayarlandı: \`${volume}\`!**`)
                ],
            })
        } catch (e) {
            console.log(String(e.stack).bgRed)
        }
    }
}