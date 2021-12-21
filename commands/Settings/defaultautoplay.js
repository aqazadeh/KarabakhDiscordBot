const { MessageEmbed } = require("discord.js");
const ee = require("../../botconfig/embed.json");
module.exports = {
    name: "defaultautoplay", //the command name for execution & for helpcmd [OPTIONAL]

    category: "Settings",
    aliases: ["dautoplay"],
    usage: "defaultautoplay",

    cooldown: 10, //the command cooldown for execution & for helpcmd [OPTIONAL]
    description: "Otomatik oynatmanayı varsayılan olarak tanımlar!", //the command description for helpcmd [OPTIONAL]
    memberpermissions: ["MANAGE_GUILD"], //Only allow members with specific Permissions to execute a Commmand [OPTIONAL]


    run: async(client, message, args, setting) => {
        try {
            //things u can directly access in an interaction!
            const { member } = message;
            const { guild } = member;
            const data = setting.get("music");
            data.autoplay = !data.autoplay;
            await client.db.update({ music: data }, { where: { guild_id: guild.id } }).then(() => {
                return message.reply({
                    embeds: [
                        new MessageEmbed()
                        .setColor(ee.color)
                        .setFooter(ee.footertext, ee.footericon)
                        .setTitle(`**Varsayılan Otomatik Oynat __\`${data.autoplay ? "Açık" : "Kapalı"}\`__!**`)
                    ],
                })
            });
        } catch (e) {
            console.log(String(e.stack).bgRed)
        }
    }
}