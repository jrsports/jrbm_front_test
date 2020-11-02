import { teamLogin } from '@/api/team'
import {getTeamToken,setTeamToken} from '@/utils/tokenUtil'

const state = {
  teamToken: getTeamToken(),
  teamName: '',
  teamAvatar: ''
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


}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}
