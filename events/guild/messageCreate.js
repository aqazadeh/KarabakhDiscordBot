const { onCoolDown, escapeRegex, rank, Embed } = require(`../../handlers/functions`);
module.exports = async(client, message) => {
    if (message.channel.partial) await message.channel.fetch();
    if (message.partial) await message.fetch();


    let setting = await client.db.findOne({ where: { guild_id: message.guild.id } });
    if (setting == null) {
        setting = await client.db.create({ guild_id: message.guild.id })
    }
    let ranks = await client.rank.findOne({ where: { guild_id: message.guild.id, user_id: message.author.id } });
    if (ranks == null) {
        await message.guild.members
            .fetch()
            .then((members) => {

                members.forEach(async(member) => {
                    if (!member.user.bot) {
                        const rank = await client.rank.findOne({ where: { guild_id: message.guild.id, user_id: member.user.id } });
                        if (rank == null) {
                            ranks = await client.rank.create({
                                guild_id: message.guild.id,
                                user_id: member.user.id,
                                username: member.user.username,
                                avatar: member.user.displayAvatarURL({ dynamic: false, format: 'png' })
                            })
                        }
                    }
                });

            });
    }

    rank(client, message, ranks);
    const prefix = setting.get("prefix")
    const prefixRegex = new RegExp(`^(<@!?${client.user.id}>|${escapeRegex(prefix)})`);
    if (!prefixRegex.test(message.content)) return;
    const [, mPrefix] = message.content.match(prefixRegex);
    const args = message.content.slice(mPrefix.length).trim().split(/ +/).filter(Boolean);
    const cmd = args.length > 0 ? args.shift().toLowerCase() : null;
    let command = client.commands.get(cmd);
    if (!command) command = client.commands.get(client.aliases.get(cmd));
    if (command) {
        if (onCoolDown(message, command)) {

            return message.channel.send({
                embeds: [Embed("error", message.author.tag, message.author.displayAvatarURL(), `❌\`${command.name}\` komutunu tekrar kullanmadan önce lütfen ${onCoolDown(message, command)} Saniye daha bekleyin.`)]
            }).then(msg => {
                setTimeout(() => {
                    msg.delete().catch((e) => { console.log(String(e).grey) })
                }, 5000)
            })
        }
        try {
            if (command.memberpermissions && command.memberpermissions.length > 0 && !message.member.permissions.has(command.memberpermissions)) {

                return message.channel.send({
                    embeds: [Embed("error", message.author.tag, message.author.displayAvatarURL(), `❌ **Bu komutu çalıştırma izniniz yok! Şu İzinlere ihtiyacınız var:** \`${command.memberpermissions}\``)]
                }).then(msg => {
                    setTimeout(() => {
                        msg.delete().catch((e) => { console.log(String(e).grey) })
                    }, 5000)
                })
            }
            if(command.category == 'Music'){
                if (!message.member.voice.channel) {
                    return message.channel.send({
                        embeds: [Embed("error", message.author.tag, message.author.displayAvatarURL(), `❌ **Lütfen önce ses kanalına giriş yapın**`)]
                    }).then(msg => {
                        setTimeout(() => {
                            msg.delete().catch((e) => { console.log(String(e).grey) })
                        }, 5000)
                    })
                }
                if (message.member.voice.channel.guild.me.voice.channel && message.member.voice.channel.guild.me.voice.channel.id != message.member.voice.channel.id) {
                    return message.channel.send({
                        embeds: [Embed("error", message.author.tag, message.author.displayAvatarURL(), `❌ **Benim ses Kanalıma giriş yap! Lütfen** <#${message.member.voice.channel.guild.me.voice.channel.id}> **kanalına giriş yap!**`)]
                    }).then(msg => {
                        setTimeout(() => {
                            msg.delete().catch((e) => { console.log(String(e).grey) })
                        }, 5000)
                    })
                }
            }
            command.run(client, message, args, setting, ranks);
        } catch (error) {
            console.log(String(error).grey)
        }
    }
}