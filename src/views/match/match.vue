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
                    <el-card class="box-card">
                        <div slot="header" class="clearfix">
                            <span>{{ongoingPrompt}}</span>
                            <el-button style="float: right; padding: 3px 0" type="text" @click="enterLive"
                                       v-if="ongoingmatchVisible">进入比赛
                            </el-button>
                        </div>
                        <el-button @click="startMatchMaking" v-if="startBtnVisible" style="width:80%;margin-left: 10%;">
                            开始匹配
                        </el-button>
<!--                        <el-button @click="testEnterGame">进入比赛</el-button>-->
                        <el-button @click="cancelMatchMaking" v-if="cancelBtnVisible" plain type="danger" style="width:80%;margin-left: 10%;">取消匹配</el-button>
                        <div style="text-align:center" v-if="ongoingmatchVisible">
                            主队-{{homeTeamName}} vs 客队-{{awayTeamName}}
                        </div>
                    </el-card>
                    <el-divider></el-divider>
                    <el-card class="box-card" v-if="finishedMatchVisible">
                        <div slot="header" class="clearfix">
                            <span>已结束比赛（{{matchCount}}场）</span>
                        </div>
                        <div>
                            <el-table
                                    :data="finishedMatchData"
                                    style="width: 100%"
                                    max-height="500"
                                    :row-class-name="tableRowClassName">
                                <el-table-column
                                        prop="matchId"
                                        label="ID"
                                        width="100"
                                >
                                </el-table-column>
                                <el-table-column
                                        prop="finishTime"
                                        label="日期"
                                >
                                </el-table-column>
                                <el-table-column
                                        prop="homeTeamName"
                                        label="主队"
                                >
                                </el-table-column>
                                <el-table-column
                                        prop="awayTeamName"
                                        label="客队"
                                >
                                </el-table-column>
                                <el-table-column
                                        prop="homeScore"
                                        label="主队得分"
                                >
                                </el-table-column>
                                <el-table-column
                                        prop="awayScore"
                                        label="客队得分"
                                >
                                </el-table-column>
                                <el-table-column
                                        prop=""
                                        label="操作"
                                >
                                    <template slot-scope="scope">
                                        <el-button
                                                size="mini"
                                                @click="viewStats(scope.row)">数据统计
                                        </el-button>
                                    </template>
                                </el-table-column>
                            </el-table>
                        </div>
                    </el-card>
                </el-main>


                <el-dialog title="比赛确认" :visible.sync="matchConfirmDialogVisible" close-on-click-modal=false
                           width="30%">
                    <el-button type="success" v-if="matchConfirmBtnVisible" style="width: 100%" @click="confirmMatch">
                        确认
                    </el-button>
                    <h3 v-if="ifConfirmed" style="text-align: center">已确认</h3>
                </el-dialog>

                <el-dialog title="比赛直播" :visible.sync="matchLiveDialogVisible" close-on-click-modal=false width="100%"
                           @close="quitLive">
                    <h3>{{scores}}{{matchTime}}</h3>
                    <ul class="infinite-list" style="height: 500px;overflow-y:scroll;">
                        <li v-for="i in liveContent" :key="i" style="list-style-type:none;">{{ i }}</li>
                    </ul>
                    <el-table ref="statTable" :data="stats" :row-class-name="onCourt" highlight-current-row
                              @current-change="handleSubstitute">
                        <el-table-column property="order" label="球员序号"></el-table-column>
                        <el-table-column property="chname" label="姓名"></el-table-column>
                        <el-table-column property="timeMinutes" label="上场时间"></el-table-column>
                        <el-table-column property="score" label="得分"></el-table-column>
                        <el-table-column property="rebound" label="篮板"></el-table-column>
                        <el-table-column property="assist" label="助攻"></el-table-column>
                        <el-table-column property="steal" label="抢断"></el-table-column>
                        <el-table-column property="turnover" label="失误"></el-table-column>
                        <el-table-column property="block" label="盖帽"></el-table-column>
                        <el-table-column property="beBlocked" label="被盖"></el-table-column>
                        <el-table-column property="foul" label="犯规"></el-table-column>
                        <el-table-column property="totalAttempt" label="总出手数"></el-table-column>
                        <el-table-column property="totalIn" label="总命中数"></el-table-column>
                        <el-table-column property="threeAttempt" label="三分出手"></el-table-column>
                        <el-table-column property="threeIn" label="三分命中"></el-table-column>
                        <el-table-column property="freeThrowAttempt" label="罚球出手"></el-table-column>
                        <el-table-column property="freeThrowIn" label="罚球命中"></el-table-column>


                        <!--                <el-table-column label="进入游戏">-->
                        <!--                    <template slot-scope="scope">-->
                        <!--                        <el-button @click="getGamePage(scope.row)">进入游戏</el-button>-->
                        <!--                    </template>-->

                        <!--                </el-table-column>-->
                    </el-table>
                </el-dialog>

                <el-dialog title="数据统计" :visible.sync="matchStatsDialogVisible" width="80%">
                    <el-table ref="statTable" :data="matchStatsData">
                        <el-table-column property="order" label="球员序号"></el-table-column>
                        <el-table-column property="chname" label="姓名"></el-table-column>
                        <el-table-column property="time" label="上场时间"></el-table-column>
                        <el-table-column property="score" label="得分"></el-table-column>
                        <el-table-column property="rebound" label="篮板"></el-table-column>
                        <el-table-column property="assist" label="助攻"></el-table-column>
                        <el-table-column property="steal" label="抢断"></el-table-column>
                        <el-table-column property="turnover" label="失误"></el-table-column>
                        <el-table-column property="block" label="盖帽"></el-table-column>
                        <el-table-column property="beBlocked" label="被盖"></el-table-column>
                        <el-table-column property="foul" label="犯规"></el-table-column>
                        <el-table-column property="totalAttempt" label="总出手数"></el-table-column>
                        <el-table-column property="totalIn" label="总命中数"></el-table-column>
                        <el-table-column property="threeAttempt" label="三分出手"></el-table-column>
                        <el-table-column property="threeIn" label="三分命中"></el-table-column>
                        <el-table-column property="freeThrowAttempt" label="罚球出手"></el-table-column>
                        <el-table-column property="freeThrowIn" label="罚球命中"></el-table-column>
                    </el-table>
                </el-dialog>

            </el-container>
        </el-container>
    </el-container>
