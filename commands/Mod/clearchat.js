const {
    MessageEmbed,
    Message
} = require("discord.js");
const config = require("../../botconfig/config.json");
const ee = require("../../botconfig/embed.json");
const settings = require("../../botconfig/settings.json");
module.exports = {
    name: "clearchat", //the command name for the Slash Command
    category: "System",
    usage: "clearchat",
    aliases: ["clearchat"],
    description: "Sohbeti Temizler", //the command description for Slash Command Overview
    cooldown: 1,
    memberpermissions: ["MANAGE_MESSAGES"], //Only allow specific Users with a Role to execute a Command [OPTIONAL]

    run: async(client, message, args) => {
        try {
            //things u can directly access in an interaction!
            if (args[0] && !Number.isInteger(parseInt(args[0]))) {
                return message.reply({
                    embeds: [new MessageEmbed()
                        .setColor(ee.wrongcolor)
                        .setFooter(ee.footertext, ee.footericon)
                        .setTitle(` **Lütfen bir say girin**`)
                        .setDescription(`**Kullanımı:**\n> \`${client.settings.get(message.guild.id, "prefix")}clearchat  ?<@number>\``)
                    ],
                });
            }
            count = args[0] || 100;
            if (message.author.bot) return;
            if (count > 100)
                return message.reply({
                    embeds: [new MessageEmbed()
                        .setColor(ee.wrongcolor)
                        .setFooter(ee.footertext, ee.footericon)
                        .setDescription(`**Şu anda bir seferde en fazla 100 mesajı silebilirsiniz.**`)
                    ],
                });

            await message.channel.messages
                .fetch({ limit: count })
                .then(async messages => {
                    // Fetches the messages
                    await message.channel.bulkDelete(messages);
                })

        } catch (e) {
            console.log(String(e.stack).bgRed)
        }
    }
}