const { Embed } = require("../../handlers/functions.js");
module.exports = {
    name: "setnick",
    category: "Mod",
    usage: "setnick <@Üye> <isim>",
    aliases: ["setnick"],
    description: "Bir Kullanıcının Sunucu İsmini Değiştirir",
    cooldown: 5,
    memberpermissions: ["MANAGE_NICKNAMES"],

    run: async(client, message, args) => {
        try {

            const member = message.mentions.members.first();

            if (!member) {
                return message.channel.send({
                    embeds: [Embed("error", message.author.tag, message.author.displayAvatarURL(), `**Lütfen bir kullanıcıyı etiketleyin**`)]
                }).then(msg => {
                    setTimeout(() => {
                        msg.delete().catch((e) => { console.log(String(e).grey) })
                    }, 5000)
                })
            }
            args.shift();
            member.setNickname(args.join(" "))
                .then(() => {
                    return message.channel.send({
                        embeds: [Embed("error", message.author.tag, message.author.displayAvatarURL(), `❌ **${message.member} adlı kullanıcı ${member} kullanıcısının ismini \`${args.join(" ")}\`!**`)]
                    }).then(msg => {
                        setTimeout(() => {
                            msg.delete().catch((e) => { console.log(String(e).grey) })
                        }, 5000)
                    })
                }).catch(e => {
                    return message.channel.send({
                        embeds: [Embed("error", message.author.tag, message.author.displayAvatarURL(), `❌ **Kullanıcı Yetkisi Benim Yetkimden daha yuksek. Kullanıcı isimi değiştirilemedi.**`)]
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