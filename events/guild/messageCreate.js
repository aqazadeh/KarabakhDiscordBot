//Import Modules
const config = require(`../../botconfig/config.json`);
const ee = require(`../../botconfig/embed.json`);
const settings = require(`../../botconfig/settings.json`);
const { onCoolDown, replacemsg } = require(`../../handlers/functions`);
const Discord = require(`discord.js`);
module.exports = async(client, message) => {
    console.log(message.member.permissions.has("ADMINISTRATOR"))
    if (!message.guild || !message.channel || message.author.bot) return;
    if (message.channel.partial) await message.channel.fetch();
    if (message.partial) await message.fetch();

    rank(client, message);



    client.settings.ensure(message.guild.id, {
        prefix: config.prefix,
        defaultvolume: 100,
        defaultautoplay: true,
        defaultfilters: [`bassboost6`, `clear`],
        djroles: []
    })
    let prefix = client.settings.get(message.guild.id, `prefix`)
    const prefixRegex = new RegExp(`^(<@!?${client.user.id}>|${escapeRegex(prefix)})`);
    if (!prefixRegex.test(message.content)) return;
    const [, mPrefix] = message.content.match(prefixRegex);
    const args = message.content.slice(mPrefix.length).trim().split(/ +/).filter(Boolean);
    const cmd = args.length > 0 ? args.shift().toLowerCase() : null;
    if (!cmd || cmd.length == 0) {
        if (mPrefix.includes(client.user.id)) {
            message.reply({ embeds: [new Discord.MessageEmbed().setColor(ee.color).setFooter(ee.footertext, ee.footericon).setTitle(`:thumbsup: **My Prefix here, is __\`${prefix}\`__**`)] })
        }
        return;
    }
    let command = client.commands.get(cmd);
    if (!command) command = client.commands.get(client.aliases.get(cmd));
    if (command) {

        if (onCoolDown(message, command)) {
            return message.reply({
                embeds: [new Discord.MessageEmbed()
                    .setColor(ee.wrongcolor)
                    .setFooter(ee.footertext, ee.footericon)
                    .setTitle(replacemsg(settings.messages.cooldown, {
                        prefix: prefix,
                        command: command,
                        timeLeft: onCoolDown(message, command)
                    }))
                ]
            });
        }
        try {
            //if Command has specific permission return error
            if (command.memberpermissions && command.memberpermissions.length > 0 && !message.member.permissions.has(command.memberpermissions)) {
                return message.reply({
                    embeds: [
                        new Discord.MessageEmbed()
                        .setColor(ee.wrongcolor)
                        .setFooter(ee.footertext, ee.footericon)
                        .setTitle(replacemsg(settings.messages.notallowed_to_exec_cmd.title))
                        .setDescription(replacemsg(settings.messages.notallowed_to_exec_cmd.description.memberpermissions, {
                            command: command,
                            prefix: prefix
                        }))
                    ]
                }).then(msg => { setTimeout(() => { msg.delete().catch((e) => { console.log(String(e).grey) }) }, settings.timeout.notallowed_to_exec_cmd.memberpermissions) }).catch((e) => { console.log(String(e).grey) });
            }



            //run the command with the parameters:  client, message, args, Cmduser, text, prefix,
            command.run(client, message, args, args.join(` `).split(`++`).filter(Boolean), message.member, args.join(` `), prefix);
        } catch (error) {
            if (settings.somethingwentwrong_cmd) {
                return message.reply({
                    embeds: [new Discord.MessageEmbed()
                        .setColor(ee.wrongcolor)
                        .setFooter(ee.footertext, ee.footericon)
                        .setTitle(replacemsg(settings.messages.somethingwentwrong_cmd.title, {
                            prefix: prefix,
                            command: command
                        }))
                        .setDescription(replacemsg(settings.messages.somethingwentwrong_cmd.description, {
                            error: error,
                            prefix: prefix,
                            command: command
                        }))
                    ]
                }).then(msg => { setTimeout(() => { msg.delete().catch((e) => { console.log(String(e).grey) }) }, 4000) }).catch((e) => { console.log(String(e).grey) });
            }
        }
    }
    /* else //if the command is not found send an info msg
            return message.reply({
              embeds: [new Discord.MessageEmbed()
                .setColor(ee.wrongcolor)
                .setFooter(ee.footertext, ee.footericon)
                .setTitle(replacemsg(settings.messages.unknown_cmd, {
                  prefix: prefix
                }))]
            }).then(msg => {setTimeout(()=>{msg.delete().catch((e) => {console.log(String(e).grey)})}, 4000)}).catch((e) => {console.log(String(e).grey)});*/
}

