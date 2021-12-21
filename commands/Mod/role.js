const { Embed } = require("../../handlers/functions.js");
module.exports = {
    name: "role",
    category: "Mod",
    usage: "role <@Üye> <Add/Del> <@Yetki",
    aliases: ["role"],
    description: "Bir Kullanıcıya Yetki verir veya kaldırır",
    cooldown: 1,
    memberpermissions: ["MANAGE_ROLES"],
    run: async(client, message, args) => {
        try {

            const member = message.mentions.members.first();
            const role = message.mentions.roles.first();
            if (!member) {
                return message.channel.send({
                    embeds: [Embed("error", message.author.tag, message.author.displayAvatarURL(), `❌ **Lütfen yetki vermek istediğiniz kullanıcıyı etiketleyin**`)]
                }).then(msg => {
                    setTimeout(() => {
                        msg.delete().catch((e) => { console.log(String(e).grey) })
                    }, 5000)
                })
            }
            if (!role) {
                return message.channel.send({
                    embeds: [Embed("error", message.author.tag, message.author.displayAvatarURL(), `❌ **Lütfen kullanıcıya vermek istediğiniz yetkiyi etiketleyin**`)]
                }).then(msg => {
                    setTimeout(() => {
                        msg.delete().catch((e) => { console.log(String(e).grey) })
                    }, 5000)
                })
            }
            if (!args[1]) {
                return message.channel.send({
                    embeds: [Embed("error", message.author.tag, message.author.displayAvatarURL(), `❌ **Hatalı işlem. Lütfen yetki vermek için \`add\` almak için \`del\` kullanın**`)]
                }).then(msg => {
                    setTimeout(() => {
                        msg.delete().catch((e) => { console.log(String(e).grey) })
                    }, 5000)
                })
            }
            if (message.guild.me.roles.highest.comparePositionTo(role) <= 0) {
                return message.channel.send({
                    embeds: [Embed("error", message.author.tag, message.author.displayAvatarURL(), `❌ **Rol Şu Anda Benden Yüksek Bu nedenle Kullanıcıya Eklenemiyor**`)]
                }).then(msg => {
                    setTimeout(() => {
                        msg.delete().catch((e) => { console.log(String(e).grey) })
                    }, 5000)
                })
            }
            const roleType = args[1].toLowerCase();
            if (!["text", "voice"].includes(roleType)) {
                return message.channel.send({
                    embeds: [Embed("error", message.author.tag, message.author.displayAvatarURL(), `❌ **Lütfen yetki vermek için \`add\` almak için \`del\` kullanın**`)]
                }).then(msg => {
                    setTimeout(() => {
                        msg.delete().catch((e) => { console.log(String(e).grey) })
                    }, 5000)
                })

            }
            if (roleType == "add") {
                await member.roles.add(role.id)
                    .then(() => {
                        return message.channel.send({
                            embeds: [Embed("success", message.author.tag, message.author.displayAvatarURL(), `**${message.member} adlı kullanıcı ${member} kullanıcısının ${role} yetkisini verdi!**`)]
                        }).then(msg => {
                            setTimeout(() => {
                                msg.delete().catch((e) => { console.log(String(e).grey) })
                            }, 5000)
                        })
                    })
                    .catch(e => {
                        return message.channel.send({
                            embeds: [Embed("error", message.author.tag, message.author.displayAvatarURL(), `❌ **Bir Hata Olustu Muhtemelen Rol Atanamadı**`)]
                        }).then(msg => {
                            setTimeout(() => {
                                msg.delete().catch((e) => { console.log(String(e).grey) })
                            }, 5000)
                        })
                    })
            }
            if (args[1].toLowerCase() == "del") {
                await member.roles.remove(role.id)
                    .then(() => {
                        return message.channel.send({
                            embeds: [Embed("success", message.author.tag, message.author.displayAvatarURL(), `**${message.member} adlı kullanıcı ${member} kullanıcısının ${role} yetkisini aldı!**`)]
                        }).then(msg => {
                            setTimeout(() => {
                                msg.delete().catch((e) => { console.log(String(e).grey) });
                            }, 5000);
                        });
                    })
                    .catch(e => {
                        return message.channel.send({
                            embeds: [Embed("error", message.author.tag, message.author.displayAvatarURL(), `❌ **Bir Hata Olustu Muhtemelen Rol Alınamadı**`)]
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