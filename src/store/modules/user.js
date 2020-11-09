import { userLogin } from '@/api/user'
import {getUserToken,setUserToken} from '@/utils/tokenUtil'

const state = {
  userToken: getUserToken(),
  userName: '',
  userAvatar: ''
}

const mutations = {
  SET_USER_TOKEN: (state, userToken) => {
    state.userToken = userToken
  },
  SET_USER_NAME: (state, userName) => {
    state.userName = userName
  },
  SET_USER_AVATAR: (state, userAvatar) => {
    state.userAvatar = userAvatar
  },
}

const actions = {
  userLogin({ commit }, req) {
    return new Promise((resolve, reject) => {
      userLogin(req).then(response => {
        let data = response.data
        commit('SET_USER_TOKEN', data.userToken)
        commit('SET_USER_NAME',data.userName)
        setUserToken(data.userToken)
        resolve()
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
