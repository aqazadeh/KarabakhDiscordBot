const { MessageAttachment } = require("discord.js");
const Rank = require("../../handlers/Rank");
const { Embed } = require("../../handlers/functions");
module.exports = {
    name: "rank", //the command name for the Slash Command
    category: "Ranking",
    usage: "rank",
    aliases: ["rank"],
    description: "Bir kullanicinin Sunucu Profilini Goruntuler", //the command description for Slash Command Overview
    cooldown: 1,


    run: async(client, message, args) => {
        try {

            const rankuser = message.mentions.users.first() || message.author;
            const rank = await client.rank.findOne({ where: { guild_id: message.guild.id, user_id: rankuser.id } });
            const rankusers = await client.rank.findAll({
                where: { guild_id: message.guild.id },
                order: [
                    ["points", "DESC"]
                ]
            });
            let i = 1;
            for (const data of rankusers) {
                if (data.get(`user_id`) === rank.get(`user_id`)) break;
                i++;
            }

            let tempmsg = await message.channel.send({ embeds: [Embed("success", message.author.tag, message.author.displayAvatarURL(), `Hesaplanıyor...`)] })
            let image = await new Rank()
                .setAvatar(rankuser.displayAvatarURL({ dynamic: false, format: 'png' }))
                .setCurrentXP(rank.get(`points`))
                .setNeededXP(rank.get(`nextlevel`))
                .setLevel(rank.get(`level`))
                .setRank(i)
                .setReputation(rank.get(`money`))
                .setUsername(rankuser.username)
                .toAttachment();
            let attachment = new MessageAttachment(image.toBuffer(), "rank-card.png");

            return await message.channel.send({ files: [attachment] }).then(() => tempmsg.delete());


        } catch (e) {
            console.log(String(e.stack).bgRed)
        }
    }
}