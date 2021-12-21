const FiltersSettings = require("../../botconfig/filters.json");
module.exports = {
        name: "filters",
        category: "Music",
        usage: "filters",
        aliases: ["filters"],
        description: "Tüm aktif ve olası Filtreleri listeleyin!",
        cooldown: 5,
        run: async(client, message, args) => {
                try {
                    const { member, guildId } = message;
                    try {
                        let newQueue = client.distube.getQueue(guildId);
                        if (!newQueue || !newQueue.songs || newQueue.songs.length == 0) {
                            return message.channel.send({
                                        embeds: [Embed("error", message.author.tag, message.author.displayAvatarURL(), `**Mevcut tüm Filtreler:** ${Object.keys(FiltersSettings).map(f => `\`${f}\``).join("\n")}`)]
                    }).then(msg => {
                        setTimeout(() => {
                            msg.delete().catch((e) => { console.log(String(e).grey) })
                        }, 5000)
                    })
                }
                return message.channel.send({
                    embeds: [Embed("error", message.author.tag, message.author.displayAvatarURL(), ``).addField("**Mevcut tüm Filtreler:**", Object.keys(FiltersSettings).map(f => `\`${f}\``).join(", ")).addField("**Geçerli Filtreler:**", newQueue.filters.map(f => `\`${f}\``).join(", "))]
                }).then(msg => {
                    setTimeout(() => {
                        msg.delete().catch((e) => { console.log(String(e).grey) })
                    }, 5000)
                })
            } catch (e) {
                console.log(e.stack ? e.stack : e)
            }
        } catch (e) {
            console.log(String(e.stack).bgRed)
        }
    }
}