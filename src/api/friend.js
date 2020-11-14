import request from '@/utils/request'

export function getFriendList() {
    return request({
        url:'/user/friend/getFriendList',
        method:'post'
    })
}

export function getMyFriendRequestList() {
    return request({
        url:'/user/friend/getMyFriendRequestList',
        method:'post'
    })
}

export function getOtherFriendRequestList() {
    return request({
        url:'/user/friend/getOtherFriendRequestList',
        method:'post'
    })
}

export function refuseFriendRequest(friendId) {
    return request({
        url:'/user/friend/refuseFriendRequest/'+friendId,
        method:'post'
    })
}

export function acceptFriendRequest(friendId) {
    return request({
        url:'/user/friend/acceptFriendRequest/'+friendId,
        method:'post'
    })
}

export function cancelFriendRequest(friendId) {
    return request({
        url:'/user/friend/cancelFriendRequest/'+friendId,
        method:'post'
    })
}

export function removeFriend(friendId) {
    return request({
        url:'/user/friend/removeFriend/'+friendId,
        method:'post'
    })
}

export function searchFriend(data) {
    return request({
        url:'/user/friend/searchFriend',
        method:'post',
        data:data
    })
}

export function sendFriendRequest(teamId) {
    return request({
        url:'/user/friend/sendFriendRequest/'+teamId,
        method:'post'
    })
}


