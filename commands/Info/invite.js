const {
    MessageEmbed
} = require("discord.js");
const config = require("../../botconfig/config.json");
var ee = require("../../botconfig/embed.json");
const settings = require("../../botconfig/settings.json");
module.exports = {
    name: "invite", //the command name for execution & for helpcmd [OPTIONAL]

    category: "Info",
    usage: "invite",
    aliases: ["inviteme", "addme", ],

    cooldown: 5, //the command cooldown for execution & for helpcmd [OPTIONAL]
    description: "Size bir davet bağlantısı gönderir", //the command description for helpcmd [OPTIONAL]
    memberpermissions: [], //Only allow members with specific Permissions to execute a Commmand [OPTIONAL]


    run: async(client, message, args) => {
        try {
            message.reply({
                embeds: [
                    new MessageEmbed().setColor(ee.color)
                    .setFooter(ee.footertext, ee.footericon)
                    .setDescription(`[**Benim kendi sunucuna davet etmek için tıkla!**](https://discord.com/api/oauth2/authorize?client_id=${client.user.id}&permissions=8&scope=bot)`)
                ]
            });
        } catch (e) {
            console.log(String(e.stack).bgRed)
        }
    }
}