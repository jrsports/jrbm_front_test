import request from '@/utils/request'

export function getSellPublish(data) {
    return request({
        url:'/trade/sell/getSellPublish',
        method:'post',
        data:data
    })
}

export function publishSell(data) {
    return request({
        url:'/trade/sell/publish',
        method:'post',
        data:data
    })
}

export function getTradable(data) {
    return request({
        url:'/trade/sell/getTradable',
        method:'post',
        data:data
    })
}