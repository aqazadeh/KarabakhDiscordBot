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
    name: "customspeed", //the command name for the Slash Command

    category: "Filter",
    usage: "speed <speedamount (0 - 20)>",
    aliases: ["customspeed", "changespeed", "cspeed"],

    description: "Changes the Speed of the Song!", //the command description for Slash Command Overview
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
                if (!args[0]) {
                    return message.reply({
                        embeds: [
                            new MessageEmbed()
                            .setColor(ee.wrongcolor)
                            .setFooter(ee.footertext, ee.footericon)
                            .setTitle(` **Lütfen 0+ ile 2 arasında bir Hız Miktarı ekleyin!**`)
                        ],
                    })
                }
                let speed_amount = parseInt(args[0])
                if (speed_amount <= 0 || speed_amount > 2) {
                    return message.reply({
                        embeds: [
                            new MessageEmbed()
                            .setColor(ee.wrongcolor)
                            .setFooter(ee.footertext, ee.footericon)
                            .setTitle(` **Lütfen 0+ ile 2 arasında bir Hız Miktarı ekleyin!**`)
                        ],
                    })
                }
                FiltersSettings.customspeed = `atempo=${speed_amount}`;
                client.distube.filters = FiltersSettings;
                //add old filters so that they get removed 	
                //if it was enabled before then add it
                if (newQueue.filters.includes("customspeed")) {
                    await newQueue.setFilter(["customspeed"]);
                }
                await newQueue.setFilter(["customspeed"]);
                message.reply({
                    embeds: [new MessageEmbed()
                        .setColor(ee.color)
                        .setTimestamp()
                        .setTitle(`♨️ **Hız ${speed_amount} olarak ayarlandı!**`)
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