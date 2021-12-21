const { Embed } = require("../../handlers/functions.js");
module.exports = {
        name: "welcome",
        category: "Settings",
        aliases: ["welcome"],
        usage: "welcome <message/channel/status> [message/channelID/status]",
        example: ["welcome message  Welcome to Channel", "welcome channel <@channel>", "welcome status enable"],
        cooldown: 1,
        description: "Server'a giriş çıkış mesajlarını bildirmek!",
        memberpermissions: ["MANAGE_GUILD"],
        run: async(client, message, args, data) => {
                try {
                    const { member } = message;
                    const { guild } = member;
                    if (!args[0]) {
                        return message.channel.send({
                            embeds: [Embed("error", message.author.tag, message.author.displayAvatarURL(), `❌ **Lütfen bir tip belirtin!**`)]
                        }).then(msg => {
                            setTimeout(() => {
                                msg.delete().catch((e) => { console.log(String(e).grey) })
                            }, 5000)
                        })
                    }

                    let Type = args.shift().toLowerCase();
                    if (!["message", "channel", "status"].includes(Type)) {
                        return message.channel.send({
                            embeds: [Embed("error", message.author.tag, message.author.displayAvatarURL(), `❌ **Lütfen geçerli bir tip belirtin!**`)]
                        }).then(msg => {
                            setTimeout(() => {
                                msg.delete().catch((e) => { console.log(String(e).grey) })
                            }, 5000)
                        })
                    }

                    if (Type == "message") {
                        if (!args[0]) {
                            return message.channel.send({
                                embeds: [Embed("error", message.author.tag, message.author.displayAvatarURL(), `❌ **Lütfen Hoşgeldin mesajı ekleyin!**`)]
                            }).then(msg => {
                                setTimeout(() => {
                                    msg.delete().catch((e) => { console.log(String(e).grey) })
                                }, 5000)
                            })
                        }
                        const msg = data.get("welcome_message").message = args.join(" ");
                        await client.db.update({ welcome_message: data.get("welcome_message") }, { where: { guild_id: guild.id } }).then(() => {
                            return message.channel.send({
                                embeds: [Embed("success", message.author.tag, message.author.displayAvatarURL(), `✅ **Mesajınız başarılı bir şekilde eklendi. \n${msg}**`)]
                            }).then(msg => {
                                setTimeout(() => {
                                    msg.delete().catch((e) => { console.log(String(e).grey) })
                                }, 5000)
                            })
                        })

                    }

                    if (Type == "channel") {
                        const channel = message.mentions.channels.first();
                        if (!args[0] || channel == undefined) {
                            return message.channel.send({
                                embeds: [Embed("error", message.author.tag, message.author.displayAvatarURL(), `❌ **Lütfen kanal ekleyin!**`)]
                            }).then(msg => {
                                setTimeout(() => {
                                    msg.delete().catch((e) => { console.log(String(e).grey) })
                                }, 5000)
                            })
                        }

                        data.get("welcome_message").channelID = channel.id;
                        await client.db.update({ welcome_message: data.get("welcome_message") }, { where: { guild_id: guild.id } }).then(() => {
                            return message.channel.send({
                                embeds: [Embed("success", message.author.tag, message.author.displayAvatarURL(), `✅ ${channel} **Artık Hoşgeldin mesaklarınız bu kanalda görünecek!**`)]
                            }).then(msg => {
                                setTimeout(() => {
                                    msg.delete().catch((e) => { console.log(String(e).grey) })
                                }, 5000)
                            })
                        })

                    }

                    if (Type == "status") {
                        if (!args[0] || !["enable", "disable"].includes(args[0])) {
                            return message.channel.send({
                                embeds: [Embed("error", message.author.tag, message.author.displayAvatarURL(), `❌ **Lütfen geçerli yöntem ekleyin!**`)]
                            }).then(msg => {
                                setTimeout(() => {
                                    msg.delete().catch((e) => { console.log(String(e).grey) })
                                }, 5000)
                            })
                        }
                        if (data.get("welcome_message").channelID == null || !data.get("welcome_message").channelID) {
                            return message.channel.send({
                                embeds: [Embed("error", message.author.tag, message.author.displayAvatarURL(), `❌ **Önce kanal eklemelisiniz! Yoksa bu özelliği açamazsınız!**`)]
                            }).then(msg => {
                                setTimeout(() => {
                                    msg.delete().catch((e) => { console.log(String(e).grey) })
                                }, 5000)
                            })
                        }
                        let status;
                        if (args[0].toLowerCase() == 'enable')
                            status = data.get("welcome_message").enable = true;
                        if (args[0].toLowerCase() == 'disable')
                            status = data.get("welcome_message").enable = false;
                        else return
                        await client.db.update({ welcome_message: data.get("welcome_message") }, { where: { guild_id: guild.id } }).then(() => {
                                    return message.channel.send({
                                                embeds: [Embed("success", message.author.tag, message.author.displayAvatarURL(), `✅ **Hosgeldin mesaj sistemi** \`${status ? `Açık`: `Kapalı`}\``)]
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