import request from '@/utils/request'

export function getFreePlayerList(data) {
    return request({
        url:'/freemarket/freeMarket/getFreePlayerList',
        method:'post',
        data:data
    })
}