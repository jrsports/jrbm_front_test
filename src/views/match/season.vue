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
                    <div v-if="seasonStatus.signUpStatus===2">
                        <el-tabs v-model="activeName" type="card" @tab-click="tabSwitch">
                            <el-tab-pane label="主页" name="main">
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
                                    <el-col span="9" :offset="1">
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
                            <el-tab-pane label="赛程" name="schedule">
                                <el-switch
                                        v-model="scheduleSwitch"
                                        active-text="我的赛程"
                                        inactive-text="全部赛程"
                                        @change="switchSchedule">
                                </el-switch>
                                <el-date-picker
                                        v-model="scheduleDate"
                                        type="date"
                                        placeholder="选择日期">
                                </el-date-picker>
                                <el-button @click="getPlayOffView">季后赛视图</el-button>
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
                            <el-tab-pane label="数据" name="stats">
                                <el-tabs v-model="statsTab" @tab-click="handleStatsTabSwitch">
                                    <el-tab-pane label="球队数据" name="teamStats">
                                        <el-tabs v-model="teamStatsTab" tab-position="left"
                                                 @tab-click="handleTeamStatsSwitch">
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
                                                <el-table :data="teamStatsRankData">
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
                                                <el-table :data="teamStatsRankData">
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
                                                <el-table :data="teamStatsRankData">
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
                                            <el-tab-pane label="助攻榜" name="assist">
                                                <el-table :data="teamStatsRankData">
                                                    <el-table-column type="index" label="排名"></el-table-column>
                                                    <el-table-column property="teamName"
                                                                     label="球队"></el-table-column>
                                                    <el-table-column property="matchCount"
                                                                     label="比赛场数"></el-table-column>
                                                    <el-table-column property="total"
                                                                     label="总助攻"></el-table-column>
                                                    <el-table-column property="avg"
                                                                     label="场均助攻"></el-table-column>
                                                </el-table>
                                            </el-tab-pane>
                                            <el-tab-pane label="抢断榜" name="steal">
                                                <el-table :data="teamStatsRankData">
                                                    <el-table-column type="index" label="排名"></el-table-column>
                                                    <el-table-column property="teamName"
                                                                     label="球队"></el-table-column>
                                                    <el-table-column property="matchCount"
                                                                     label="比赛场数"></el-table-column>
                                                    <el-table-column property="total"
                                                                     label="总抢断"></el-table-column>
                                                    <el-table-column property="avg"
                                                                     label="场均抢断"></el-table-column>
                                                </el-table>
                                            </el-tab-pane>
                                            <el-tab-pane label="失误榜" name="turnover">
                                                <el-table :data="teamStatsRankData">
                                                    <el-table-column type="index" label="排名"></el-table-column>
                                                    <el-table-column property="teamName"
                                                                     label="球队"></el-table-column>
                                                    <el-table-column property="matchCount"
                                                                     label="比赛场数"></el-table-column>
                                                    <el-table-column property="total"
                                                                     label="总失误"></el-table-column>
                                                    <el-table-column property="avg"
                                                                     label="场均失误"></el-table-column>
                                                </el-table>
                                            </el-tab-pane>
                                            <el-tab-pane label="盖帽榜" name="block">
                                                <el-table :data="teamStatsRankData">
                                                    <el-table-column type="index" label="排名"></el-table-column>
                                                    <el-table-column property="teamName"
                                                                     label="球队"></el-table-column>
                                                    <el-table-column property="matchCount"
                                                                     label="比赛场数"></el-table-column>
                                                    <el-table-column property="total"
                                                                     label="总盖帽"></el-table-column>
                                                    <el-table-column property="avg"
                                                                     label="场均盖帽"></el-table-column>
                                                </el-table>
                                            </el-tab-pane>
                                        </el-tabs>
                                    </el-tab-pane>
                                    <el-tab-pane label="球员数据" name="playerStats">
                                        <el-tabs v-model="playerStatsTab" tab-position="left"
                                                 @tab-click="handlePlayerStatsSwitch">
                                            <el-tab-pane label="得分榜" name="score">
                                                <el-table :data="playerStatsRankData">
                                                    <el-table-column type="index" label="排名"></el-table-column>
                                                    <el-table-column property="playerName"
                                                                     label="球员"></el-table-column>
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
                                            <el-tab-pane label="篮板榜" name="reb">
                                                <el-table :data="playerStatsRankData">
                                                    <el-table-column type="index" label="排名"></el-table-column>
                                                    <el-table-column property="playerName"
                                                                     label="球员"></el-table-column>
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
                                            <el-tab-pane label="助攻榜" name="assist">
                                                <el-table :data="playerStatsRankData">
                                                    <el-table-column type="index" label="排名"></el-table-column>
                                                    <el-table-column property="playerName"
                                                                     label="球员"></el-table-column>
                                                    <el-table-column property="teamName"
                                                                     label="球队"></el-table-column>
                                                    <el-table-column property="matchCount"
                                                                     label="比赛场数"></el-table-column>
                                                    <el-table-column property="total"
                                                                     label="总助攻"></el-table-column>
                                                    <el-table-column property="avg"
                                                                     label="场均助攻"></el-table-column>
                                                </el-table>
                                            </el-tab-pane>
                                            <el-tab-pane label="抢断榜" name="steal">
                                                <el-table :data="playerStatsRankData">
                                                    <el-table-column type="index" label="排名"></el-table-column>
                                                    <el-table-column property="playerName"
                                                                     label="球员"></el-table-column>
                                                    <el-table-column property="teamName"
                                                                     label="球队"></el-table-column>
                                                    <el-table-column property="matchCount"
                                                                     label="比赛场数"></el-table-column>
                                                    <el-table-column property="total"
                                                                     label="总抢断"></el-table-column>
                                                    <el-table-column property="avg"
                                                                     label="场均抢断"></el-table-column>
                                                </el-table>
                                            </el-tab-pane>
                                            <el-tab-pane label="失误榜" name="turnover">
                                                <el-table :data="playerStatsRankData">
                                                    <el-table-column type="index" label="排名"></el-table-column>
                                                    <el-table-column property="playerName"
                                                                     label="球员"></el-table-column>
                                                    <el-table-column property="teamName"
                                                                     label="球队"></el-table-column>
                                                    <el-table-column property="matchCount"
                                                                     label="比赛场数"></el-table-column>
                                                    <el-table-column property="total"
                                                                     label="总失误"></el-table-column>
                                                    <el-table-column property="avg"
                                                                     label="场均失误"></el-table-column>
                                                </el-table>
                                            </el-tab-pane>
                                            <el-tab-pane label="盖帽榜" name="block">
                                                <el-table :data="playerStatsRankData">
                                                    <el-table-column type="index" label="排名"></el-table-column>
                                                    <el-table-column property="playerName"
                                                                     label="球员"></el-table-column>
                                                    <el-table-column property="teamName"
                                                                     label="球队"></el-table-column>
                                                    <el-table-column property="matchCount"
                                                                     label="比赛场数"></el-table-column>
                                                    <el-table-column property="total"
                                                                     label="总盖帽"></el-table-column>
                                                    <el-table-column property="avg"
                                                                     label="场均盖帽"></el-table-column>
                                                </el-table>
                                            </el-tab-pane>
                                        </el-tabs>
                                    </el-tab-pane>
                                </el-tabs>
                            </el-tab-pane>
                            <el-tab-pane label="执教" name="coach"></el-tab-pane>
                            <el-tab-pane label="联盟" name="league"></el-tab-pane>
                        </el-tabs>
                    </div>
                    <div v-if="seasonStatus.signUpStatus<2">
                        <el-card>
                            <div slot="header">
                                <span>我的赛季{{seasonStatus.signUpStatus===0?'(未报名，下一个赛季为第'+seasonStatus.signUpSeason+'赛季)':'(已报名，等待分配)'}}</span>
                            </div>
                            <div v-if="seasonStatus.signUpStatus===0">
                                <el-table :data="seasonSignUpData">
                                    <el-table-column
                                            prop="salaryCapLevel"
                                            label="工资帽级别">
                                    </el-table-column>
                                    <el-table-column
                                            prop="reward"
                                            label="奖金">
                                    </el-table-column>
                                    <el-table-column
                                            fixed="right"
                                            label="操作"
                                            width="180">
                                        <template slot-scope="scope">
                                            <el-button @click="showSignUp(scope.row)"
                                                       type="text" size="small">报名
                                            </el-button>
                                        </template>
                                    </el-table-column>
                                </el-table>
                            </div>
                            <div v-if="seasonStatus.signUpStatus===1">
                                <el-alert
                                        title="您已报名赛季，请耐心等待赛程安排"
                                        type="success"
                                        show-icon>
                                </el-alert>
                            </div>
                        </el-card>

                        <el-card style="margin-top: 100px">
                            <div slot="header">
                                <span>正在进行的赛季</span>
                            </div>
                            <div>
                                <el-table :data="playingSeasonData">
                                    <el-table-column
                                            prop="seasonId"
                                            label="赛季ID">
                                    </el-table-column>
                                    <el-table-column
                                            prop="salaryCapLevel"
                                            label="工资帽级别">
                                    </el-table-column>
                                    <el-table-column
                                            fixed="right"
                                            label="操作"
                                            width="180">
                                        <template slot-scope="scope">
                                            <el-button @click="showSeasonDetail(scope.row)"
                                                       type="text" size="small">详情
                                            </el-button>
                                        </template>
                                    </el-table-column>
                                </el-table>
                            </div>
                        </el-card>
                    </div>

                    <el-dialog title="新赛季报名" :visible.sync="applySeasonDialogVisible">
                        <el-alert
                                title="赛季报名后，大名单变动将被限制"
                                type="info"
                                show-icon>
                        </el-alert>
                        <el-form ref="form" :model="signUpForm" label-position="top">
                            <el-form-item label="赛季">
                                <el-input disabled :value="'第'+seasonStatus.signUpSeason+'赛季'"></el-input>
                            </el-form-item>
                            <el-form-item label="组别">
                                <el-input disabled :value="signUpForm.salaryCapLevel"></el-input>
                            </el-form-item>
                            <el-form-item label="赛区">
                                <el-radio-group v-model="signUpForm.conference">
                                    <el-radio-button label="西部"></el-radio-button>
                                    <el-radio-button label="东部"></el-radio-button>
                                </el-radio-group>
                            </el-form-item>
                            <el-form-item>
                                <el-button type="primary" plain @click="signUp()" style="width: 100%">
                                    报名
                                </el-button>
                            </el-form-item>
                        </el-form>
                    </el-dialog>






                    <MatchStatsDialog ref="matchStatsDialogRef"></MatchStatsDialog>

                    <MatchLiveDialog ref="matchLiveDialogRef"></MatchLiveDialog>


                </el-main>
            </el-container>
        </el-container>
    </el-container>
