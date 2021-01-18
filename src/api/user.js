import request from '@/utils/request'

export function userLogin(data) {
    return request({
        url:'/user/user/userLogin',
        method:'post',
        data:data
    })
}

export function getTeamList() {
    return request({
        url:'/user/user/getTeamList',
        method:'post'
    })
}

export function applyWsToken() {
    return request({
        url:'/user/websocket/apply',
        method:'post'
    })
}