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
        name: "nowplaying", //the command name for the Slash Command
        category: "Song",
        usage: "nowplaying",
        aliases: ["np", "current"],
        description: "Geçerli Çalmakta olan Şarkıyı gösterir", //the command description for Slash Command Overview
        cooldown: 5,


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
                        let newTrack = newQueue.songs[0];
                        message.reply({
                                    content: `${client.settings.get(guild.id, "prefix")}play ${newTrack.url}`,
                                    embeds: [
                                            new MessageEmbed().setColor(ee.color)
                                            .setTitle(newTrack.name)
                                            .setURL(newTrack.url)
                                            .addField(`💡 İsteyen:`, `>>> ${newTrack.user}`, true)
                                            .addField(`⏱ Süre:`, `>>> \`${newQueue.formattedCurrentTime} / ${newTrack.formattedDuration}\``, true)
                                            .addField(`🌀 Kuyruk:`, `>>> \`${newQueue.songs.length} şarkı(lar)\`\n\`${newQueue.formattedDuration}\``, true)
                                            .addField(`♾ Döngü:`, `>>> ${newQueue.repeatMode ? newQueue.repeatMode === 2 ? `\`Kuyruk\`` : `\`Şarkı\`` : ``}`, true)
                                            .addField(`❔ Müziği indir:`, `>>> [\`Buraya Tıkla\`](${newTrack.streamURL})`, true)
                                            .addField(`❔ Filter${newQueue.filters.length > 0 ? "s": ""}:`, `>>> ${newQueue.filters && newQueue.filters.length > 0 ? `${newQueue.filters.map(f=>`\`${f}\``).join(`, `)}` : ``}`, newQueue.filters.length > 1 ? false : true)
                                            .addField(`Görüntulenme`, `>>> \`${newTrack.views}\``, true)
                                            
                                            .addField(`:thumbsup: Beğenenler:`, `>>> \`${newTrack.likes}\``, true)
                                            .addField(`:thumbsdown: Beğenmeyenler:`, `>>> \`${newTrack.dislikes}\``, true)
                                            .setThumbnail(`https://img.youtube.com/vi/${newTrack.id}/mqdefault.jpg`)
                                            .setFooter(`Şarkı İsteyen: ${guild.name}`, guild.iconURL({
                                                dynamic: true
                                            })).setTimestamp()
                                        ]
				}).catch((e) => {
					onsole.log(e.stack ? e.stack : e)
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