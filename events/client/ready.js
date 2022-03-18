//here the event starts
const { settings } = require("../../handlers/database.js")
module.exports = client => {
    try {
        client.user.setPresence({
            status: "online",
            game: {
                name: "!help | Karabakh Music Bot", 
                type: "PLAYING" // PLAYING, WATCHING, LISTENING, STREAMING,
            }
        });

        client.db = settings();
        client.db.sync();
        client.guilds.cache.forEach(async guild => {
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