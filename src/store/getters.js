const getters = {
    userToken: state => state.user.userToken,
    userAvatar: state => state.user.userAvatar,
    userName: state => state.user.userName,
    teamToken: state => state.team.teamToken,
    teamAvatar: state => state.team.teamAvatar,
    teamName: state => state.team.teamName,
    teamId:state=>state.team.teamId,
    fund: state => state.team.fund,
    coin: state => state.team.coin,
    season:state=>state.team.season,
    friendList:state=>state.team.friendList,
    wsMsgRouter: state=>state.ws.wsMsgRouter
}
export default getters