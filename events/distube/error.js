module.exports = client => {
    try {
        client.distube.on(`error`, (channel, e) => {
            channel.messages.fetch(client.PlayerMap.get(queue.id)).then(currentSongPlayMsg => {
                currentSongPlayMsg.delete().catch((e) => {
                    console.log(e.stack ? String(e.stack).grey : String(e).grey)
                })
            }).catch((e) => {
                console.log(e.stack ? String(e.stack).grey : String(e).grey)
            })
            channel.send(`Bir hatayla karşılaşıldı: ${e}`).catch((e) => console.log(e))
            console.error(e)
        });
    } catch (e) {
        console.log(String(e.stack).grey.italic.dim.bgRed)
    }
}