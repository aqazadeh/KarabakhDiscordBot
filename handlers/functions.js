const { Collection, MessageEmbed, MessageButton, MessageActionRow } = require("discord.js");


//EXPORT ALL FUNCTIONS
module.exports.shuffle = shuffle;
module.exports.escapeRegex = escapeRegex;
module.exports.onCoolDown = onCoolDown;

module.exports.formatVariable = formatVariable;
module.exports.applyText = applyText;
module.exports.check_if_dj = check_if_dj;
module.exports.rank = rank;
module.exports.Embed = Embed;
module.exports.receiveQueueData = receiveQueueData;

function check_if_dj(client, member, song, setting) {
    if (!client) return false;

    if (member.permissions.has("ADMINISTRATOR") || song.user.id == member.id) return false;

    var roleid = setting.get(`music`).djrole;

    if (roleid.length == 0) return true;

    for (let i = 0; i < roleid.length; i++) {
        if (!member.guild.roles.cache.get(roleid[i])) continue;
        if (member.roles.cache.has(roleid[i])) isdj = true;
    }
    if (!isdj) return true;
    else return false;
}


module.exports.replacemsg = replacedefaultmessages

function replacedefaultmessages(text, o = {}) {
    if (!text || text == undefined || text == null) throw "No Text for the replacedefault message added as First Parameter";
    const options = Object(o)
    if (!options || options == undefined || options == null) return String(text)
    return String(text)
        .replace(/{user}/gi, options && options.user ? options.user : "{user}")
        .replace(/{command}/gi, options && options.command ? options.command : "{command}")
        .replace(/{prefix}/gi, options && options.prefix ? options.prefix : "{prefix}")
        .replace(/{autoplay}/gi, options && options.autoplay ? options.autoplay : "{autoplay}")

}

function onCoolDown(message, command) {
    if (!message || !message.client) throw "No Message with a valid DiscordClient granted as First Parameter";
    if (!command || !command.name) throw "No Command with a valid Name granted as Second Parameter";
    const client = message.client;
    if (!client.cooldowns.has(command.name)) { //if its not in the cooldown, set it too there
        client.cooldowns.set(command.name, new Collection());
    }
    const now = Date.now(); //get the current time
    const timestamps = client.cooldowns.get(command.name); //get the timestamp of the last used commands
    const cooldownAmount = (command.cooldown || 1.5) * 1000; //get the cooldownamount of the command, if there is no cooldown there will be automatically 1 sec cooldown, so you cannot spam it^^
    if (timestamps.has(message.member.id)) { //if the user is on cooldown
        const expirationTime = timestamps.get(message.member.id) + cooldownAmount; //get the amount of time he needs to wait until he can run the cmd again
        if (now < expirationTime) { //if he is still on cooldonw
            const timeLeft = (expirationTime - now) / 1000; //get the lefttime
            //return true
            return timeLeft
        } else {
            //if he is not on cooldown, set it to the cooldown
            timestamps.set(message.member.id, now);
            //set a timeout function with the cooldown, so it gets deleted later on again
            setTimeout(() => timestamps.delete(message.member.id), cooldownAmount);
            //return false aka not on cooldown
            return false;
        }
    } else {
        //if he is not on cooldown, set it to the cooldown
        timestamps.set(message.member.id, now);
        //set a timeout function with the cooldown, so it gets deleted later on again
        setTimeout(() => timestamps.delete(message.member.id), cooldownAmount);
        //return false aka not on cooldown
        return false;
    }
}

/**
 * 
 * @param {*} array Shuffles a given array (mix) 
 * @returns ARRAY
 */
function shuffle(array) {
    try {
        var j, x, i;
        for (i = array.length - 1; i > 0; i--) {
            j = Math.floor(Math.random() * (i + 1));
            x = array[i];
            array[i] = array[j];
            array[j] = x;
        }
        return array;
    } catch (e) {
        console.log(String(e.stack).bgRed)
    }
}



/**
 * 
 * @param {*} str String of message, not replacing pings 
 * @returns Only the Pinged message
 */
function escapeRegex(str) {
    try {
        return str.replace(/[.*+?^()|[\]\\]/g, `\\$&`);
    } catch (e) {
        console.log(String(e.stack).bgRed)
    }
}

/**
 * 
 * @param {
 * } client 
 * @param {*} message 
 * @param {*} ranks
 */

async function rank(client, message, ranks) {


    const messagePoint = Math.floor(message.content.length * 0.5);
    const money = Number((message.content.split(/ +/).length * 0.01));
    await client.rank.update({ points: ranks.get(`points`) + messagePoint, money: ranks.get(`money`) + money }, { where: { guild_id: message.guild.id, user_id: message.author.id } })

    if (ranks.get(`points`) > ranks.get(`nextlevel`)) {
        console.log(`level up`)

        await client.rank.update({
            nextlevel: ranks.get(`nextlevel`) + Math.floor(ranks.get(`nextlevel`) * 0.8),
            level: ranks.get(`level`) + 1
        }, {
            where: {
                guild_id: message.guild.id,
                user_id: message.author.id
            }
        });


        const curLevel = ranks.get(`level`);
        message.channel.send({
                    embeds: [
                            new MessageEmbed()
                            .setTitle(`Tebrikler: ` + message.author.username)
                            .setTimestamp()
                            .setDescription(`Seviye Atladiniz: **\`${curLevel}\`**! (Puan: \`${ranks.get(`points`)}\`) `)
                                .setColor('#C219D8')
                                .setFooter({text: 'Karabakh BOT', iconURL:'https://cdn.discordapp.com/avatars/914294751551954974/1e03a99854f09776b06acda84679e849.png'})
                          ]
              });
          }

}
/**
 * 
 * @param {*} type 
 * @param {*} authorName 
 * @param {*} authorImg 
 * @param {*} desc 
 * @param {*} field 
 * @param {*} thumb 
 * @param {*} image 
 * @returns 
 */

