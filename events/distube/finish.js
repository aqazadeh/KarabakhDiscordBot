module.exports = client => {
    try {
        client.distube.on(`finish`, (queue) => {
            queue.textChannel.send("Baska Şarki Kalmadı")
            .then(currentSongPlayMsg => {
                currentSongPlayMsg.delete()
                .catch((e) => {
                    console.log(e.stack ? String(e.stack).grey : String(e).grey)
                })
            })
        });

    } catch (e) {
        console.log(String(e.stack).grey.italic.dim.bgRed)
    }
}
