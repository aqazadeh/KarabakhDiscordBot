const { Embed } = require("../../handlers/functions.js");
module.exports = {
    name: "Mod",
    category: "System",
    usage: "kick <@User>",
    aliases: ["kick"],
    description: "Bir kullaniciyi Sunucudan Atar",
    cooldown: 1,
    memberpermissions: ["KICK_MEMBERS"],

    run: async(client, message, args, settings) => {
        try {
            const mMember = message.mentions.members.first();
            if (!mMember) {
                return message.channel.send({
                    embeds: [Embed("error", message.author.tag, message.author.displayAvatarURL(), `**Lütfen bir kullanıcıyı etiketleyin**`)]
                }).then(msg => {
                    setTimeout(() => {
                        msg.delete().catch((e) => { console.log(String(e).grey) })
                    }, 5000)
                })
            }
            mMember.kick().then(() => {
                return message.channel.send({
                    embeds: [Embed("success", message.author.tag, message.author.displayAvatarURL(), `\`${mMember.tag}\` adlı kullanıcı sunucudan atıldı!`)]
                }).then(msg => {
                    setTimeout(() => {
                        msg.delete().catch((e) => { console.log(String(e).grey) })
                    }, 5000)
                });
            }).catch(e => {
                return message.channel.send({
                    embeds: [Embed("error", message.author.tag, message.author.displayAvatarURL(), `${mMember} adlı kullanıcı ,\`Sunucudan\` engellenmedi. Kullanıcı \`Rütbesi\` benim rütbemben büyük ve ya arnı rütbedeyiz!`)]
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