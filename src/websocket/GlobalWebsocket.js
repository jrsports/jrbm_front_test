import {getWsToken} from "@/api/team";
import {Message,Notification} from "element-ui";
import Stomp from "stompjs";
import store from '@/store'

export default {
    stompClient: null,
    connect() {
        getWsToken().then(res => {
            const me = this;
            if (res.code === 0) {
                const wsToken = res.data;
                const socket = new WebSocket("ws://www.jrsports.com/global?wsToken=" + wsToken);
                this.stompClient = Stomp.over(socket);
                this.stompClient.connect({}, function (frame) {
                    console.log('Connected:' + frame);
                    Message({
                        message: "成功连接到JRBM服务器",
                        type: "success"
                    });
                    me.stompClient.subscribe("/user/queue/team", function (response) {
                        console.log("收到个人消息："+response.body);
                        let res = JSON.parse(response.body);
                        // 分发消息
                        me.dispatchMessage(res);
                        me.handleOperation(res.operation, res.body);
                    });
                }, function () {
                    //断开处理
                    console.log('Info: STOMP connection closed.');
                });
            }
        })
    },
    disconnect() {
        if (this.stompClient) {
            this.stompClient.disconnect();
        }
    },
    handleOperation(operation, body) {
        if(operation=="收到通知"){
            Notification({
                title: body.title,
                message: body.content
            })
        }
    },
    dispatchMessage(msg){
        let route="/"+msg.serviceRegistry+"/"+msg.scene+"/"+msg.operation;
        console.log(store.getters.wsMsgRouter)
        store.getters.wsMsgRouter.get(route)(msg.body);
    }
}