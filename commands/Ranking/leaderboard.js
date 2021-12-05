const { MessageEmbed, MessageAttachment } = require("discord.js");
const Canvas = require("canvas");
const Cs = require("../../handlers/canvas/index");
const ee = require("../../botconfig/embed.json");
module.exports = {
    name: "leaderboard", //the command name for the Slash Command
    category: "Ranking",
    Kullanımı: "leaderboard",
    aliases: ["leaderboard", "test"],
    description: "Sunucu Siralamasini Goruntuler", //the command description for Slash Command Overview
    cooldown: 1,


    run: async(client, message, args) => {
        try {
            let mesage = new MessageEmbed()
                .setColor(ee.wrongcolor)
                .setFooter(ee.footertext, ee.footericon)
                .setAuthor("Hesaplanıyor...", "https://cdn.discordapp.com/emojis/769935094285860894.gif")


            console.log(client.users.cache)
            let tempmsg = await message.channel.send({ embeds: [mesage] })
                //console.log(message.guild.memberCount)
                //things u can directly access in an interaction!
            const filtered = client.points.filter(p => p.guild === message.guild.id).array();
            const sorted = filtered.sort((a, b) => b.points - a.points);
            const top10 = sorted.splice(0, 10);
            console.log(top10.length)
            let rank = 0;
            // get rank client.users.cache.get(data.user)
            const canvas = Canvas.createCanvas(990, top10.length * 60);
            const ctx = canvas.getContext("2d");
            for (const data of top10) {
                color = rank == 0 ? "#da9e3b" : "#989898";
                // console.log(data)
                // console.log(client.users.cache.get(data.user))
                avatar = client.users.cache.get(data.user);
                username = client.users.cache.get(data.user);
                let image = await new Cs.LeaderBoard()
                    .setAvatar(avatar ? avatar.displayAvatarURL({ dynamic: false, format: 'png' }) : data.avatar)
                    .setLevel(data.level)
                    .setRank(rank + 1)
                    .setRankBadgeColor(color)
                    .setXp(data.points)
                    .setMoney(data.money)
                    .setRankName(data.status)
                    .setMessageCount(data.messages)
                    .setUsername(username ? username.username : data.username)
                    .toAttachment();

                ctx.drawImage(image, 0, rank * 60);
                rank++;
            }
            const attachment = new MessageAttachment(canvas.toBuffer(), "RankCard.png");
            //define embed
            const embed = new MessageEmbed()
                .setTitle(`Seviyeniz:`)
                .setColor(ee.wrongcolor)
                .setFooter(ee.footertext, ee.footericon)
                .setImage("attachment://RankCard.png");
            await message.channel.send({ embeds: [embed], files: [attachment] });
            //delete that temp message
            await tempmsg.delete();
        } catch (e) {
            console.log(String(e.stack).bgRed)
        }
    }
}