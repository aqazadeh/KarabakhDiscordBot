const { Embed } = require("../../handlers/functions");
module.exports = client => {
    try {
        client.distube.on(`addSong`, (queue, song) => {
            queue.textChannel.send({
                embeds: [Embed("**Şarkı listeye eklendi!**", song.user.tag, song.user.displayAvatarURL(), `👍 Şarkı: [\`${song.name}\`](${song.url})  -  \`${song.formattedDuration}\``).setThumbnail(`https://img.youtube.com/vi/${song.id}/mqdefault.jpg`).addField(`🌀 **Şarkı süresi:**`, `\`${song.formattedDuration}\``)]
            })
        });

    } catch (e) {
        console.log(String(e.stack).grey.italic.dim.bgRed)
    }
}