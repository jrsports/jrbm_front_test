<template>
    <div>
        <el-row>
            <el-col :span="18">
                <el-form :inline="true" :model="purchasePublishSearchForm">
                    <el-form-item label="球员">
                        <el-select
                                v-model="purchasePublishSearchForm.bpId"
                                filterable
                                remote
                                clearable
                                reserve-keyword
                                placeholder="请输入球员名"
                                :remote-method="searchBasicPlayer"
                                :loading="basicPlayerSearchLoading">
                            <el-option
                                    v-for="item in basicPlayerSearchCandidates"
                                    :key="item.bpId"
                                    :label="item.chname"
                                    :value="item.bpId">
                            </el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item label="类型">
                        <el-select v-model="purchasePublishSearchForm.type"
                                   clearable
                                   placeholder="全部">
                            <el-option v-for="item in purchaseTypeMap"
                                       :key="item[0]"
                                       :label="item[1]"
                                       :value="item[0]">
                            </el-option>
                        </el-select>

                    </el-form-item>
                    <el-form-item>
                        <el-button type="primary" @click="getPurchasePublish">搜索</el-button>
                    </el-form-item>
                </el-form>
            </el-col>
            <el-col :span="6">
                <el-button @click="handlePublish">发布</el-button>
                <el-button @click="handleMyPurchasePublish">我的求购</el-button>
                <el-button @click="handleHistoryPurchasePublish">历史成交</el-button>
                <el-button icon="el-icon-refresh" @click="getPurchasePublish"></el-button>
            </el-col>
        </el-row>
        <el-table
                ref="purchasePublishTable"
                :data="purchasePublishTableData"
                style="width: 100%">
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
                    prop="type"
                    label="类型">
            </el-table-column>
            <el-table-column
                    prop="purchaseTeamName"
                    label="求购球队"
                    width="180">
            </el-table-column>
            <el-table-column
                    prop="price"
                    label="价格">
            </el-table-column>
            <el-table-column
                    prop="salary"
                    label="期望薪资">
            </el-table-column>
            <el-table-column
                    prop="timeLeft"
                    label="剩余时间">
            </el-table-column>
            <el-table-column label="操作">
                <template slot-scope="scope">
                    <el-button
                            v-if="isPublisher(scope.row)"
                            size="mini"
                            @click="handleCancelPurchase(scope.row)">撤回
                    </el-button>
                    <el-tooltip effect="dark" :content="'你有满足条件的'+scope.row.chname" placement="top-start">
                        <el-button
                                v-if="scope.row.suitableUpId!==null"
                                size="mini"
                                type="success"
                                @click="handleSellPurchase(scope.row)">出售
                        </el-button>
                    </el-tooltip>
                </template>
            </el-table-column>
        </el-table>

        <el-dialog :visible.sync="purchasePublishDialogVisible" title="发布求购信息">
            <el-form ref="form" :model="purchasePublishForm" label-width="200px">
                <el-form-item label="球员">
                    <el-select
                            v-model="purchasePublishForm.bpId"
                            filterable
                            remote
                            clearable
                            placeholder="请输入球员名"
                            :remote-method="searchBasicPlayer"
                            :loading="basicPlayerSearchLoading">
                        <el-option
                                v-for="item in basicPlayerSearchCandidates"
                                :key="item.bpId"
                                :label="item.chname"
                                :value="item.bpId">
                        </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="类型">
                    <el-radio v-model="purchasePublishForm.type" label="0">普通球员</el-radio>
                    <el-radio v-model="purchasePublishForm.type" label="1">球员蛋</el-radio>
                </el-form-item>
                <el-form-item label="交易卡数量">
                    <el-input-number v-model="purchasePublishForm.cardCount" :min="1" :max="5"></el-input-number>
                </el-form-item>
                <el-form-item label="美元价格（万）">
                    <el-input-number v-model="purchasePublishForm.fundPrice" :min="1"
                                     :max="100000"></el-input-number>
                </el-form-item>
                <el-form-item label="JR币价格">
                    <el-input-number v-model="purchasePublishForm.coinPrice" :min="1"
                                     :max="100000"></el-input-number>
                </el-form-item>
                <el-form-item>
                    <el-button type="primary" @click="publishPurchase">发布</el-button>
                </el-form-item>
            </el-form>

        </el-dialog>
        <el-dialog :visible.sync="myPurchasePublishDialogVisible" title="我的求购" width="80%">
            <el-form :inline="true" :model="myPurchasePublishSearchForm">
                <el-form-item label="球员">
                    <el-select
                            v-model="myPurchasePublishSearchForm.bpId"
                            filterable
                            remote
                            clearable
                            placeholder="请输入球员名"
                            :remote-method="searchBasicPlayer"
                            :loading="basicPlayerSearchLoading">
                        <el-option
                                v-for="item in basicPlayerSearchCandidates"
                                :key="item.bpId"
                                :label="item.chname"
                                :value="item.bpId">
                        </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="求购状态">
                    <el-select v-model="myPurchasePublishSearchForm.status"
                               clearable
                               placeholder="全部">
                        <el-option
                                v-for="item in purchaseStatusMap"
                                :key="item[0]"
                                :label="item[1]"
                                :value="item[0]">
                        </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item>
                    <el-button type="primary" @click="getMyPurchasePublish">搜索</el-button>
                </el-form-item>
            </el-form>
            <el-table :data="myPurchasePublishTableData" height="550" style="width: 100%">
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
                        prop="type"
                        label="类型">
                </el-table-column>
                <el-table-column
                        prop="price"
                        label="价格">
                </el-table-column>
                <el-table-column
                        prop="status"
                        label="状态">
                </el-table-column>
                <el-table-column
                        prop="gmtCreate"
                        label="发布时间">
                </el-table-column>
                <el-table-column
                        prop="dealTime"
                        label="成交时间">
                </el-table-column>
                <el-table-column
                        prop="sellerTeamName"
                        label="购买球队">
                </el-table-column>
                <el-table-column
                        prop="timeLeft"
                        label="剩余时间">
                </el-table-column>
                <el-table-column label="操作">
                    <template slot-scope="scope">
                        <el-button
                                v-if="scope.row.status===purchaseStatusMap.get(0)"
                                size="mini"
                                @click="handleCancelPurchase(scope.row)">撤回
                        </el-button>
                    </template>
                </el-table-column>
            </el-table>
        </el-dialog>
        <el-dialog :visible.sync="historyPurchasePublishDialogVisible" title="历史成交" width="80%">
            <el-form :inline="true" :model="historyPurchasePublishSearchForm">
                <el-form-item label="球员">
                    <el-select
                            v-model="historyPurchasePublishSearchForm.bpId"
                            filterable
                            remote
                            clearable
                            placeholder="请输入球员名"
                            :remote-method="searchBasicPlayer"
                            :loading="basicPlayerSearchLoading">
                        <el-option
                                v-for="item in basicPlayerSearchCandidates"
                                :key="item.bpId"
                                :label="item.chname"
                                :value="item.bpId">
                        </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item>
                    <el-button type="primary" @click="handleHistoryPurchasePublish">搜索</el-button>
                </el-form-item>
            </el-form>
            <el-table :data="historyPurchasePublishTableData" height="550" style="width: 100%">
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
                        prop="price"
                        label="价格">
                </el-table-column>
                <el-table-column
                        prop="gmtCreate"
                        label="发布时间">
                </el-table-column>
                <el-table-column
                        prop="dealTime"
                        label="成交时间">
                </el-table-column>
                <el-table-column
                        prop="purchaseerTeamName"
                        label="求购球队">
                </el-table-column>
                <el-table-column
                        prop="buyerTeamName"
                        label="购买球队">
                </el-table-column>
                <el-table-column label="操作">
                    <template slot-scope="scope">
                        <el-button
                                v-if="scope.row.status===2"
                                size="mini"
                                @click="handleCancelPurchase(scope.row)">撤回
                        </el-button>
                    </template>
                </el-table-column>
            </el-table>
        </el-dialog>

        <PlayerInfoDialog ref="playerInfoDialogRef"></PlayerInfoDialog>
    </div>
