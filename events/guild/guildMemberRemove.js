const Discord = require(`discord.js`);
const { replacemsg } = require(`../../handlers/functions`)
const ee = require("../../botconfig/embed.json");

module.exports = async(client, member) => {

    const data = await client.db.findOne({ where: { guild_id: member.guild.id } });
    if (data.get("leave_message").enable) {

        const leaveMessage = data.get("leave_message").message;
        const channelID = data.get("leave_message").channelID;



        const channel = member.guild.channels.cache.filter(ch => ch.id == channelID).first();
        if (!channel) {
            return;
        }

        return channel.send({
            embeds: [
                new Discord.MessageEmbed()
                .setTitle(`Keşke Gitmeseydi`)
                .setDescription(replacemsg(leaveMessage, { user: member.user }))
                .setThumbnail(member.displayAvatarURL({
                    dynamic: true,
                }))
                .setFooter(ee.footertext, ee.footericon)
                .setTimestamp()
            ]
        });
    }
}