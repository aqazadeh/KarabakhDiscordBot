const {
    MessageEmbed
} = require("discord.js");
const config = require("../../botconfig/config.json");
const ee = require("../../botconfig/embed.json");
const settings = require("../../botconfig/settings.json");
module.exports = {
        name: "help", //the command name for execution & for helpcmd [OPTIONAL]

        category: "Info",
        usage: "help [cmdname]",
        aliases: ["h", "help", "y", "yardım"],

        cooldown: 1, //the command cooldown for execution & for helpcmd [OPTIONAL]
        description: "Tüm Komutları döndürür", //the command description for helpcmd [OPTIONAL]
        memberpermissions: [], //Only allow members with specific Permissions to execute a Commmand [OPTIONAL]
        requiredroles: [], //Only allow specific Users with a Role to execute a Command [OPTIONAL]
        alloweduserids: [], //Only allow specific Users to execute a Command [OPTIONAL]
        run: async(client, message, args) => {
                try {
                    let prefix = client.settings.get(message.guild.id, "prefix")
                    if (args[0] && args[0].length > 0) {
                        const embed = new MessageEmbed();
                        const cmd = client.commands.get(args[0].toLowerCase()) || client.commands.get(client.aliases.get(args.toLowerCase()));
                        if (!cmd) {
                            return message.reply({
                                embeds: [embed.setColor(ee.wrongcolor).setDescription(`Komut için bilgi bulunamadı**${args.toLowerCase()}**`)]
                            });
                        }
                        if (cmd.name) embed.addField("**Komut ismi**", `\`${cmd.name}\``);
                        if (cmd.name) embed.setTitle(`Hakkında detaylı bilgi:\`${cmd.name}\``);
                        if (cmd.description) embed.addField("**Açıklama**", `\`${cmd.description}\``);
                        if (cmd.aliases) embed.addField("**Takma adlar**", `\`${cmd.aliases.map((a) => `${a}`).join("`, `")}\``);
                    if (cmd.cooldown) embed.addField("**Bekleme Süresi**", `\`${cmd.cooldown} saniye\``);
                    else embed.addField("**Bekleme Süresi**", `\`${settings.default_cooldown_in_sec} saniye\``);
                    if (cmd.usage) {
                      embed.addField("**Kullanımı**", `\`${prefix}${cmd.usage}\``);
                      embed.setFooter("Sözdizimi: <> = gerekli, [] = isteğe bağlı");
                    }
                    return message.reply({
                      embeds: [embed.setColor(ee.color)]
                    });
                  } else {
                    const embed = new MessageEmbed()
                      .setColor(ee.color)
                      .setThumbnail(ee.footericon)
                      .setTitle("Yardım 🔰 Komutları")
                      .setDescription(`**[Sunucuna beni davet et](https://discord.com/api/oauth2/authorize?client_id=${client.user.id}&permissions=8&scope=bot%20applications.commands) **`)
                      .setFooter(`Komut Açıklama ve Bilgilerini görmek için şunu yazın: ${prefix}help [Komut ismi]`, ee.footericon);
                    const commands = (category) => {
                      return client.commands.filter((cmd) => cmd.category === category).map((cmd) => `\`${cmd.name}\``);
                    };
                    try {
                      for (let i = 0; i < client.categories.length; i += 1) {
                        const current = client.categories[i];
                        const items = commands(current);
                        embed.addField(`**${current.toUpperCase()} [${items.length}]**`, `> ${items.join(", ")}`);
                      }
                    } catch (e) {
                      console.log(String(e.stack).red);
                    }
                    message.reply({
                      embeds: [embed]
                    });
                  }
      } catch (e) {
        console.log(String(e.stack).bgRed)
        return message.reply({
          embeds: [new MessageEmbed()
            .setColor(ee.wrongcolor)
            .setFooter(ee.footertext, ee.footericon)
            .setTitle(` Hata | Bir hata oluştu`)
            .setDescription(`\`\`\`${e.message ? String(e.message).substr(0, 2000) : String(e).substr(0, 2000)}\`\`\``)
          ]
        });
      }
    }
}