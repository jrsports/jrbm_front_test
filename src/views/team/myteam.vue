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
                    <el-tabs tab-position="left" style="height: 900px;">
                        <el-tab-pane label="大名单">
                            <el-row>
                                <el-col span="12">
                                    <div>
                                        dd
                                    </div>
                                </el-col>
                                <el-col span="10">
                                    <span>总工资/工资帽:{{lineUpData.totalSalary}}/{{lineUpData.salaryCap}}</span>
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
                                        <el-button type="text" size="small">编辑</el-button>
                                    </template>
                                </el-table-column>
                            </el-table>
                        </el-tab-pane>
                        <el-tab-pane label="备选名单">
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
                            </el-table>
                        </el-tab-pane>
                        <el-tab-pane label="球员蛋"></el-tab-pane>
                    </el-tabs>


                    <el-dialog title="球员详情" :visible.sync="userPlayerDetailDialogVisible">
                        <el-row>
                            <el-col span="6">
                                <el-avatar shape="square" :size="100" :src="playerDetail.avatarUrl"></el-avatar>
                            </el-col>
                            <el-col span="6">
                                <h3>{{playerDetail.chname}}</h3>
                                <h5>{{playerDetail.enname}}</h5>
                            </el-col>
                            <el-col span="6">
                                <h1>总评：{{playerDetail.overall}}</h1>
                            </el-col>
                            <el-col span="6">
                                <h1>等级：{{playerDetail.grade}}</h1>
                            </el-col>
                            <el-card style="width: 100%">
                                <div slot="header">
                                    <span>能力值</span>
                                    <el-button style="float: right; padding: 3px 0" type="text">操作按钮</el-button>
                                </div>
                                <el-row>
                                    <el-col span="4">突破：{{playerDetail.ability.breakthrough}}</el-col>
                                    <el-col span="4">中距离：{{playerDetail.ability.midrange}}</el-col>
                                    <el-col span="4">内线：{{playerDetail.ability.inside}}</el-col>
                                    <el-col span="4">三分：{{playerDetail.ability.three}}</el-col>
                                    <el-col span="4">罚球：{{playerDetail.ability.freethrow}}</el-col>
                                    <el-col span="4">造犯规：{{playerDetail.ability.causefoul}}</el-col>
                                </el-row>
                                <el-row style="margin-top: 15px">
                                    <el-col span="4">传球稳定：{{playerDetail.ability.passStability}}</el-col>
                                    <el-col span="4">传球精确：{{playerDetail.ability.passAccuracy}}</el-col>
                                    <el-col span="4">视野：{{playerDetail.ability.passVision}}</el-col>
                                    <el-col span="4">抢断：{{playerDetail.ability.steal}}</el-col>
                                    <el-col span="4">篮板：{{playerDetail.ability.rebound}}</el-col>
                                    <el-col span="4">逼抢：{{playerDetail.ability.forcing}}</el-col>
                                </el-row>
                                <el-row style="margin-top: 15px">
                                    <el-col span="4">防盖帽：{{playerDetail.ability.blocking}}</el-col>
                                    <el-col span="4">防突破：{{playerDetail.ability.antiBreakthrough}}</el-col>
                                    <el-col span="4">防中距离：{{playerDetail.ability.antiMidrange}}</el-col>
                                    <el-col span="4">防三分：{{playerDetail.ability.antiThree}}</el-col>
                                    <el-col span="4">防内线：{{playerDetail.ability.antiInside}}</el-col>
                                    <el-col span="4">干净度：{{playerDetail.ability.clean}}</el-col>
                                </el-row>
                                <el-row style="margin-top: 15px">
                                    <el-col span="4">运球：{{playerDetail.ability.dribble}}</el-col>
                                    <el-col span="4">受助攻：{{playerDetail.ability.beAssisted}}</el-col>
                                    <el-col span="4">投篮倾向：{{playerDetail.ability.shootIncline}}</el-col>
                                    <el-col span="4">突破倾向：{{playerDetail.ability.breakthroughIncline}}</el-col>
                                    <el-col span="4">中投倾向：{{playerDetail.ability.midrangeIncline}}</el-col>
                                    <el-col span="4">三分倾向：{{playerDetail.ability.threeIncline}}</el-col>
                                </el-row>
                                <el-row style="margin-top: 15px">
                                    <el-col span="4">内线倾向：{{playerDetail.ability.insideIncline}}</el-col>
                                    <el-col span="4">传球倾向：{{playerDetail.ability.passIncline}}</el-col>
                                    <el-col span="4">进攻综合：{{playerDetail.ability.offensiveOverall}}</el-col>
                                    <el-col span="4">防守综合：{{playerDetail.ability.defensiveOverall}}</el-col>
                                    <el-col span="4">球权：{{playerDetail.ability.ballWeight}}</el-col>
                                    <el-col span="4"></el-col>
                                </el-row>
                            </el-card>

                        </el-row>
                    </el-dialog>
                </el-main>
            </el-container>
        </el-container>
    </el-container>
</template>

<script>
    import Sidebar from "@/views/layout/sidebar/sidebar";
    import NavBar from "@/views/layout/header/header"
    // import Chat from "@/views/layout/chat/chat";
    import {getLineUp, getPlayerDetail, substitute} from "@/api/team";
    import {convertPlayerInfo} from "@/utils/PlayerInfoUtil";

    export default {
        name: "gameindex",
        components: {Sidebar, NavBar},
        mounted() {
            this.getUserPlayerList();
        },
        data() {
            return {
                teamName: "null",
                lineUpData:{
                    totalSalary:0,
                    salaryCap:0,
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
                userPlayerDetailDialogVisible: false,
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
                        this.lineUpData=res.data;
                        this.lineUpData.rosterList.forEach(function (item) {
                            convertPlayerInfo(item)
                        })
                        console.log(this.lineUpData);
                        this.rosterTableLoading = false;
                    }
                })
            },
            handlePlayerSelect(row) {
                if (this.substituteLocked) {
                    this.$refs.rosterTable.setCurrentRow();
                    return;
                }
                if (this.selectedUpId > 0) {
                    // 取消选择
                    if (this.selectedUpId === row.upId) {
                        console.log(this.$refs.rosterTable);
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
            handlePlayerDetail(upId) {
                getPlayerDetail(upId).then(res => {
                    if (res.code === 0) {
                        let item = res.data;
                        convertPlayerInfo(item);
                        this.playerDetail = item;
                        this.userPlayerDetailDialogVisible = true;
                    }
                })

            }
        }
    }
</script>

<style scoped>

</style>