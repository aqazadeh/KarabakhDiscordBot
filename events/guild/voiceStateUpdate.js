module.exports = async(client, oldState, newState) => {
    if (!newState.member.bot) {
        const userID = newState.member.id;
        console.log(userID)

    }
}