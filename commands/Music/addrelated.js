const { MessageEmbed } = require("discord.js");
const ee = require("../../botconfig/embed.json");
module.exports = {
        name: "addrelated", //the command name for the Slash Command
        category: "Music",
        usage: "addrelated",
        description: "Geçerli Şarkıya benzer/ilgili bir şarkı ekleyin!", //the command description for Slash Command Overview
        cooldown: 2,

        alloweduserids: [], //Only allow specific Users to execute a Command [OPTIONAL
        run: async(client, message, args) => {
            try {
                //things u can directly access in an interaction!
                const { member, guildId } = message;
                const { guild } = member;
                const { channel } = member.voice;
                if (!channel) return message.reply({
                    embeds: [
                        new MessageEmbed().setColor(ee.wrongcolor).setTitle(`**Lütfen önce ses kanalına giriş yapın**`)
                    ],

                })
                if (channel.userLimit != 0 && channel.full)
                    return message.reply({
                        embeds: [new MessageEmbed()
                            .setColor(ee.wrongcolor)
                            .setFooter(ee.footertext, ee.footericon)
                            .setTitle(`Ses Kanalın dolu. Giriş yapamıyorum`)
                        ],
                    });
                if (channel.guild.me.voice.channel && channel.guild.me.voice.channel.id != channel.id) {
                    return message.reply({
                        embeds: [new MessageEmbed()
                            .setColor(ee.wrongcolor)
                            .setFooter(ee.footertext, ee.footericon)
                            .setTitle(`Baska kanalda şarkı çalıyorum yanıma gel`)
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
                        //update it without a response!
                    let thenewmsg = await message.reply({
                        content: `🔍İlgili Şarkı aranıyor... **${newQueue.songs[0].name}**`,
                    }).catch(e => {
                        console.log(e)
                    })
                    await newQueue.addRelatedSong();
                    await thenewmsg.edit({
                        content: `👍 Eklendi: **${newQueue.songs[newQueue.songs.length - 1].name}**`,
                    }).catch(e => {
                        console.log(e)
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