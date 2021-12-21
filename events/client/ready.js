//here the event starts
const config = require("../../botconfig/config.json")
const { settings, ranks } = require("../../handlers/database.js")
module.exports = client => {
    try {
        client.db = settings();
        client.db.sync();
        client.rank = ranks();
        client.rank.sync();
        client.guilds.cache.forEach(async guild => {
            guild.members
                .fetch()
                .then((members) => {

                    members.forEach(async(member) => {
                        if (!member.user.bot) {
                            const rank = await client.rank.findOne({ where: { guild_id: guild.id, user_id: member.user.id } });
                            if (rank == null) {
                                await client.rank.create({
                                    guild_id: guild.id,
                                    user_id: member.user.id,
                                    username: member.user.username,
                                    avatar: member.user.displayAvatarURL({ dynamic: false, format: 'png' })
                                })
                            }
                        }
                    });

                });
            const setting = await client.db.findOne({ where: { guild_id: guild.id } })
            if (setting == null) {
                await client.db.create({ guild_id: guild.id })
            }
        });


        try {
            const stringlength = 69;
            console.log("\n")
            console.log(`     ┏━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┓`.bold.brightGreen)
            console.log(`     ┃ `.bold.brightGreen + " ".repeat(-1 + stringlength - ` ┃ `.length) + "┃".bold.brightGreen)
            console.log(`     ┃ `.bold.brightGreen + `Discord Bot online!`.bold.brightGreen + " ".repeat(-1 + stringlength - ` ┃ `.length - `Discord Bot online!`.length) + "┃".bold.brightGreen)
            console.log(`     ┃ `.bold.brightGreen + ` /--/ ${client.user.tag} /--/ `.bold.brightGreen + " ".repeat(-1 + stringlength - ` ┃ `.length - ` /--/ ${client.user.tag} /--/ `.length) + "┃".bold.brightGreen)
            console.log(`     ┃ `.bold.brightGreen + " ".repeat(-1 + stringlength - ` ┃ `.length) + "┃".bold.brightGreen)
            console.log(`     ┗━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┛`.bold.brightGreen)
        } catch { /* */ }


    } catch (e) {
        console.log(String(e.stack).grey.italic.dim.bgRed)
    }
}