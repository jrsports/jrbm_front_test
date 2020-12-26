import request from '@/utils/request'

export function getFreePlayerList(data) {
    return request({
        url:'/freemarket/freeMarket/getFreePlayerList',
        method:'post',
        data:data
    })
}

export function getTeamOfferRecordHistory(data) {
    return request({
        url:'/freemarket/offer/getTeamOfferRecordHistory/'+data,
        method:'post'
    })
}

export function addOffer(data) {
    return request({
        url:'/freemarket/offer/addOffer',
        method:'post',
        data:data
    })
}

export function getOfferRecordList(data) {
    return request({
        url:'/freemarket/offer/getOfferRecordList/'+data,
        method:'post'
    })
}

export function getHistory(data) {
    return request({
        url:'/freemarket/freeMarket/getHistory',
        method:'post',
        data:data
    })
}

