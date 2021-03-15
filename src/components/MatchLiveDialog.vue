<template>

    <el-container>
        <el-dialog :visible.sync="matchLiveDialogVisible" :close-on-click-modal="false"

                   width="100%"
                   :modal="false"
                   :fullscreen="true"
                   @close="quitLive">
            <el-row>
                <h2 style="text-align: center">{{title}}</h2>
                <h3 style="text-align: center">{{matchTime}}</h3>
            </el-row>
            <el-row>
                <el-col :span="4">
                    <div v-for="player in homeOnCourtPlayers" :key="player">
                        <el-row>
                            <el-col :span="6">
                                <el-avatar shape="square" :size="50" src="https://cube.elemecdn.com/9/c2/f0ee8a3c7c9638a54940382568c9dpng.png"></el-avatar>
                            </el-col>
                            <el-col :span="18">
                                <h3>{{player.chname}}</h3>
                            </el-col>
                        </el-row>
                        <el-divider></el-divider>
                    </div>

                </el-col>
                <el-col :span="12" :offset="2">
                    <ul class="infinite-list" style="height: 500px;overflow-y:scroll;">
                        <li v-for="i in liveContent" :key="i" style="list-style-type:none;">{{ i }}</li>
                    </ul>
                </el-col>
                <el-col :span="4" :offset="2">
                    <div v-for="player in awayOnCourtPlayers" :key="player">
                        <el-row>
                            <el-col :span="6">
                                <el-avatar shape="square" :size="50" src="https://cube.elemecdn.com/9/c2/f0ee8a3c7c9638a54940382568c9dpng.png"></el-avatar>
                            </el-col>
                            <el-col :span="18">
                                <h3>{{player.chname}}</h3>
                            </el-col>
                        </el-row>
                        <el-divider></el-divider>
                    </div>
                </el-col>
            </el-row>

            <el-row>
                <el-col :span="16">
                    <el-table ref="statTable" :data="stats" :row-class-name="onCourt" highlight-current-row
                              @current-change="handleSubstitute" height="500px">
                        <el-table-column property="order" label="球员序号" fixed></el-table-column>
                        <el-table-column property="chname" label="姓名" fixed></el-table-column>
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
                </el-col>
            </el-row>


        </el-dialog>
    </el-container>

</template>

<script>


    import GlobalWebsocket from "@/websocket/GlobalWebsocket";

    var onCourtPlayers;

    export default {
        name: "MatchLiveDialog",
        components:{},
        data() {
            return {
                matchLiveDialogVisible: false,
                liveContent: ["比赛直播即将开始"],
                matchTime: "",
                playerIn: -1,
                playerOut: -1,
                matchId:-1,
                stats: [],
                homeOnCourtPlayers:[],
                awayOnCourtPlayers:[],
                title:""
            }

        },
        methods: {
            loadMatch(matchId){
                this.matchLiveDialogVisible=true;
                this.liveContent=[];
                let channel="/channel/matchServer/live/" + matchId;
                this.$store.dispatch('ws/addRouter', {
                    "channel": channel,
                    "routers": [
                        {
                            router: "/MATCH_SERVER/live/文字直播消息",
                            function: this.handleLiveMsg
                        },
                        {
                            router: "/MATCH_SERVER/live/时间更新消息",
                            function: this.handleTimeUpdate
                        }
                    ]
                });
                GlobalWebsocket.subscribe(channel);
                this.matchId=matchId;
            },
            handleLiveMsg(body){
                //比赛直播
                this.liveContent.unshift(body.message);
                this.stats = body.stats;
                this.title=body.homeTeamName+"  "+body.homeStats.score + ":" + body.awayStats.score+"  "+body.awayTeamName
                onCourtPlayers = body.onCourtPlayers;
                this.handleOnCourtPlayers(body.onCourtPlayers,body.playerList);
            },
            handleOnCourtPlayers(onCourtPlayers,playerList){
                this.homeOnCourtPlayers.splice(0,this.homeOnCourtPlayers.length);
                this.awayOnCourtPlayers.splice(0,this.awayOnCourtPlayers.length);
                onCourtPlayers.forEach((item,index)=>{
                   if(index<5){

                       this.homeOnCourtPlayers.push(playerList[item].matchPlayerInfo);
                   } else{
                       this.awayOnCourtPlayers.push(playerList[item].matchPlayerInfo);
                   }
                });
            },
            handleTimeUpdate(body){
                //时间更新
                this.matchTime = "  "+body.matchTimeStr;
            },
            handleSubstitute(body){
                //换人请求
                this.liveContent.unshift(body.message);
            },
            onCourt({rowIndex}) {
                for (var i of onCourtPlayers) {
                    if (rowIndex == i) {
                        return 'success-row';
                    }
                }
                return '';
            },
            websocketsend(Data) {//数据发送
                this.websock.send(Data)
            },
            quitLive() {
                let channel="/channel/matchServer/live/" + this.matchId;
                GlobalWebsocket.unsubscribe(channel)
            }
        }
    }
</script>

<style scoped>

</style>