<template xmlns:el-col="http://www.w3.org/1999/html">


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
                    <el-tabs tab-position="left" style="height: 900px;" @tab-click="switchTab" v-model="activeTab">
                        <el-tab-pane label="大名单" name="roster">
                            <el-row>
                                <el-col :span="2">
                                    <span>总身价:{{lineUpData.totalPrice}}万</span>
                                </el-col>
                                <el-col :span="4">
                                    <span>总工资/工资帽:{{lineUpData.totalSalary}}万/{{lineUpData.salaryCap}}万</span>
                                    <i class="el-icon-circle-plus-outline" style="cursor: pointer" @click="confirmIncreaseSalaryCap"></i>
                                </el-col>
                                <el-col :span="4">
                                    <span>大名单人数:{{lineUpData.rosterList.length}}/{{lineUpData.rosterCount}}</span>
                                </el-col>
                                <el-col :span="4">
                                    <span>平均能力值:{{lineUpData.averageOverall}}</span>
                                </el-col>
                                <el-button :icon="substituteLocked?'el-icon-lock':'el-icon-unlock'"
                                           @click="handleSubstituteLock" circle style="float: right"></el-button>
                            </el-row>
                            <el-table
                                    ref="rosterTable"
                                    v-loading="rosterTableLoading"
                                    :data="lineUpData.rosterList"
                                    highlight-current-row
                                    @current-change="handlePlayerSelect"
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
                                        v-if="this.$store.getters.season>0"
                                        prop="currentSeasonSalary"
                                        label="本赛季工资">
                                </el-table-column>
                                <el-table-column
                                        v-if="this.$store.getters.season<=0"
                                        prop="nextSeasonSalary"
                                        label="下赛季工资">
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
                                        width="120">
                                    <template slot-scope="scope">
                                        <el-button @click="handlePlayerDetail(scope.row.upId)" type="text" size="small">
                                            详细
                                        </el-button>
                                        <el-button @click="handlePlayerReserve(scope.row.upId)" type="text"
                                                   size="small">下放
                                        </el-button>
                                        <el-button @click="handlePlayerDismiss(scope.row.upId)" type="text"
                                                   size="small">解雇
                                        </el-button>
                                    </template>
                                </el-table-column>
                            </el-table>
                        </el-tab-pane>
                        <el-tab-pane label="候补名单" name="reserve">
                            <el-row>
                                <el-col :span="4">
                                    <span>候补名单人数:{{lineUpData.reserveList.length}}/{{lineUpData.reserveCount}}</span>
                                </el-col>
                            </el-row>

                            <el-table
                                    :data="lineUpData.reserveList"
                                    style="width: 100%">
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
                                        <el-button @click="handlePlayerPromote(scope.row.upId)" type="text"
                                                   size="small">提拔
                                        </el-button>
                                    </template>
                                </el-table-column>
                            </el-table>
                        </el-tab-pane>
                        <el-tab-pane label="球员蛋"></el-tab-pane>
                    </el-tabs>


                    <PlayerInfoDialog ref="playerInfoDialogRef"></PlayerInfoDialog>

                </el-main>
            </el-container>
        </el-container>
    </el-container>
</template>

