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
        url:'/player/player/ops/reserve',
        method:'post',
        data:data
    })
}

export function promote(data) {
    return request({
        url:'/player/player/ops/promote',
        method:'post',
        data:data
    })
}

export function dismiss(data) {
    return request({
        url:'/player/player/ops/dismiss',
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

export function getBasicPlayerDetail(data) {
    return request({
        url:'/player/basic/getBasicPlayerDetail',
        method:'post',
        data:data
    })
}