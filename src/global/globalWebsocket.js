import Vue from 'vue'
import router from '../router/router'

var friendList = [];
var chatMsgRecord = [];
export default {
    ws: {},
    drawerVisible: false,
    heartBeatTimer:{},
    friendList: function () {
        return friendList;
    },
    setFriendList:function(list){
      friendList=list;
    },
    chatMsgRecord: function () {
        return chatMsgRecord;
    },
    pushMsgRecord:function (j) {
        chatMsgRecord.push(j);
    },
    increaseUnRead(friendTeamId){
        friendList.forEach(function (item) {
            if(item.friendTeamId==friendTeamId){
                item.unRead++;
            }

        });
    },
    resetUnRead(friendTeamId){
        friendList.forEach(function (item) {
            if(item.friendTeamId==friendTeamId){
                item.unRead=0;
            }

        });
    },
    async connectToGlobalServer() {
        const me = this;
        await this.applyWsToken();
        const wsToken = sessionStorage.getItem("wsToken");
        if ("WebSocket" in window) {
            const url = "ws://www.jrsports.com/api/ws/global/global?wsToken=" + wsToken;
            this.ws = new WebSocket(url);
        } else {
            // 浏览器不支持 WebSocket
            console.log("您的浏览器不支持 WebSocket!");
        }
        this.ws.onopen = function () {
            me.handleGlobalWs();
            me.startHeartBeat();
        };
    },
    async applyWsToken() {
        await Vue.prototype.axios.post("http://www.jrsports.com/api/user/websocket/apply", null, {
            headers: {
                "userToken": localStorage.getItem("userToken"),
                "teamToken": sessionStorage.getItem("teamToken")
            }
        }).then(function (response) {
            const serverResponse = response.data;
            if (serverResponse.code == 0) {
                sessionStorage.setItem("wsToken", serverResponse.data);
            } else {
                alert(serverResponse.msg);
            }

        });
    },
    startHeartBeat() {
        const me = this;
        this.heartBeatTimer=setInterval(function () {
            me.ws.send(JSON.stringify({type: -100, time: new Date().getTime()}))
        }, 3000);
    },
    stopHeartBeat(){

    },
    handleGlobalWs() {
        const me = Vue.prototype;
        const that = this;
        this.ws.onmessage = function (msg) {
            const response = JSON.parse(msg.data);
            if (response.type == 22) {
                //直接展示通知即可
                const message = JSON.parse(response.message);
                me.$notify.info({
                    title: message.title,
                    message: message.content
                });
            } else if (response.type == 23) {
                //球队下线
                const message = JSON.parse(response.message);
                const offlineTeamId = message.data;
                console.log("您的好友已下线" + offlineTeamId);
                friendList.forEach(function (item) {
                    if (item.friendTeamId == offlineTeamId) {
                        item.online = false;
                    }
                });
            } else if (response.type == 24) {
                //球队上线
                const message = JSON.parse(response.message);
                const offlineTeamId = message.data;
                console.log("您的好友已上线" + offlineTeamId);
                friendList.forEach(function (item) {
                    if (item.friendTeamId == offlineTeamId) {
                        item.online = true;
                    }
                });

            } else if(response.type==25){
                //异常掉线
                // const message = JSON.parse(response.message);
                me.$alert('您的球队被强制下线，请注意账号安全', '强制下线', {
                    confirmButtonText: '确定',
                    // eslint-disable-next-line no-unused-vars
                    callback: action => {
                        router.push('/');
                    }
                });

            } else if (response.type == 100) {
                //好友聊天消息
                that.pushMsgRecord(response);
                that.increaseUnRead(response.fromTeamId);
                console.log(that.chatMsgRecord);
            } else {
                me.$message({
                    message: response.message,
                    type: "success"
                });
            }

        };
    },
    async refreshTeamToken() {
        const me = this;
        await Vue.prototype.axios.post("http://www.jrsports.com/api/user/team/refreshTeamToken", null, {
            headers: {
                "userToken": localStorage.getItem("userToken"),
                "teamToken": sessionStorage.getItem("teamToken"),
                "refresh": true
            }
        }).then(function (response) {
            const loginResponse = response.data;
            if (loginResponse.code === 0) {
                console.log("更新teamToken");
                sessionStorage.setItem("teamToken", loginResponse.teamToken);
            } else {
                me.$message({
                    message: loginResponse.msg,
                    type: "error"
                });
            }
        });
    },
}
