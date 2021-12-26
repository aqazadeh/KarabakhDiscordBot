const { Embed } = require("../../handlers/functions.js");
module.exports = {
    name: "defaultautoplay",
    category: "Settings",
    aliases: ["dautoplay"],
    usage: "defaultautoplay",
    cooldown: 10,
    description: "Otomatik oynatmanayı varsayılan olarak tanımlar!",
    memberpermissions: ["MANAGE_GUILD"],
    run: async(client, message, args, setting) => {
        try {
            const { member } = message;
            const { guild } = member;
            const data = setting.get("music");
            data.autoplay = !data.autoplay;
            await client.db.update({ music: data }, { where: { guild_id: guild.id } }).then(() => {
                return message.channel.send({
                    embeds: [Embed("success", message.author.tag, message.author.displayAvatarURL(), `✅ **Varsayılan Otomatik Oynat __\`${data.autoplay ? "Açık" : "Kapalı"}\`__!**`)]
                }).then(msg => {
                    setTimeout(() => {
                        msg.delete().catch((e) => { console.log(String(e).grey) })
                    }, 5000)
                })
            });
        } catch (e) {
            console.log(String(e.stack).bgRed)
        }
    }
}