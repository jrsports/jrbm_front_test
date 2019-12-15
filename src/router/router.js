import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

export const constantRouterMap = [
    {
        path:"/",
        component: () => import('@/views/home/index'),
        meta:{
            needLogin:false
        }
    },
    {
        path: "/myteam",
        component: () => import('@/views/team/myteam'),
        meta:{
            needLogin:true
        }
    },{
        path: "/myprofile",
        component:()=> import('@/views/profile/myprofile'),
        meta:{
            needLogin:true
        }
    }
]

export default new Router({
    // mode: 'history', //后端支持可开
    scrollBehavior: () => ({y: 0}),
    routes: constantRouterMap
})

