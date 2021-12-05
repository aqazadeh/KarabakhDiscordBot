const {
    MessageEmbed
} = require("discord.js");
const config = require("../../botconfig/config.json");
const ee = require("../../botconfig/embed.json");
const settings = require("../../botconfig/settings.json");
const filters = require("../../botconfig/filters.json")
module.exports = {
    name: "defaultfilter", //the command name for execution & for helpcmd [OPTIONAL]
    aliases: ["dfilter"],
    category: "Settings",
    Kullanımı: "defaultfilter <Filter1 Filter2>",
    cooldown: 10, //the command cooldown for execution & for helpcmd [OPTIONAL]
    description: "Varsayılan Filtre(leri) tanımlar", //the command description for helpcmd [OPTIONAL]
    memberpermissions: ["MANAGE_GUILD"], //Only allow members with specific Permissions to execute a Commmand [OPTIONAL]


    run: async(client, message, args) => {
        try {
            //things u can directly access in an interaction!
            const {
                member,
            } = message;
            const {
                guild
            } = member;
            client.settings.ensure(guild.id, {
                defaultvolume: 50,
                defaultautoplay: false,
                defaultfilters: [`bassboost6`, `clear`]
            });
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
            client.settings.set(guild.id, args, "defaultfilters");
            let newfilters = args.length > 0 ? args.map(a => `\`${a}\``).join(", ") : `\`Bulunamadı\`\n> **Kullanımı:** \`${client.settings.get(guild.id, "prefix")}defaultfilter <filter1 filter2 etc.>\``;
            return message.reply({
                embeds: [
                    new MessageEmbed()
                    .setColor(ee.color)
                    .setFooter(ee.footertext, ee.footericon)
                    .setTitle(`**Yeni Varsayılan Filtre${args.length > 1 ? "ler ": ""}:**`)
                    .setDescription(`${newfilters}`)
                ],
            })
        } catch (e) {
            console.log(String(e.stack).bgRed)
        }
    }
}