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
            startMatchMaking(){ //初始化weosocket
                const url = "ws://www.jrsports.com/api/matchmaking/matchmaking?tid=1";
                // const url = "ws://localhost:9999/matchmaking?tid=1";
                this.websock = new WebSocket(url);
                this.websock.onmessage = this.websocketonmessage;
                this.websock.onopen = this.websocketonopen;
                this.websock.onerror = this.websocketonerror;
                this.websock.onclose = this.websocketclose;
            },
            websocketonopen(){ //连接建立之后执行send方法发送数据
                // this.websocketsend(this.user)
                // console.log(111);
            },
            websocketonerror(){//连接建立失败重连
                this.initWebSocket()
            },
            websocketonmessage(e){
                let _this = this //数据接收
                if (e.data == '连接成功') {//这个判断是我业务需求才加的
                    return
                }
                //业务需求，将socket接收到的值存进vuex
                _this.$store.store.dispatch('RESET_ID') //先调用reset方法置空vuex > store里面的scorketId（为什么置空，下面标题3解释）
                _this.$store.store.dispatch('SAVE_ID', JSON.parse(e.data).areaId) //重新给store中的scorketId赋值（数据格式问题先转了json）
                // console.log(_this.$store.store.state.scorketId);
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