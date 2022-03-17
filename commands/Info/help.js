const { MessageEmbed } = require("discord.js");
const { replacemsg } = require("../../handlers/functions.js")
module.exports = {
        name: "help",
        category: "Info",
        usage: "help [cmdname]",
        aliases: ["h", "help"],
        example: ["help", "help play"],
        cooldown: 1,
        description: "Tüm Komutları döndürür",
        run: async(client, message, args) => {
                try {
                    let setting = await client.db.findOne({ where: { guild_id: message.guild.id } });
                    let prefix = setting.dataValues.prefix;
                    if (args[0] && args[0].length > 0) {
                        const embed = new MessageEmbed();
                        console.log(args[0])
                        const cmd = client.commands.get(args[0].toLowerCase()) || client.commands.get(client.aliases.get(args[0].toLowerCase()));
                        if (!cmd) {
                            return message.reply({
                                embeds: [
                                    embed.setColor(`#e01e01`)
                                    .setDescription(replacemsg(`**Komut için bilgi bulunamadı: ** \`{command}\``, { command: args[0].toLowerCase() }))
                                ]
                            });
                        }
                        if (cmd.name) embed.addField("**Komut ismi: **", `\`${cmd.name}\``);
                        if (cmd.name) embed.setTitle(replacemsg(`\`{command}\`** :Komutu hakkında detaylı bilgi!**`, { command: cmd.name }));
                        if (cmd.description) embed.addField(`**Açıklama: **`, `\`${cmd.description}\``);
                        if (cmd.aliases) embed.addField(`**Takma adlar: **`, `\`${cmd.aliases.map((a) => `${a}`).join("`, `")}\``);
                    if (cmd.cooldown) embed.addField(`**Bekleme Süresi: **`, `\`${cmd.cooldown}\``);
                    if (cmd.usage) {
                      embed.addField(`**Kullanımı: **`, `\`${prefix}${cmd.usage}\``);
                      embed.setFooter({text: `Söz dizimi: <> = gerekli, [] = isteğe bağlı`});
                    }
                    if(cmd.example) embed.addField(`**Örnek**: `, `\`${cmd.example.map((a) => `${a}`).join("`\n `")}\``);
                    return message.reply({
                      embeds: [embed.setColor(`#C219D8`)]
                    });
                  } else {
                    const embed = new MessageEmbed()
                      .setColor(`#C219D8`)
                      .setThumbnail(`https://cdn.discordapp.com/avatars/914294751551954974/1e03a99854f09776b06acda84679e849.png`)
                      .setTitle(`Yardım 🔰 Komutlar`)
                      .setDescription(`**[Sunucuna beni davet et](https://discord.com/api/oauth2/authorize?client_id=${client.user.id}&permissions=8&scope=bot)**`)
                      .setFooter(replacemsg(`Komut Açıklama ve Bilgilerini görmek için şunu yazın: {prefix}help [Komut ismi]`, { prefix }), `https://cdn.discordapp.com/avatars/914294751551954974/1e03a99854f09776b06acda84679e849.png`);
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
      }
    }
}