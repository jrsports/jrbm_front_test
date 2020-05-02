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
                    <div v-if="ifInSeason">
                        <el-tabs v-model="activeName" type="card" @tab-click="tabSwitch">
                            <el-tab-pane label="赛季首页" name="main">
                                <el-row>
                                    <el-col :span="14">
                                        <el-row>
                                            <el-card class="box-card">
                                                <div slot="header">
                                                    <span>今日赛程（周日）</span><span style="float: right"><el-link
                                                        :underline="false">查看全部10场</el-link></span>
                                                </div>
                                                <div v-for="schedule in myTodayScheduleData" :key="schedule.scheduleId">
                                                    <el-row type="flex" align="middle">
                                                        <el-avatar style="margin-left: 50px" :size="60" shape="square"
                                                                   src="https://cube.elemecdn.com/9/c2/f0ee8a3c7c9638a54940382568c9dpng.png"></el-avatar>
                                                        <span style="font-size: larger;font-weight: bolder;margin-left: 50px">{{schedule.homeTeamName}}</span>
                                                        <span style="font-size: larger;font-weight: bolder;margin-left: 50px">VS</span>
                                                        <span style="font-size: larger;font-weight: bolder;margin-left: 50px">{{schedule.awayTeamName}}</span>
                                                        <el-avatar style="margin-left: 50px" :size="60" shape="square"
                                                                   src="https://cube.elemecdn.com/9/c2/f0ee8a3c7c9638a54940382568c9dpng.png"></el-avatar>
                                                        <span style="float: right;font-weight: bolder;margin-left: 250px">开赛时间：{{schedule.matchTime}}</span>
                                                    </el-row>
                                                </div>
                                            </el-card>
                                        </el-row>
                                        <el-row>
                                            <el-card class="box-card">
                                                <div slot="header">
                                                    <span>今日比赛</span>
                                                </div>
                                                <div v-for="o in 4" :key="o" class="text item">
                                                    {{'列表内容 ' + o }}
                                                </div>
                                            </el-card>
                                        </el-row>
                                    </el-col>
                                    <el-col :span="9" offset="1">
                                        <el-row>
                                            <el-card>
                                                <div slot="header">
                                                    <span>球队排名</span>
                                                </div>
                                                <el-tabs v-model="rankActiveName" @tab-click="rankSwitch">
                                                    <el-tab-pane label="西部" name="west">
                                                        <el-table :data="teamRankData" height="560">
                                                            <el-table-column type="index" label="排名"></el-table-column>
                                                            <el-table-column property="teamName"
                                                                             label="球队"></el-table-column>
                                                            <el-table-column property="win_lose"
                                                                             label="胜-负"></el-table-column>
                                                            <el-table-column property="rate_diff"
                                                                             label="胜率/胜场差"></el-table-column>
                                                            <el-table-column property="recent" label="近况"></el-table-column>
                                                        </el-table>
                                                    </el-tab-pane>
                                                    <el-tab-pane label="东部" name="east">
                                                        <el-table :data="teamRankData" height="560">
                                                            <el-table-column type="index" label="排名"></el-table-column>
                                                            <el-table-column property="teamName"
                                                                             label="球队"></el-table-column>
                                                            <el-table-column property="win_lose"
                                                                             label="胜-负"></el-table-column>
                                                            <el-table-column property="rate_diff"
                                                                             label="胜率/胜场差"></el-table-column>
                                                            <el-table-column property="recent" label="近况"></el-table-column>
                                                        </el-table>
                                                    </el-tab-pane>
                                                </el-tabs>
                                            </el-card>


                                        </el-row>
                                    </el-col>
                                </el-row>
                            </el-tab-pane>
                            <el-tab-pane label="赛程管理" name="schedule">
                                <el-table :data="myScheduleData" height="750">
                                    <el-table-column type="index" label="场次"></el-table-column>
                                    <el-table-column property="matchTime" label="比赛时间"></el-table-column>
                                    <el-table-column property="result" label="结果"></el-table-column>
                                    <el-table-column property="homeTeamName" label="主队"></el-table-column>
                                    <el-table-column property="awayTeamName" label="客队"></el-table-column>
                                    <el-table-column property="matchBriefInfoDto.homeScore" label="主队比分"></el-table-column>
                                    <el-table-column property="matchBriefInfoDto.awayScore" label="客队比分"></el-table-column>
                                    <el-table-column label="操作">
                                        <template slot-scope="scope">
                                            <el-button
                                                    size="mini"
                                                    @click="viewStats(scope.row)">数据统计
                                            </el-button>
                                        </template>
                                    </el-table-column>
                                </el-table>
                            </el-tab-pane>
                            <el-tab-pane label="数据统计" name="stats"></el-tab-pane>
                        </el-tabs>
                    </div>
                    <div v-if="!ifInSeason">
                        <el-row>
                            <h1 style="font-size: 5em;text-align: center">休赛期还剩15天</h1>
                        </el-row>
                        <el-row>
                            <h1 style="font-size: 3em;text-align: center">新赛季：第4赛季</h1>
                        </el-row>
                        <el-row>
                            <h1 style="font-size: 3em;text-align: center">组别：新秀赛季组</h1>
                        </el-row>
                        <el-row type="flex" justify="center">
                            <el-button type="success" plain style="font-size: 2em"
                                       @click="applySeasonDialogVisible=true">报名
                            </el-button>
                        </el-row>
                    </div>


                    <el-dialog title="新赛季报名" :visible.sync="applySeasonDialogVisible">
                        <el-form ref="form" :model="signUpForm" label-position="top">
                            <el-form-item label="赛季">
                                <el-input disabled value="第4赛季"></el-input>
                            </el-form-item>
                            <el-form-item label="组别">
                                <el-input disabled value="新秀赛季组"></el-input>
                            </el-form-item>
                            <el-form-item label="赛区">
                                <el-radio-group v-model="signUpForm.conference">
                                    <el-radio-button label="西部"></el-radio-button>
                                    <el-radio-button label="东部"></el-radio-button>
                                </el-radio-group>
                            </el-form-item>
                            <el-form-item>
                                <el-button type="primary" plain @click="signUp()" style="width: 100%">报名</el-button>
                            </el-form-item>
                        </el-form>
                    </el-dialog>

                    <el-dialog title="我的赛程" :visible.sync="scheduleDialogVisible" width="80%">

                    </el-dialog>
                </el-main>
            </el-container>
        </el-container>
    </el-container>
