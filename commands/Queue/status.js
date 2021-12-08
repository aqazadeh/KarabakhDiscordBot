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
        name: "status", //the command name for the Slash Command

        category: "Queue",
        aliases: ["stats"],
        usage: "status",

        description: "Kuyruktakı şarkıları gösterir", //the command description for Slash Command Overview
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
                        var djs = client.settings.get(newQueue.id, `djroles`);
                        if (!djs || !Array.isArray(djs)) djs = [];
                        else djs = djs.map(r => `<@&${r}>`);
                        if (djs.length == 0) djs = "`atanmadi`";
                        else djs.slice(0, 15).join(", ");
                        let newTrack = newQueue.songs[0];
                        let embed = new MessageEmbed()
                            .setColor(ee.color)
                            .addField(`💡 İsteyen:`, `>>> ${newTrack.user}`, true)
                            .addField(`⏱ Süre:`, `>>> \`${newQueue.formattedCurrentTime} / ${newTrack.formattedDuration}\``, true)
                            .addField(`🌀 Kuyruk:`, `>>> \`${newQueue.songs.length} şarkı(lar)\`\n\`${newQueue.formattedDuration}\``, true)
                            .addField(`🔊 Ses yüzdesi:`, `>>> \`${newQueue.volume} %\``, true)
                            .addField(`♾ Döngü:`, `>>> ${newQueue.repeatMode ? newQueue.repeatMode === 2 ? `\`Kuyruk\`` : `\`Şarkı\`` : ``}`, true)
                            .addField(`❔ Müziği indir:`, `>>> [\`Buraya Tıkla\`](${newTrack.streamURL})`, true)
                            .addField(`❔ Filtre${newQueue.filters.length > 0 ? "ler": ""}:`, `>>> ${newQueue.filters && newQueue.filters.length > 0 ? `${newQueue.filters.map(f=>`\`${f}\``).join(`, `)}` : ``}`, newQueue.filters.length > 1 ? false : true)
                            .addField(`🎧 DJ Yetkisi${djs.length > 1 ? "s": ""}:`, `>>> ${djs}`, djs.length > 1 ? false : true)
                            .setAuthor(`${newTrack.name}`, `https://images-ext-1.discordapp.net/external/DkPCBVBHBDJC8xHHCF2G7-rJXnTwj_qs78udThL8Cy0/%3Fv%3D1/https/cdn.discordapp.com/emojis/859459305152708630.gif`, newTrack.url)
                            .setThumbnail(`https://img.youtube.com/vi/${newTrack.id}/mqdefault.jpg`)
                            .setFooter(`💯 ${newTrack.user.tag}`, newTrack.user.displayAvatarURL({
                                dynamic: true
                            }));
				message.reply({
					embeds: [embed]
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