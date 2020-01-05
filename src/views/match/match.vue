<template>
    <el-container>
        <el-header>
            <el-menu mode="horizontal" style="text-align: right">
                <el-submenu index="1">
                    <template slot="title">欢迎{{teamName}}</template>
                    <el-menu-item index="2-1">我的账户</el-menu-item>
                    <el-menu-item index="2-2">充值</el-menu-item>
                    <el-menu-item index="2-3">设置</el-menu-item>
                </el-submenu>
            </el-menu>
        </el-header>
        <el-container>
            <el-aside width="200px">
                <sidebar></sidebar>
            </el-aside>
            <el-container>
                <el-main>
                    <el-button @click="startMatchMaking">开始匹配</el-button>
                </el-main>
            </el-container>
        </el-container>
    </el-container>
</template>

<script>
    import Sidebar from "@/views/layout/sidebar/sidebar";
    import axios from "axios";
    export default {
        name: "match",
        components: {Sidebar},
        mounted() {
            const me = this;
            //初始化时加载球队信息
            axios.post("http://www.jrsports.com/api/user/team/getTeamInfo", null, {
                headers: {
                    "userToken": localStorage.getItem("userToken"),
                    "teamToken": localStorage.getItem("teamToken")
                }
            }).then(function (response) {
                const teamInfoResponse = response.data;
                if (teamInfoResponse.code === 0) {
                    console.log(teamInfoResponse);
                    me.teamName = teamInfoResponse.data.teamName;
                } else {
                    alert(teamInfoResponse.message);
                }
            }).catch(function (error) {
                alert(error);
            });
        },
        data() {
            return {
                teamName: "null",
            }
        },
        methods:{
            async startMatchMaking(){ //连接websocket
                await this.applyWsToken();
                const wsToken=localStorage.getItem("wsToken")
                const url = "ws://www.jrsports.com/api/matchmaking/matchmaking?wsToken="+wsToken;
                // const url = "ws://localhost:9999/matchmaking?tid=1";
                this.websock = new WebSocket(url);
                this.websock.onmessage = this.websocketonmessage;
                this.websock.onopen = this.websocketonopen;
                this.websock.onerror = this.websocketonerror;
                this.websock.onclose = this.websocketclose;
            },
            applyWsToken(){
                axios.post("http://www.jrsports.com/api/user/websocket/apply", null, {
                    headers: {
                        "userToken": localStorage.getItem("userToken"),
                        "teamToken": localStorage.getItem("teamToken")
                    }
                }).then(function (response) {
                    const serverResponse = response.data;
                    if(serverResponse.code==0){
                       localStorage.setItem("wsToken",serverResponse.data);
                    }else{
                        alert(serverResponse.msg);
                    }

                }).catch(function (error) {
                    alert(error);
                });
            },
            websocketonopen(){ //连接建立之后执行send方法发送数据
                // this.websocketsend(this.user)
                // console.log(111);
            },
            websocketonerror(){//连接建立失败重连
                this.$message({
                    message:"连接异常，正在重连",
                    type:"error"
                });
                this.initWebSocket()
            },
            websocketonmessage(msg){
                const me=this;
                const response=JSON.parse(msg);
                if(response.code==0){
                    me.$message({
                        message:response.msg,
                        type:"info"
                    });
                }else{
                    me.$message({
                        message:"服务器出错",
                        type:"error"
                    });
                }
            },
            websocketsend(Data){//数据发送
                this.websock.send(Data)
            },
            websocketclose(e){  //关闭
                console.log('断开连接', e)
            }
        }
    }
</script>

<style scoped>

</style>