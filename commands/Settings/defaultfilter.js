const { MessageEmbed } = require("discord.js");
const ee = require("../../botconfig/embed.json");
const filters = require("../../botconfig/filters.json");
const { settings } = require("../../handlers/database");
module.exports = {
    name: "defaultfilter", //the command name for execution & for helpcmd [OPTIONAL]
    aliases: ["dfilter"],
    category: "Settings",
    usage: "defaultfilter <Filter1 Filter2>",
    cooldown: 10, //the command cooldown for execution & for helpcmd [OPTIONAL]
    description: "Varsayılan Filtre tanımlar", //the command description for helpcmd [OPTIONAL]
    memberpermissions: ["MANAGE_GUILD"], //Only allow members with specific Permissions to execute a Commmand [OPTIONAL]


    run: async(client, message, args, setting) => {
        try {
            //things u can directly access in an interaction!
            const { member } = message;
            const { guild } = member;
            if (args.some(a => !filters[a])) {
                return message.reply({
                    embeds: [
                        new MessageEmbed()
                        .setColor(ee.wrongcolor)
                        .setFooter(ee.footertext, ee.footericon)
                        .setTitle(`**Geçersiz Filtre eklediniz!**`)
                        .setDescription("**Birden Çok Filtre tanımlamak için aralarına bir BOŞLUK (` `) ekleyin!**")
                        .addField("**Tüm Geçerli Filtreler:**", Object.keys(filters).map(f => `\`${f}\``).join(", "))
                    ],
                })
            }
            const data = setting.get(`music`);
            args.forEach(e => {
                data.filters.push(e)
            })
            await client.db.update({ music: data }, { where: { guild_id: guild.id } }).then(() => {
                let newfilters = data.filters.length > 0 ? data.filters.map(a => `\`${a}\``).join(", ") : `\`Bulunamadı\`\n> **Kullanımı:** \`defaultfilter <filter1 filter2 etc.>\``;
                return message.reply({
                    embeds: [
                        new MessageEmbed()
                        .setColor(ee.color)
                        .setFooter(ee.footertext, ee.footericon)
                        .setTitle(`**Yeni Varsayılan Filtre:**`)
                        .setDescription(`${newfilters}`)
                    ],
                })
            });

        } catch (e) {
            console.log(String(e.stack).bgRed)
        }
    }
}