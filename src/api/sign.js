import request from '@/utils/request'

export function getUnsignedContractList(data) {
    return request({
        url:'/sign/sign/getUnsignedContractList',
        method:'post',
        data:data
    })
}

export function getSignContractList(data) {
    return request({
        url:'/sign/sign/getSignContractList',
        method:'post',
        data:data
    })
}

export function signContract(data) {
    return request({
        url:'/sign/sign/signContract',
        method:'post',
        data:data
    })
}

export function refuseContract(data) {
    return request({
        url:'/sign/sign/refuseContract',
        method:'post',
        data:data
    })
}

export function getSignFlow(flowId) {
    return request({
        url:'/sign/offerFlow/getOfferFlow/'+flowId,
        method:'post'
    })
}

export function getNegotiationList(data) {
    return request({
        url:'/sign/negotiation/list',
        data:data,
        method:'post'
    })
}

export function negotiate(data) {
    return request({
        url:'/sign/negotiation/negotiate',
        data:data,
        method:'post'
    })
}