</template>

<script>
    import Sidebar from "@/views/layout/sidebar/sidebar";
    import NavBar from "@/views/layout/header/header";
    import MatchLiveDialog from "@/components/MatchLiveDialog";
    import MatchStatsDialog from "@/components/MatchStatsDialog";
    import {} from "@/api/season";
    import {signUp} from "@/api/season";
    import {getSignUpStatus} from "@/api/season";
    import {getMySchedule} from "@/api/season";
    import {getSchedule} from "@/api/season";
    import {getMyTodaySchedule} from "@/api/season";
    import {getPlayOffView} from "@/api/season";
    import {getSeasonPlayerStatsRank} from "@/api/season";
    import {secondsToTime} from "@/utils/timeUtil"
    import {getTeamRank} from "@/api/season";
    import {getSeasonStatsRank} from "@/api/season";
    import {getSignableSeason} from "@/api/season";
    import {getPlayingSeason} from "@/api/season";


    export default {
        components: {Sidebar, NavBar,MatchLiveDialog,MatchStatsDialog},
        name: "season",
        data() {
            return {
                scheduleSwitch: true,
                scheduleDate: new Date(),
                teamAvgLossRankData: [],
                teamAvgRebRankData: [],
                seasonSignUpData:[],
                teamStatsRankData: [],
                playerStatsRankData: [],
                teamStatsTab: "west",
                playerStatsTab: "score",
                statsTab: "teamStats",
                playingSeasonData:[],
                seasonStatus: {
                    signUpStatus: 0,
                    phase: 0,
                    signUpSeason:0,
                    deadline:0
                },
                rankActiveName: "west",
                vsTeam: "Koliday   VS    ccTeam",
                applySeasonDialogVisible: false,
                scheduleDialogVisible: false,
                signUpForm: {
                    conference: '西部',
                    salaryCapLevel:"",
                },
                matchStatsDialogVisible: false,
                matchStatsData: [],
                teamAvgScoreRankData: [],
                activeName: "main",
                myScheduleData: [],
                myTodayScheduleData: [],
                teamRankData: [{
                    teamName: "Koliday",
                    win_lose: "12-5",
                    rate_diff: "80%/0.0",
                    recent: "4连胜"
                }],
                finishedMatchData: [],
                homeTeamName: "",
                awayTeamName: "",
                matchCount: 0,
                ongoingPrompt: "匹配",
            }
        },
        mounted() {
            this.getSignUpStatus();
            this.getSignableSeason();
            this.getPlayingSeason();
        },
        methods: {
            showSignUp(row){
                this.applySeasonDialogVisible=true;
                this.signUpForm.salaryCapLevel=row.salaryCapLevel;
                this.signUpForm.level=row.level;
            },
            signUp() {
                signUp({
                    conference: this.signUpForm.conference === "西部" ? 1 : 2,
                    level:this.signUpForm.level
                }).then(res => {
                    if (res.code === 0) {
                        this.$message({
                            message: "报名成功",
                            type: "success"
                        });
                        this.$store.dispatch('team/getMyTeamInfo');
                        this.applySeasonDialogVisible = false;
                    }
                });
            },
            getSignUpStatus() {
                getSignUpStatus().then(res => {
                    if (res.code === 0) {
                        this.seasonStatus = res.data;
                        if(!this.seasonStatus.deadline){
                            this.seasonStatus.timeLeft="不限";
                        }else{
                            let secondsLeft = parseInt((this.seasonStatus.deadline - new Date().getTime()) / 1000);
                            this.seasonStatus.timeLeft=secondsToTime(secondsLeft);
                            setInterval(this.handleSignUpTime,500);
                        }
                        if (this.seasonStatus.signUpStatus === 2) {
                            this.getMyTodaySchedule();
                            this.getTeamRank(1);
                        }

                    }
                });
            },
            getSignableSeason(){
              getSignableSeason({}).then(res=>{
                  if(res.code===0){
                      this.seasonSignUpData=res.data;
                      this.seasonSignUpData.forEach(item=>{
                          if(item.level===1){
                              item.salaryCapLevel="6000万";
                          }else if(item.level===2){
                              item.salaryCapLevel="7000万";
                          }else if(item.level===3){
                              item.salaryCapLevel="8000万";
                          }else if(item.level===4){
                              item.salaryCapLevel="9000万";
                          }

                      })
                  }
              })
            },
            getPlayingSeason(){
              getPlayingSeason().then(res=>{
                  if(res.code===0){
                      this.playingSeasonData=res.data;
                      this.playingSeasonData.forEach(item=>{
                          if(item.level===1){
                              item.salaryCapLevel="6000万";
                          }else if(item.level===2){
                              item.salaryCapLevel="7000万";
                          }else if(item.level===3){
                              item.salaryCapLevel="8000万";
                          }else if(item.level===4){
                              item.salaryCapLevel="9000万";
                          }
                      });
                  }
              })
            },
            handleSignUpTime(){
                let secondsLeft = parseInt((this.seasonStatus.deadline - new Date().getTime()) / 1000);
                this.seasonStatus.timeLeft=secondsToTime(secondsLeft);
            },
            switchSchedule(val) {
                if (val) {
                    this.getMySchedule();
                } else {
                    this.getAllSchedule();
                }
            },
            getMySchedule() {
                getMySchedule({
                    date: this.scheduleDate
                }).then(res => {
                    if (res.code === 0) {
                        let me = this;
                        let d = res.data;
                        d.forEach(function (item) {
                            if (item.status == 0) {
                                item.result = "未赛";
                                item.matchBriefInfoDto.homeScore = "-";
                                item.matchBriefInfoDto.awayScore = "-";
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
                    }
                });
            },
            getAllSchedule() {
                getSchedule({
                    teamId: null,
                    date: this.scheduleDate
                }).then(res => {
                    if (res.code === 0) {
                        let d = res.data;
                        d.forEach(function (item) {
                            if (item.status == 0) {
                                item.result = "未赛";
                                item.matchBriefInfoDto.homeScore = "-";
                                item.matchBriefInfoDto.awayScore = "-";
                            } else if (item.status == 1) {
                                item.result = "进行中";
                            } else {
                                // if (item.result == 0) {
                                //     item.result = "负";
                                // } else if (item.result == 1) {
                                //     item.result = "胜";
                                // }
                                item.result = "完场";
                            }
                        });
                        this.myScheduleData = d;
                    }
                });
            },
            getMyTodaySchedule() {
                getMyTodaySchedule({
                    date: this.scheduleDate
                }).then(res=>{
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
                        this.myTodayScheduleData = d;
                    }
                });
            },
            getPlayOffView() {
                getPlayOffView().then(res=>{
                    if (res.code === 0) {
                        let d = res.data;
                        console.log(d);
                    }
                });
            },
            getTeamRank(conference) {
                const me = this;
                getTeamRank(conference).then(res=>{
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
                    }
                });
            },
            getSeasonStatsRank(type, phase, target) {
                const me = this;
                getSeasonStatsRank({
                    type: type,
                    phase: phase,
                    target: target
                }).then(res=>{
                    if (res.code === 0) {
                        let d = res.data;
                        me.teamStatsRankData = d;
                    }
                });
            },
            getSeasonPlayerStatsRank(type, phase) {
                getSeasonPlayerStatsRank({
                    type: type,
                    phase: phase
                }).then(res=>{
                    if (res.code === 0) {
                        this.playerStatsRankData = res.data;
                    }
                });
            },
            enterLive(row) {
                this.$refs.matchLiveDialogRef.loadMatch(row.matchId);
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
            handleTeamStatsSwitch(tab) {
                if (tab.name == "west") {
                    this.getTeamRank(1);
                } else if (tab.name == "east") {
                    this.getTeamRank(2);
                } else if (tab.name == "score") {
                    this.getSeasonStatsRank("score", 0, 0);
                } else if (tab.name == "loss") {
                    this.getSeasonStatsRank("score", 0, 1);
                } else if (tab.name == "reb") {
                    this.getSeasonStatsRank("rebound", 0, 0);
                } else if (tab.name == "assist") {
                    this.getSeasonStatsRank("assist", 0, 0);
                } else if (tab.name == "steal") {
                    this.getSeasonStatsRank("steal", 0, 0);
                } else if (tab.name == "turnover") {
                    this.getSeasonStatsRank("turnover", 0, 0);
                } else if (tab.name == "block") {
                    this.getSeasonStatsRank("block", 0, 0);
                }
            },
            handlePlayerStatsSwitch(tab) {
                if (tab.name == "score") {
                    this.getSeasonPlayerStatsRank("score", 0);
                } else if (tab.name == "reb") {
                    this.getSeasonPlayerStatsRank("rebound", 0);
                } else if (tab.name == "assist") {
                    this.getSeasonPlayerStatsRank("assist", 0);
                } else if (tab.name == "steal") {
                    this.getSeasonPlayerStatsRank("steal", 0);
                } else if (tab.name == "turnover") {
                    this.getSeasonPlayerStatsRank("turnover", 0);
                } else if (tab.name == "block") {
                    this.getSeasonPlayerStatsRank("block", 0);
                }
            },
            handleStatsTabSwitch(tab) {
                if (tab.name == "playerStats" && this.playerStatsRankData.length == 0) {
                    this.getSeasonPlayerStatsRank("score", 0);
                }
            },
            viewStats(row) {
                this.$refs.matchStatsDialogRef.loadStats(row.matchId);
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
        }
    }
</script>

<style scoped>
    .el-row {
        margin-bottom: 20px;
    }
</style>