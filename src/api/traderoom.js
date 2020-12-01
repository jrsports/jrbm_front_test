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

export function addChip(data) {
    return request({
        url:'/trade/room/addChip',
        method:'post',
        data:data
    })
}

export function removeChip(data) {
    return request({
        url:'/trade/room/removeChip',
        method:'post',
        data:data
    })
}

export function info() {
    return request({
        url:'/trade/room/info',
        method:'post'
    })
}

export function submit(data) {
    return request({
        url:'/trade/room/submit',
        method:'post',
        data:data
    })
}

export function confirm() {
    return request({
        url:'/trade/room/confirm',
        method:'post'
    })
}