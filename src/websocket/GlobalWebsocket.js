import {getWsToken} from "@/api/team";
import {Message} from "element-ui";
import Stomp from "stompjs";
import store from '@/store'

export default {
    stompClient: null,
    isConnected:false,
    subscription:new Map(),
    connect() {
        getWsToken().then(res => {
            const me = this;
            if (res.code === 0) {
                const wsToken = res.data;
                const socket = new WebSocket("ws://www.jrsports.com/global?wsToken=" + wsToken);
                this.stompClient = Stomp.over(socket);
                this.stompClient.connect({}, function () {
                    // console.log('Connected:' + frame);
                    console.log("成功连接到JRBM服务器");
                    me.isConnected=true;
                    Message({
                        message: "成功连接到JRBM服务器",
                        type: "success"
                    });
                    // 连接成功后订阅私人频道
                    me.subscribe("/user/queue/team");
                }, function () {
                    //断开处理
                    console.log('Info: STOMP connection closed.');
                });
            }
        })
    },
    subscribe(channel){
        let me=this;
        // 可能存在还未连接到服务器就订阅，因此这里延迟等待连接，直到连接成功再订阅
        let timer=setInterval(function () {
            if(me.isConnected){
                me.doSubscribe(channel);
                clearInterval(timer);
            }else{
                console.log("ws连接还未构建，等待500ms")
            }
        },500);
    },
    doSubscribe(channel){
        let me=this;
        let subs=this.stompClient.subscribe(channel, function (response) {
            console.log("channel["+channel+"]收到消息["+response.body+"]");
            let res = JSON.parse(response.body);
            // 分发消息
            me.dispatchMessage(channel,res);
        });
        this.subscription.set(channel,subs);
    },
    unsubscribe(channel){
        console.log("unsub",this.subscription.get(channel));
        // this.subscription.get(channel).unsubscribe();
        this.stompClient.unsubscribe(channel)

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