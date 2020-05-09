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
                    <div v-if="signUpStatus==2">
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
                                    <el-col :span="9" :offset="1">
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
                                                            <el-table-column property="recent"
                                                                             label="近况"></el-table-column>
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
                                                            <el-table-column property="recent"
                                                                             label="近况"></el-table-column>
                                                        </el-table>
                                                    </el-tab-pane>
                                                </el-tabs>
                                            </el-card>


                                        </el-row>
                                    </el-col>
                                </el-row>
                            </el-tab-pane>
                            <el-tab-pane label="赛程管理" name="schedule">
                                <el-switch
                                        v-model="scheduleSwitch"
                                        active-text="我的赛程"
                                        inactive-text="全部赛程"
                                        @change="switchSchedule">
                                </el-switch>
                                <el-table :data="myScheduleData" height="750">
                                    <el-table-column type="index" label="场次"></el-table-column>
                                    <el-table-column property="matchTime" label="比赛时间"></el-table-column>
                                    <el-table-column property="result" label="结果"></el-table-column>
                                    <el-table-column property="homeTeamName" label="主队"></el-table-column>
                                    <el-table-column property="awayTeamName" label="客队"></el-table-column>
                                    <el-table-column property="matchBriefInfoDto.homeScore"
                                                     label="主队比分"></el-table-column>
                                    <el-table-column property="matchBriefInfoDto.awayScore"
                                                     label="客队比分"></el-table-column>
                                    <el-table-column label="操作">
                                        <template slot-scope="scope">
                                            <el-button
                                                    v-if="scope.row.status==1"
                                                    size="mini"
                                                    @click="enterLive(scope.row)">进入直播
                                            </el-button>
                                            <el-button
                                                    v-if="scope.row.status==2"
                                                    size="mini"
                                                    @click="viewStats(scope.row)">数据统计
                                            </el-button>
                                        </template>
                                    </el-table-column>
                                </el-table>
                            </el-tab-pane>
                            <el-tab-pane label="数据统计" name="stats">
                                <el-tabs v-model="statsTab" @tab-click="handleStatsTabSwitch">
                                    <el-tab-pane label="球队数据" name="teamStats">
                                        <el-tabs v-model="teamStatsTab" tab-position="left" @tab-click="handleTeamStatsSwitch">
                                            <el-tab-pane label="西部排名" name="west">
                                                <el-table :data="teamRankData" height="560">
                                                    <el-table-column type="index" label="排名"></el-table-column>
                                                    <el-table-column property="teamName"
                                                                     label="球队"></el-table-column>
                                                    <el-table-column property="win_lose"
                                                                     label="胜-负"></el-table-column>
                                                    <el-table-column property="rate_diff"
                                                                     label="胜率/胜场差"></el-table-column>
                                                    <el-table-column property="recent"
                                                                     label="近况"></el-table-column>
                                                </el-table>
                                            </el-tab-pane>
                                            <el-tab-pane label="东部排名" name="east">
                                                <el-table :data="teamRankData" height="560">
                                                    <el-table-column type="index" label="排名"></el-table-column>
                                                    <el-table-column property="teamName"
                                                                     label="球队"></el-table-column>
                                                    <el-table-column property="win_lose"
                                                                     label="胜-负"></el-table-column>
                                                    <el-table-column property="rate_diff"
                                                                     label="胜率/胜场差"></el-table-column>
                                                    <el-table-column property="recent"
                                                                     label="近况"></el-table-column>
                                                </el-table>
                                            </el-tab-pane>
                                            <el-tab-pane label="得分榜" name="score">
                                                <el-table :data="teamAvgScoreRankData" >
                                                    <el-table-column type="index" label="排名"></el-table-column>
                                                    <el-table-column property="teamName"
                                                                     label="球队"></el-table-column>
                                                    <el-table-column property="matchCount"
                                                                     label="比赛场数"></el-table-column>
                                                    <el-table-column property="total"
                                                                     label="总得分"></el-table-column>
                                                    <el-table-column property="avg"
                                                                     label="场均得分"></el-table-column>
                                                </el-table>
                                            </el-tab-pane>
                                            <el-tab-pane label="失分榜" name="loss">
                                                <el-table :data="teamAvgLossRankData" >
                                                    <el-table-column type="index" label="排名"></el-table-column>
                                                    <el-table-column property="teamName"
                                                                     label="球队"></el-table-column>
                                                    <el-table-column property="matchCount"
                                                                     label="比赛场数"></el-table-column>
                                                    <el-table-column property="total"
                                                                     label="总失分"></el-table-column>
                                                    <el-table-column property="avg"
                                                                     label="场均失分"></el-table-column>
                                                </el-table>
                                            </el-tab-pane>
                                            <el-tab-pane label="篮板榜" name="reb">
                                                <el-table :data="teamAvgRebRankData" >
                                                    <el-table-column type="index" label="排名"></el-table-column>
                                                    <el-table-column property="teamName"
                                                                     label="球队"></el-table-column>
                                                    <el-table-column property="matchCount"
                                                                     label="比赛场数"></el-table-column>
                                                    <el-table-column property="total"
                                                                     label="总篮板"></el-table-column>
                                                    <el-table-column property="avg"
                                                                     label="场均篮板"></el-table-column>
                                                </el-table>
                                            </el-tab-pane>
                                        </el-tabs>
                                    </el-tab-pane>
                                    <el-tab-pane label="球员数据" name="playerStats">配置管理</el-tab-pane>
                                </el-tabs>
                            </el-tab-pane>
                        </el-tabs>
                    </div>
                    <div v-if="signUpStatus!=2">
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
                                       v-if="signUpStatus==0" @click="applySeasonDialogVisible=true">报名
                            </el-button>
                            <h3 v-if="signUpStatus==1">已报名，请等待分配结果</h3>
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
                                <el-button type="primary" plain @click="signUp()"  style="width: 100%">
                                    报名
                                </el-button>
                            </el-form-item>
                        </el-form>
                    </el-dialog>

                    <el-dialog title="我的赛程" :visible.sync="scheduleDialogVisible" width="80%">

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
                    </el-dialog>



                </el-main>
            </el-container>
        </el-container>
    </el-container>
