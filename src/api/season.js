import request from '@/utils/request'

export function signUp(data) {
    return request({
        url:'/season/signUp/',
        method:'post',
        data:data
    })
}

export function getSignUpStatus() {
    return request({
        url:'/season/signUp/getSeasonStatus',
        method:'post'
    })
}

export function getMySchedule(data) {
    return request({
        url:'/season/schedule/getMySchedule',
        method:'post',
        data:data
    })
}

export function getSchedule(data) {
    return request({
        url:'/season/schedule/getSchedule',
        method:'post',
        data:data
    })
}

export function getMyTodaySchedule(data) {
    return request({
        url:'/season/schedule/getMyTodaySchedule',
        method:'post',
        data:data
    })
}

export function getPlayOffView(data) {
    return request({
        url:'/season/schedule/getPlayOffView',
        method:'post',
        data:data
    })
}

export function getSeasonStatsRank(data) {
    return request({
        url:'/season/stats/getTeamStatsRank',
        method:'post',
        data:data
    })
}

export function getSeasonPlayerStatsRank(data) {
    return request({
        url:'/season/stats/getPlayerStatsRank',
        method:'post',
        data:data
    })
}



export function getTeamRank(data) {
    return request({
        url:'/season/stats/getTeamRank/' + data,
        method:'post'
    })
}

export function getSignableSeason() {
    return request({
        url:'/season/signUp/getSignableSeason',
        method:'post'
    })
}

export function getPlayingSeason() {
    return request({
        url:'/season/signUp/getPlayingSeason',
        method:'post'
    })
}

