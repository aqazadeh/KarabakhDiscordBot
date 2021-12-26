const { Embed } = require("../../handlers/functions.js");
module.exports = {
    name: "dj",
    category: "Settings",
    aliases: ["djrole"],
    usage: "dj <add/remove> <@Role>",
    cooldown: 1,
    description: "Dj'leri yönetir!",
    memberpermissions: ["MANAGE_GUILD"],
    run: async(client, message, args, setting) => {
        try {
            const data = setting.get("music");
            const { member } = message;
            const { guild } = member;
            if (!args[0]) {
                return message.channel.send({
                    embeds: [Embed("error", message.author.tag, message.author.displayAvatarURL(), `❌ **Lütfen bir eylem belirtin!**`)]
                }).then(msg => {
                    setTimeout(() => {
                        msg.delete().catch((e) => { console.log(String(e).grey) })
                    }, 5000)
                })
            }
            let add_remove = args[0].toLowerCase();
            if (!["add", "remove"].includes(add_remove)) {
                return message.channel.send({
                    embeds: [Embed("error", message.author.tag, message.author.displayAvatarURL(), `❌ **Lütfen geçerli bir eylem belirtin!**`)]
                }).then(msg => {
                    setTimeout(() => {
                        msg.delete().catch((e) => { console.log(String(e).grey) })
                    }, 5000)
                })
            }
            let Role = message.mentions.roles.first();
            if (!Role) {
                return message.channel.send({
                    embeds: [Embed("error", message.author.tag, message.author.displayAvatarURL(), `❌ **Lütfen geçerli bir yetki belirtin!**`)]
                }).then(msg => {
                    setTimeout(() => {
                        msg.delete().catch((e) => { console.log(String(e).grey) })
                    }, 5000)
                })
            }

            if (add_remove == "add") {

                if (data.djrole.includes(Role.id)) {
                    return message.channel.send({
                        embeds: [Embed("error", message.author.tag, message.author.displayAvatarURL(), `❌ **Bu Yetki zaten bir DJ  yetkisi!**`)]
                    }).then(msg => {
                        setTimeout(() => {
                            msg.delete().catch((e) => { console.log(String(e).grey) })
                        }, 5000)
                    })
                }

                data.djrole.push(Role.id)
                await client.db.update({ music: data }, { where: { guild_id: guild.id } }).then(() => {
                    let djs = data.djrole.map(r => `<@&${r}>`);
                    if (djs.length == 0) djs = "`atanmadı`";
                    else djs.join(", ");
                    return message.channel.send({
                        embeds: [Embed("success", message.author.tag, message.author.displayAvatarURL(), `✅ **DJ yetkisi \`${Role.name}\` eklendi!**`)]
                    }).then(msg => {
                        setTimeout(() => {
                            msg.delete().catch((e) => { console.log(String(e).grey) })
                        }, 5000)
                    })
                })
            } else {
                if (!data.djrole.includes(Role.id)) {
                    return message.channel.send({
                        embeds: [Embed("error", message.author.tag, message.author.displayAvatarURL(), `❌ **Bu Yetki zaten bir DJ yetkisi değildir!**`)]
                    }).then(msg => {
                        setTimeout(() => {
                            msg.delete().catch((e) => { console.log(String(e).grey) })
                        }, 5000)
                    })
                }
                const index = data.djrole.indexOf(Role.id);
                data.djrole.splice(index, 1);
                await client.db.update({ music: data }, { where: { guild_id: guild.id } }).then(() => {
                    let djs = data.djrole.map(r => `<@&${r}>`);
                    if (djs.length == 0) djs = "`atanmadı`";
                    else djs.join(", ");
                    return message.channel.send({
                        embeds: [Embed("success", message.author.tag, message.author.displayAvatarURL(), `✅ **DJ yetkisi \`${Role.name}\` silindi!**`)]
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