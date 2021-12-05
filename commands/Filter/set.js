const {
    MessageEmbed,
    Message
} = require("discord.js");
const config = require("../../botconfig/config.json");
const ee = require("../../botconfig/embed.json");
const settings = require("../../botconfig/settings.json");
const {
    check_if_dj
} = require("../../handlers/functions")
const FiltersSettings = require("../../botconfig/filters.json");
module.exports = {
    name: "setfilter", //the command name for the Slash Command

    category: "Filter",
    Kullanımı: "setfilter <Filter1 Filter2>",
    aliases: ["setfilters", "set", "setf"],

    description: "Tüm Filtreleri ayarlar (üzerine yazar)", //the command description for Slash Command Overview
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
            if (!channel) return message.reply({
                embeds: [
                    new MessageEmbed().setColor(ee.wrongcolor).setTitle(`**Lütfen önce ses kanalına giriş yapın**`)
                ],

            })
            if (channel.guild.me.voice.channel && channel.guild.me.voice.channel.id != channel.id) {
                return message.reply({
                    embeds: [new MessageEmbed()
                        .setColor(ee.wrongcolor)
                        .setFooter(ee.footertext, ee.footericon)
                        .setTitle(`Benim ses Kanalıma giriş yap!`)
                        .setDescription(`<#${guild.me.voice.channel.id}>`)
                    ],
                });
            }
            try {
                let newQueue = client.distube.getQueue(guildId);
                if (!newQueue || !newQueue.songs || newQueue.songs.length == 0) return message.reply({
                    embeds: [
                        new MessageEmbed().setColor(ee.wrongcolor).setTitle(`**Şu anda şarkı çalmıyorum!**`)
                    ],

                })
                if (check_if_dj(client, member, newQueue.songs[0])) {
                    return message.reply({
                        embeds: [new MessageEmbed()
                            .setColor(ee.wrongcolor)
                            .setFooter(ee.footertext, ee.footericon)
                            .setTitle(`**Sen bir DJ değilsin ve Şarkı İsteyen de değilsin!**`)
                            .setDescription(`**DJ Yetkisi:**\n> ${check_if_dj(client, member, newQueue.songs[0])}`)
                        ],
                    });
                }
                let filters = args;
                if (filters.some(a => !FiltersSettings[a])) {
                    return message.reply({
                        embeds: [
                            new MessageEmbed()
                            .setColor(ee.wrongcolor)
                            .setFooter(ee.footertext, ee.footericon)
                            .setTitle(`**Geçersiz Filtre eklediniz!**`)
                            .setDescription("**Birden Çok Filtre tanımlamak için aralarına bir BOŞLUK (` `) ekleyin!**")
                            .addField("**Tüm Geçerli Filtreler:**", Object.keys(FiltersSettings).map(f => `\`${f}\``).join(", "))
                        ],
                    })
                }
                let amount = filters.length;
                let toAdded = filters;
                //add old filters so that they get removed 	
                newQueue.filters.forEach((f) => {
                    if (!filters.includes(f)) {
                        toAdded.push(f)
                    }
                })
                if (!toAdded || toAdded.length == 0) {
                    return message.reply({
                        embeds: [
                            new MessageEmbed()
                            .setColor(ee.wrongcolor)
                            .setFooter(ee.footertext, ee.footericon)
                            .setTitle(` **Henüz Filtrelerde bulunan bir Filtre eklemediniz.**`)
                            .addField("**Tüm __current__ Filtreler:**", newQueue.filters.map(f => `\`${f}\``).join(", "))
                        ],
                    })
                }
                await newQueue.setFilter(filters);
                message.reply({
                    embeds: [new MessageEmbed()
                        .setColor(ee.color)
                        .setTimestamp()
                        .setTitle(`♨️ **${amount} Filtresini Ayarla!**`)
                        .setFooter(`💢 Eylem yapan: ${member.user.tag}`, member.user.displayAvatarURL({ dynamic: true }))
                    ]
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