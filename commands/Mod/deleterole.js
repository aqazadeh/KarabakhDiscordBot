const {
    MessageEmbed,
    Message
} = require("discord.js");
const config = require("../../botconfig/config.json");
const ee = require("../../botconfig/embed.json");
const settings = require("../../botconfig/settings.json");
module.exports = {
    name: "deleterole", //the command name for the Slash Command
    category: "Mod",
    usage: "clearchat",
    aliases: ["deleterole", "delrole"],
    description: "Sohbeti Temizler", //the command description for Slash Command Overview
    cooldown: 1,
    memberpermissions: ["MANAGE_MESSAGES"], //Only allow specific Users with a Role to execute a Command [OPTIONAL]

    run: async(client, message, args) => {
        try {
            //things u can directly access in an interaction!


        } catch (e) {
            console.log(String(e.stack).bgRed)
        }
    }
}