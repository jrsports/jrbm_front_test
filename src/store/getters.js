const getters = {
    userToken: state => state.user.userToken,
    userAvatar: state => state.user.userAvatar,
    userName: state => state.user.userName,
    teamToken: state => state.team.teamToken,
    teamAvatar: state => state.team.teamAvatar,
    teamName: state => state.team.teamName,
}
export default getters