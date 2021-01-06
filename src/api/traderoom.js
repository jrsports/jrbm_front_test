import request from '@/utils/request'

export function sendTradeInvitation(data) {
    return request({
        url:'/trade/invitation/createTradeInvitation',
        method:'post',
        data:data
    })
}

export function cancelTradeInvitation() {
    return request({
        url:'/trade/invitation/cancelTradeInvitation',
        method:'post'
    })
}

export function acceptTradeInvitation(data) {
    return request({
        url:'/trade/invitation/acceptTradeInvitation',
        method:'post',
        data:data
    })
}

export function refuseTradeInvitation(data) {
    return request({
        url:'/trade/invitation/refuseTradeInvitation',
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