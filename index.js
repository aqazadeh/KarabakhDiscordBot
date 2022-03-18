const Discord = require("discord.js");
const config = require(`./botconfig/config.json`);
const colors = require("colors");
const libsodium = require("libsodium-wrappers");
const ffmpeg = require("ffmpeg-static");
const voice = require("@discordjs/voice");
const DisTube = require("distube").default;
const { YtDlpPlugin } = require('@distube/yt-dlp')
const client = new Discord.Client({
    shards: "auto",
    allowedMentions: {
        parse: [],
        repliedUser: false,
    },
    partials: ['MESSAGE', 'CHANNEL', 'REACTION'],
    intents: [
        Discord.Intents.FLAGS.GUILDS,
        Discord.Intents.FLAGS.GUILD_MEMBERS,
        Discord.Intents.FLAGS.GUILD_MESSAGES,
        Discord.Intents.FLAGS.GUILD_VOICE_STATES,
        Discord.Intents.FLAGS.GUILD_BANS,
        Discord.Intents.FLAGS.GUILD_EMOJIS_AND_STICKERS,
        Discord.Intents.FLAGS.GUILD_INTEGRATIONS,
        Discord.Intents.FLAGS.GUILD_WEBHOOKS,
        Discord.Intents.FLAGS.GUILD_INVITES,
        Discord.Intents.FLAGS.GUILD_PRESENCES,
        Discord.Intents.FLAGS.GUILD_MESSAGE_REACTIONS,
        Discord.Intents.FLAGS.GUILD_MESSAGE_TYPING,
        Discord.Intents.FLAGS.DIRECT_MESSAGES,
        Discord.Intents.FLAGS.DIRECT_MESSAGE_REACTIONS,
        Discord.Intents.FLAGS.DIRECT_MESSAGE_TYPING
    ],
});



client.distube = new DisTube(client, {
    emitNewSongOnly: false,
    leaveOnEmpty: true,
    leaveOnFinish: false,
    leaveOnStop: false,
    savePreviousSongs: true,
    emitAddSongWhenCreatingQueue: false,
    searchSongs: 0,
    youtubeIdentityToken: config.youtubeApiKey,
    emptyCooldown: 120,
    plugins: [
        new YtDlpPlugin()
      ],
    youtubeDL: false,
})

client.commands = new Discord.Collection();
client.cooldowns = new Discord.Collection();
client.aliases = new Discord.Collection();
client.categories = require("fs").readdirSync(`./commands`);
client.PlayerMap = new Map();
client.setMaxListeners(100);
require('events').defaultMaxListeners = 120;

["events", "commands", "antiCrash"]
.filter(Boolean)
    .forEach(h => {
        require(`./handlers/${h}`)(client);
    })

client.login(config.token)