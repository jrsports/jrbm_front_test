import request from '@/utils/request'

export function teamLogin(data) {
    return request({
        url:'/user/team/teamLogin',
        method:'post',
        data:data
    })
}

export function getLineUp() {
    return request({
        url:'/user/team/getLineUp',
        method:'post'
    })
}

export function getPlayerDetail(upId) {
    return request({
        url:'/player/userPlayer/getUserPlayerDetail/' + upId,
        method:'post'
    })
}

export function substitute(data) {
    return request({
        url:'/player/userPlayer/substitute',
        method:'post',
        data:data
    })
}