module.exports = async(client, oldState, newState) => {
    if (!newState.member.bot) {
        if (newState.member.user.bot) return;
        if (newState.channelId == null) {
            console.log("leave")
        } else {
            console.log("join")
        }

    }
}