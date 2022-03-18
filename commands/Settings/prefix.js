const { Embed } = require("../../handlers/functions.js");
module.exports = {
    name: "prefix",
    category: "Settings",
    aliases: ["setprefix"],
    usage: "prefix <newPrefix>",
    cooldown: 1,
    description: "Bot PREFİX Değiştirir!",
    memberpermissions: ["MANAGE_GUILD"],
    run: async(client, message, args, settings) => {
        try {
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