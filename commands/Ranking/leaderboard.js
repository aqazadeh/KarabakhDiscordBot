const { MessageAttachment } = require("discord.js");
const Canvas = require("canvas");
const LeaderBoard = require("../../handlers/LeaderBoard");
const { Embed } = require("../../handlers/functions");
module.exports = {
    name: "leaderboard", //the command name for the Slash Command
    category: "Ranking",
    usage: "leaderboard",
    aliases: ["leaderboard"],
    description: "Sunucu Siralamasini Goruntuler", //the command description for Slash Command Overview
    cooldown: 1,


    run: async(client, message, args) => {
        try {
            let tempmsg = await message.channel.send({ embeds: [Embed("success", message.author.tag, message.author.displayAvatarURL(), `https://cdn.discordapp.com/emojis/769935094285860894.gif Hesaplanıyor...`)] })

            const rankusers = await client.rank.findAll({
                where: {
                    guild_id: message.guild.id
                },
                order: [
                    ["points", "DESC"]
                ]
            });
            let rank = 0;
            const canvas = Canvas.createCanvas(990, rankusers.length * 60);
            const ctx = canvas.getContext("2d");
            for (const data of rankusers) {
                color = rank == 0 ? "#da9e3b" : "#989898";
                const user = client.users.cache.get(data.get(`user_id`));
                let image = await new LeaderBoard()
                    .setAvatar(user ? user.displayAvatarURL({ dynamic: false, format: 'png' }) : data.get(`avatar`))
                    .setLevel(data.get(`level`))
                    .setRank(rank + 1)
                    .setRankBadgeColor(color)
                    .setXp(data.get(`points`))
                    .setMoney(data.get(`money`))
                    .setMessageCount(data.get(`messages`))
                    .setUsername(user ? user.username : data.get(`username`))
                    .toAttachment();

                ctx.drawImage(image, 0, rank * 60);
                rank++;
            }
            const attachment = new MessageAttachment(canvas.toBuffer(), "RankCard.png");

            return await message.channel.send({ files: [attachment] }).then(() => tempmsg.delete());

        } catch (e) {
            console.log(String(e.stack).bgRed)
        }
    }
}