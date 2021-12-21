const { Embed } = require("../../handlers/functions.js");
module.exports = {
    name: "prefix", //the command name for execution & for helpcmd [OPTIONAL]
    category: "Settings",
    aliases: ["setprefix"],
    usage: "prefix <newPrefix>",
    cooldown: 1, //the command cooldown for execution & for helpcmd [OPTIONAL]
    description: "Bot PREFİX Değiştirir!", //the command description for helpcmd [OPTIONAL]
    memberpermissions: ["MANAGE_GUILD"], //Only allow members with specific Permissions to execute a Commmand [OPTIONAL]



    run: async(client, message, args) => {
        try {
            //things u can directly access in an interaction!
            const { member } = message;
            const { guild } = member;
            if (!args[0]) {
                return message.channel.send({
                    embeds: [Embed("error", message.author.tag, message.author.displayAvatarURL(), `❌ **Lütfen bir PREFİX ekleyin!**`)]
                }).then(msg => {
                    setTimeout(() => {
                        msg.delete().catch((e) => { console.log(String(e).grey) })
                    }, 5000)
                })
            }
            let newPrefix = args[0];

            await client.db.update({ prefix: newPrefix }, { where: { guild_id: guild.id } }).then(() => {
                return message.channel.send({
                    embeds: [Embed("success", message.author.tag, message.author.displayAvatarURL(), `✅ **Yeni PREFİX şimdi: \`${newPrefix}\`**`)]
                }).then(msg => {
                    setTimeout(() => {
                        msg.delete().catch((e) => { console.log(String(e).grey) })
                    }, 5000)
                })
            })

        } catch (e) {
            console.log(String(e.stack).bgRed)
        }
    }
}