const { MessageEmbed, MessageAttachment } = require("discord.js");
const Canvas = require("../../handlers/canvas/index");
const ee = require("../../botconfig/embed.json");
module.exports = {
    name: "rank", //the command name for the Slash Command
    category: "Ranking",
    Kullanımı: "rank",
    aliases: ["rank"],
    description: "Bir kullanicinin Sunucu Profilini Goruntuler", //the command description for Slash Command Overview
    cooldown: 1,


    run: async(client, message, args) => {
        try {
            //things u can directly access in an interaction!


            let rankuser = message.mentions.users.first() || message.author;
            client.points.ensure(`${message.guild.id}-${rankuser.id}`, {
                user: message.author.id,
                guild: message.guild.id,
                points: 0,
                level: 1,
                levelPoint: 200,
                messages: 0,
                money: 0,
                status: "Çaylak"
            });
            const filtered = client.points.filter(p => p.guild === message.guild.id).array();
            const sorted = filtered.sort((a, b) => b.level - a.level || b.points - a.points);
            const top10 = sorted.splice(0, message.guild.memberCount);
            let i = 0;
            //count server rank sometimes an error comes
            for (const data of top10) {
                try {
                    i++;
                    if (data.user === rankuser.id) break; //if its the right one then break it ;)
                } catch {
                    i = `Error counting Rank`;
                    break;
                }
            }
            const key = `${message.guild.id}-${rankuser.id}`;
            let mesage = new MessageEmbed()
                .setColor("RED")
                .setAuthor("Hesaplanıyor...", "https://cdn.discordapp.com/emojis/769935094285860894.gif")
            let tempmsg = await message.channel.send({ embeds: [mesage] })
            let image = await new Canvas.RankCard()
                .setAvatar(rankuser.displayAvatarURL({ dynamic: false, format: 'png' }))
                .setCurrentXP(client.points.get(key, `points`))
                .setNeededXP(client.points.get(key, `levelPoint`))
                .setLevel(client.points.get(key, `level`))
                .setRank(i)
                .setReputation(client.points.get(key, `money`))
                .setRankName(client.points.get(key, `status`))
                .setUsername(rankuser.username)
                .toAttachment();
            console.log(image.toBuffer())
            let attachment = new MessageAttachment(image.toBuffer(), "rank-card.png");
            //define embed
            const embed = new MessageEmbed()
                .setTitle(`Seviyeniz:  ${rankuser.username}`)
                .setImage("attachment://RankCard.png")
                .setColor(ee.wrongcolor)
                .setFooter(ee.footertext, ee.footericon)
                //send that embed
            tempmsg.delete();
            return message.channel.send({ embeds: [embed], files: [attachment] });


        } catch (e) {
            console.log(String(e.stack).bgRed)
        }
    }
}