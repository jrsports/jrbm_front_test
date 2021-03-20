import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router);

export const constantRouterMap = [
    {
        path:"/",
        component: () => import('@/views/home/index'),
        meta:{
            needLogin:false,
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
    },
    {
        path: "/draft",
        component: () => import('@/views/draft/draft'),
        meta:{
            needLogin:true
        }
    },
    {
        path: "/match",
        component: () => import('@/views/match/match'),
        meta:{
            needLogin:true
        }
    },
    {
        path: "/season",
        component: () => import('@/views/match/season'),
        meta:{
            needLogin:true
        }
    },
    {
        path: "/matchLive",
        component: () => import('@/views/match/matchlive'),
        meta:{
            needLogin:true
        }
    },
    {
        path: "/freemarket",
        component: () => import('@/views/freemarket/freemarket'),
        meta:{
            needLogin:true
        }
    },
    {
        path: "/sign",
        component: () => import('@/views/sign/sign'),
        meta:{
            needLogin:true
        }
    },
    {
        path: "/currentplayer",
        component: () => import('@/views/playercenter/currentplayer'),
        meta:{
            needLogin:true
        }
    },
    {
        path: "/trade",
        component: () => import('@/views/trade/trade'),
        meta:{
            needLogin:true
        }
    },
    {
        path: "/matchrecord",
        component: () => import('@/views/match/matchrecord'),
        meta:{
            needLogin:true
        }
    },
    {
        path: "/rosterInit",
        component: () => import('@/views/team/rosterInit'),
        meta:{
            needLogin:true
        }
    }

];

export default new Router({
    // mode: 'history', //后端支持可开
    scrollBehavior: () => ({y: 0}),
    routes: constantRouterMap
})

