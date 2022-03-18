var { Embed } = require("../../handlers/functions");
module.exports = {
    name: "invite",
    category: "Info",
    usage: "invite",
    example: ["invite"],
    aliases: ["invite"],
    cooldown: 5,
    description: "Size bir davet bağlantısı gönderir",
    run: async(client, message, args, settings) => {
        try {
            message.reply({
                embeds: [Embed("Success", message.author.tag, message.author.displayAvatarURL(), `[**Benim kendi sunucuna davet etmek için tıkla!**](https://discord.com/api/oauth2/authorize?client_id=${client.user.id}&permissions=8&scope=bot)`)]
            });
        } catch (e) {
            console.log(String(e.stack).bgRed)
        }
    }
}