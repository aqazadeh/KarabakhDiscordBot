const { Embed } = require("../../handlers/functions.js");
module.exports = {
    name: "createchanel",
    category: "Mod",
    usage: "createchanel <text/voice> <isim>",
    aliases: ["createchanel", "cchannel"],
    description: "Yeni Bir Kanal Oluşturur!",
    cooldown: 1,
    memberpermissions: ["MANAGE_GUILD"],

    run: async(client, message, args) => {
        try {
            if (!args) {
                return message.channel.send({
                    embeds: [Embed("error", message.author.tag, message.author.displayAvatarURL(), `❌ **Hatalı işlem. Kanal oluştumak için \`text\` almak için \`voice\` kullanın**`)]
                }).then(msg => {
                    setTimeout(() => {
                        msg.delete().catch((e) => { console.log(String(e).grey) })
                    }, 5000)
                })
            }
            const channelType = args.shift().toLowerCase();

            if (!["text", "voice"].includes(channelType)) {
                return message.channel.send({
                    embeds: [Embed("error", message.author.tag, message.author.displayAvatarURL(), `❌ **Hatalı işlem. Kanal oluştumak için \`text\` almak için \`voice\` kullanın**`)]
                }).then(msg => {
                    setTimeout(() => {
                        msg.delete().catch((e) => { console.log(String(e).grey) })
                    }, 5000)
                })

            }
            if (channelType == "voice") {
                args = args.join(" ");

                message.guild.channels.create(String(args), { type: 'GUILD_VOICE' })
                    .then((channel) => {
                        return message.channel.send({
                            embeds: [Embed("success", message.author.tag, message.author.displayAvatarURL(), `**${message.member} adlı kullanıcı ${channel} kanalını olusturdu!**`)]
                        }).then(msg => {
                            setTimeout(() => {
                                msg.delete().catch((e) => { console.log(String(e).grey) })
                            }, 5000)
                        })
                    })
                    .catch(e => {
                        return message.channel.send({
                            embeds: [Embed("error", message.author.tag, message.author.displayAvatarURL(), `❌ **Ses kanalı oluşturma Başarısız!**`)]
                        }).then(msg => {
                            setTimeout(() => {
                                msg.delete().catch((e) => { console.log(String(e).grey) })
                            }, 5000)
                        })
                    })
            }
            if (channelType == "text") {
                args = args.join(" ");
                message.guild.channels.create(String(args), { type: 'GUILD_TEXT' })
                    .then((channel) => {
                        return message.channel.send({
                            embeds: [Embed("success", message.author.tag, message.author.displayAvatarURL(), `**${message.member} adlı kullanıcı ${channel} mesaj kanalını olusturdu!**`)]
                        }).then(msg => {
                            setTimeout(() => {
                                msg.delete().catch((e) => { console.log(String(e).grey) })
                            }, 5000)
                        })
                    })
                    .catch(e => {
                        return message.channel.send({
                            embeds: [Embed("error", message.author.tag, message.author.displayAvatarURL(), `❌ **Mesaj kanalı oluşturma Başarısız!**`)]
                        }).then(msg => {
                            setTimeout(() => {
                                msg.delete().catch((e) => { console.log(String(e).grey) })
                            }, 5000)
                        })
                    })
            }

        } catch (e) {
            console.log(String(e.stack).bgRed)
        }
    }
}