const { check_if_dj } = require("../../handlers/functions");
module.exports = {
    name: "play",
    category: "Music",
    aliases: ["p", "play"],
    usage: "play <Search/link>",
    description: "Ses Kanalınızda bir Şarkı/Çalma Listesi çalar",
    cooldown: 2,
    run: async(client, message, args) => {
        try {
            const { member, channelId, guildId } = message;
            const { guild } = member;
            const { channel } = member.voice;
            if (!channel) {
                return message.channel.send({
                    embeds: [Embed("error", message.author.tag, message.author.displayAvatarURL(), `❌ **Lütfen önce ses kanalına giriş yapın**`)]
                }).then(msg => {
                    setTimeout(() => {
                        msg.delete().catch((e) => { console.log(String(e).grey) })
                    }, 5000)
                })
            }
            if (channel.guild.me.voice.channel && channel.guild.me.voice.channel.id != channel.id) {
                return message.channel.send({
                    embeds: [Embed("error", message.author.tag, message.author.displayAvatarURL(), `❌ **Benim ses Kanalıma giriş yap! Lütfen** <#${channel.guild.me.voice.channel.id}> **kanalına giriş yap!**`)]
                }).then(msg => {
                    setTimeout(() => {
                        msg.delete().catch((e) => { console.log(String(e).grey) })
                    }, 5000)
                })
            }
            if (channel.userLimit != 0 && channel.full) {
                return message.channel.send({
                    embeds: [Embed("error", message.author.tag, message.author.displayAvatarURL(), `❌ **Ses Kanalın dolu. Giriş yapamıyorum**!**`)]
                }).then(msg => {
                    setTimeout(() => {
                        msg.delete().catch((e) => { console.log(String(e).grey) })
                    }, 5000)
                })
            }
            if (!args[0]) {
                return message.channel.send({
                    embeds: [Embed("error", message.author.tag, message.author.displayAvatarURL(), `❌ **Lütfen bir Arama Sorgusu ekleyin!**`)]
                }).then(msg => {
                    setTimeout(() => {
                        msg.delete().catch((e) => { console.log(String(e).grey) })
                    }, 5000)
                })
            }
            const Text = args.join(" ");
            let newmsg = await message.reply({
                content: `🔍 Aranıyor... \`\`\`${Text}\`\`\``,
            }).catch(e => {
                console.log(e)
            })
            try {
                let queue = client.distube.getQueue(guildId);
                let options = { member: member }
                if (!queue) options.textChannel = guild.channels.cache.get(channelId)
                await client.distube.playVoiceChannel(channel, Text, options);
                newmsg.edit({
                    content: `${queue?.songs?.length > 0 ? "👍 Eklendi" : "🎶 Simdi Çalınıyor"}: \`\`\`css\n${Text}\n\`\`\``,
                }).catch(e => {
                    console.log(e)
                })
            } catch (e) {
                console.log(e.stack ? e.stack : e)
            }
        } catch (e) {
            console.log(String(e.stack).bgRed)
        }
    }
}