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
                    <el-card>
                        <div slot="header">
                            <span>待签约</span>
                        </div>
                        <el-table
                                :data="unSignedData"
                                style="width: 100%">
                            <el-table-column
                                    prop="contractId"
                                    label="合同编号">
                            </el-table-column>
                            <el-table-column
                                    prop="signToken"
                                    label="签约令牌"
                                    v-if="colShow">
                            </el-table-column>
                            <el-table-column
                                    label="球员"
                                    width="100">
                                <template slot-scope="scope">
                                    <div class="block" @click="handlePlayerDetail(scope.row.upId)" style="cursor:pointer;">
                                        <el-avatar shape="square" :size="50" :src="scope.row.avatar"></el-avatar>
                                    </div>
                                </template>
                            </el-table-column>
                            <el-table-column
                                    prop="chname"
                                    label="中文名"
                                    width="180">
                            </el-table-column>
                            <el-table-column
                                    prop="source"
                                    label="签约来源">
                            </el-table-column>
                            <el-table-column
                                    prop="type"
                                    label="签约类型">
                            </el-table-column>
                            <el-table-column
                                    prop="timeLeft"
                                    label="截止时间">
                            </el-table-column>
                            <el-table-column label="签约">
                                <template slot-scope="scope" v-if="scope.row.timeLeft!='已过期'">
                                    <el-button
                                            size="mini"
                                            @click="signContract(scope.row)">接受
                                    </el-button>
                                    <el-button
                                            size="mini"
                                            @click="refuseContract(scope.row)">拒绝
                                    </el-button>
                                </template>
                            </el-table-column>
                        </el-table>
                    </el-card>
                    <el-divider></el-divider>
                    <el-card class="box-card">
                        <div slot="header">
                            <span>签约记录</span>
                        </div>
                        <el-select v-model="signRecordStatus" placeholder="请选择" @change="getSignContractList">
                            <el-option key="2" label="已签约" value="2"></el-option>
                            <el-option key="3" label="已拒绝" value="3"></el-option>
                            <el-option key="4" label="已过期" value="4"></el-option>
                        </el-select>
                        <el-table
                                v-loading="loading"
                                :data="signedData"
                                style="width: 100%">
                            <el-table-column
                                    prop="contractId"
                                    label="合同编号">
                            </el-table-column>
                            <el-table-column
                                    label="球员"
                                    width="100">
                                <template slot-scope="scope">
                                    <div class="block" @click="handlePlayerDetail(scope.row.upId)" style="cursor:pointer;">
                                        <el-avatar shape="square" :size="50" :src="scope.row.avatar"></el-avatar>
                                    </div>
                                </template>
                            </el-table-column>
                            <el-table-column
                                    prop="chname"
                                    label="中文名"
                                    width="180">
                            </el-table-column>
                            <el-table-column
                                    prop="source"
                                    label="签约来源">
                            </el-table-column>
                            <el-table-column
                                    prop="type"
                                    label="签约类型">
                            </el-table-column>
                            <el-table-column
                                    prop="status"
                                    label="签约状态">
                            </el-table-column>
                            <el-table-column
                                    prop="signTime"
                                    label="签约时间">
                            </el-table-column>
                            <el-table-column
                                    prop="contract"
                                    label="合同">
                            </el-table-column>
                            <el-table-column label="合同详情">
                                <template slot-scope="scope">
                                    <el-button
                                            size="mini"
                                            @click="viewContractDetail(scope.row)">详情
                                    </el-button>
                                </template>
                            </el-table-column>
                        </el-table>
                    </el-card>

                    <el-dialog title="合同详情" :visible.sync="contractDetailDialogVisible">
                        <el-table :data="contractDetailData">
                            <el-table-column property="season" label="赛季"></el-table-column>
                            <el-table-column property="salary" label="薪资"></el-table-column>
                        </el-table>
                    </el-dialog>
                    <PlayerInfoDialog ref="playerInfoDialogRef"></PlayerInfoDialog>
                </el-main>
            </el-container>
        </el-container>
    </el-container>
</template>

