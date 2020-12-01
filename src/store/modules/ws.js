
const state = {
  // <channel,<router,function>>
  wsMsgRouter:new Map()
}

const mutations = {
  ADD_WS_ROUTER: (state, routerData) => {
    routerData.routers.forEach(router=>{
      let map = state.wsMsgRouter.get(routerData.channel);
      if(typeof(map)=="undefined"){
        state.wsMsgRouter.set(routerData.channel,new Map().set(router.router,router.function));
      }else{
        map.set(router.router,router.function);
      }
    })
  },
}

const actions = {
  addRouter({ commit }, routerData) {
    return new Promise(() => {
      commit('ADD_WS_ROUTER', routerData)
    })
  },

}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}
