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
                </el-tab-pane>
                <el-tab-pane :label="awayTeam.teamName" name="away">
                    <el-table ref="statTable" :data="awayStatsData">
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
                        //转换时间
                        for (let i = 0; i < homeData.length; i++) {
                            homeData[i]["time"] = secondsToMatchTime(homeData[i]["time"] / 10)
                        }
                        for (let i = 0; i < awayData.length; i++) {
                            awayData[i]["time"] = secondsToMatchTime(awayData[i]["time"] / 10)
                        }

                        this.homeStatsData = homeData;
                        this.awayStatsData = awayData;

                        this.titleContent=this.homeTeam.teamName+" "+this.homeTeam.score+":"+this.awayTeam.score+" "+this.awayTeam.teamName;
                        this.dialogVisible=true;
                    }
                });
            }
        }
    }
</script>

<style scoped>

</style>