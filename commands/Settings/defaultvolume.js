const { Embed } = require("../../handlers/functions.js");
module.exports = {
    name: "defaultvolume",
    category: "Settings",
    aliases: ["dvolume"],
    Kullanımı: "defaultvolume <Percentage>",
    cooldown: 10,
    description: "Botun Ses Yüksekliğini tanımlar!",
    memberpermissions: ["MANAGE_GUILD "],
    run: async(client, message, args, setting) => {
        try {
            const { member } = message;
            const { guild } = member;
            if (!args[0] || Number.isInteger(args[0])) {
                return message.channel.send({
                    embeds: [Embed("error", message.author.tag, message.author.displayAvatarURL(), `❌ **Lütfen bir ses yüksekliği belirtin!**`)]
                }).then(msg => {
                    setTimeout(() => {
                        msg.delete().catch((e) => { console.log(String(e).grey) })
                    }, 5000)
                })
            }
            let volume = Number(args[0]);
            if (!volume || (volume > 200 || volume < 1)) {
                return message.channel.send({
                    embeds: [Embed("error", message.author.tag, message.author.displayAvatarURL(), `❌ **Ses yüksekliği \`1\` ve \`200\` arasında olmalıdır !**`)]
                }).then(msg => {
                    setTimeout(() => {
                        msg.delete().catch((e) => { console.log(String(e).grey) })
                    }, 5000)
                })
            }

            const data = setting.get(`music`);
            data.volume = volume

            await client.db.update({ music: data }, { where: { guild_id: guild.id } }).then(() => {
                return message.channel.send({
                    embeds: [Embed("success", message.author.tag, message.author.displayAvatarURL(), `✅ **Varsayılan Ses yüksekliği olarak ayarlandı: \`${volume}\`!**`)]
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