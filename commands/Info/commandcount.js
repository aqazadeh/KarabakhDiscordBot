const {
    MessageEmbed
} = require("discord.js");
const config = require("../../botconfig/config.json");
var ee = require("../../botconfig/embed.json");
const settings = require("../../botconfig/settings.json");
module.exports = {
    name: "commandcount", //the command name for execution & for helpcmd [OPTIONAL]
    category: "Info",
    Kullanımı: "commandcount",
    aliases: ["cmds", "commandc", "count", "cmdcount"],
    cooldown: 1, //the command cooldown for execution & for helpcmd [OPTIONAL]
    description: "Kategorilerdeki Komutların Miktarını Gösterir", //the command description for helpcmd [OPTIONAL]
    memberpermissions: [], //Only allow members with specific Permissions to execute a Commmand [OPTIONAL]


    run: async(client, message, args) => {
        try {
            message.reply({
                embeds: [new MessageEmbed()
                    .setColor(ee.color)
                    .setFooter(ee.footertext, ee.footericon)
                    .setTitle(`:gear: **[${client.commands.size}] Komut**`)
                    .setDescription(`:gear: **[${client.categories.length}] kategori**\n\n`)
                ]
            });
        } catch (e) {
            console.log(String(e.stack).bgRed)
        }
    }
}