import request from '@/utils/request'

export function getSellPublish(data) {
    return request({
        url:'/trade/sell/getSellPublish',
        method:'post',
        data:data
    })
}

export function getMySellPublish(data) {
    return request({
        url:'/trade/sell/getMySellPublish',
        method:'post',
        data:data
    })
}

export function getHistorySellPublish(data) {
    return request({
        url:'/trade/sell/getHistorySellPublish',
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

export function cancelSell(data) {
    return request({
        url:'/trade/sell/cancel',
        method:'post',
        data:data
    })
}

export function buySell(data) {
    return request({
        url:'/trade/sell/buy',
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


export function getPurchasePublish(data) {
    return request({
        url:'/trade/purchase/getPurchasePublish',
        method:'post',
        data:data
    })
}

export function publishPurchase(data) {
    return request({
        url:'/trade/purchase/publish',
        method:'post',
        data:data
    })
}

export function sellPurchase(data) {
    return request({
        url:'/trade/purchase/sell',
        method:'post',
        data:data
    })
}

export function cancelPurchase(data) {
    return request({
        url:'/trade/purchase/cancel',
        method:'post',
        data:data
    })
}

export function getMyPurchasePublish(data) {
    return request({
        url:'/trade/purchase/getMyPurchasePublish',
        method:'post',
        data:data
    })
}