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
                    <el-tabs tab-position="bottom" type="border-card">
                        <el-tab-pane label="文字直播">
                            <ul class="infinite-list" style="height: 500px;overflow-y:scroll;">
                                <li v-for="i in liveContent" :key="i" style="list-style-type:none;">{{ i }}</li>
                            </ul>
                        </el-tab-pane>
                        <el-tab-pane label="主队数据">
                            <el-table ref="statTable" :data="homeStats" :row-class-name="onCourt" highlight-current-row
                                      @current-change="handleSubstitute" height="500px">
                                <el-table-column property="chname" label="姓名" fixed width="200px"></el-table-column>
                                <el-table-column property="timeMinutes" label="上场时间"></el-table-column>
                                <el-table-column property="score" label="得分"></el-table-column>
                                <el-table-column property="rebound" label="篮板"></el-table-column>
                                <el-table-column property="assist" label="助攻"></el-table-column>
                                <el-table-column property="totalInAttempt" label="投篮"></el-table-column>
                                <el-table-column property="threeInAttempt" label="三分"></el-table-column>
                                <el-table-column property="freeThrowInAttempt" label="罚球"></el-table-column>
                                <el-table-column property="steal" label="抢断"></el-table-column>
                                <el-table-column property="turnover" label="失误"></el-table-column>
                                <el-table-column property="block" label="盖帽"></el-table-column>
                                <el-table-column property="beBlocked" label="被盖"></el-table-column>
                                <el-table-column property="foul" label="犯规"></el-table-column>

                            </el-table>
                        </el-tab-pane>
                        <el-tab-pane label="客队数据">
                            <el-table ref="statTable" :data="awayStats" :row-class-name="onCourt" highlight-current-row
                                      @current-change="handleSubstitute" height="500px">
                                <el-table-column property="chname" label="姓名" fixed width="200px"></el-table-column>
                                <el-table-column property="timeMinutes" label="上场时间"></el-table-column>
                                <el-table-column property="score" label="得分"></el-table-column>
                                <el-table-column property="rebound" label="篮板"></el-table-column>
                                <el-table-column property="assist" label="助攻"></el-table-column>
                                <el-table-column property="totalInAttempt" label="投篮"></el-table-column>
                                <el-table-column property="threeInAttempt" label="三分"></el-table-column>
                                <el-table-column property="freeThrowInAttempt" label="罚球"></el-table-column>
                                <el-table-column property="steal" label="抢断"></el-table-column>
                                <el-table-column property="turnover" label="失误"></el-table-column>
                                <el-table-column property="block" label="盖帽"></el-table-column>
                                <el-table-column property="beBlocked" label="被盖"></el-table-column>
                                <el-table-column property="foul" label="犯规"></el-table-column>
                            </el-table>
                        </el-tab-pane>
                        <el-tab-pane label="战术面板">
                            <el-collapse v-model="activeTacTab" accordion>
                                <el-collapse-item title="换人" name="substitution">
                                    <el-select v-model="playerOut" multiple placeholder="请选择被替换的球员">
                                        <el-option
                                                v-for="item in playerToBeSubstituteCandidate"
                                                :key="item.order"
                                                :label="item.chname"
                                                :value="item.order">
                                        </el-option>
                                    </el-select>
                                    <el-select v-model="playerIn" multiple placeholder="请选择要替换的球员">
                                        <el-option
                                                v-for="item in playerSubstituteCandidate"
                                                :key="item.order"
                                                :label="item.chname"
                                                :value="item.order">
                                        </el-option>
                                    </el-select>
                                    <el-button @click="substitute">换人</el-button>
                                </el-collapse-item>
                                <el-collapse-item title="暂停" name="timeout">

                                </el-collapse-item>
                                <el-collapse-item title="进攻战术" name="offense">

                                </el-collapse-item>
                                <el-collapse-item title="防守战术" name="defense">

                                </el-collapse-item>
                            </el-collapse>
                        </el-tab-pane>
                    </el-tabs>

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



        </el-dialog>
    </el-container>

</template>

<script>

    import {
       substitute
    } from "@/api/match";
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
                matchId:-1,
                homeStats: [],
                awayStats: [],
                homeOnCourtPlayers:[],
                awayOnCourtPlayers:[],
                title:"",
                activeTacTab:"substitution",
                playerSubstituteCandidate:[],
                playerToBeSubstituteCandidate:[],
                playerIn:[],
                playerOut:[],
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
                this.homeStats.splice(0,this.homeStats.length);
                this.awayStats.splice(0,this.awayStats.length);
                this.playerSubstituteCandidate.splice(0,this.playerSubstituteCandidate.length);
                this.playerToBeSubstituteCandidate.splice(0,this.playerToBeSubstituteCandidate.length);
                body.playerList.forEach((item,index)=>{
                    let stat=body.stats[index];
                    stat.threeInAttempt=stat.threeIn+"/"+stat.threeAttempt;
                    stat.freeThrowInAttempt=stat.freeThrowIn+"/"+stat.freeThrowAttempt;
                    stat.totalInAttempt=stat.totalIn+"/"+stat.totalAttempt;
                    if(item.matchPlayerInfo.teamId===this.$store.getters.teamId){
                        if(body.onCourtPlayers.indexOf(index)>-1){
                            this.playerToBeSubstituteCandidate.push({
                                chname:item.matchPlayerInfo.chname,
                                order:index
                            });
                        }
                        this.playerSubstituteCandidate.push({
                            chname:item.matchPlayerInfo.chname,
                            order:index
                        });
                    }

                    if(item.matchPlayerInfo.ifHome){
                        this.homeStats.push(stat);
                    }else{
                        this.awayStats.push(stat);
                    }

                });
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
                this.matchTime = body.matchTimeStr==="Q4 00:00"?"完场":body.matchTimeStr;
            },
            substitute(){
                let substitutionList=[];
                if(this.playerIn.length===0 || this.playerIn.length!==this.playerOut.length){
                    return;
                }
                this.playerIn.forEach((item,index)=>{
                   substitutionList.push({
                       playerIn:item,
                       playerOut:this.playerOut[index]
                   })
                });
               substitute({
                   matchId:this.matchId,
                   substitutionList:substitutionList
               }).then(res=>{
                   if(res.code===0){
                       this.playerIn.splice(0,this.playerIn.length);
                       this.playerOut.splice(0,this.playerOut.length);
                   }
               });
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