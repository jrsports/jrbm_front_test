import request from '@/utils/request'

export function getDraftList(data) {
    return request({
        url:'/draft/draft/list',
        method:'post',
        data:data
    })
}

export function getDraftTeamList(data) {
    return request({
        url:'/draft/draft/teamList',
        method:'post',
        data:data
    })
}

export function getDraftPlayerList(data) {
    return request({
        url:'/draft/draft/playerList',
        method:'post',
        data:data
    })
}

export function signUpDraft(data) {
    return request({
        url:'/draft/signUp/',
        method:'post',
        data:data
    })
}

export function getDraftRoom(data) {
    return request({
        url:'/draft/pick/room',
        method:'post',
        data:data
    })
}

export function pickPlayer(data) {
    return request({
        url:'/draft/pick/pick',
        method:'post',
        data:data
    })
}


