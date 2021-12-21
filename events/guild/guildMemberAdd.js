const Discord = require(`discord.js`);
const { replacemsg } = require(`../../handlers/functions`)
const ee = require("../../botconfig/embed.json");

module.exports = async(client, member) => {
    const data = await client.db.findOne({ where: { guild_id: member.guild.id } });
    if (data.get("welcome_message").enable) {

        const welcome = data.get("welcome_message").message;
        const channelID = data.get("welcome_message").channelID;



        const channel = member.guild.channels.cache.filter(ch => ch.id == channelID).first();
        if (!channel) {
            return;
        }

        return channel.send({
            embeds: [
                new Discord.MessageEmbed()
                .setTitle(`Keşke Gitmeseydi`)
                .setDescription(replacemsg(welcome, { user: member.user }))
                .setThumbnail(member.displayAvatarURL({
                    dynamic: true,
                }))
                .setFooter(ee.footertext, ee.footericon)
                .setTimestamp()
            ]
        });
    }
}