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
        name: "removefilter", //the command name for the Slash Command

        category: "Filter",
        usage: "removefilter <Filter1 Filter2>",
        aliases: ["removefilters", "remove", "removef"],

        description: "Sıradan bir Filtreyi Kaldırır", //the command description for Slash Command Overview
        cooldown: 5,
        requiredroles: [], //Only allow specific Users with a Role to execute a Command [OPTIONAL]
        alloweduserids: [], //Only allow specific Users to execute a Command [OPTIONAL]
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
                                .setDescription(`**DJ-ROLES:**\n> ${check_if_dj(client, member, newQueue.songs[0])}`)
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
                                .addField("**Mevcut tüm Filtreler:**", Object.keys(FiltersSettings).map(f => `\`${f}\``).join(", "))
                            ],
                        })
                    }
                    let toRemove = [];
                    //add new filters    bassboost, clear    --> [clear] -> [bassboost]   
                    filters.forEach((f) => {
                        if (newQueue.filters.includes(f)) {
                            toRemove.push(f)
                        }
                    })
                    if (!toRemove || toRemove.length == 0) {
                        return message.reply({
                            embeds: [
                                new MessageEmbed()
                                .setColor(ee.wrongcolor)
                                .setFooter(ee.footertext, ee.footericon)
                                .setTitle(`**Filtreler'de bulunan bir Filtre eklemediniz.**`)
                                .addField("**Tüm __current__ Filtreler:**", newQueue.filters.map(f => `\`${f}\``).join(", "))
                            ],
                        })
                    }
                    await newQueue.setFilter(toRemove);
                    message.reply({
                        embeds: [new MessageEmbed()
                            .setColor(ee.color)
                            .setTimestamp()
                            .setTitle(`♨️ **Silindi ${toRemove.length} ${toRemove.length == filters.length}**`)
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
    /**
     * @INFO
     * Bot Coded by Tomato#6966 | https://github.com/Tomato6966/Discord-Js-Handler-Template
     * @INFO
     * Work for Milrato Development | https://milrato.eu
     * @INFO
     * Please mention Him / Milrato Development, when using this Code!
     * @INFO
     */