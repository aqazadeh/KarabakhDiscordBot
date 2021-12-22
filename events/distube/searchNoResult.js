module.exports = client => {
    try {
        client.distube.on(`searchNoResult`, message => {
            message.channel.send(`Aradıgınız Şarkı Bulunamadı`).catch((e) => console.log(e))
        });

    } catch (e) {
        console.log(String(e.stack).grey.italic.dim.bgRed)
    }
}