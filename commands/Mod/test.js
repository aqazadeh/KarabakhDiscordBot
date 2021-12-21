const { MessageEmbed } = require("discord.js");
const config = require("../../botconfig/config.json");
const ee = require("../../botconfig/embed.json");
const settings = require("../../botconfig/settings.json");
const { Embed, check_if_dj } = require("../../handlers/functions.js");
module.exports = {
    name: "test", //the command name for the Slash Command
    category: "Fun",
    usage: "test",
    aliases: ["test"],
    description: "Bir kullaniciyi Sunucudan Engeller", //the command description for Slash Command Overview
    cooldown: 1,


    run: async(client, message, args, setting) => {
        try {
            //things u can directly access in an interaction!
            // const channel = await message.guild.channels.create("test", { type: `GUILD_VOICE` });
            // const a = await channel.setParent('913956770710441986');
            // await channel.lockPermissions()
            // const exampleEmbed = new MessageEmbed()
            //     .setColor(ee.color)
            //     .setTitle("Basarili Islem")
            //     .setAuthor(message.member.user.tag, message.member.user.displayAvatarURL({ dynamic: true }))
            //     .setDescription('Some description here')
            //     .addField('Inline field title', 'Some value here', true)
            //     .setTimestamp()
            //     .setFooter(ee.footertext, ee.footericon);

            // message.channel.send({ embeds: [exampleEmbed] });
            // console.log(a)

            // message.channel.send(Embed('info', message.member.user.tag, message.member.user.displayAvatarURL({ dynamic: true }), "'Some description here'"));

            return message.reply({
                embeds: [new MessageEmbed()
                    .setColor(ee.wrongcolor)
                    .setFooter(ee.footertext, ee.footericon)
                    .setTitle(` **Siz bir DJ veya Şarkı İsteyen değilsiniz!**`)
                    .setDescription(`**DJ Yetkisi:**\n> ${ check_if_dj(client, message.member, 12, setting)}`)
                ],
            });

        } catch (e) {
            console.log(String(e.stack).bgRed)
        }
    }
}