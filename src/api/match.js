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

export function getMatchRecordList(data) {
    return request({
        url:'/matchserver/match/recordList',
        method:'post',
        data:data
    })
}

export function viewStats(data) {
    return request({
        url:'/matchserver/match/getMatchDetailInfo/' + data,
        method:'post'
    })
}

export function startMatching() {
    return request({
        url:'/matchserver/rankMatch/startMatching',
        method:'post'
    })
}

export function cancelMatching() {
    return request({
        url:'/matchserver/rankMatch/cancelMatching',
        method:'post'
    })
}

export function getRankNearby() {
    return request({
        url:'/matchserver/rankMatch/getRankNearby',
        method:'post'
    })
}

export function getMatchingInfo() {
    return request({
        url:'/matchserver/rankMatch/getMatchingInfo',
        method:'post'
    })
}

export function getTeamStats() {
    return request({
        url:'/matchserver/rankMatch/getTeamStats',
        method:'post'
    })
}

export function getMatchingTeamCount() {
    return request({
        url:'/matchserver/rankMatch/getMatchingTeamCount',
        method:'post'
    })
}

export function getRank(data) {
    return request({
        url:'/matchserver/rankMatch/getRank',
        method:'post',
        data:data
    })
}