<script>
    import Sidebar from "@/views/layout/sidebar/sidebar";
    import NavBar from "@/views/layout/header/header";
    import PlayerInfoDialog from "@/components/PlayerInfoDialog";
    import {getUnsignedContractList} from "@/api/sign";
    import {getSignContractList} from "@/api/sign";
    import {signContract} from "@/api/sign";
    import {refuseContract} from "@/api/sign";

    export default {
        components: {Sidebar, NavBar,PlayerInfoDialog},
        name: "sign",
        data() {
            return {
                unSignedData: [],
                signedData: [],
                colShow: false,
                signRecordStatus:"已签约",
                contractDetailDialogVisible: false,
                contractDetailData: [
                    {
                        season: "第一赛季",
                        salary: "500万"
                    },
                    {
                        season: "第二赛季",
                        salary: "600万"
                    },
                    {
                        season: "第三赛季",
                        salary: "700万"
                    },
                    {
                        season: "第四赛季",
                        salary: "800万"
                    },
                ],
                loading: true
            }
        },
        mounted() {
            this.getUnsignedContractList();
            this.getSignContractList(2);
        },
        methods: {
            getUnsignedContractList() {
                getUnsignedContractList({
                    pageNo: 1,
                    pageSize: 10
                }).then(res => {
                    if (res.code === 0) {
                        let sd = res.data.recordList;
                        sd.forEach(function (item) {
                            if (item.source === 1) {
                                item.source = "自由市场";
                            }
                            if (item.type === 1) {
                                item.type = "签约";
                            }
                        });
                        setInterval(this.startTimer, 1000);
                        this.unSignedData = sd;
                    }
                });
            },
            getSignContractList(status) {
                getSignContractList({
                    status: status,
                    pageRequest: {
                        pageNo: 1,
                        pageSize: 10
                    }
                }).then(res => {
                    if (res.code === 0) {
                        let sd = res.data.recordList;
                        sd.forEach(function (item) {
                            if (item.source == 1) {
                                item.source = "自由市场";
                            }
                            if (item.type == 1) {
                                item.type = "签约";
                            }
                            if (item.status == 2) {
                                item.status = "签约成功";
                            } else if (item.status == 3) {
                                item.status = "拒绝签约";
                            } else if (item.status == 4) {
                                item.status = "已过期";
                            }
                            item.contract = item.contractDto.totalSeason + "年" + item.contractDto.totalSalary + "万"
                        });
                        this.signedData = sd;
                        this.loading = false;
                    }
                });
            },
            signContract(row) {
                signContract({
                    contractId: row.contractId,
                    signToken: row.signToken
                }).then(res => {
                    if (res.code === 0) {
                        this.$message({
                            message: "签约成功",
                            type: "success"
                        });
                        this.getUnsignedContractList();
                        this.getSignedContractList();
                    }
                });
            },
            refuseContract(row) {
                refuseContract({
                    contractId: row.contractId,
                    signToken: row.signToken
                }).then(res => {
                    if (res.code === 0) {
                        this.$message({
                            message: "拒绝成功",
                            type: "success"
                        });
                        this.getUnsignedContractList();
                        this.getSignedContractList();
                    }
                });
            },
            handlePlayerDetail(upId) {
                this.$refs.playerInfoDialogRef.show(upId);
            },
            viewContractDetail(row) {
                this.contractDetailDialogVisible=true;
                const me = this;
                const d = me.signedData;
                d.forEach(function (item) {
                    if (item.contractId == row.contractId) {
                        me.contractDetailData = item.contractDto.contractDetailReqDtoList;
                    }
                })
            },
            startTimer() {
                const me = this;
                let temp = [];
                this.unSignedData.forEach(function (item) {
                    var t = parseInt((item.expireTime - new Date().getTime()) / 1000);
                    if (t > 0) {
                        item.timeValLeft = t;
                        // console.log(item.timeValLeft);
                        item.timeLeft = me.secondsToTime(t);
                    } else {
                        item.timeLeft = "已过期";
                    }
                    temp.push(item);
                });
                this.unSignedData = temp;
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

</style>