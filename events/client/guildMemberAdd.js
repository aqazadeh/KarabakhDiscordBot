//Import Modules
module.exports = (client, member) => {
    let username = member.user.username;
    const user = member.guild.channels.cache.get("913956770710441987");
    user.send('Sunucuya Hşgeldin **' + username + '** Eğleniceğini Düşünüyorum!');
};