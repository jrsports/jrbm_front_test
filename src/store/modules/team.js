import {getMyTeamInfo, teamLogin} from '@/api/team'
import {getFriendList} from "@/api/friend";
import {getTeamToken,setTeamToken} from '@/utils/tokenUtil'

const state = {
  teamToken: getTeamToken(),
  teamName: '',
  teamAvatar: '',
  fund:'-',
  coin:'-',
  friendList:[]
}

const mutations = {
  SET_TEAM_TOKEN: (state, teamToken) => {
    state.teamToken = teamToken
  },
  SET_TEAM_NAME: (state, teamName) => {
    state.teamName = teamName
  },
  SET_TEAM_AVATAR: (state, teamAvatar) => {
    state.teamAvatar = teamAvatar
  },
  SET_TEAM_FUND: (state, fund) => {
    state.fund = fund
  },
  SET_TEAM_COIN: (state, coin) => {
    state.coin = coin
  },
  SET_FRIEND_LIST: (state, friendList) => {
    state.friendList = friendList
  },
}

const actions = {
  teamLogin({ commit }, req) {
    return new Promise((resolve, reject) => {
      teamLogin(req).then(response => {
        if(response.code===0){
          let data=response.data.teamInfo;
          commit('SET_TEAM_TOKEN', data.teamToken)
          commit('SET_TEAM_NAME',data.teamName)
          commit('SET_TEAM_AVATAR',data.avatar)
          setTeamToken(data.teamToken)
        }
        resolve(response)
      }).catch(error => {
        reject(error)
      })
    })
  },
  getMyTeamInfo({ commit }) {
    return new Promise((resolve, reject) => {
      getMyTeamInfo().then(response => {
        if(response.code===0){
          let data=response.data;
          commit('SET_TEAM_NAME',data.teamName)
          commit('SET_TEAM_AVATAR',data.avatar)
          commit('SET_TEAM_FUND',data.fund)
          commit('SET_TEAM_COIN',data.coin)
        }
        resolve(response)
      }).catch(error => {
        reject(error)
      })
    })
  },
  getFriendList({ commit }) {
    return new Promise((resolve, reject) => {
      getFriendList().then(response => {
        if(response.code===0){
          let data=response.data;
          commit('SET_FRIEND_LIST',data)
        }
        resolve(response)
      }).catch(error => {
        reject(error)
      })
    })
  },


}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}
