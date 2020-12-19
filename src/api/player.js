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