const { Embed } = require("../../handlers/functions.js");
module.exports = {
    name: "avatar",
    category: "Fun",
    usage: "avatar",
    aliases: ["avatar"],
    description: "Bir kullaniciyi Sunucudan Engeller",
    cooldown: 1,
    run: async(client, message, args) => {
        try {
            const mMember = message.mentions.members.first() || message.author;
            return message.channel.send({
                embeds: [Embed("success", message.author.tag, message.author.displayAvatarURL()).setImage(mMember.displayAvatarURL({ size: 4096 }))]
            }).then(msg => {
                setTimeout(() => {
                    msg.delete().catch((e) => { console.log(String(e).grey) })
                }, 5000)
            })
        } catch (e) {
            console.log(String(e.stack).bgRed)
        }
    }
}