function escapeRegex(str) {
    try {
        return str.replace(/[.*+?^()|[\]\\]/g, `\\$&`);
    } catch {
        return str
    }
}

function rank(client, message) {
    const key = `${message.guild.id}-${message.author.id}`;
    client.points.ensure(`${key}`, {
        user: message.author.id,
        guild: message.guild.id,
        username: message.author.username ? message.author.username : message.author.tag,
        avatar: message.author.displayAvatarURL({ dynamic: false, format: 'png' }),
        points: 0,
        level: 1,
        levelPoint: 200,
        messages: 0,
        money: 0,
        status: "Çaylak"

    });

    const messagePoint = Number(Math.floor(message.content.length * 0.5));
    const money = (message.content.length * 0.01).toFixed(2);
    //if too short the message

    client.points.math(key, `+`, Number(money), `money`)
    client.points.inc(key, `money`);
    client.points.math(key, `+`, Number(messagePoint), `points`)
    client.points.inc(key, `points`);
    const curLevel = client.points.get(key, `level`);
    const levelPoint = client.points.get(key, `levelPoint`);

    //if its a new level then do this
    if (client.points.get(key, `points`) > client.points.get(key, `levelPoint`)) {
        nextLevel = Math.floor(levelPoint * 2);
        client.points.set(key, nextLevel, `levelPoint`);
        client.points.set(key, (curLevel + 1), `level`);

        if (curLevel + 1 > 5) {
            client.points.set(key, "Asteğmen", `status`);
            console.log("10")
        } else if (curLevel + 1 > 10) {
            client.points.set(key, "Teğmen", `status`);
            console.log("15")
        } else if (curLevel + 1 > 15) {
            client.points.set(key, "Üsteğmen", `status`);
        } else if (curLevel + 1 > 20) {
            client.points.set(key, "Yüzbaşı", `status`);
        } else if (curLevel + 1 > 25) {
            client.points.set(key, "Binbaşı", `status`);
        } else if (curLevel + 1 > 30) {
            client.points.set(key, "Yarbay", `status`);
        } else if (curLevel + 1 > 35) {
            client.points.set(key, "Albay", `status`);
        } else if (curLevel + 1 > 45) {
            client.points.set(key, "Tuğgeneral", `status`);
        } else if (curLevel + 1 > 55) {
            client.points.set(key, "Tümgeneral", `status`);
        } else if (curLevel + 1 > 65) {
            client.points.set(key, "Korgeneral", `status`);
        } else if (curLevel + 1 > 75) {
            client.points.set(key, "Orgeneral", `status`);
        } else if (curLevel + 1 > 85) {
            client.points.set(key, "Genelkurmaybaşkanı", `status`);
        } else if (curLevel + 1 > 120) {
            client.points.set(key, "Mareşal", `status`);
        } else {
            console.log("hata")
        }

        //define ranked embed
        //send ping and embed message
        message.channel.send({
                    embeds: [
                            new Discord.MessageEmbed()
                            .setTitle(`Tebrikler: ` + message.author.username)
                            .setTimestamp()
                            .setDescription(`Seviye Atladiniz: **\`${curLevel + 1}\`**! (Puan: \`${client.points.get(key, `points`)}\`) `)
                                .setColor(ee.wrongcolor)
                                .setFooter(ee.footertext, ee.footericon)
                          ]
              });
          }
}