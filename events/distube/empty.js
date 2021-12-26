const { Embed } = require("../../handlers/functions");
module.exports = client => {
    try {
        client.distube.on(`empty`, queue => {
            queue.textChannel.messages.fetch(client.PlayerMap.get(queue.id)).then(currentSongPlayMsg => {
                currentSongPlayMsg.delete().catch((e) => {
                    console.log(e.stack ? String(e.stack).grey : String(e).grey)
                })
            }).catch((e) => {
                console.log(e.stack ? String(e.stack).grey : String(e).grey)
            })
            queue.textChannel.send({
                embeds: [
                    Embed(``, ``, ``, `:headphones: **Listede başka şarkı kalmadı.** \`Karabakh BOT\` **Ses kanalından ayrıldı!`)
                ],
            })
        });

    } catch (e) {
        console.log(String(e.stack).grey.italic.dim.bgRed)
    }
}