import request from '@/utils/request'

export function teamLogin(data) {
    return request({
        url:'/user/team/teamLogin',
        method:'post',
        data:data
    })
}

export function createTeam(data) {
    return request({
        url:'/user/team/createTeam',
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

export function getMyTeamInfo() {
    return request({
        url:'/user/team/getMyTeamInfo',
        method:'post'
    })
}

export function getWsToken() {
    return request({
        url:'/user/websocket/apply',
        method:'post'
    })
}

export function getOtherTeamInfo(data) {
    return request({
        url:'/user/team/getTeamInfo',
        method:'post',
        data:data
    })
}

export function getTradeInfo(data) {
    return request({
        url:'/user/tradeInfo/getTradeInfo',
        method:'post',
        data:data
    })
}

export function getRosterInitializationCandidate(data) {
    return request({
        url:'/user/team/getRosterInitializationCandidate',
        method:'post',
        data:data
    })
}

export function confirmRosterInitialization(data) {
    return request({
        url:'/user/team/confirmRosterInitialization',
        method:'post',
        data:data
    })
}




