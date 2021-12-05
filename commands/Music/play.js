const {
    MessageEmbed,
    Message
} = require("discord.js");
const config = require("../../botconfig/config.json");
const ee = require("../../botconfig/embed.json");
const settings = require("../../botconfig/settings.json");
module.exports = {
    name: "play", //the command name for the Slash Command

    category: "Music",
    aliases: ["p", "paly", "pley"],
    Kullanımı: "play <Search/link>",

    description: "Ses Kanalınızda bir Şarkı/Çalma Listesi çalar", //the command description for Slash Command Overview
    cooldown: 2,


    run: async(client, message, args) => {
        try {
            //console.log(interaction, StringOption)

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
            if (!args[0]) {
                return message.reply({
                    embeds: [new MessageEmbed()
                        .setColor(ee.wrongcolor)
                        .setFooter(ee.footertext, ee.footericon)
                        .setTitle(` **Please add a Search Query!**`)
                        .setDescription(`**Kullanımı:**\n> \`${client.settings.get(message.guild.id, "prefix")}play <Search/Link>\``)
                    ],
                });
            }
            //let IntOption = options.getInteger("OPTIONNAME"); //same as in IntChoices //RETURNS NUMBER
            const Text = args.join(" ") //same as in StringChoices //RETURNS STRING 
                //update it without a response!
            let newmsg = await message.reply({
                content: `🔍 Aranıyor... \`\`\`${Text}\`\`\``,
            }).catch(e => {
                console.log(e)
            })
            try {
                let queue = client.distube.getQueue(guildId)
                let options = {
                    member: member,
                }
                if (!queue) options.textChannel = guild.channels.cache.get(channelId)
                await client.distube.playVoiceChannel(channel, Text, options)
                    //Edit the reply
                newmsg.edit({
                    content: `${queue?.songs?.length > 0 ? "👍 Eklendi" : "🎶 Simdi Çalınıyor"}: \`\`\`css\n${Text}\n\`\`\``,
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