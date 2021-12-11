const { Collection } = require("discord.js");


//EXPORT ALL FUNCTIONS
module.exports.shuffle = shuffle;
module.exports.createBar = createBar;
module.exports.escapeRegex = escapeRegex;
module.exports.onCoolDown = onCoolDown;

module.exports.check_if_dj = check_if_dj;

function check_if_dj(client, member, song) {
    //if no message added return
    if (!client) return false;
    //get the adminroles
    var roleid = client.settings.get(member.guild.id, `djroles`)
        //if no dj roles return false, so that it continues
    if (String(roleid) == "") return false;

    //define variables
    var isdj = false;

    //loop through the roles
    for (let i = 0; i < roleid.length; i++) {
        //if the role does not exist, then skip this current loop run
        if (!member.guild.roles.cache.get(roleid[i])) continue;
        //if he has role set var to true
        if (member.roles.cache.has(roleid[i])) isdj = true;
        //add the role to the string
    }
    //if no dj and not an admin, return the string
    if (!isdj && !member.permissions.has("ADMINISTRATOR") && song.user.id != member.id)
        return roleid.map(i => `<@&${i}>`).join(", ");
    //if he is a dj or admin, then return false, which will continue the cmd
    else
        return false;
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
 * @param {*} total Number | Time in Milliseconds
 * @param {*} current  Number | Time in Milliseconds | Current Music Position
 * @param {*} size Number | Amount of Letters in the Bar (SIZE) Default is: 25
 * @param {*} line EMOJI | the default line is: "▬"
 * @param {*} slider EMOJI | the default slider is: "🔷"
 * @returns STRING a BAR [▬▬▬▬▬🔷▬▬▬▬▬▬▬▬]
 */
function createBar(total, current, size = 25, line = "▬", slider = "🔷") {
    try {
        if (!total) throw "MISSING MAX TIME";
        if (!current) return `**[${mover}${line.repeat(size - 1)}]**`;
        let bar = current > total ? [line.repeat(size / 2 * 2), (current / total) * 100] : [line.repeat(Math.round(size / 2 * (current / total))).replace(/.$/, slider) +
            line.repeat(size - Math.round(size * (current / total)) + 1), current / total
        ];
        if (!String(bar).includes(mover)) {
            return `**[${mover}${line.repeat(size - 1)}]**`;
        } else {
            return `**[${bar[0]}]**`;
        }
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