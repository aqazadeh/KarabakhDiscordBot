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
        name: "addfilter", //the command name for the Slash Command

        category: "Filter",
        Kullanımı: "addfilter <Filter1 Filter2>",
        aliases: ["addfilters", "add", "addf"],

        description: "Filtrelere Filtre Ekle", //the command description for Slash Command Overview
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
                        let toAdded = [];
                        //add new filters
                        filters.forEach((f) => {
                            if (!newQueue.filters.includes(f)) {
                                toAdded.push(f)
                            }
                        })
                        if (!toAdded || toAdded.length == 0) {
                            return message.reply({
                                embeds: [
                                    new MessageEmbed()
                                    .setColor(ee.wrongcolor)
                                    .setFooter(ee.footertext, ee.footericon)
                                    .setTitle(` **Hiç Filtre eklemediniz. Filtre yok**`)
                                    .addField("**Tüm  __geçerli__ Filtreler:**", newQueue.filters.map(f => `\`${f}\``).join(", "))
                                ],
                            })
                        }
                        await newQueue.setFilter(toAdded);
                        message.reply({
                                    embeds: [new MessageEmbed()
                                            .setColor(ee.color)
                                            .setTimestamp()
                                            .setTitle(`♨️ **Eklendi ${toAdded.length} ${toAdded.length == filters.length ? "Filtreler": `${filters.length}`}**`)
					  .setFooter(`💢 Eylem yapan: ${member.user.tag}`, member.user.displayAvatarURL({dynamic: true}))]
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