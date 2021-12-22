const { Embed } = require("../../handlers/functions");
module.exports = client => {
    try {
        client.distube.on(`addList`, (queue, playlist) => {
            queue.textChannel.send({
                embeds: [
                    Embed("**Oynatma listesi Listeye eklendi!**", playlist.user.tag, playlist.user.displayAvatarURL(), `👍 Oynatma listesi: [\`${playlist.name}\`](${playlist.url ? playlist.url : ""})  -  \`${playlist.songs.length} Şarkı\``).setThumbnail(playlist.thumbnail.url ? playlist.thumbnail.url : `https://img.youtube.com/vi/${playlist.songs[0].id}/mqdefault.jpg`).addField(`🌀 **Şarkı süresi:**`, `\`${playlist.formattedDuration}\``)
                ],
            })
        });

    } catch (e) {
        console.log(String(e.stack).grey.italic.dim.bgRed)
    }
}