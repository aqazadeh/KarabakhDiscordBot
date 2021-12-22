const { Embed } = require("../../handlers/functions");
module.exports = client => {
    try {
        client.distube.on(`initQueue`, async queue => {
            try {
                const setting = await client.db.findOne({ where: { guild_id: queue.id } })
                const data = setting.get('music');
                queue.autoplay = data.autoplay;
                queue.volume = data.volume;
                queue.setFilter(data.filters);
            } catch (error) {
                console.error(error)
            }
        });

    } catch (e) {
        console.log(String(e.stack).grey.italic.dim.bgRed)
    }
}