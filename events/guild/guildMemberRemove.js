const Discord = require(`discord.js`);
const { replacemsg } = require(`../../handlers/functions`)
const ee = require("../../botconfig/embed.json");

module.exports = async(client, member) => {

    client.InOut.ensure(member.guild.id, {
        jointMessage: `Sunucumuza Hoş Geldiniz {user}! Seni aramızda görmek güzel!`,
        leaveMessage: `{user} 'ın aramızdan ayrıldığı için çok üzgünüm. Bence  onu geri çağırmalıyız! `,
        channel: null

    })
    const leaveMessage = await client.InOut.get(member.guild.id, `leaveMessage`);
    const channelID = client.InOut.get(member.guild.id, `channel`) ? client.InOut.get(member.guild.id, `channel`) : null;

    let channel
    if (!channelID) {
        channel = member.guild.channels.cache.filter(ch => ch.type === 'GUILD_TEXT').first();
        console.log(channel.id)
    } else {
        channel = member.guild.channels.cache.filter(ch => ch.id === channelID).first()
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