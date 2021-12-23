const { MessageEmbed } = require("discord.js");
const lang = require("../../lang/tr.json");
const ee = require("../../botconfig/embed.json");
const { replacemsg } = require("../../handlers/functions.js")
module.exports = {
        name: "help",
        category: "Info",
        usage: "help [cmdname]",
        aliases: ["h", "help"],
        example: ["help", "help play"],
        cooldown: 1,
        description: lang.help.generaldescription,
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
                                    embed.setColor(ee.wrongcolor)
                                    .setDescription(replacemsg(lang.help.commandNotFound, { command: args[0].toLowerCase() }))
                                ]
                            });
                        }
                        if (cmd.name) embed.addField(lang.help.commandName, `\`${cmd.name}\``);
                        if (cmd.name) embed.setTitle(replacemsg(lang.help.commandSingTitle, { command: cmd.name }));
                        if (cmd.description) embed.addField(lang.help.commandSingleDesc, `\`${cmd.description}\``);
                        if (cmd.aliases) embed.addField(lang.help.commandSingleAliases, `\`${cmd.aliases.map((a) => `${a}`).join("`, `")}\``);
                    if (cmd.cooldown) embed.addField(lang.help.commandSingleCooldown, `\`${cmd.cooldown}\``);
                    if (cmd.usage) {
                      embed.addField(lang.help.commandSingleUsage, `\`${prefix}${cmd.usage}\``);
                      embed.setFooter(lang.help.commandSingleSyntax);
                    }
                    if(cmd.example) embed.addField(lang.help.commandSingleExample, `\`${cmd.example.map((a) => `${a}`).join("`\n `")}\``);
                    return message.reply({
                      embeds: [embed.setColor(ee.color)]
                    });
                  } else {
                    const embed = new MessageEmbed()
                      .setColor(ee.color)
                      .setThumbnail(ee.footericon)
                      .setTitle(lang.help.title)
                      .setDescription(`**[${lang.help.description}](https://discord.com/api/oauth2/authorize?client_id=${client.user.id}&permissions=8&scope=bot) **`)
                      .setFooter(replacemsg(lang.help.commandFooter, { prefix }), ee.footericon);
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
            .setTitle(lang.general.error)
            .setDescription(`\`\`\`${e.message ? String(e.message).substr(0, 2000) : String(e).substr(0, 2000)}\`\`\``)
          ]
        });
      }
    }
}