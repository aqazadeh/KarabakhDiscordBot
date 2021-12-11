const Discord = require("discord.js");
const config = require(`./botconfig/config.json`);
const settings = require(`./botconfig/settings.json`);
const filters = require(`./botconfig/filters.json`);
const colors = require("colors");
const Enmap = require("enmap");
const libsodium = require("libsodium-wrappers");
const ffmpeg = require("ffmpeg-static");
const voice = require("@discordjs/voice");
const DisTube = require("distube").default;
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
    presence: {
        activity: {
            name: `+help | musicium.eu`,
            type: "PLAYING",
        },
        status: "online"
    }
});


client.points = new Enmap({ name: "points", dataDir: "./databases/points" });
// const leveling = require("./ranking"); //load the leveling file
// leveling(client);
client.distube = new DisTube(client, {
    emitNewSongOnly: false,
    leaveOnEmpty: true,
    leaveOnFinish: true,
    leaveOnStop: true,
    savePreviousSongs: true,
    emitAddSongWhenCreatingQueue: false,
    searchSongs: 0,
    youtubeIdentityToken: config.youtubeApiKey,
    nsfw: true,
    emptyCooldown: 25,
    ytdlOptions: {
        highWaterMark: 1024 * 1024 * 64,
        quality: "highestaudio",
        format: "audioonly",
        liveBuffer: 60000,
        dlChunkSize: 1024 * 1024 * 64,
    },
    youtubeDL: true,
    updateYouTubeDL: true,
    customFilters: filters
})

client.commands = new Discord.Collection();
client.cooldowns = new Discord.Collection();
client.aliases = new Discord.Collection();
client.categories = require("fs").readdirSync(`./commands`);

client.setMaxListeners(100);
require('events').defaultMaxListeners = 100;

client.settings = new Enmap({ name: "settings", dataDir: "./databases/settings" });
client.infos = new Enmap({ name: "infos", dataDir: "./databases/infos" });
client.InOut = new Enmap({ name: "InOut", dataDir: "./databases/InOut" });
client.musicForMe = new Enmap({ name: "musicForMe", dataDir: "./databases/musicforme" });

["events", "commands", settings.antiCrash ? "antiCrash" : null, "distubeEvent"]
.filter(Boolean)
    .forEach(h => {
        require(`./handlers/${h}`)(client);
    })

client.login(config.token)