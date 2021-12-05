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
module.exports = {
    name: "remove", //the command name for the Slash Command

    category: "Queue",
    aliases: ["delete", "del", "rem"],
    Kullanımı: "remove <What_song> [Amount]",

    description: "Bir Şarkıyı kaldırır", //the command description for Slash Command Overview
    cooldown: 10,


    run: async(client, message, args) => {
        try {
            //things u can directly access in an interaction!
            const {
                member,
                channelId,
                guildId,
                applicationId,
                commandName,
                deferred,
                replied,
                ephemeral,
                options,
                id,
                createdTimestamp
            } = message;
            const {
                guild
            } = member;
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
                            .setTitle(` **Siz bir DJ veya Şarkı İsteyen değilsiniz!**`)
                            .setDescription(`**DJ Yetkisi:**\n> ${check_if_dj(client, member, newQueue.songs[0])}`)
                        ],
                    });
                }
                if (!args[0]) {
                    return message.reply({
                        embeds: [new MessageEmbed()
                            .setColor(ee.wrongcolor)
                            .setFooter(ee.footertext, ee.footericon)
                            .setTitle(` **Lütfen bir Şarkı Konumu ekleyin!**`)
                            .setDescription(`**Kullanımı:**\n> \`${client.settings.get(message.guild.id, "prefix")}remove <SongPosition> [Amount]\``)
                        ],
                    });
                }
                let songIndex = Number(args[0]);
                if (!songIndex) {
                    return message.reply({
                        embeds: [new MessageEmbed()
                            .setColor(ee.wrongcolor)
                            .setFooter(ee.footertext, ee.footericon)
                            .setTitle(` **Lütfen bir Şarkı-Konum NUMARASI ekleyin!**`)
                            .setDescription(`**Kullanımı:**\n> \`${client.settings.get(message.guild.id, "prefix")}remove <SongPosition> [Amount]\``)
                        ],
                    });
                }
                let amount = Number(args[1] ? args[1] : "1");
                if (!amount) amount = 1;
                if (songIndex > newQueue.songs.length - 1) return message.reply({
                    embeds: [
                        new MessageEmbed().setColor(ee.wrongcolor).setTitle(` **Bu Şarkı mevcut değil!**`)
                        .setDescription(`**Kuyruktaki son Şarkı numrası: \`${newQueue.songs.length}\`**`)
                    ],

                })
                if (songIndex <= 0) return message.reply({
                    embeds: [
                        new MessageEmbed()
                        .setColor(ee.wrongcolor)
                        .setTitle(` **Geçerli Şarkıyı (0) kaldıramazsınız!**`)
                        .setDescription(`**Kullanımı: \`${client.settings.get(guild.id, "prefix")}skip\`**`)
                    ],

                })
                if (amount <= 0) return message.reply({
                    embeds: [
                        new MessageEmbed().setColor(ee.wrongcolor).setTitle(` **En azından 1 Şarkıyı kaldırmanız gerekiyor!**`)
                    ],

                })
                newQueue.songs.splice(songIndex, amount);
                message.reply({
                    embeds: [new MessageEmbed()
                        .setColor(ee.color)
                        .setTimestamp()
                        .setTitle(`🗑 **Kuyruktan ${amount} şarkı${amount > 1 ?"lar": ""} silindi!**`)
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