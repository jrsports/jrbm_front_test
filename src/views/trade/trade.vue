<template>
    <el-container>
        <el-header>
            <nav-bar></nav-bar>
        </el-header>
        <el-container>
            <el-aside width="200px">
                <sidebar></sidebar>
            </el-aside>
            <el-main>
                <el-tabs type="border-card">
<!--                    <el-tab-pane>-->
<!--                        <span slot="label"><i class="el-icon-date"></i>交易大厅</span>-->
<!--                        <div>-->
<!--                            <el-row>-->
<!--                                <el-col :span="16">-->
<!--                                    <el-row>-->
<!--                                        <h2>交易搜索器</h2>-->
<!--                                        <el-input placeholder="输入球员名或球队名"  class="input-with-select"-->
<!--                                                  style="margin-top: 15px;">-->
<!--                                            <el-select  slot="prepend" placeholder="过滤项"-->
<!--                                                       style="width:130px;background-color:#fff">-->
<!--                                                <el-option label="餐厅名" value="1"></el-option>-->
<!--                                                <el-option label="订单号" value="2"></el-option>-->
<!--                                                <el-option label="用户电话" value="3"></el-option>-->
<!--                                            </el-select>-->
<!--                                            <el-button slot="append" icon="el-icon-search"></el-button>-->
<!--                                        </el-input>-->
<!--                                    </el-row>-->
<!--                                    <el-row>-->
<!--                                        <h2>交易推荐</h2>-->
<!--                                    </el-row>-->
<!--                                </el-col>-->
<!--                                <el-col :span="8">-->
<!--                                    <h2>交易动态</h2>-->
<!--                                </el-col>-->
<!--                            </el-row>-->
<!--                            <el-button @click="createTrade">发起交易请求</el-button>-->
<!--                            <el-button @click="acceptTrade" v-if="tradeReceived">接受交易请求</el-button>-->
<!--                            <el-button @click="refuseTrade" v-if="tradeReceived">拒绝交易请求</el-button>-->
<!--                        </div>-->
<!--                    </el-tab-pane>-->
                    <el-tab-pane label="出售大厅">
                        <el-button @click="handlePublish">发布</el-button>
                        <el-table
                                :data="sellPublishTableData"
                                :key="dynamicKey"
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
                                    prop="sellerTeamName"
                                    label="出售球队"
                                    width="180">
                            </el-table-column>
                            <el-table-column
                                    prop="price"
                                    label="价格">
                            </el-table-column>
                            <el-table-column
                                    prop="timeLeft"
                                    label="剩余时间">
                            </el-table-column>
                        </el-table>
                    </el-tab-pane>
                    <el-tab-pane label="求购大厅"></el-tab-pane>
                </el-tabs>

                <el-dialog :visible.sync="sellPublishDialogVisible" title="发布出售信息">
                    <el-form ref="form" :model="sellPublishForm" label-width="80px">
                        <el-form-item label="可交易球员">
                            <el-select v-model="sellPublishForm.upId" placeholder="请选择要交易的球员">
                                <el-option
                                        v-for="item in tradablePlayerList"
                                        :key="item.upId"
                                        :label="item.chname"
                                        :value="item.upId"
                                        :disabled="item.status!==0">
                                </el-option>
                            </el-select>
                        </el-form-item>
                        <el-form-item label="交易卡数量">
                            <el-input-number v-model="sellPublishForm.cardCount" :min="1" :max="5"></el-input-number>
                        </el-form-item>
                        <el-form-item label="美元价格（万）">
                            <el-input-number v-model="sellPublishForm.fundPrice" :min="1"
                                             :max="100000"></el-input-number>
                        </el-form-item>
                        <el-form-item label="JR币价格">
                            <el-input-number v-model="sellPublishForm.coinPrice" :min="1"
                                             :max="100000"></el-input-number>
                        </el-form-item>
                        <el-form-item>
                            <el-button type="primary" @click="publishSell">发布</el-button>
                        </el-form-item>
                    </el-form>

                </el-dialog>

                <PlayerInfoDialog ref="playerInfoDialogRef"></PlayerInfoDialog>
            </el-main>
        </el-container>
    </el-container>
