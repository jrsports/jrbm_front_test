<template>
    <el-container>
        <el-header>
            <nav-bar></nav-bar>
        </el-header>
        <el-container>
            <el-aside width="200px">
                <sidebar></sidebar>
            </el-aside>
            <el-container>
                <el-main>
                    <el-row gutter="4">
                        <el-col :span="12">
                            <el-card class="box-card">
                                <div slot="header" class="clearfix">
                                    <span>{{ongoingPrompt}}</span>
                                    <span style="float: right; padding: 3px 0">今日剩余:{{teamStats.timesLeft}}次</span>
                                </div>
                                <el-row>
                                    <el-col :span="8" :offset="10">
                                        <el-avatar shape="square" :size="100"  src="https://fuss10.elemecdn.com/e/5d/4a731a90594a4af544c0c25941171jpeg.jpeg"></el-avatar>
                                    </el-col>
                                </el-row>
                                <h2 style="margin-left: 330px">{{currentRank}}</h2>
                                <h2 style="margin-left: 360px">{{teamStats.score}}</h2>
                                <el-row>
                                    <el-col :span="8" :offset="2">
                                        <h3>总场次:{{teamStats.matchCount}}</h3>
                                    </el-col>
                                    <el-col :span="7">
                                        <h3>胜率:{{teamStats.winRate}}%</h3>
                                    </el-col>
                                    <el-col :span="7">
                                        <h3>场均净胜:{{teamStats.averageDiff}}分</h3>
                                    </el-col>
                                </el-row>

                                <h4 v-if="matchingStatus===2" style="margin-left: 300px">匹配人数:{{matchingTeamCount}}{{timeElapsed}}</h4>
                                <el-button @click="startMatching" v-if="matchingStatus===1"
                                           style="width:80%;margin-left: 10%;">
                                    开始匹配
                                </el-button>
                                <!--                        <el-button @click="testEnterGame">进入比赛</el-button>-->
                                <el-button @click="cancelMatching" v-if="matchingStatus===2" plain type="danger"
                                           style="width:80%;margin-left: 10%;">取消匹配
                                </el-button>
                                <div v-if="matchingStatus===3">
                                    <h3  style="margin-left: 250px">{{matchSuccessContent}}</h3>
                                    <el-button @click="enterLive" style="margin-left: 300px">进入比赛</el-button>
                                </div>


                            </el-card>
                        </el-col>
                        <el-col :span="12">

                            <el-card class="box-card">
                                <div slot="header" class="clearfix">
                                    <span>排行榜</span>
                                    <el-button style="float: right; padding: 3px 0" type="text">全部排名</el-button>
                                </div>
                                <el-table :data="nearbyRankData" :row-class-name="highlight">
                                    <el-table-column property="rankNo" label="排名"></el-table-column>
                                    <el-table-column property="teamName" label="球队名"></el-table-column>
                                    <el-table-column property="score" label="积分"></el-table-column>
                                </el-table>
                            </el-card>
                        </el-col>
                    </el-row>

                    <MatchLiveDialog ref="matchLiveDialogRef"></MatchLiveDialog>
                </el-main>


            </el-container>
        </el-container>
    </el-container>
</template>


<script>
    import Sidebar from "@/views/layout/sidebar/sidebar";
    import NavBar from "@/views/layout/header/header"
    import {cancelMatching, getMatchingInfo, getRankNearby, getTeamStats, startMatching} from "@/api/match";
    import {secondsToMatchTime} from "@/utils/timeUtil";
    import MatchLiveDialog from "@/components/MatchLiveDialog";

    let timeElapsed=0,timer;
    let matchId=0;
    export default {
        name: "match",
        components: {Sidebar, NavBar,MatchLiveDialog},
        mounted() {
            this.getRankNearby();
            this.getMatchingInfo();
            this.getTeamStats();
        },
        data() {
            return {
                matchConfirmDialogVisible: false,
                matchingStatus: 1,
                matchConfirmBtnVisible: true,
                ifConfirmed: false,
                ongoingPrompt: "匹配",
                nearbyRankData: [],
                currentRank:"初出茅庐",
                teamStats:{
                    score:23,
                    matchCount:0,
                    winRate:0,
                    averageDiff:0.0,
                    timesLeft:0
                },
                timeElapsed:" 00:00",
                matchingTeamCount:0,
                matchSuccessContent:"",

            }
        },
        methods: {
            startMatching() {
                startMatching().then(res => {
                    let me=this;
                    if (res.code === 0) {
                        this.matchingStatus = 2;
                        timer=setInterval(()=>{
                            timeElapsed++;
                            me.timeElapsed=" "+secondsToMatchTime(timeElapsed);
                            me.getMatchingInfo();
                        },1000);
                        this.$message({
                            message: "开始匹配",
                            type: "info"
                        })
                    }
                })
            },
            getTeamStats(){
              getTeamStats().then(res=>{
                  if(res.code===0){
                      this.teamStats=res.data;
                  }
              })
            },
            getMatchingInfo(){
                let me=this;
                getMatchingInfo().then(res=>{
                    if(res.code===0){
                        this.matchingStatus = res.data.status;
                        if(res.data.status===2){
                            this.matchingStarted = true;
                            // 匹配中，激活定时
                            if(!timer){
                                timeElapsed=parseInt((new Date().getTime()-res.data.startTime)/1000);
                                timer=setInterval(()=>{
                                    timeElapsed++;
                                    me.timeElapsed=" "+secondsToMatchTime(timeElapsed);
                                    me.getMatchingInfo();
                                },1000);
                            }
                        }else if(res.data.status===3){
                            if(res.data.opponentTeamName===null){
                                this.matchSuccessContent="匹配成功，创建比赛中..."
                            }else{
                                this.matchSuccessContent="比赛进行中... VS "+res.data.opponentTeamName;
                                clearInterval(timer);
                                matchId=res.data.matchId;
                            }

                        }
                        this.matchingTeamCount=res.data.matchingTeamCount;
                    }
                })
            },
            getRankNearby() {
                getRankNearby().then(res => {
                    if (res.code === 0) {
                        this.nearbyRankData = res.data.rankTeamList;
                    }
                });
            },
            cancelMatching() {
                timeElapsed=0;
                clearInterval(timer);
                this.timeElapsed=" 00:00";
                cancelMatching().then(res => {
                    if (res.code === 0) {
                        this.matchingStatus = 1;
                        this.$message({
                            message: "已取消匹配",
                            type: "info"
                        })
                    }
                })
            },
            highlight({row}) {
                if (row.teamId === this.$store.getters.teamId) {
                    return 'success-row';
                }
                return '';
            },
            enterLive() {
                this.$refs.matchLiveDialogRef.loadMatch(matchId);
            },
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