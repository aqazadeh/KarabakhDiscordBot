const { Embed } = require("../../handlers/functions.js");
const fetch = require('cross-fetch');
const together = require("../../botconfig/together.json");
module.exports = {
    name: "awkword",
    category: "Fun",
    usage: "awkword",
    aliases: ["awkword"],
    description: "Ses Kanalinda awkword izlemenizi sağlar!",
    cooldown: 20,
    run: async(client, message, args, setting) => {
        const { member, channelId, guildId } = message;
        const { guild } = member;
        const { channel } = member.voice;
        if (!channel) {
            return message.channel.send({
                embeds: [Embed("error", message.author.tag, message.author.displayAvatarURL(), `❌ **Lütfen önce ses kanalına giriş yapın**`)]
            }).then(msg => {
                setTimeout(() => {
                    msg.delete().catch((e) => { console.log(String(e).grey) })
                }, 5000)
            })
        }
        try {
            let returnData = {
                code: 'none',
            };
            try {
                await fetch(`https://discord.com/api/v8/channels/${channel.id}/invites`, {
                        method: 'POST',
                        body: JSON.stringify({
                            max_age: 86400,
                            max_uses: 0,
                            target_application_id: together.awkword,
                            target_type: 2,
                            temporary: false,
                            validate: null,
                        }),
                        headers: {
                            Authorization: `Bot ${client.token}`,
                            'Content-Type': 'application/json',
                        },
                    })
                    .then((res) => res.json())
                    .then((invite) => {
                        if (invite.error || !invite.code) throw new Error('An error occured while retrieving data !');
                        if (Number(invite.code) === 50013) console.warn('Your bot lacks permissions to perform that action');
                        returnData.code = `https://discord.com/invite/${invite.code}`;
                    });
                return message.channel.send({
                    embeds: [Embed("success", message.author.tag, message.author.displayAvatarURL(), `[**awkword Çagırmak için tıkla!**](${returnData.code})`)]
                });


            } catch (e) {
                console.log(String(e.stack).bgRed)
            }

        } catch (e) {
            console.log(String(e.stack).bgRed)
        }
    }
}