function Embed(type, authorName, authorImg, desc =""){
    const embed = new MessageEmbed();
    if(type == "error")
    {
        embed.setColor('#e01e01');
        embed.setTitle('Hatalı İşlem!');
    }else if(type == "success"){
        embed.setColor('#C219D8');
        embed.setTitle('İşlem Başarılı!');
    }else {
        embed.setColor('#0099ff');
        embed.setTitle(type);
    }
	embed.setAuthor({ name: authorName, iconURL: authorImg});
	embed.setDescription(desc);
	embed.setTimestamp();
	embed.setFooter({text: 'Karabakh BOT', iconURL:'https://cdn.discordapp.com/avatars/914294751551954974/1e03a99854f09776b06acda84679e849.png'});

    return embed;
}

/**
 * Gets variables and types
 * @param {object} prefix The type of variable
 * @param {object} variable The variable to change
 * @returns The variable formatted
 */
function formatVariable(prefix, variable) {
    const formattedVariable = variable.toLowerCase()
        .split("-").map((word) => word.charAt(0).toUpperCase() + word.substr(1, word.length).toLowerCase()).join("");
    return prefix + formattedVariable;
}

/**
 * Gets variables and types
 * @param {object} canvas The canvas
 * @param {object} text The text
 * @param {object} defaultFontSize The default font pixel size
 * @param {object} width The max width of the text
 * @param {object} font The text font
 * @returns The variable formatted
 */

function applyText(canvas, text, defaultFontSize, width, font) {
    const ctx = canvas.getContext("2d");
    do {
        ctx.font = `${(defaultFontSize -= 1)}px ${font}`;
    } while (ctx.measureText(text).width > width);
    return ctx.font;
}
/**
 * 
 * @param {*} newQueue 
 * @param {*} newTrack 
 * @returns 
 */
function receiveQueueData(newQueue, newTrack) {
    if(!newTrack) return new MessageEmbed().setColor(`#e01e01`).setTitle("NO SONG FOUND?!?!")
    var embed = new MessageEmbed()
      .setColor(`#0099ff`)
      .addField(`💡 İsteyen`, `>>> ${newTrack.user}`, true)
      .addField(`⏱ Süre:`, `>>> \` ${newTrack.formattedDuration}\``, true)
      .addField(`🌀 Şarkı Listesi:`, `>>> \`${newQueue.songs.length} şarkı\`\n\`${newQueue.formattedDuration}\``, true)
      .addField(`🔊 Ses Seviyesi:`, `>>> \`${newQueue.volume} %\``, true)
      .addField(`❔ Şarkıyı indir:`, `>>> [\`Buraya Tıkla\`](${newTrack.streamURL})`, true)
      .addField(`❔ Filtreler:`, `>>> ${newQueue.filters && newQueue.filters.length > 0 ? `${newQueue.filters.map(f=>`\`${f}\``).join(`, `)}` : ``}`, newQueue.filters.length > 2 ? false : true)
	  .setAuthor({nane: `${newTrack.name}`, iconURL: `https://images-ext-1.discordapp.net/external/DkPCBVBHBDJC8xHHCF2G7-rJXnTwj_qs78udThL8Cy0/%3Fv%3D1/https/cdn.discordapp.com/emojis/859459305152708630.gif`, url: newTrack.url})
      .setThumbnail(`https://img.youtube.com/vi/${newTrack.id}/mqdefault.jpg`)
      .setFooter({text: `💯 ${newTrack.user.tag}`, iconURL: newTrack.user.displayAvatarURL({dynamic: true})});
    let prev = new MessageButton().setStyle('PRIMARY').setCustomId('4').setEmoji('⏮')
    let pause = new MessageButton().setStyle('PRIMARY').setCustomId('3').setEmoji('⏸')
    let stop = new MessageButton().setStyle('DANGER').setCustomId('2').setEmoji(`⏹`)
    let skip = new MessageButton().setStyle('PRIMARY').setCustomId('1').setEmoji(`⏭`)
    if (!newQueue.playing) {
      pause = pause.setStyle('SUCCESS').setEmoji('▶️')
    }
    let shuffle = new MessageButton().setStyle('PRIMARY').setCustomId('6').setEmoji('🔀')
    let autoplay = new MessageButton().setStyle('SUCCESS').setCustomId('7').setEmoji('🔄')
    let songloop = new MessageButton().setStyle('SUCCESS').setCustomId('8').setEmoji(`🔁`)
    let queueloop = new MessageButton().setStyle('SUCCESS').setCustomId('9').setEmoji(`🔂`)
    if (newQueue.autoplay) {
      autoplay = autoplay.setStyle('SECONDARY')
    }
    if (newQueue.repeatMode === 0) {
      songloop = songloop.setStyle('SUCCESS')
      queueloop = queueloop.setStyle('SUCCESS')
    }
    if (newQueue.repeatMode === 1) {
      songloop = songloop.setStyle('SECONDARY')
      queueloop = queueloop.setStyle('SUCCESS')
    }
    if (newQueue.repeatMode === 2) {
      songloop = songloop.setStyle('SUCCESS')
      queueloop = queueloop.setStyle('SECONDARY')
    }
    const row = new MessageActionRow().addComponents([prev, pause, stop, skip]);
    const row2 = new MessageActionRow().addComponents([ shuffle,songloop, queueloop,autoplay]);
    return {
      embeds: [embed],
      components: [row, row2]
    };
}