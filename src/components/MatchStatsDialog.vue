<template>

    <el-container>
        <el-dialog title="数据统计" :visible.sync="dialogVisible" width="80%">

            <el-row :gutter="20">
                <el-col :span="12" :offset="10">
                    <h2>{{titleContent}}</h2>
                </el-col>

            </el-row>
            <el-tabs v-model="activeTab" type="card">
                <el-tab-pane :label="homeTeam.teamName" name="home">
                    <el-table ref="statTable" :data="homeStatsData">
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
                <el-tab-pane :label="awayTeam.teamName" name="away">
                    <el-table ref="statTable" :data="awayStatsData">
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
            </el-tabs>


        </el-dialog>
    </el-container>

</template>

<script>

    import {viewStats} from "@/api/match";
    import {secondsToMatchTime} from "@/utils/timeUtil"

    export default {
        name: "MatchStatsDialog",
        components:{},
        data() {
            return {
                dialogVisible: false,
                awayStatsData: [],
                homeStatsData: [],
                activeTab:"home",
                homeTeam:{
                    teamName:"主队",
                    score:0
                },
                awayTeam:{
                    teamName:"客队",
                    score:0
                },
                titleContent:""

            }

        },
        methods: {
            loadStats(matchId){

                viewStats(matchId).then(res=>{
                    if (res.code === 0) {
                        let data = res.data;
                        let homeTeamId = data.matchBriefInfoRspDto.homeTeamId;
                        this.homeTeam.teamName=data.matchBriefInfoRspDto.homeTeamName;
                        this.homeTeam.score=data.matchBriefInfoRspDto.homeScore;
                        this.awayTeam.teamName=data.matchBriefInfoRspDto.awayTeamName;
                        this.awayTeam.score=data.matchBriefInfoRspDto.awayScore;
                        let awayTeamId = data.matchBriefInfoRspDto.awayTeamId;
                        let homeData = data.matchPlayerStatsDtoMap[homeTeamId];

                        let awayData = data.matchPlayerStatsDtoMap[awayTeamId];
                        this.convertStats(homeData);
                        this.convertStats(awayData);

                        this.homeStatsData = homeData;
                        this.awayStatsData = awayData;

                        this.titleContent=this.homeTeam.teamName+" "+this.homeTeam.score+":"+this.awayTeam.score+" "+this.awayTeam.teamName;
                        this.dialogVisible=true;
                    }
                })
            },
            convertStats(statsData){
                for (let i = 0; i < statsData.length; i++) {
                    console.log(statsData[i]["time"]);
                    statsData[i]["timeMinutes"] = secondsToMatchTime(statsData[i]["time"] / 10);
                    console.log( statsData[i]["time"]);
                    statsData[i]["threeInAttempt"]= statsData[i]["threeIn"]+"/"+statsData[i]["threeAttempt"];
                    statsData[i]["freeThrowInAttempt"]= statsData[i]["freeThrowIn"]+"/"+statsData[i]["freeThrowAttempt"];
                    statsData[i]["totalInAttempt"]= statsData[i]["totalIn"]+"/"+statsData[i]["totalAttempt"];
                }
            }
        }
    }
</script>

<style scoped>

</style>