import Vue from 'vue';
import Stomp from "stompjs";


export default {
    stompClient:{},
    connect(){
        let me=this;
        let v=Vue.prototype;
        v.axios.post("http://www.jrsports.com/api/user/websocket/apply", null, {
            headers: {
                "userToken": localStorage.getItem("userToken"),
                "teamToken": sessionStorage.getItem("teamToken")
            }
        }).then(function (response) {
            const serverResponse = response.data;
            // sessionStorage.setItem("wsToken", serverResponse.data);
            // var socket = new SockJS("http://localhost:5266/global");
            var socket=new WebSocket("ws://www.jrsports.com/global?wsToken="+serverResponse.data);
            // var sockets = new SockJS("http://www.jrsports.com/global?wsToken="+serverResponse.data);

            me.stompClient = Stomp.over(socket);

            me.stompClient.connect({}, function(frame) {
                console.log('Connected:' + frame);
                v.$message({
                    message: "连接全局ws成功",
                    type: "success"
                });
                // private channel
                me.stompClient.subscribe("/user/queue/team", function (response) {
                    v.$message({
                        message: response.body,
                        type: "success"
                    });
                    console.log(response.body);
                    let res=JSON.parse(response.body);
                    me.handleOperation(res.operation,res.body);
                });
            },function () {
                //断开处理
                console.log('Info: STOMP connection closed.');
            });

        });

    },
    handleOperation(operation,body){
        if(operation=="我方收到交易请求"){
            console.log(body);
        }
    },
}