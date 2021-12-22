const { onCoolDown, escapeRegex, rank, Embed } = require(`../../handlers/functions`);
module.exports = async(client, message) => {
    if (!message.guild || !message.channel || message.author.bot) {
        if (message.content == `info`) {
            client.guilds.cache.forEach(async guild => {
                const channels = await guild.channels.fetch();
                channels.forEach(async c => {
                    if (c.type === 'GUILD_TEXT') {
                        c.send({ embeds: [Embed("✅ Güncelleme!", message.author.tag, message.author.displayAvatarURL(), `**Bazı Hata Düzeltmeleri ve Yenilikler Eklendi! \n Bizi Seçtiğiniz İçin Teşekkürler!**\n\`Karabakh BOT\``)] }).catch((e) => { console.log(String(e).grey) })
                    }
                })
            })
        }
        return
    };
    if (message.channel.partial) await message.channel.fetch();
    if (message.partial) await message.fetch();


    const setting = await client.db.findOne({ where: { guild_id: message.guild.id } });
    const ranks = await client.rank.findOne({ where: { guild_id: message.guild.id, user_id: message.author.id } });

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
            command.run(client, message, args, setting, ranks);
        } catch (error) {
            console.log(String(error).grey)
        }
    }
}