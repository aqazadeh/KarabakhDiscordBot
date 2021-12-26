const { replacemsg } = require(`../../handlers/functions`)

module.exports = async(client, member) => {


    if (!member.user.bot) {
        const rank = await client.rank.findOne({ where: { guild_id: member.guild.id, user_id: member.user.id } });
        if (rank == null) {
            await client.rank.create({
                guild_id: member.guild.id,
                user_id: member.user.id,
                username: member.user.username,
                avatar: member.user.displayAvatarURL({ dynamic: false, format: 'png' })
            });
        }
    }

    const data = await client.db.findOne({ where: { guild_id: member.guild.id } });
    if (data.get("welcome_message").enable) {

        const welcome = data.get("welcome_message").message;
        const channelID = data.get("welcome_message").channelID;



        const channel = member.guild.channels.cache.filter(ch => ch.id == channelID).first();
        if (!channel) {
            return;
        }

        return channel.send({
            embeds: [Embed("Bilgilendirme", message.author.tag, message.author.displayAvatarURL(), replacemsg(welcome, { user: member.user })).setThumbnail(member.displayAvatarURL({ dynamic: true, }))]
        });
    }
}