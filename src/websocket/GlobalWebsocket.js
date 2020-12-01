import {getWsToken} from "@/api/team";
import {Message} from "element-ui";
import Stomp from "stompjs";
import store from '@/store'

export default {
    stompClient: null,
    connect(channel) {
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
                    me.stompClient.subscribe(channel, function (response) {
                        console.log("channel["+channel+"]收到消息["+response.body+"]");
                        let res = JSON.parse(response.body);
                        // 分发消息
                        me.dispatchMessage(channel,res);
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
    dispatchMessage(channel,msg){
        let route="/"+msg.serviceRegistry+"/"+msg.scene+"/"+msg.operation;
        store.getters.wsMsgRouter.get(channel).get(route)(msg.body);
    }
}