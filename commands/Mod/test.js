const { MessageEmbed } = require("discord.js");
const config = require("../../botconfig/config.json");
const ee = require("../../botconfig/embed.json");
const settings = require("../../botconfig/settings.json");
module.exports = {
    name: "test", //the command name for the Slash Command
    category: "Fun",
    usage: "test",
    aliases: ["test"],
    description: "Bir kullaniciyi Sunucudan Engeller", //the command description for Slash Command Overview
    cooldown: 1,


    run: async(client, message, args) => {
        try {
            //things u can directly access in an interaction!
            const channel = await message.guild.channels.create("test", { type: `GUILD_VOICE` });
            const a = await channel.setParent('913956770710441986');
            await channel.lockPermissions()

            console.log(a)
        } catch (e) {
            console.log(String(e.stack).bgRed)
        }
    }
}