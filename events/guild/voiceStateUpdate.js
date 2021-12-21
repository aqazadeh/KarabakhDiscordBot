module.exports = async(client, oldState, newState) => {
    if (!newState.member.bot) {
        const userID = newState.member.id;
        let isVoiceUser = [];
        if (newState.member.bot) return;
        if (newState.channelId == null) {
            console.log("leave")
        } else {
            console.log("join")
        }
        // console.log(newState)

    }
}