const { check_if_dj } = require("../../handlers/functions");
module.exports = {
        name: "playskip",
        category: "Music",
        aliases: ["ps"],
        usage: "playskip <Search/link>",
        description: "Plays a Song/Playlist and skips!",
        cooldown: 2,
        run: async(client, message, args) => {
            try {
                const { channelId, member, guildId } = message;
                const { guild } = member;
                const { channel } = member.voice;

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
                    content: `🔍 Searching... \`\`\`${Text}\`\`\``,
                }).catch(e => {
                    console.log(e)
                })
                try {
                    let queue = client.distube.getQueue(guildId)
                    let options = {
                        member: member,
                        skip: true
                    }
                    if (!queue) options.textChannel = guild.channels.cache.get(channelId)
                    if (queue) {
                        if (check_if_dj(client, member, newQueue.songs[0])) {
                            return message.channel.send({
                                embeds: [Embed("error", message.author.tag, message.author.displayAvatarURL(), `❌ **Siz bir DJ veya Şarkı İsteyen değilsiniz!**`)]
                            }).then(msg => {
                                setTimeout(() => {
                                    msg.delete().catch((e) => { console.log(String(e).grey) })
                                }, 5000)
                            })
                        }
                    }
                    await client.distube.play(channel, Text, options)
                        //Edit the reply
                    newmsg.edit({
                        content: `${queue?.songs?.length > 0 ? "⏭ Atlanıyor" : "🎶 Simdi çalınıyor"}: \`\`\`css\n${Text}\n\`\`\``,
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
    /**
     * @INFO
     * Bot Coded by Tomato#6966 | https://github.com/Tomato6966/Discord-Js-Handler-Template
     * @INFO
     * Work for Milrato Development | https://milrato.eu
     * @INFO
     * Please mention Him / Milrato Development, when using this Code!
     * @INFO
     */