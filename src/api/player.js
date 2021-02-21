import request from '@/utils/request'

export function searchBasicPlayer(data) {
    return request({
        url:'/player/basic/search',
        method:'post',
        data:data
    })
}

export function reserve(data) {
    return request({
        url:'/player/userPlayer/reserve',
        method:'post',
        data:data
    })
}

export function promote(data) {
    return request({
        url:'/player/userPlayer/promote',
        method:'post',
        data:data
    })
}

export function dismiss(data) {
    return request({
        url:'/player/userPlayer/dismiss',
        method:'post',
        data:data
    })
}

export function getCurrentPlayerList(data) {
    return request({
        url:'/player/basic/getPlayerRank',
        method:'post',
        data:data
    })
}

export function getUserPlayerDetailList() {
    return request({
        url:'/player/userPlayer/getUserPlayerDetailList',
        method:'post'
    })
}

export function getBasicPlayerDetail(data) {
    return request({
        url:'/player/basic/getBasicPlayerDetail',
        method:'post',
        data:data
    })
}