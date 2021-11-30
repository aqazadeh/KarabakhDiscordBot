const {
    MessageEmbed,
    Message
} = require("discord.js");
const config = require("../../botconfig/config.json");
const ee = require("../../botconfig/embed.json");
const settings = require("../../botconfig/settings.json");
module.exports = {
        name: "mix", //the command name for the Slash Command

        category: "Music",
        aliases: ["musicmix", "playmix", "playlist", "playmusicmix"],
        usage: "mix [MIXNAME]",

        description: "Plays a defined Mix", //the command description for Slash Command Overview
        cooldown: 2,
        requiredroles: [], //Only allow specific Users with a Role to execute a Command [OPTIONAL]
        alloweduserids: [], //Only allow specific Users to execute a Command [OPTIONAL]

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
                if (channel.userLimit != 0 && channel.full)
                    return message.reply({
                        embeds: [new MessageEmbed()
                            .setColor(ee.wrongcolor)
                            .setFooter(ee.footertext, ee.footericon)
                            .setTitle(`Your Voice Channel is full, I can't join!`)
                        ],
                    });
                if (channel.guild.me.voice.channel && channel.guild.me.voice.channel.id != channel.id) {
                    return message.reply({
                        embeds: [new MessageEmbed()
                            .setColor(ee.wrongcolor)
                            .setFooter(ee.footertext, ee.footericon)
                            .setTitle(`I am already connected somewhere else`)
                        ],
                    });
                }

                let link = "https://open.spotify.com/playlist/37i9dQZF1DXc6IFF23C9jj";
                if (args[0]) {
                    //ncs | no copyrighted music
                    if (args[0].toLowerCase().startsWith("n")) link = "https://open.spotify.com/playlist/7sZbq8QGyMnhKPcLJvCUFD";
                    //pop
                    if (args[0].toLowerCase().startsWith("p")) link = "https://open.spotify.com/playlist/37i9dQZF1DXc6IFF23C9jj";
                    //default
                    if (args[0].toLowerCase().startsWith("d")) link = "https://open.spotify.com/playlist/37i9dQZF1DXc6IFF23C9jj";
                    //remixes from Magic Release
                    if (args[0].toLowerCase().startsWith("re")) link = "https://www.youtube.com/watch?v=NX7BqdQ1KeU&list=PLYUn4YaogdahwfEkuu5V14gYtTqODx7R2"
                        //rock
                    if (args[0].toLowerCase().startsWith("ro")) link = "https://open.spotify.com/playlist/37i9dQZF1DWXRqgorJj26U";
                    //oldgaming
                    if (args[0].toLowerCase().startsWith("o")) link = "https://www.youtube.com/watch?v=iFOAJ12lDDU&list=PLYUn4YaogdahPQPTnBGCrytV97h8ABEav"
                        //gaming
                    if (args[0].toLowerCase().startsWith("g")) link = "https://open.spotify.com/playlist/4a54P2VHy30WTi7gix0KW6";
                    //Charts
                    if (args[0].toLowerCase().startsWith("cha")) link = "https://www.youtube.com/playlist?list=PLMC9KNkIncKvYin_USF1qoJQnIyMAfRxl"
                        //Chill
                    if (args[0].toLowerCase().startsWith("chi")) link = "https://open.spotify.com/playlist/37i9dQZF1DX4WYpdgoIcn6";
                    //Jazz
                    if (args[0].toLowerCase().startsWith("j")) link = "https://open.spotify.com/playlist/37i9dQZF1DXbITWG1ZJKYt";
                    //blues
                    if (args[0].toLowerCase().startsWith("b")) link = "https://open.spotify.com/playlist/37i9dQZF1DXd9rSDyQguIk";
                    //strange-fruits
                    if (args[0].toLowerCase().startsWith("s")) link = "https://open.spotify.com/playlist/6xGLprv9fmlMgeAMpW0x51";
                    //magic-release
                    if (args[0].toLowerCase().startsWith("ma")) link = "https://www.youtube.com/watch?v=WvMc5_RbQNc&list=PLYUn4Yaogdagvwe69dczceHTNm0K_ZG3P"
                        //metal
                    if (args[0].toLowerCase().startsWith("me")) link = "https://open.spotify.com/playlist/37i9dQZF1DX9qNs32fujYe";
                    //heavy metal
                    if (args[0].toLowerCase().startsWith("h")) link = "https://open.spotify.com/playlist/37i9dQZF1DX9qNs32fujYe";
                }
                let newMsg = await message.reply({
                    content: `Loading the **'${args[0] ? args[0] : "Default"}' Music Mix**`,
                });
                try {
                    let queue = client.distube.getQueue(guildId)
                    let options = {
                        member: member,
                    }
                    if (!queue) options.textChannel = guild.channels.cache.get(channelId)
                    await client.distube.playVoiceChannel(channel, link, options)
                        //Edit the reply
                    newMsg.edit({
                        content: `${queue?.songs?.length > 0 ? "👍 Loaded" : "🎶 Now Playing"}: the **'${args[0] ? args[0] : "Default"}'**`,
                    });
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