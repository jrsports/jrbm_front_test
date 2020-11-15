
const state = {
  wsMsgRouter:new Map()
}

const mutations = {
  ADD_WS_ROUTER: (state, routers) => {
    routers.forEach(router=>{
      state.wsMsgRouter.set(router.router,router.function);
    })
  },
}

const actions = {
  addRouter({ commit }, routers) {
    return new Promise(() => {
      commit('ADD_WS_ROUTER', routers)
    })
  },

}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}
