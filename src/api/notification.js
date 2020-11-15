import request from '@/utils/request'

export function getNotificationList(data) {
    return request({
        url:'/user/notification/list',
        method:'post',
        data:data
    })
}


export function readNotification(noteId) {
    return request({
        url:'/user/notification/read/'+noteId,
        method:'post'
    })
}


