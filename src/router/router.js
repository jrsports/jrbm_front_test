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
        path: "/myplayerdetail",
        component: () => import('@/views/team/myplayerdetail'),
        meta:{
            needLogin:true
        }
    },

    {
        path: "/accessor",
        component: () => import('@/views/esign/accessor'),
    },
    {
        path: "/accessordetail",
        component: () => import('@/views/esign/accessordetail'),
    },
    {
        path: "/line",
        component: () => import('@/views/esign/line'),
    },
    {
        path: "/linedetail",
        component: () => import('@/views/esign/linedetail'),
    },
    {
        path: "/flow",
        component: () => import('@/views/esign/flow'),
    },
    {
        path: "/flowdetail",
        component: () => import('@/views/esign/flowdetail'),
    },
    {
        path: "/signrecord",
        component: () => import('@/views/esign/signrecord'),
    },
    {
        path: "/signrecorddetail",
        component: () => import('@/views/esign/signrecorddetail'),
    },
    {
        path: "/signer",
        component: () => import('@/views/esign/signer'),
    },
    {
        path: "/signerdetail",
        component: () => import('@/views/esign/signerdetail'),
    },
    {
        path: "/archieve",
        component: () => import('@/views/esign/archieve'),
    },
    {
        path: "/archievedetail",
        component: () => import('@/views/esign/archievedetail'),
    }

];

export default new Router({
    // mode: 'history', //后端支持可开
    scrollBehavior: () => ({y: 0}),
    routes: constantRouterMap
})

