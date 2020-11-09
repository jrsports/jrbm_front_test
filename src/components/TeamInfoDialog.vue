<template>

    <el-container>
        <el-dialog title="球队详情" :visible.sync="teamDetailDialogVisible" width="1300px">
            <el-tabs type="border-card">
                <el-tab-pane>
                    <span slot="label"><i class="el-icon-date"></i> 大名单</span>
                    <el-table
                            ref="rosterTable"
                            v-loading="teamInfoLoading"
                            :data="teamInfo.rosterList"
                            style="width: 100%">
                        <el-table-column
                                prop="order"
                                label="序号"
                                width="100">
                        </el-table-column>
                        <el-table-column
                                label="球员"
                                width="100">
                            <template slot-scope="scope">
                                <div class="block">
                                    <el-avatar shape="square" :size="50" :src="scope.row.avatarUrl"></el-avatar>
                                </div>
                            </template>
                        </el-table-column>
                        <el-table-column
                                prop="chname"
                                label="中文名"
                                width="180">
                        </el-table-column>
                        <el-table-column
                                prop="enname"
                                label="英文名"
                                width="180">
                        </el-table-column>
                        <el-table-column
                                prop="position"
                                label="位置">
                        </el-table-column>
                        <el-table-column
                                prop="type"
                                label="类型">
                        </el-table-column>
                        <el-table-column
                                prop="price"
                                label="身价">
                        </el-table-column>
                        <el-table-column
                                prop="currentSeasonSalary"
                                label="本赛季工资">
                        </el-table-column>
                        <el-table-column
                                prop="overall"
                                label="总评">
                        </el-table-column>
                        <el-table-column
                                prop="grade"
                                label="等级">
                        </el-table-column>
                        <el-table-column
                                fixed="right"
                                label="操作"
                                width="100">
                            <template slot-scope="scope">
                                <el-button @click="handlePlayerDetail(scope.row.upId)" type="text" size="small">
                                    详细
                                </el-button>
                            </template>
                        </el-table-column>
                    </el-table>
                </el-tab-pane>
                <el-tab-pane label="交易管理">
                    <el-row>
                        <h3>交易评分：{{tradeInfo.score}}</h3>
                        <h5>备注：{{tradeInfo.memo}}</h5>
                    </el-row>
                    <el-row>
                        <el-col span=8>
                            <h4>可交易球员列表</h4>
                            <div v-for="player in tradeInfo.tradablePlayerList" :key="player">
                                <el-row>
                                    <el-col span=8>
                                        <el-avatar shape="square" :size="30" :src="player.avatarUrl"></el-avatar>
                                    </el-col>
                                    <el-col span=8>
                                        <span>{{player.chname}}</span>
                                    </el-col>
                                    <el-col span=8>
                                        <el-tag :type="player.priority==0?'success':player.priority==1?'warning':'danger'">{{player.priority==0?'低':player.priority==1?'中':'高'}}</el-tag>
                                    </el-col>
                                </el-row>
                            </div>
                        </el-col>
                        <el-col span=8>
                            <h4>可交易球员列表</h4>
                        </el-col>
                        <el-col span=8>
                            <h4>可交易球员列表</h4>
                        </el-col>
                    </el-row>
                </el-tab-pane>
            </el-tabs>
        </el-dialog>
        <PlayerInfoDialog ref="playerInfoDialogRef"></PlayerInfoDialog>
    </el-container>

</template>

<script>
    import {getOtherTeamInfo, getTradeInfo} from "@/api/team";
    import {convertPlayerInfo} from "@/utils/PlayerInfoUtil";
    import PlayerInfoDialog from "@/components/PlayerInfoDialog";

    export default {
        name: "TeamInfoDialog",
        components:{PlayerInfoDialog},
        data() {
            return {
                teamDetailDialogVisible: true,
                teamInfo: {
                    rosterList: [{
                        avatarUrl: "https://cube.elemecdn.com/9/c2/f0ee8a3c7c9638a54940382568c9dpng.png",
                        chname: "勒布朗-詹姆斯",
                        enname: "Lebron James",
                        offensive: 126,
                        defensive: 110,
                        position: "PG/SG",
                        salary: 4800,
                        overall: 97,
                        type: "现役",
                        price: "2390",
                        grade: "S+",
                        order: "1"
                    }],
                },
                teamInfoLoading: false,
                tradeInfo:{
                    score:90,
                    memo:"都可以",
                    tradablePlayerList:[
                        {
                            upId:12,
                            avatarUrl:"https://cube.elemecdn.com/9/c2/f0ee8a3c7c9638a54940382568c9dpng.png",
                            chname:"勒布朗-詹姆斯",
                            priority:"高"
                        }
                    ]
                }


            }

        },
        methods: {
            show(teamId) {
                this.teamDetailDialogVisible = true;
                this.teamInfoLoading = true;
                getOtherTeamInfo({teamId: teamId}).then(res => {

                    this.teamInfo = res.data;
                    this.teamInfo.rosterList.forEach(function (item) {
                        convertPlayerInfo(item)
                    });
                    this.teamInfoLoading = false;
                });
                getTradeInfo({teamId:teamId}).then(res=>{
                   this.tradeInfo=res.data;

                });
            },
            handlePlayerDetail(upId) {
                this.$refs.playerInfoDialogRef.show(upId);
            },
        }
    }
</script>

<style scoped>

</style>