</template>


<script>
    import Sidebar from "@/views/layout/sidebar/sidebar";

    var onCourtPlayers;
    export default {
        name: "match",
        components: {Sidebar},
        mounted() {
            this.teamName=sessionStorage.getItem("teamName");
            this.getOngoingMatch();
            this.getFinishedMatch();
        },
        data() {
            return {
                teamName: "null",
                matchConfirmDialogVisible: false,
                startBtnVisible: false,
                cancelBtnVisible: false,
                matchLiveDialogVisible: false,
                matchConfirmBtnVisible: true,
                ongoingmatchVisible: false,
                finishedMatchVisible: true,
                matchStatsDialogVisible:false,
                ifConfirmed: false,
                matchId: -1,
                ticket: "",
                liveContent: ["比赛直播即将开始"],
                scores: "",
                stats: [],
                finishedMatchData: [],
                matchStatsData:[],
                matchTime: "",
                homeTeamName: "",
                awayTeamName: "",
                matchCount: 0,
                ongoingPrompt: "匹配",
                playerIn:-1,
                playerOut:-1
            }
        },
        methods: {
            testEnterGame(){
                let routeUrl = this.$router.resolve({
                    path: "/matchLive",
                    query: {ticket:"12awef8a3f1waw3e5"}
                });
                window.open(routeUrl .href, '_blank');
            },
            tableRowClassName({row}) {
                if ((row.homeTeamName == this.teamName && row.homeScore > row.awayScore) || (row.awayTeamName == this.teamName && row.homeScore < row.awayScore)) {
                    return 'success-row';
                } else {
                    return 'warning-row'
                }
            },
            getOngoingMatch() {
                const me = this;
                this.axios.post("http://www.jrsports.com/api/matchserver/match/getOngoingMatch", null, {
                    headers: {
                        "userToken": localStorage.getItem("userToken"),
                        "teamToken": sessionStorage.getItem("teamToken")
                    }
                }).then(function (response) {
                    const ongoingResponse = response.data;
                    if (ongoingResponse.code === 0) {
                        if (ongoingResponse.data == null) {
                            //无正在进行比赛，可以匹配
                            me.startBtnVisible = true;
                        } else {
                            //展示比赛简要信息
                            me.ongoingPrompt = "正在进行的比赛";
                            me.ongoingmatchVisible = true;
                            me.homeTeamName = ongoingResponse.data.homeTeamName;
                            me.awayTeamName = ongoingResponse.data.awayTeamName;
                            me.matchId = ongoingResponse.data.matchId;
                        }
                    } else {
                        alert(ongoingResponse.message);
                    }
                });
            },
            getFinishedMatch() {
                const me = this;
                this.axios.post("http://www.jrsports.com/api/matchserver/match/getFinishedMatch/2", null, {
                    headers: {
                        "userToken": localStorage.getItem("userToken"),
                        "teamToken": sessionStorage.getItem("teamToken")
                    }
                }).then(function (response) {
                    const matchInfoResponse = response.data;
                    if (matchInfoResponse.code === 0) {
                        me.finishedMatchData = matchInfoResponse.data;
                        me.matchCount = matchInfoResponse.data.length;
                    } else {
                        alert(matchInfoResponse.message);
                    }
                });
            },
            viewStats(row) {
                const me = this;
                this.axios.post("http://www.jrsports.com/api/matchserver/match/getMatchStats/"+row.matchId,null, {
                    headers: {
                        "userToken": localStorage.getItem("userToken"),
                        "teamToken": sessionStorage.getItem("teamToken")
                    }
                }).then(function (response) {
                    const matchStatsResponse = response.data;
                    if (matchStatsResponse.code === 0) {
                        let data=matchStatsResponse.data;
                        //转换时间
                        for(var i=0;i<data.length;i++){
                            data[i]["time"]=me.secondsToTime(data[i]["time"]/10)
                        }
                        me.matchStatsData = data;
                        me.matchStatsDialogVisible=true;
                    } else {
                        alert(matchStatsResponse.message);
                    }
                });
            },
            substituteOnCourt() {
                console.log("发送换人请求"+this.playerIn+" "+this.playerOut);
                const me = this;
                this.axios.post("http://www.jrsports.com/api/matchserver/match/substitute", {
                    ticket:me.ticket,
                    substituteRequestDetailList:[{
                        playerIn:me.playerIn,
                        playerOut:me.playerOut
                    }]
                }, {
                    headers: {
                        "userToken": localStorage.getItem("userToken"),
                        "teamToken": sessionStorage.getItem("teamToken")
                    }
                }).then(function (response) {
                    const substituteResponse = response.data;
                    if (substituteResponse.code === 0) {
                        me.$message({
                            message: substituteResponse.msg,
                            type: "success"
                        });
                    } else {
                        me.$message({
                            message: substituteResponse.msg,
                            type: "warning"
                        });
                    }
                    me.playerIn=-1;
                    me.playerOut=-1;
                });
            },
            handleSubstitute(val){
                if(this.playerIn>=0){
                    this.playerOut=val.order;
                    this.substituteOnCourt();
                }else{
                    this.playerIn=val.order;
                }
            },
            enterLive() {
                this.matchLiveDialogVisible = true;
                this.matchLive(this.matchId);
            },
            quitLive() {
                this.websock.close();
            },
            secondsToTime(s) {
                let h;
                h = Math.floor(s / 60);
                s = s % 60;
                h += '';
                s += '';
                h = (h.length == 1) ? '0' + h : h;
                s = (s.length == 1) ? '0' + s : s;
                return h + ':' + s;
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
                const url = "ws://www.jrsports.com/api/ws/matchserver/matchlive?ticket=" + this.ticket + "&wsToken=" + wsToken;
                this.websock = new WebSocket(url);
                this.websock.onmessage = this.websocketonmessage;
                this.websock.onopen = this.websocketonopen;
                this.websock.onerror = this.websocketonerror;
                this.websock.onclose = this.websocketclose;
            },
            async applyWsToken() {
                await this.axios.post("http://www.jrsports.com/api/user/websocket/apply", null, {
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
            async applyTicket(matchId) {
                const me = this;
                await this.axios.post("http://www.jrsports.com/api/matchserver/ticket/apply/" + matchId, null,{
                    headers: {
                        "userToken": localStorage.getItem("userToken"),
                        "teamToken": sessionStorage.getItem("teamToken")
                    }
                }).then(function (response) {
                    const serverResponse = response.data;
                    if (serverResponse.code == 0) {
                        me.ticket = serverResponse.data;
                    } else {
                        alert(serverResponse.msg);
                    }

                });
            },
            confirmMatch() {
                this.websocketsend("confirm");
            },
            cancelMatchMaking() {
                this.websocketsend("stop");
            },
            onCourt({rowIndex}) {
                for (var i of onCourtPlayers) {
                    if (rowIndex == i) {
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
                    if (response.type == 0) {
                        //加入匹配池成功
                        this.startBtnVisible = false;
                        this.cancelBtnVisible = true;
                        me.$message({
                            message: response.message,
                            type: "success"
                        });
                    } else if (response.type == 1) {
                        //匹配到对手
                        this.matchConfirmDialogVisible = true;
                        this.cancelBtnVisible = false;
                        me.$message({
                            message: response.message,
                            type: "success"
                        });
                    } else if (response.type == 3) {
                        //双方都确认
                        me.$message({
                            message: response.message,
                            type: "success"
                        });
                        this.matchLiveDialogVisible = true;
                        this.matchConfirmDialogVisible = false;
                        // this.ongoingmatchVisible=true;
                        // this.websock.close();
                    } else if (response.type == 5) {
                        //本方确认成功
                        this.matchConfirmBtnVisible = false;
                        this.ifConfirmed = true;
                        me.$message({
                            message: response.message,
                            type: "success"
                        });
                    } else if (response.type == 8) {
                        //比赛创建
                        this.matchLive(response.data);
                    } else if (response.type == 16) {
                        //取消匹配成功
                        this.startBtnVisible = true;
                        this.cancelBtnVisible = false;
                        me.$message({
                            message: response.message,
                            type: "success"
                        });
                    } else if (response.type == 99) {
                        const d = response.data;
                        //比赛直播
                        this.liveContent.unshift(d.message);
                        this.scores = d.homeStats.score + ":" + d.awayStats.score;
                        this.stats = d.stats;
                        onCourtPlayers = d.onCourtPlayers;
                    } else if (response.type == 98) {
                        const t = response.data;
                        //时间更新
                        this.matchTime = t.matchTimeStr;
                    } else if (response.type == 97) {
                        const d = response.data;
                        //换人请求
                        this.liveContent.unshift(d.message);
                    } else if (response.type == -1) {
                        me.$message({
                            message: response.message,
                            type: "warning"
                        });
                    } else {
                        me.$message({
                            message: response.message,
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
                console.log("断开连接 " + e);
                // this.$message({
                //     message: "断开连接 " + e,
                //     type: "warning"
                // });
                location.reload();
            }
        }
    }
</script>

<style>
    .el-table .warning-row {
        background: #fdb9b4;
    }

    .el-table .success-row {
        background: #f0f9eb;
    }
</style>