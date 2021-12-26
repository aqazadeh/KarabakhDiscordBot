const { Embed } = require("../../handlers/functions.js");
module.exports = {
        name: "leave",
        category: "Settings",
        aliases: ["leave"],
        usage: "levave <message/channel/status> [message/channelID/status]",
        example: ["leave message  Leave to Channel", "leave channel <@channel>", "leave status enable"],
        cooldown: 1,
        description: "Server'a giriş çıkış mesajlarını bildirmek!",
        memberpermissions: ["MANAGE_GUILD"],
        run: async(client, message, args, setting) => {
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
                                embeds: [Embed("error", message.author.tag, message.author.displayAvatarURL(), `❌ **Lütfen Çıkış mesajı ekleyin!**`)]
                            }).then(msg => {
                                setTimeout(() => {
                                    msg.delete().catch((e) => { console.log(String(e).grey) })
                                }, 5000)
                            })
                        }
                        const msg = setting.get("leave_message").message = args.join(" ");
                        await client.db.update({ leave_message: setting.get("leave_message") }, { where: { guild_id: guild.id } }).then(() => {
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

                        setting.get("leave_message").channelID = channel.id;
                        await client.db.update({ leave_message: setting.get("leave_message") }, { where: { guild_id: guild.id } }).then(() => {
                            return message.channel.send({
                                embeds: [Embed("success", message.author.tag, message.author.displayAvatarURL(), `✅ ${channel} **Artık Çıkış mesaklarınız bu kanalda görünecek!**`)]
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
                        if (setting.get("leave_message").channelID == null || !setting.get("leave_message").channelID) {
                            return message.channel.send({
                                embeds: [Embed("error", message.author.tag, message.author.displayAvatarURL(), `❌ **Önce kanal eklemelisiniz! Yoksa bu özelliği açamazsınız!**`)]
                            }).then(msg => {
                                setTimeout(() => {
                                    msg.delete().catch((e) => { console.log(String(e).grey) })
                                }, 5000)
                            })
                        }
                        if (args[0].toLowerCase() == 'enable')
                            setting.get("leave_message").enable = true;
                        if (args[0].toLowerCase() == 'disable')
                            setting.get("leave_message").enable = false;
                        await client.db.update({
                                leave_message: setting.get("leave_message")
                            }, {
                                where: { guild_id: guild.id }
                            }).then(() => {
                                    return message.channel.send({
                                                embeds: [Embed("success", message.author.tag, message.author.displayAvatarURL(), `✅ **Çıkış mesaj sistemi** \`${setting.get("leave_message").enable ? `Açık`: `Kapalı`}\``)]
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