const { Embed } = require("../../handlers/functions.js");
module.exports = {
    name: "clearchat",
    category: "System",
    usage: "clearchat",
    aliases: ["clearchat"],
    description: "Sohbeti Temizler. En fazla 99 mesaj!",
    cooldown: 1,
    memberpermissions: ["MANAGE_MESSAGES"],

    run: async(client, message, args, settings) => {
        try {
            if (args[0] && !Number.isInteger(parseInt(args[0]))) {
                return message.channel.send({
                    embeds: [Embed("error", message.author.tag, message.author.displayAvatarURL(), `**Lütfen bir sayı girin**`)]
                }).then(msg => {
                    setTimeout(() => {
                        msg.delete().catch((e) => { console.log(String(e).grey) })
                    }, 5000)
                })

            }
            count = args[0] || 99;
            if (count > 99) count = 99;
            await message.channel.messages
                .fetch({ limit: count })
                .then(async messages => {
                    await message.channel.bulkDelete(messages).then(() => {
                        return message.channel.send({
                            embeds: [Embed("success", message.author.tag, message.author.displayAvatarURL(), `\`${count}\` **Mesaj Silindi**`)]
                        }).then(msg => {
                            setTimeout(() => {
                                msg.delete().catch((e) => { console.log(String(e).grey) })
                            }, 5000)
                        })
                    })
                })

        } catch (e) {
            console.log(String(e.stack).bgRed)
        }
    }
}