<script>
    import Sidebar from "@/views/layout/sidebar/sidebar";
    import NavBar from "@/views/layout/header/header"
    // import Chat from "@/views/layout/chat/chat";
    import {getLineUp, getSalaryCapIncreaseInfo, increaseSalaryCap, substitute} from "@/api/team";
    import {convertPlayerInfo} from "@/utils/PlayerInfoUtil";
    import PlayerInfoDialog from "@/components/PlayerInfoDialog";
    import {dismiss, promote, reserve} from "@/api/player";

    export default {
        name: "gameindex",
        components: {PlayerInfoDialog, Sidebar, NavBar},
        mounted() {
            this.getUserPlayerList();
        },
        data() {
            return {
                teamName: "null",
                activeTab:"roster",
                lineUpData: {
                    totalSalary: 0,
                    salaryCap: 0,
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
                    reserveList: [{
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
                        order: 1
                    }],
                },

                substituteLocked: true,
                playerDetail: {
                    avatarUrl: "https://cube.elemecdn.com/9/c2/f0ee8a3c7c9638a54940382568c9dpng.png",
                    chname: "",
                    ability: {}
                },
                selectedUpId: -1,
                rosterTableLoading: false
            }
        },
        methods: {
            getUserPlayerList() {
                this.rosterTableLoading = true;
                getLineUp().then(res => {
                    if (res.code === 0) {
                        this.lineUpData = res.data;

                        this.lineUpData.rosterList.forEach(function (item) {
                            convertPlayerInfo(item)
                        });
                        this.lineUpData.reserveList.forEach(function (item) {
                            convertPlayerInfo(item)
                        });
                        this.rosterTableLoading = false;
                    }
                })
            },
            handlePlayerDetail(upId) {
                this.$refs.playerInfoDialogRef.show(upId);
            },
            handlePlayerReserve(upId) {
                reserve({upId: upId}).then(res => {
                    if (res.code === 0) {
                        this.$message({
                            message: "下放成功",
                            type: "success"
                        });
                        this.getUserPlayerList();
                    }
                });
            },
            handlePlayerDismiss(upId) {
                dismiss({upId: upId}).then(res => {
                    if (res.code === 0) {
                        this.$message({
                            message: "解雇成功",
                            type: "success"
                        });
                        this.getUserPlayerList();
                    }
                });
            },
            confirmIncreaseSalaryCap(){
                getSalaryCapIncreaseInfo().then(res=>{
                    if(res.code===0){
                        let currentSalaryCap = res.data.currentSalaryCap;
                        let maxSalaryCap = res.data.maxSalaryCap;
                        if(currentSalaryCap===maxSalaryCap){
                            this.$message({
                                type: 'warning',
                                message: '您已达到当前等级最高工资帽'
                            });
                        }else{
                            this.$confirm('您将消耗一张“工资帽提升卡”将工资帽从'+currentSalaryCap+"万提升至"+(currentSalaryCap+250)+"万", '提升工资帽', {
                                confirmButtonText: '确定',
                                cancelButtonText: '取消',
                                type: 'warning'
                            }).then(() => {
                                increaseSalaryCap({}).then(res=>{
                                    if(res.code===0){
                                        this.$message({
                                            type: 'success',
                                            message: '提升成功!'
                                        });
                                        this.getUserPlayerList();
                                    }
                                })

                            }).catch(() => {

                            });
                        }

                    }
                });

            },
            handlePlayerPromote(upId) {
                promote({upId: upId}).then(res => {
                    if (res.code === 0) {
                        this.$message({
                            message: "提拔成功",
                            type: "success"
                        });
                        this.getUserPlayerList();
                    }
                });
            },
            handlePlayerSelect(row) {
                if (this.substituteLocked) {
                    this.$refs.rosterTable.setCurrentRow();
                    return;
                }
                if (this.selectedUpId > 0) {
                    // 取消选择
                    if (this.selectedUpId === row.upId) {
                        this.$refs.rosterTable.setCurrentRow();
                    } else {
                        this.substitute(this.selectedUpId, row.upId);
                        this.selectedUpId = -1;
                    }

                } else {
                    this.selectedUpId = row.upId;
                }
            },
            handleSubstituteLock() {
                this.substituteLocked = !this.substituteLocked;
            },
            switchTab() {
                this.getUserPlayerList();
            },
            substitute(fromUpId, toUpId) {
                substitute({
                        fromUpId: fromUpId,
                        toUpId: toUpId
                    }
                ).then(res => {
                    if (res.code == 0) {
                        this.$message({
                            message: "换人成功",
                            type: "success"
                        });
                        this.getUserPlayerList();
                    }
                })
            },

        }
    }
</script>

<style scoped>

</style>