</template>

<script>
    import Sidebar from "@/views/layout/sidebar/sidebar";
    import NavBar from "@/views/layout/header/header"
    import {getSellPublish, getTradable, publishSell} from "@/api/trade";
    import {secondsToTime} from "@/utils/timeUtil";
    import PlayerInfoDialog from "@/components/PlayerInfoDialog";

    export default {
        name: "Trade",
        components: {Sidebar, NavBar,PlayerInfoDialog},
        mounted() {
            this.getSellPublish();
        },
        data() {
            return {
                tradeReceived: null,
                tradeRequestId: null,
                sellPublishTableData: [],
                sellPublishDialogVisible: false,
                // 保证更新数据后，table会显示最新数据
                dynamicKey:0,
                sellPublishForm: {
                    upId: "",
                    cardCount: 0,
                    coinPrice: 0,
                    fundPrice: 0
                },
                tradablePlayerList: []
            }
        },
        methods: {
            createTrade() {
                var me = this;
                this.axiosPost.post("http://www.jrsports.com/api/trade/trade/createTradeRequest", {
                    "targetTeamId": "432919740818919424"
                }, {
                    headers: {
                        "userToken": localStorage.getItem("userToken"),
                        "teamToken": sessionStorage.getItem("teamToken"),
                        "Content-Type": "application/json;charset=UTF-8"
                    }
                }).then(function (response) {
                    const data = response.data;
                    me.$message({
                        message: data.msg,
                        type: "primary"
                    });
                });
            },
            acceptTrade() {
                var me = this;
                this.axiosPost.post("http://www.jrsports.com/api/trade/trade/acceptTradeRequest", {
                    "tradeRequestId": "432919740818919424"
                }, {
                    headers: {
                        "userToken": localStorage.getItem("userToken"),
                        "teamToken": sessionStorage.getItem("teamToken"),
                        "Content-Type": "application/json;charset=UTF-8"
                    }
                }).then(function (response) {
                    const data = response.data;
                    me.$message({
                        message: data.msg,
                        type: "primary"
                    });
                });
            },
            refuseTrade() {
                var me = this;
                this.axiosPost.post("http://www.jrsports.com/api/trade/trade/createTradeRequest", {
                    "targetTeamId": "432919740818919424"
                }, {
                    headers: {
                        "userToken": localStorage.getItem("userToken"),
                        "teamToken": sessionStorage.getItem("teamToken"),
                        "Content-Type": "application/json;charset=UTF-8"
                    }
                }).then(function (response) {
                    const data = response.data;
                    me.$message({
                        message: data.msg,
                        type: "primary"
                    });
                });
            },
            getSellPublish() {
                getSellPublish({pageRequest: {pageNo: 1, pageSize: 10}}).then(res => {
                    if (res.code === 0) {
                        this.sellPublishTableData = res.data.recordList;
                        this.sellPublishTableData.forEach(item=>{
                            let price="";
                            if(item.fundPrice>0){
                                price+=item.fundPrice+"万资金"
                            }
                            if(item.coinPrice>0){
                                price+="/"+item.coinPrice+"币";
                            }
                            item.price=price;
                        });
                        setInterval(this.handleSellPublishTime, 200);
                    }
                });
            },
            handleSellPublishTime() {
                this.dynamicKey++;
                let data=this.sellPublishTableData;
                data.forEach(item => {
                    let secondsLeft = parseInt((item.expireTime - new Date().getTime()) / 1000);
                    if (secondsLeft > 0) {
                        item.timeLeft = secondsToTime(secondsLeft);
                    } else {
                        item.timeLeft = "已失效"
                    }
                });
                this.sellPublishTableData=data;
            },
            handlePublish() {
                this.sellPublishDialogVisible = true;
                getTradable().then(res => {
                    this.tradablePlayerList = res.data;
                })
            },
            publishSell() {
                publishSell(this.sellPublishForm).then(res => {
                    if (res.code === 0) {
                        this.$message({
                            message: "发布成功",
                            type: "success"
                        });
                        this.sellPublishDialogVisible=false;
                        this.getSellPublish();
                    }
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