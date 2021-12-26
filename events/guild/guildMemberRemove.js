const { replacemsg, Embed } = require(`../../handlers/functions`);

module.exports = async(client, member) => {

    if (!member.user.bot) {
        const rank = await client.rank.findOne({ where: { guild_id: member.guild.id, user_id: member.user.id } });
        if (rank != null) {
            await client.rank.destroy({
                where: {
                    guild_id: member.guild.id,
                    user_id: member.user.id

                }
            });
        }
    }

    const data = await client.db.findOne({ where: { guild_id: member.guild.id } });
    if (data.get("leave_message").enable) {

        const leaveMessage = data.get("leave_message").message;
        const channelID = data.get("leave_message").channelID;



        const channel = member.guild.channels.cache.filter(ch => ch.id == channelID).first();
        if (!channel) {
            return;
        }
        return channel.send({
            embeds: [Embed("Bilgilendirme", message.author.tag, message.author.displayAvatarURL(), replacemsg(leaveMessage, { user: member.user })).setThumbnail(member.displayAvatarURL({ dynamic: true, }))]
        });
    }
}