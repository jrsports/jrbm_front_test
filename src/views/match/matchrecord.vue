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
                    <el-tabs v-model="activeTab" type="card" @tab-click="switchTab">
                        <el-tab-pane label="排位赛" name="rank">
                            <el-table :data="rankMatchRecordData">
                                <el-table-column
                                        prop="matchId"
                                        label="比赛ID">
                                </el-table-column>
                                <el-table-column
                                        prop="homeTeamName"
                                        label="主队">
                                </el-table-column>
                                <el-table-column
                                        prop="awayTeamName"
                                        label="客队">
                                </el-table-column>
                                <el-table-column
                                        prop="homeScore"
                                        label="主队得分">
                                </el-table-column>
                                <el-table-column
                                        prop="awayScore"
                                        label="客队得分">
                                </el-table-column>
                                <el-table-column
                                        prop="result"
                                        label="结果">
                                </el-table-column>
                                <el-table-column label="操作">
                                    <template slot-scope="scope">
                                        <el-button
                                                v-if="scope.row.status===1"
                                                size="mini"
                                                @click="enterLive(scope.row)">进入直播
                                        </el-button>
                                        <el-button
                                                v-if="scope.row.status===2"
                                                size="mini"
                                                @click="viewStats(scope.row)">数据统计
                                        </el-button>
                                    </template>
                                </el-table-column>
                            </el-table>
                        </el-tab-pane>
                        <el-tab-pane label="赛季" name="season">
                            <el-table :data="seasonMatchRecordData">
                                <el-table-column
                                        prop="matchId"
                                        label="比赛ID">
                                </el-table-column>
                                <el-table-column
                                        prop="homeTeamName"
                                        label="主队">
                                </el-table-column>
                                <el-table-column
                                        prop="awayTeamName"
                                        label="客队">
                                </el-table-column>
                                <el-table-column
                                        prop="homeScore"
                                        label="主队得分">
                                </el-table-column>
                                <el-table-column
                                        prop="awayScore"
                                        label="客队得分">
                                </el-table-column>
                                <el-table-column
                                        prop="result"
                                        label="结果">
                                </el-table-column>
                            </el-table>
                        </el-tab-pane>
                        <el-tab-pane label="友谊赛" name="friend">
                            <el-table :data="friendMatchRecordData">
                                <el-table-column
                                        prop="matchId"
                                        label="比赛ID">
                                </el-table-column>
                                <el-table-column
                                        prop="startTime"
                                        label="比赛时间">
                                </el-table-column>
                                <el-table-column
                                        prop="homeTeamName"
                                        label="主队">
                                </el-table-column>
                                <el-table-column
                                        prop="awayTeamName"
                                        label="客队">
                                </el-table-column>
                                <el-table-column
                                        prop="homeScore"
                                        label="主队得分">
                                </el-table-column>
                                <el-table-column
                                        prop="awayScore"
                                        label="客队得分">
                                </el-table-column>
                                <el-table-column
                                        prop="result"
                                        label="结果">
                                </el-table-column>
                                <el-table-column label="操作">
                                    <template slot-scope="scope">
                                        <el-button
                                                v-if="scope.row.status===1"
                                                size="mini"
                                                @click="enterLive(scope.row)">进入直播
                                        </el-button>
                                        <el-button
                                                v-if="scope.row.status===2"
                                                size="mini"
                                                @click="viewStats(scope.row)">数据统计
                                        </el-button>
                                    </template>
                                </el-table-column>
                            </el-table>
                            <el-pagination
                                    background
                                    layout="prev, pager, next"
                                    :total="friendMatchRecordPage.totalRecordCount"
                                    :page-count="friendMatchRecordPage.totalPageCount"
                                    :current-page="friendMatchRecordPage.pageNo"
                                    :page-size="friendMatchRecordPage.pageSize"
                                    @current-change="handleCurrentChange"
                            >
                            </el-pagination>
                        </el-tab-pane>
                    </el-tabs>

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
    import {getMatchRecordList} from "@/api/match";
    import MatchStatsDialog from "@/components/MatchStatsDialog";
    import {formatDate} from "@/utils/date";

    export default {
        name: "matchrecord",
        components: {Sidebar,NavBar,MatchStatsDialog,MatchLiveDialog},
        data() {
            return {
                activeTab:"friend",
                friendMatchRecordData:[],
                seasonMatchRecordData:[],
                rankMatchRecordData:[],
                friendMatchRecordPage:{
                    totalRecordCount:150,
                    totalPageCount:15,
                    pageNo:1,
                    pageSize:10
                }
            }
        },
        mounted(){
            this.switchTab({name:"friend"});
        },
        methods:{
            switchTab(tab) {
                if (tab.name === "rank") {
                    this.getMatchRecordList(1,2,'rankMatchRecordData');
                }else if(tab.name==="season"){
                    this.getMatchRecordList(1,1,'seasonMatchRecordData');
                }else if(tab.name==="friend"){
                    this.getMatchRecordList(1,3,'friendMatchRecordData');
                }
            },
            getMatchRecordList(pageNo,type,dataSource){
                getMatchRecordList({
                    pageRequest:{
                        pageNo:pageNo,
                        pageSize:10
                    },
                    type:type
                }).then(res=>{
                    if(res.code===0){
                        this.friendMatchRecordPage=res.data;
                        this[dataSource]=res.data.recordList;
                        this[dataSource].forEach(item=>{
                            item.startTime = formatDate(new Date(item.startTime), "yyyy-MM-dd hh:mm:ss");
                            if(item.status===1){
                                item.result="进行中";
                            }else{
                                item.result=item.resultMap[this.$store.getters.teamId]?"胜":"负";
                            }

                        });
                    }
                });
            },
            viewStats(row){
                this.$refs.matchStatsDialogRef.loadStats(row.matchId);
            },
            enterLive(row) {
                this.$refs.matchLiveDialogRef.loadMatch(row.matchId);
            },
            handleCurrentChange(pageNo){
                // this.friendMatchRecordPage.pageNo=pageNo;
                this.getMatchRecordList(pageNo,3,'friendMatchRecordData');
            },
        }
    }
</script>

<style scoped>

</style>