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
        name: "replay", //the command name for the Slash Command
        category: "Song",
        Kullanımı: "replay",
        aliases: ["restart"],
        description: "Geçerli şarkıyı tekrar çalar!", //the command description for Slash Command Overview
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
                    let seekNumber = 0
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
                    await newQueue.seek(seekNumber);
                    message.reply({
                        embeds: [new MessageEmbed()
                            .setColor(ee.color)
                            .setTimestamp()
                            .setTitle(`🔃 **Geçerli Şarkıyı tekrar çalmak!**`)
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