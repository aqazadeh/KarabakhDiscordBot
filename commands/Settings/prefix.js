const {
    MessageEmbed
} = require("discord.js");
const config = require("../../botconfig/config.json");
const ee = require("../../botconfig/embed.json");
const settings = require("../../botconfig/settings.json");
module.exports = {
    name: "prefix", //the command name for execution & for helpcmd [OPTIONAL]
    category: "Settings",
    aliases: ["setprefix"],
    Kullanımı: "prefix <newPrefix>",
    cooldown: 1, //the command cooldown for execution & for helpcmd [OPTIONAL]
    description: "Bot PREFİX Değiştirir!", //the command description for helpcmd [OPTIONAL]
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
                        .setTitle(` **Lütfen bir PREFİX ekleyin!**`)
                        .setDescription(`**Kullanımı:**\n> \`${client.settings.get(guild.id, "prefix")}prefix <newPrefix>\``)
                    ],
                })
            }
            let newPrefix = args[0];
            client.settings.ensure(guild.id, {
                prefix: config.prefix
            });

            client.settings.set(guild.id, newPrefix, "prefix");
            return message.reply({
                embeds: [
                    new MessageEmbed()
                    .setColor(ee.color)
                    .setFooter(ee.footertext, ee.footericon)
                    .setTitle(`**Yeni PREFİX şimdi: \`${newPrefix}\`**`)
                ],
            })
        } catch (e) {
            console.log(String(e.stack).bgRed)
        }
    }
}