</template>

<script>
    import {
        sellPurchase,
        cancelPurchase,
        getHistoryPurchasePublish,
        getMyPurchasePublish,
        getPurchasePublish,
        publishPurchase
    } from "@/api/trade";
    import {secondsToTime} from "@/utils/timeUtil";
    import PlayerInfoDialog from "@/components/PlayerInfoDialog";
    import {searchBasicPlayer} from "@/api/player";
    import {formatDate} from "@/utils/date"

    export default {
        name: "TradePurchaseTab",
        components: {PlayerInfoDialog},
        data() {
            return {
                purchasePublishTableData: [],
                myPurchasePublishTableData: [],
                historyPurchasePublishTableData: [],
                purchasePublishDialogVisible: false,
                myPurchasePublishDialogVisible: false,
                historyPurchasePublishDialogVisible: false,
                purchasePublishForm: {
                    bpId: "",
                    cardCount: 0,
                    coinPrice: 0,
                    fundPrice: 0,
                    type: "0"
                },
                purchasePublishSearchForm: {
                    bpId: null,
                    type:null
                },
                myPurchasePublishSearchForm: {
                    bpId: null,
                    status: null
                },
                historyPurchasePublishSearchForm: {
                    bpId: null
                },
                basicPlayerSearchCandidates: [],
                basicPlayerSearchLoading: false,
                purchaseStatusMap: new Map([
                    [0, "求购中"],
                    [1, "已成交"],
                    [2, "已过期"],
                    [3, "已撤销"]
                ]),
                purchaseTypeMap:new Map([
                    [0, "普通球员"],
                    [1, "球员蛋"]
                ])
            }
        },
        mounted() {
            this.getPurchasePublish();
        },
        methods: {
            getPurchasePublish() {
                let query = this.purchasePublishSearchForm;
                query.pageRequest = {pageNo: 1, pageSize: 10};
                getPurchasePublish(query).then(res => {
                    if (res.code === 0) {
                        this.purchasePublishTableData = res.data.recordList;
                        this.purchasePublishTableData.forEach(item => {
                            let price = "";
                            if (item.fundPrice > 0) {
                                price += item.fundPrice + "万资金"
                            }
                            if (item.coinPrice > 0) {
                                price += "/" + item.coinPrice + "JR币";
                            }
                            item.price = price;
                            if (item.type === 0) {
                                item.salary = item.contractDto.totalSeason + "年" + item.contractDto.totalSalary + "万"
                            } else if (item.type === 1) {
                                item.salary = item.signSalary;
                            }
                            item.type=this.purchaseTypeMap.get(item.type);
                        });
                        setInterval(this.handlePurchasePublishTime, 200, this.purchasePublishTableData);
                    }
                });
            },
            handlePurchasePublishTime(data) {
                data.forEach((item, index) => {
                    let secondsLeft = parseInt((item.expireTime - new Date().getTime()) / 1000);
                    if (item.status === 0) {
                        if (secondsLeft > 0) {
                            item.timeLeft = secondsToTime(secondsLeft);
                        } else {
                            item.timeLeft = "已过期"
                        }

                    }
                    // el-table每次只能监听整个row的变化，当row中某个属性变化时，是无法追踪的，所以需要重新给table中的某一行赋值
                    this.$set(data, index, item)
                });
            },
            handlePublish() {
                this.purchasePublishDialogVisible = true;
            },
            handleMyPurchasePublish() {
                this.myPurchasePublishDialogVisible = true;
                this.getMyPurchasePublish();
            },
            handleHistoryPurchasePublish() {
                this.historyPurchasePublishDialogVisible = true;
                let query = this.historyPurchasePublishSearchForm;
                query.pageRequest = {pageNo: 1, pageSize: 10};
                getHistoryPurchasePublish(query).then(res => {
                    if (res.code === 0) {
                        this.historyPurchasePublishTableData = res.data.recordList;
                        this.historyPurchasePublishTableData.forEach(item => {
                            let price = "";
                            if (item.fundPrice > 0) {
                                price += item.fundPrice + "万资金"
                            }
                            if (item.coinPrice > 0) {
                                price += "/" + item.coinPrice + "JR币";
                            }
                            item.price = price;
                            item.gmtCreate = formatDate(new Date(item.gmtCreate), "yyyy-MM-dd hh:mm:ss");
                            item.dealTime = formatDate(new Date(item.dealTime), "yyyy-MM-dd hh:mm:ss");
                        });
                    }
                });
            },
            getMyPurchasePublish() {
                let query = this.myPurchasePublishSearchForm;
                query.pageRequest = {pageNo: 1, pageSize: 10};
                getMyPurchasePublish(query).then(res => {
                    if (res.code === 0) {
                        this.myPurchasePublishTableData = res.data.recordList;
                        this.myPurchasePublishTableData.forEach(item => {
                            let price = "";
                            if (item.fundPrice > 0) {
                                price += item.fundPrice + "万资金"
                            }
                            if (item.coinPrice > 0) {
                                price += "/" + item.coinPrice + "JR币";
                            }
                            item.price = price;
                            item.status = this.purchaseStatusMap.get(item.status);
                            item.gmtCreate = formatDate(new Date(item.gmtCreate), "yyyy-MM-dd hh:mm:ss");
                            if (item.dealTime) {
                                item.dealTime = formatDate(new Date(item.dealTime), "yyyy-MM-dd hh:mm:ss");
                            }
                            item.type=this.purchaseTypeMap.get(item.type);
                        });
                        setInterval(this.handlePurchasePublishTime, 200, this.myPurchasePublishTableData);
                    }
                });
            },
            publishPurchase() {
                publishPurchase(this.purchasePublishForm).then(res => {
                    if (res.code === 0) {
                        this.$message({
                            message: "发布成功",
                            type: "success"
                        });
                        this.purchasePublishDialogVisible = false;
                        this.getPurchasePublish();
                    }
                });
            },
            handlePlayerDetail(upId) {
                this.$refs.playerInfoDialogRef.show(upId);
            },
            handleCancelPurchase(row) {
                cancelPurchase({purchaseId: row.purchaseId}).then(res => {
                    if (res.code === 0) {
                        this.$message({
                            message: "撤回成功",
                            type: "success"
                        });
                        this.getPurchasePublish();
                        this.getMyPurchasePublish();
                    }
                })
            },
            isPublisher(row) {
                return row.purchaseTeamId === this.$store.getters.teamId;
            },
            handleSellPurchase(row) {
                sellPurchase({purchaseId: row.purchaseId,upId:row.suitableUpId}).then(res => {
                    if (res.code === 0) {
                        this.$message({
                            message: "出售成功",
                            type: "success"
                        });
                        this.getPurchasePublish();
                    }
                })
            },
            searchBasicPlayer(chname) {
                if (chname !== '') {
                    this.basicPlayerSearchLoading = true;
                    searchBasicPlayer({chname: chname}).then(res => {
                        if (res.code === 0) {
                            this.basicPlayerSearchCandidates = res.data;
                        }
                    });
                    this.basicPlayerSearchLoading = false;
                }
            }
        }

    }
</script>

<style scoped>

</style>