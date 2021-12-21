const { Sequelize, DataTypes } = require("sequelize");
const config = require("../botconfig/config.json")
const db = new Sequelize('database', 'user', 'password', {
    host: 'localhost',
    dialect: 'sqlite',
    logging: false,
    storage: 'database.sqlite'
});
module.exports.settings = () => {
    const settings = db.define('Settings', {
        guild_id: { type: DataTypes.STRING, unique: true, allowNull: false },
        prefix: { type: DataTypes.STRING, defaultValue: config.prefix },
        music: { type: DataTypes.JSON, defaultValue: { volume: 70, autoplay: false, filters: ["bassboost6", "clear"], djrole: [] } },
        welcome_message: { type: DataTypes.JSON, defaultValue: { enable: false, message: "Sunucumuza Hoş Geldiniz {user}! Seni aramızda görmek güzel!", channelID: "" } },
        leave_message: { type: DataTypes.JSON, defaultValue: { enable: false, message: "{user} 'ın aramızdan ayrıldığı için çok üzgünüm. Bence  onu geri çağırmalıyız!", channelID: "" } }
    });
    return settings;

}
module.exports.ranks = () => {
    const rank = db.define('textrank', {
        guild_id: { type: DataTypes.STRING, allowNull: false },
        user_id: { type: DataTypes.STRING, unique: true, allowNull: false },
        username: { type: DataTypes.STRING },
        avatar: { type: DataTypes.STRING },
        points: { type: DataTypes.INTEGER, defaultValue: 0 },
        level: { type: DataTypes.INTEGER, defaultValue: 1 },
        nextlevel: { type: DataTypes.INTEGER, defaultValue: 300 },
        messages: { type: DataTypes.INTEGER, defaultValue: 1 },
        money: { type: DataTypes.FLOAT, defaultValue: 0.0 },
        voicetime: { type: DataTypes.JSON, defaultValue: { fullTime: 0, connect: { join: 0, leave: 0 } } },
    });
    return rank;
}