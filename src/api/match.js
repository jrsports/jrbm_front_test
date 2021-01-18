import request from '@/utils/request'

export function sendFriendMatchInvitation(data) {
    return request({
        url:'/matchserver/friendMatch/createFriendMatchInvitation',
        method:'post',
        data:data
    })
}

export function cancelFriendMatchInvitation() {
    return request({
        url:'/matchserver/friendMatch/cancelFriendMatchInvitation',
        method:'post'
    })
}

export function acceptFriendMatchInvitation(data) {
    return request({
        url:'/matchserver/friendMatch/acceptFriendMatchInvitation',
        method:'post',
        data:data
    })
}

export function refuseFriendMatchInvitation(data) {
    return request({
        url:'/matchserver/friendMatch/refuseFriendMatchInvitation',
        method:'post',
        data:data
    })
}

export function applyTicket(data) {
    return request({
        url:'/matchserver/ticket/apply/'+data,
        method:'post'
    })
}
