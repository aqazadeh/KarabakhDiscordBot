const { MessageEmbed } = require("discord.js");
const ee = require("../../botconfig/embed.json");
module.exports = {
    name: "defaultautoplay", //the command name for execution & for helpcmd [OPTIONAL]

    category: "Settings",
    aliases: ["dautoplay"],
    Kullanımı: "defaultautoplay",

    cooldown: 10, //the command cooldown for execution & for helpcmd [OPTIONAL]
    description: "Otomatik oynatmanayı varsayılan olarak tanımlar!", //the command description for helpcmd [OPTIONAL]
    memberpermissions: ["MANAGE_GUILD"], //Only allow members with specific Permissions to execute a Commmand [OPTIONAL]


    run: async(client, message, args) => {
        try {
            //things u can directly access in an interaction!
            const {
                member,
                channelId,
                guildId,
                applicationId,
                commandName,
                deferred,
                replied,
                ephemeral,
                options,
                id,
                createdTimestamp
            } = message;
            const {
                guild
            } = member;
            client.settings.ensure(guild.id, {
                defaultvolume: 50,
                defaultautoplay: false,
                defaultfilters: [`bassboost6`, `clear`]
            });

            client.settings.set(guild.id, !client.settings.get(guild.id, "defaultautoplay"), "defaultautoplay");
            return message.reply({
                embeds: [
                    new MessageEmbed()
                    .setColor(ee.color)
                    .setFooter(ee.footertext, ee.footericon)
                    .setTitle(`**Varsayılan Otomatik Oynat __\`${client.settings.get(guild.id, "defaultautoplay") ? "Açık" : "Kapalı"}\`__!**`)
                ],
            })
        } catch (e) {
            console.log(String(e.stack).bgRed)
        }
    }
}