</template>

<script>
    import Sidebar from "@/views/layout/sidebar/sidebar";
    import NavBar from "@/views/layout/header/header";
    var onCourtPlayers;
    export default {
        components: {Sidebar, NavBar},
        name: "season",
        data() {
            return {
                scheduleSwitch:true,
                teamAvgLossRankData:[],
                teamAvgRebRankData:[],
                awayStatsData:[],
                homeStatsData:[],
                teamStatsTab:"west",
                statsTab:"teamStats",
                signUpStatus:0,
                rankActiveName: "west",
                vsTeam: "Koliday   VS    ccTeam",
                applySeasonDialogVisible: false,
                scheduleDialogVisible: false,
                signUpForm: {
                    conference: '西部'
                },
                matchStatsDialogVisible:false,
                matchStatsData:[],
                teamAvgScoreRankData:[],
                matchLiveDialogVisible: false,
                activeName: "main",
                myScheduleData: [],
                myTodayScheduleData: [],
                teamRankData: [{
                    teamName: "Koliday",
                    win_lose: "12-5",
                    rate_diff: "80%/0.0",
                    recent: "4连胜"
                }],
                liveContent: ["比赛直播即将开始"],
                scores: "",
                stats: [],
                finishedMatchData: [],
                matchTime: "",
                homeTeamName: "",
                awayTeamName: "",
                matchCount: 0,
                ongoingPrompt: "匹配",
                playerIn:-1,
                playerOut:-1
            }
        },
        async mounted() {
            await this.getSignUpStatus();
            console.log(this.signUpStatus);
            if (this.signUpStatus==2) {
                this.getMyTodaySchedule();
                this.getTeamRank(1);
            }
        },
        methods: {

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
            async getSignUpStatus() {
                const me = this;
                await this.axios.post("http://www.jrsports.com/api/season/signUp/getSignUpStatus", null, {
                    headers: {
                        "userToken": localStorage.getItem("userToken"),
                        "teamToken": sessionStorage.getItem("teamToken")
                    }
                }).then(function (response) {
                    const res = response.data;
                    if (res.code === 0) {
                        me.signUpStatus = res.data;
                    } else {
                        me.$message({
                            message: res.msg,
                            type: "warning"
                        });
                    }
                });
            },
            switchSchedule(val){
                if(val){
                    this.getMySchedule();
                }else{
                    this.getAllSchedule();
                }
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
                            if (item.status == 0) {
                                item.result = "未赛";
                                item.matchBriefInfoDto.homeScore="-";
                                item.matchBriefInfoDto.awayScore="-";
                            } else if (item.status == 1) {
                                item.result = "进行中";
                            } else {
                                if (item.result == 0) {
                                    item.result = "负";
                                } else if (item.result == 1) {
                                    item.result = "胜";
                                }
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
            getAllSchedule() {
                const me = this;
                this.axios.post("http://www.jrsports.com/api/season/schedule/getAllSchedule", null, {
                    headers: {
                        "userToken": localStorage.getItem("userToken"),
                        "teamToken": sessionStorage.getItem("teamToken")
                    }
                }).then(function (response) {
                    const res = response.data;
                    if (res.code === 0) {
                        let d = res.data;
                        d.forEach(function (item) {
                            if (item.status == 0) {
                                item.result = "未赛";
                                item.matchBriefInfoDto.homeScore="-";
                                item.matchBriefInfoDto.awayScore="-";
                            } else if (item.status == 1) {
                                item.result = "进行中";
                            } else {
                                // if (item.result == 0) {
                                //     item.result = "负";
                                // } else if (item.result == 1) {
                                //     item.result = "胜";
                                // }
                                item.result="完场";
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
                            if (item.status == 0) {
                                item.result = "未赛";
                            } else if (item.status == 1) {
                                item.result = "进行中";
                            } else {
                                if (item.result == 0) {
                                    item.result = "负";
                                } else if (item.result == 1) {
                                    item.result = "胜";
                                }
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
            getTeamRank(conference) {
                const me = this;
                this.axios.post("http://www.jrsports.com/api/season/stats/getTeamRank/" + conference, null, {
                    headers: {
                        "userToken": localStorage.getItem("userToken"),
                        "teamToken": sessionStorage.getItem("teamToken")
                    }
                }).then(function (response) {
                    const res = response.data;
                    if (res.code === 0) {
                        let d = res.data;
                        d.forEach(function (item) {
                            item.win_lose = item.win + "-" + item.lose;
                            item.rate_diff = item.winRate + "-" + item.winDiff;
                            if (item.recent > 0) {
                                item.recent = item.recent + "连胜";
                            } else if (item.recent < 0) {
                                item.recent = -item.recent + "连败";
                            } else {
                                item.recent = "无";
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

            getSeasonAvgScoreRank() {
                const me = this;
                this.axios.post("http://www.jrsports.com/api/season/stats/getTeamAvgScoreRank", null, {
                    headers: {
                        "userToken": localStorage.getItem("userToken"),
                        "teamToken": sessionStorage.getItem("teamToken")
                    }
                }).then(function (response) {
                    const res = response.data;
                    if (res.code === 0) {
                        let d = res.data;
                        me.teamAvgScoreRankData = d;
                    } else {
                        me.$message({
                            message: res.msg,
                            type: "warning"
                        });
                    }
                });
            },
            getSeasonAvgLossRank() {
                const me = this;
                this.axios.post("http://www.jrsports.com/api/season/stats/getTeamAvgLossRank", null, {
                    headers: {
                        "userToken": localStorage.getItem("userToken"),
                        "teamToken": sessionStorage.getItem("teamToken")
                    }
                }).then(function (response) {
                    const res = response.data;
                    if (res.code === 0) {
                        let d = res.data;
                        me.teamAvgLossRankData = d;
                    } else {
                        me.$message({
                            message: res.msg,
                            type: "warning"
                        });
                    }
                });
            },
            getSeasonAvgRebRank() {
                const me = this;
                this.axios.post("http://www.jrsports.com/api/season/stats/getTeamAvgRebRank", null, {
                    headers: {
                        "userToken": localStorage.getItem("userToken"),
                        "teamToken": sessionStorage.getItem("teamToken")
                    }
                }).then(function (response) {
                    const res = response.data;
                    if (res.code === 0) {
                        let d = res.data;
                        me.teamAvgRebRankData = d;
                    } else {
                        me.$message({
                            message: res.msg,
                            type: "warning"
                        });
                    }
                });
            },
            enterLive(row){
                this.matchLiveDialogVisible = true;
                this.matchLive(row.matchId);
            },
            async matchLive(matchId) { //连接websocket
                console.log("!!!");
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
            websocketonopen() { //连接建立之后执行send方法发送数据

            },
            websocketonerror() {//连接建立失败重连
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
            websocketclose(e) {  //关闭
                console.log("断开连接 " + e);
                // this.$message({
                //     message: "断开连接 " + e,
                //     type: "warning"
                // });
                // location.reload();
            },
            tabSwitch(tab) {
                if (tab.name == "schedule") {
                    this.getMySchedule();
                }
            },
            rankSwitch(tab) {
                if (tab.name == "west") {
                    this.getTeamRank(1);
                } else if (tab.name == "east") {
                    this.getTeamRank(2);
                }
            },
            handleTeamStatsSwitch(tab){
                if (tab.name == "west") {
                    this.getTeamRank(1);
                } else if (tab.name == "east") {
                    this.getTeamRank(2);
                } else if (tab.name == "score") {
                    this.getSeasonAvgScoreRank();
                } else if(tab.name=="loss"){
                    this.getSeasonAvgLossRank();
                } else if(tab.name=="reb"){
                    this.getSeasonAvgRebRank();
                }
            },
            viewStats(row) {
                const me = this;
                this.axios.post("http://www.jrsports.com/api/matchserver/match/getMatchDetailInfo/"+row.matchId,null, {
                    headers: {
                        "userToken": localStorage.getItem("userToken"),
                        "teamToken": sessionStorage.getItem("teamToken")
                    }
                }).then(function (response) {
                    const matchStatsResponse = response.data;
                    if (matchStatsResponse.code === 0) {
                        // let i;
                        let data=matchStatsResponse.data;
                        let homeTeamId=data.matchBriefInfoDto.homeTeamId;
                        let awayTeamId=data.matchBriefInfoDto.awayTeamId;
                        console.log(homeTeamId);
                        console.log(data.matchPlayerStatsDtoMap);
                        let homeData=data.matchPlayerStatsDtoMap[homeTeamId];

                        let awayData=data.matchPlayerStatsDtoMap[awayTeamId];
                        //转换时间
                        for(let i = 0; i<homeData.length; i++){
                            homeData[i]["time"]=me.secondsToTime(homeData[i]["time"]/10)
                        }
                        for(let i=0;i<awayData.length;i++){
                            awayData[i]["time"]=me.secondsToTime(awayData[i]["time"]/10)
                        }

                        me.homeStatsData=homeData;
                        me.awayStatsData=awayData;
                        me.matchStatsDialogVisible=true;
                    } else {
                        alert(matchStatsResponse.message);
                    }
                });
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
            quitLive() {
                this.websock.close();
            },
        }
    }
</script>

<style scoped>
    .el-row {
        margin-bottom: 20px;
    }
</style>