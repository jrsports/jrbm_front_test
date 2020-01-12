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
                    <el-button @click="startMatchMaking" v-if="startBtnVisible">开始匹配</el-button>
                    <el-button @click="cancelMatchMaking" v-if="cancelBtnVisible">取消匹配</el-button>
                </el-main>


                <el-dialog title="比赛确认" :visible.sync="matchConfirmDialogVisible" width="30%">
                   <el-button type="success" style="width: 100%" @click="confirmMatch">确认</el-button>
                </el-dialog>

                <el-dialog title="比赛直播" :visible.sync="matchLiveDialogVisible" width="60%">
                    <h3>{{scores}}</h3>
                    <ul class="infinite-list" style="height: 500px;overflow-y:scroll;">
                        <li v-for="i in liveContent" :key="i" style="list-style-type:none;">{{ i }}</li>
                    </ul>
                    <el-table ref="statTable" :data="stats">
                        <el-table-column property="order" label="球员序号"></el-table-column>
                        <el-table-column property="chname" label="姓名" ></el-table-column>
                        <el-table-column property="time" label="上场时间" ></el-table-column>
                        <el-table-column property="score" label="得分" ></el-table-column>
                        <el-table-column property="rebound" label="篮板" ></el-table-column>
                        <el-table-column property="assist" label="助攻" ></el-table-column>
                        <el-table-column property="steal" label="抢断" ></el-table-column>
                        <el-table-column property="turnover" label="失误" ></el-table-column>
                        <el-table-column property="block" label="盖帽" ></el-table-column>
                        <el-table-column property="beBlocked" label="被盖" ></el-table-column>
                        <el-table-column property="foul" label="犯规" ></el-table-column>
                        <el-table-column property="totalAttempt" label="总出手数" ></el-table-column>
                        <el-table-column property="totalIn" label="总命中数" ></el-table-column>
                        <el-table-column property="threeAttempt" label="三分出手" ></el-table-column>
                        <el-table-column property="threeIn" label="三分命中" ></el-table-column>

                        <!--                <el-table-column label="进入游戏">-->
                        <!--                    <template slot-scope="scope">-->
                        <!--                        <el-button @click="getGamePage(scope.row)">进入游戏</el-button>-->
                        <!--                    </template>-->

                        <!--                </el-table-column>-->
                    </el-table>
                </el-dialog>

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
                matchConfirmDialogVisible: false,
                startBtnVisible:true,
                cancelBtnVisible:false,
                matchLiveDialogVisible:false,
                matchId:-1,
                liveContent:["比赛直播开始"],
                scores:"",
                stats:[{

                }]
            }
        },
        methods: {
            async startMatchMaking() { //连接websocket
                await this.applyWsToken();
                const wsToken = localStorage.getItem("wsToken")
                const url = "ws://www.jrsports.com/api/matchmaking/matchmaking?wsToken=" + wsToken;
                // const url = "ws://localhost:9999/matchmaking?tid=1";
                this.websock = new WebSocket(url);
                this.websock.onmessage = this.websocketonmessage;
                this.websock.onopen = this.websocketonopen;
                this.websock.onerror = this.websocketonerror;
                this.websock.onclose = this.websocketclose;
            },
            async matchLive() { //连接websocket
                await this.applyWsToken();
                const wsToken = localStorage.getItem("wsToken")
                const url = "ws://www.jrsports.com/api/matchserver/matchlive?wsToken=" + wsToken+"&matchId="+this.matchId;
                this.websock = new WebSocket(url);
                this.websock.onmessage = this.websocketonmessage;
                this.websock.onopen = this.websocketonopen;
                this.websock.onerror = this.websocketonerror;
                this.websock.onclose = this.websocketclose;
            },
            applyWsToken() {
                axios.post("http://www.jrsports.com/api/user/websocket/apply", null, {
                    headers: {
                        "userToken": localStorage.getItem("userToken"),
                        "teamToken": localStorage.getItem("teamToken")
                    }
                }).then(function (response) {
                    const serverResponse = response.data;
                    if (serverResponse.code == 0) {
                        localStorage.setItem("wsToken", serverResponse.data);
                    } else {
                        alert(serverResponse.msg);
                    }

                }).catch(function (error) {
                    alert(error);
                });
            },
            confirmMatch(){
               this.websocketsend("confirm");
            },
            cancelMatchMaking(){
               this.websocketsend("stop");
            },
            websocketonopen() { //连接建立之后执行send方法发送数据

            },
            websocketonerror() {//连接建立失败重连
                this.$message({
                    message: "连接异常，正在重连",
                    type: "error"
                });
                this.initWebSocket()
            },
            websocketonmessage(msg) {
                const me = this;
                const response = JSON.parse(msg.data);
                if (response.code == 0) {
                    if(response.type==0){
                        //加入匹配池成功
                        this.startBtnVisible=false;
                        this.cancelBtnVisible=true;
                        me.$message({
                            message:response.message,
                            type: "success"
                        });
                    }else if(response.type==1){
                        //匹配到对手
                        this.matchConfirmDialogVisible=true;
                        me.$message({
                            message:response.message,
                            type: "success"
                        });
                    }else if(response.type==3){
                       //双方都确认
                        me.$message({
                            message:response.message,
                            type: "success"
                        });
                        this.cancelBtnVisible=false;
                        this.matchLiveDialogVisible=true;
                        this.matchConfirmDialogVisible=false;
                        // this.websock.close();
                    } else if(response.type==8) {
                        this.matchId=response.data;
                        this.matchLive();
                    } else if(response.type==16){
                        //取消匹配成功
                        this.startBtnVisible=true;
                        this.cancelBtnVisible=false;
                        me.$message({
                            message:response.message,
                            type: "success"
                        });
                    } else if(response.type==99){
                        var d=response.data;
                        //比赛直播
                        this.liveContent.unshift(d.message);
                        this.scores=d.homeStats.score+":"+d.awayStats.score;
                        this.stats=d.stats;
                    }else{
                        me.$message({
                            message:response.message,
                            type: "success"
                        });
                    }
                } else {
                    me.$message({
                        message: "服务器出错",
                        type: "error"
                    });
                }
            },
            websocketsend(Data) {//数据发送
                this.websock.send(Data)
            },
            websocketclose(e) {  //关闭
                console.log('断开连接', e)
            }
        }
    }
</script>

<style scoped>

</style>