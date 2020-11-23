import request from '@/utils/request'

export function sendTradeRequest(data) {
    return request({
        url:'/trade/trade/createTradeRequest',
        method:'post',
        data:data
    })
}

export function cancelTradeRequest() {
    return request({
        url:'/trade/trade/cancelTradeRequest',
        method:'post'
    })
}

export function acceptTradeRequest(data) {
    return request({
        url:'/trade/trade/acceptTradeRequest',
        method:'post',
        data:data
    })
}

export function refuseTradeRequest(data) {
    return request({
        url:'/trade/trade/refuseTradeRequest',
        method:'post',
        data:data
    })
}