</template>

<script>
    import Sidebar from "@/views/layout/sidebar/sidebar";
    import NavBar from "@/views/layout/header/header";

    export default {
        components: {Sidebar, NavBar},
        name: "season",
        data() {
            return {
                ifInSeason: true,
                rankActiveName: "west",
                vsTeam: "Koliday   VS    ccTeam",
                applySeasonDialogVisible: false,
                scheduleDialogVisible: false,
                signUpForm: {
                    conference: '西部'
                },
                activeName: "main",
                myScheduleData: [],
                myTodayScheduleData: [],
                teamRankData: [{
                    teamName: "Koliday",
                    win_lose: "12-5",
                    rate_diff: "80%/0.0",
                    recent: "4连胜"
                }]
            }
        },
        async mounted() {
            await this.checkIfInSeason();
            if(this.ifInSeason){
                this.getMyTodaySchedule();
                this.getSeasonTeamRank(1);
            }
        },
        methods: {
            async checkIfInSeason(){
                const me=this;
                await this.axios.post("http://www.jrsports.com/api/user/team/getCurrentSeason",null,{
                    headers:{
                        "userToken":localStorage.getItem("userToken"),
                        "teamToken":sessionStorage.getItem("teamToken")
                    }
                }).then(function (response) {
                    const res = response.data;
                    if(res.code===0){
                        const season=res.data;
                        me.ifInSeason=season>0;
                    }else{
                        me.$message({
                            message: res.msg,
                            type: "warning"
                        });
                    }
                });
            },
            signUp() {
                const me = this;
                this.axios.post("http://www.jrsports.com/api/season/signUp/", {
                    conference: me.signUpForm.conference == "西部" ? 1 : 2
                }, {
                    headers: {
                        "userToken": localStorage.getItem("userToken"),
                        "teamToken": sessionStorage.getItem("teamToken")
                    }
                }).then(function (response) {
                    const res = response.data;
                    if (res.code === 0) {
                        me.$message({
                            message: res.msg,
                            type: "success"
                        });
                        me.applySeasonDialogVisible = false;
                    } else {
                        me.$message({
                            message: res.msg,
                            type: "warning"
                        });
                    }
                });
            },
            getMySchedule() {
                const me = this;
                this.axios.post("http://www.jrsports.com/api/season/schedule/getMySchedule", null, {
                    headers: {
                        "userToken": localStorage.getItem("userToken"),
                        "teamToken": sessionStorage.getItem("teamToken")
                    }
                }).then(function (response) {
                    const res = response.data;
                    if (res.code === 0) {
                        let d = res.data;
                        d.forEach(function (item) {
                            if (item.result == 0) {
                                item.result = "未赛";
                            } else if (item.result == 10) {
                                item.result = "胜";
                            } else {
                                item.result = "负";
                            }
                        });
                        me.myScheduleData = d;
                    } else {
                        me.$message({
                            message: res.msg,
                            type: "warning"
                        });
                    }
                });
            },
            getMyTodaySchedule() {
                const me = this;
                this.axios.post("http://www.jrsports.com/api/season/schedule/getMyTodaySchedule", null, {
                    headers: {
                        "userToken": localStorage.getItem("userToken"),
                        "teamToken": sessionStorage.getItem("teamToken")
                    }
                }).then(function (response) {
                    const res = response.data;
                    if (res.code === 0) {
                        let d = res.data;
                        d.forEach(function (item) {
                            if (item.result == 0) {
                                item.result = "未赛";
                            } else if (item.result == 10) {
                                item.result = "胜";
                            } else {
                                item.result = "负";
                            }
                            if (item.period == 1) {
                                item.matchTime = "12:30";
                            } else {
                                item.matchTime = "19:00";
                            }
                        });
                        me.myTodayScheduleData = d;
                    } else {
                        me.$message({
                            message: res.msg,
                            type: "warning"
                        });
                    }
                });
            },
            getSeasonTeamRank(conference) {
                const me = this;
                this.axios.post("http://www.jrsports.com/api/season/stats/getSeasonTeamRank/"+conference, null, {
                    headers: {
                        "userToken": localStorage.getItem("userToken"),
                        "teamToken": sessionStorage.getItem("teamToken")
                    }
                }).then(function (response) {
                    const res = response.data;
                    if (res.code === 0) {
                        let d = res.data;
                        d.forEach(function (item) {
                            item.win_lose=item.win+"-"+item.lose;
                            item.rate_diff=item.winRate+"-"+item.winDiff;
                            if(item.recent>0){
                                item.recent=item.recent+"连胜";
                            }else if(item.recent<0){
                                item.recent=item.recent+"连败";
                            }else{
                                item.recent="无";
                            }

                        });
                        me.teamRankData = d;
                    } else {
                        me.$message({
                            message: res.msg,
                            type: "warning"
                        });
                    }
                });
            },
            tabSwitch(tab) {
                if (tab.name == "schedule") {
                    this.getMySchedule();
                }
            },
            rankSwitch(tab){
                if(tab.name=="west"){
                    this.getSeasonTeamRank(1);
                }else if (tab.name == "east") {
                    this.getSeasonTeamRank(2);
                }
            }
        }
    }
</script>

<style scoped>
    .el-row {
        margin-bottom: 20px;
    }
</style>