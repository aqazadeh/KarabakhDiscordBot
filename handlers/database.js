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
        music: { type: DataTypes.JSON, defaultValue: { volume: 70, autoplay: false, djrole: [] } },
        welcome_message: { type: DataTypes.JSON, defaultValue: { enable: false, message: "Sunucumuza Hoş Geldiniz {user}! Seni aramızda görmek güzel!", channelID: "" } },
        leave_message: { type: DataTypes.JSON, defaultValue: { enable: false, message: "{user} 'ın aramızdan ayrıldığı için çok üzgünüm. Bence  onu geri çağırmalıyız!", channelID: "" } }
    });
    return settings;

}
