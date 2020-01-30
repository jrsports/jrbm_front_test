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
                    <el-card class="box-card" v-if="ongoingmatchVisible">
                        <div slot="header" class="clearfix">
                            <span>正在进行的比赛</span>
                            <el-button style="float: right; padding: 3px 0" type="text" @click="enterLive">进入比赛</el-button>
                        </div>
                        <div style="text-align:center">
                            主队-{{homeTeamName}} vs 客队-{{awayTeamName}}
                        </div>
                    </el-card>
                </el-main>


                <el-dialog title="比赛确认" :visible.sync="matchConfirmDialogVisible" close-on-click-modal=false width="30%">
                   <el-button type="success" v-if="matchConfirmBtnVisible" style="width: 100%" @click="confirmMatch" >确认</el-button>
                    <h3 v-if="ifConfirmed" style="text-align: center">已确认</h3>
                </el-dialog>

                <el-dialog title="比赛直播" :visible.sync="matchLiveDialogVisible" close-on-click-modal=false width="100%" @close="quitLive">
                    <h3>{{scores}}{{matchTime}}</h3>
                    <ul class="infinite-list" style="height: 500px;overflow-y:scroll;">
                        <li v-for="i in liveContent" :key="i" style="list-style-type:none;">{{ i }}</li>
                    </ul>
                    <el-table ref="statTable" :data="stats" :row-class-name="onCourt">
                        <el-table-column property="order" label="球员序号"></el-table-column>
                        <el-table-column property="chname" label="姓名" ></el-table-column>
                        <el-table-column property="timeMinutes" label="上场时间" ></el-table-column>
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
                        <el-table-column property="freeThrowAttempt" label="罚球出手" ></el-table-column>
                        <el-table-column property="freeThrowIn" label="罚球命中" ></el-table-column>


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
    var onCourtPlayers;
    export default {
        name: "match",
        components: {Sidebar},
        mounted() {
            this.iniTeam();
            this.getOngoingMatch();
        },
        data() {
            return {
                teamName: "null",
                matchConfirmDialogVisible: false,
                startBtnVisible:false,
                cancelBtnVisible:false,
                matchLiveDialogVisible:false,
                matchConfirmBtnVisible:true,
                ongoingmatchVisible:false,
                ifConfirmed:false,
                matchId:-1,
                ticket:"",
                liveContent:["比赛直播即将开始"],
                scores:"",
                stats:[{

                }],
                matchTime:"",
                homeTeamName:"",
                awayTeamName:""
            }
        },
        methods: {
            iniTeam(){
                const me = this;
                //初始化时加载球队信息
                axios.post("http://www.jrsports.com/api/user/team/getTeamInfo", null, {
                    headers: {
                        "userToken": sessionStorage.getItem("userToken"),
                        "teamToken": sessionStorage.getItem("teamToken")
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
            getOngoingMatch(){
                const me = this;
                //初始化时加载球队信息
                axios.post("http://www.jrsports.com/api/matchserver/match/getOngoingMatch", null, {
                    headers: {
                        "userToken": sessionStorage.getItem("userToken"),
                        "teamToken": sessionStorage.getItem("teamToken")
                    }
                }).then(function (response) {
                    const ongoingResponse = response.data;
                    if (ongoingResponse.code === 0) {
                        if(ongoingResponse.data==null){
                            //无正在进行比赛，可以匹配
                            me.startBtnVisible=true;
                        }else{
                            //展示比赛简要信息
                            me.ongoingmatchVisible=true;
                            me.homeTeamName=ongoingResponse.data.homeTeamName;
                            me.awayTeamName=ongoingResponse.data.awayTeamName;
                            me.matchId=ongoingResponse.data.matchId;
                        }
                    } else {
                        alert(ongoingResponse.message);
                    }
                }).catch(function (error) {
                    alert(error);
                });
            },
            enterLive(){
                this.matchLiveDialogVisible=true;
                this.matchLive(this.matchId);
            },
            quitLive(){
                console.log("close dialog");
                this.websock.close();
            },
            async startMatchMaking() { //连接websocket
                await this.applyWsToken();
                const wsToken = sessionStorage.getItem("wsToken");
                const url = "ws://www.jrsports.com/api/ws/matchmaking/matchmaking?wsToken=" + wsToken;
                this.websock = new WebSocket(url);
                this.websock.onmessage = this.websocketonmessage;
                this.websock.onopen = this.websocketonopen;
                this.websock.onerror = this.websocketonerror;
                this.websock.onclose = this.websocketclose;
            },
             async matchLive(matchId) { //连接websocket
                await this.applyWsToken();
                await this.applyTicket(matchId);
                const wsToken = sessionStorage.getItem("wsToken");
                const url = "ws://www.jrsports.com/api/ws/matchserver/matchlive?ticket="+this.ticket+"&wsToken="+wsToken;
                this.websock = new WebSocket(url);
                this.websock.onmessage = this.websocketonmessage;
                this.websock.onopen = this.websocketonopen;
                this.websock.onerror = this.websocketonerror;
                this.websock.onclose = this.websocketclose;
            },
            async applyWsToken() {
                await axios.post("http://www.jrsports.com/api/user/websocket/apply", null, {
                    headers: {
                        "userToken": sessionStorage.getItem("userToken"),
                        "teamToken": sessionStorage.getItem("teamToken")
                    }
                }).then(function (response) {
                    const serverResponse = response.data;
                    if (serverResponse.code == 0) {
                        sessionStorage.setItem("wsToken", serverResponse.data);
                    } else {
                        alert(serverResponse.msg);
                    }

                }).catch(function (error) {
                    alert(error);
                });
            },
            async applyTicket(matchId){
                const me=this;
                await axios.get("http://www.jrsports.com/api/matchserver/ticket/apply?matchId="+matchId, {
                    headers: {
                        "userToken": sessionStorage.getItem("userToken"),
                        "teamToken": sessionStorage.getItem("teamToken")
                    }
                }).then(function (response) {
                    const serverResponse = response.data;
                    if (serverResponse.code == 0) {
                        me.ticket=serverResponse.data;
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
            onCourt({rowIndex}){
                for(var i of onCourtPlayers){
                    if(rowIndex==i){
                        return 'success-row';
                    }
                }
                return '';
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
                        this.cancelBtnVisible=false;
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
                        this.matchLiveDialogVisible=true;
                        this.matchConfirmDialogVisible=false;
                        // this.ongoingmatchVisible=true;
                        // this.websock.close();
                    } else if(response.type==5){
                        //本方确认成功
                        this.matchConfirmBtnVisible=false;
                        this.ifConfirmed=true;
                        me.$message({
                            message:response.message,
                            type: "success"
                        });
                    }else if(response.type==8) {
                        //比赛创建
                        this.matchLive(response.data);
                    } else if(response.type==16){
                        //取消匹配成功
                        this.startBtnVisible=true;
                        this.cancelBtnVisible=false;
                        me.$message({
                            message:response.message,
                            type: "success"
                        });
                    } else if(response.type==99){
                        const d = response.data;
                        //比赛直播
                        this.liveContent.unshift(d.message);
                        this.scores=d.homeStats.score+":"+d.awayStats.score;
                        this.stats=d.stats;
                        onCourtPlayers=d.onCourtPlayers;
                        console.log(onCourtPlayers);
                    }else if(response.type==98){
                        const t = response.data;
                        //时间更新
                        this.matchTime=t.matchTimeStr;
                    }else if(response.type==-1){
                        me.$message({
                            message:response.message,
                            type: "warning"
                        });
                    }else {
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
                this.$message({
                    message:"断开连接 "+e,
                    type: "warning"
                });
                location.reload();
            }
        }
    }
</script>

<style scoped>

</style>