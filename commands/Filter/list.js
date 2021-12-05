const {
    MessageEmbed,
    Message
} = require("discord.js");
const config = require("../../botconfig/config.json");
const ee = require("../../botconfig/embed.json");
const settings = require("../../botconfig/settings.json");
const FiltersSettings = require("../../botconfig/filters.json");
const {
    check_if_dj
} = require("../../handlers/functions")

module.exports = {
    name: "filters", //the command name for the Slash Command

    category: "Filter",
    Kullanımı: "filters",
    aliases: ["listfilter", "listfilters", "allfilters"],

    description: "Tüm aktif ve olası Filtreleri listeleyin!", //the command description for Slash Command Overview
    cooldown: 5,


    run: async(client, message, args) => {
        try {
            const {
                member,
                guildId,
                guild
            } = message;
            const {
                channel
            } = member.voice;
            try {
                let newQueue = client.distube.getQueue(guildId);
                if (!newQueue || !newQueue.songs || newQueue.songs.length == 0) return message.reply({
                    embeds: [
                        new MessageEmbed()
                        .setColor(ee.wrongcolor)
                        .setFooter(ee.footertext, ee.footericon)
                        .addField("**Mevcut tüm Filtreler:**", Object.keys(FiltersSettings).map(f => `\`${f}\``).join(", "))
                    ],
                })
                return message.reply({
                    embeds: [
                        new MessageEmbed()
                        .setColor(ee.wrongcolor)
                        .setFooter(ee.footertext, ee.footericon)
                        .addField("**Mevcut tüm Filtreler:**", Object.keys(FiltersSettings).map(f => `\`${f}\``).join(", "))
                        .addField("**Tüm __current__ Filtreler:**", newQueue.filters.map(f => `\`${f}\``).join(", "))
                    ],
                })
            } catch (e) {
                console.log(e.stack ? e.stack : e)
                message.reply({
                    content: ` | Hata: `,
                    embeds: [
                        new MessageEmbed().setColor(ee.wrongcolor)
                        .setDescription(`\`\`\`${e}\`\`\``)
                    ],

                })
            }
        } catch (e) {
            console.log(String(e.stack).bgRed)
        }
    }
}