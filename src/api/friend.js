import request from '@/utils/request'

export function getFriendList() {
    return request({
        url:'/user/friend/getFriendList',
        method:'post'
    })
}
