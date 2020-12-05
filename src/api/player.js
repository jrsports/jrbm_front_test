import request from '@/utils/request'

export function searchBasicPlayer(data) {
    return request({
        url:'/player/basic/search',
        method:'post',
        data:data
    })
}