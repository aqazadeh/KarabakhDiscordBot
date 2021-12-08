const {
    MessageEmbed
} = require("discord.js");
const config = require("../../botconfig/config.json");
const ee = require("../../botconfig/embed.json");
const settings = require("../../botconfig/settings.json");
module.exports = {
    name: "ping", //the command name for the Slash Command

    category: "Info",
    usage: "ping",
    aliases: ["latency"],

    description: "Botun ne kadar hızlı olduğu hakkında size bilgi verir", //the command description for Slash Command Overview
    cooldown: 1,
    memberpermissions: [], //Only allow members with specific Permissions to execute a Commmand [OPTIONAL]



    run: async(client, message, args) => {
        try {
            const {
                member,
                guildId,
                guild
            } = message;
            const {
                channel
            } = member.voice;
            await message.reply({
                    content: `Bot bağlantı hızı sorgulanıyor...`,
                    ephemeral: true
                })
                .then(newMsg => newMsg.edit({
                    content: `Bot hızı: \`${Math.floor((Date.now() - message.createdTimestamp) - 2 * Math.floor(client.ws.ping))} ms\``,
                    ephemeral: true
                }).catch(e => {
                    return console.log(e)
                }))
                .catch(e => {
                    console.log(e)
                })

        } catch (e) {
            console.log(String(e.stack).bgRed)
        }
    }
}