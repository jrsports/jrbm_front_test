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
                        <el-row>
                            <el-col :span="18">
                                <el-form :inline="true" :model="sellPublishSearchForm">
                                    <el-form-item label="球员">
                                        <el-select
                                                v-model="sellPublishSearchForm.bpId"
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
                                    <el-form-item label="资金价格<=">
                                        <el-input-number v-model="sellPublishSearchForm.maxFundPrice"  :min="1" :max="9999"></el-input-number>
                                    </el-form-item>
                                    <el-form-item label="JR币价格<=">
                                        <el-input-number v-model="sellPublishSearchForm.maxCoinPrice"  :min="1" :max="9999"></el-input-number>
                                    </el-form-item >
                                    <el-form-item>
                                        <el-button type="primary" @click="getSellPublish">搜索</el-button>
                                    </el-form-item>
                                </el-form>
                            </el-col>
                            <el-col :span="6">
                                <el-button @click="handlePublish">发布</el-button>
                                <el-button @click="handleMySellPublish">我的发布</el-button>
                                <el-button icon="el-icon-refresh" @click="getSellPublish"></el-button>
                            </el-col>
                        </el-row>

                        <el-table
                                ref="sellPublishTable"
                                :data="sellPublishTableData"
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
                            <el-table-column label="操作">
                                <template slot-scope="scope">
                                    <el-button
                                            v-if="isPublisher(scope.row)"
                                            size="mini"
                                            @click="handleCancelSell(scope.row)">撤回</el-button>
                                    <el-button
                                            v-if="!isPublisher(scope.row)"
                                            size="mini"
                                            type="success"
                                            @click="handleBuySell(scope.row)">购买</el-button>
                                </template>
                            </el-table-column>
                        </el-table>
                    </el-tab-pane>
                    <el-tab-pane label="求购大厅"></el-tab-pane>
                </el-tabs>

                <el-dialog :visible.sync="sellPublishDialogVisible" title="发布出售信息">
                    <el-form ref="form" :model="sellPublishForm" label-width="200px">
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
                <el-dialog :visible.sync="mySellPublishDialogVisible" title="我的发布">
                    <el-table :data="mySellPublishTableData" style="width: 100%">
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
                                prop="timeLeft"
                                label="剩余时间">
                        </el-table-column>
                        <el-table-column label="操作">
                            <template slot-scope="scope">
                                <el-button
                                        v-if="canCancel(scope.row)"
                                        size="mini"
                                        @click="handleCancelSell(scope.row)">撤回</el-button>
                            </template>
                        </el-table-column>
                    </el-table>
                </el-dialog>

                <PlayerInfoDialog ref="playerInfoDialogRef"></PlayerInfoDialog>
            </el-main>
        </el-container>
    </el-container>
</template>

<script>
    import Sidebar from "@/views/layout/sidebar/sidebar";
    import NavBar from "@/views/layout/header/header"
    import {buySell, cancelSell, getMySellPublish, getSellPublish, getTradable, publishSell} from "@/api/trade";
    import {secondsToTime} from "@/utils/timeUtil";
    import PlayerInfoDialog from "@/components/PlayerInfoDialog";
    import {searchBasicPlayer} from "@/api/player";

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
                mySellPublishTableData:[],
                sellPublishDialogVisible: false,
                mySellPublishDialogVisible:false,
                sellPublishForm: {
                    upId: "",
                    cardCount: 0,
                    coinPrice: 0,
                    fundPrice: 0
                },
                tradablePlayerList: [],
                sellPublishSearchForm:{
                    bpId:null,
                    maxFundPrice:9999,
                    maxCoinPrice:9999
                },
                basicPlayerSearchCandidates:[],
                basicPlayerSearchLoading:false,

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
                let query=this.sellPublishSearchForm;
                console.log(query);
                query.pageRequest={pageNo: 1, pageSize: 10};
                getSellPublish(query).then(res => {
                    if (res.code === 0) {
                        this.sellPublishTableData = res.data.recordList;
                        this.sellPublishTableData.forEach(item=>{
                            let price="";
                            if(item.fundPrice>0){
                                price+=item.fundPrice+"万资金"
                            }
                            if(item.coinPrice>0){
                                price+="/"+item.coinPrice+"JR币";
                            }
                            item.price=price;
                        });
                        setInterval(this.handleSellPublishTime, 200,this.sellPublishTableData);
                    }
                });
            },
            handleSellPublishTime(data) {
                data.forEach((item,index)=> {
                    let secondsLeft = parseInt((item.expireTime - new Date().getTime()) / 1000);
                    if (secondsLeft > 0) {
                        item.timeLeft = secondsToTime(secondsLeft);
                    } else {
                        item.timeLeft = "已失效"
                    }
                    // el-table每次只能监听整个row的变化，当row中某个属性变化时，是无法追踪的，所以需要重新给table中的某一行赋值
                    this.$set(data,index,item)
                });
            },
            handlePublish() {
                this.sellPublishDialogVisible = true;
                getTradable().then(res => {
                    this.tradablePlayerList = res.data;
                })
            },
            handleMySellPublish(){
              getMySellPublish({pageRequest:{pageNo: 1, pageSize: 10}}).then(res=>{
                  if(res.code===0){
                      this.mySellPublishDialogVisible=true;
                      this.mySellPublishTableData=res.data.recordList;
                      this.mySellPublishTableData.forEach(item=>{
                          let price="";
                          if(item.fundPrice>0){
                              price+=item.fundPrice+"万资金"
                          }
                          if(item.coinPrice>0){
                              price+="/"+item.coinPrice+"JR币";
                          }
                          item.price=price;
                      });
                      setInterval(this.handleSellPublishTime, 200,this.mySellPublishTableData);
                  }
              });
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
            handleCancelSell(row){
                cancelSell({sellId:row.sellId}).then(res=>{
                    if(res.code===0){
                        this.$message({
                            message:"撤回成功",
                            type:"success"
                        });
                        this.getSellPublish();
                    }
                })
            },
            handleBuySell(row){
                buySell({sellId:row.sellId}).then(res=>{
                    if(res.code===0){
                        this.$message({
                            message:"购买成功",
                            type:"success"
                        });
                        this.getSellPublish();
                    }
                })
            },
            isPublisher(row){
                return row.sellerTeamId===this.$store.getters.teamId;
            },
            canCancel(row){
                return row.expireTime>new Date();
            },
            searchBasicPlayer(chname){
                if(chname!==''){
                    this.basicPlayerSearchLoading=true;
                    searchBasicPlayer({chname:chname}).then(res=>{
                        if(res.code===0){
                            this.basicPlayerSearchCandidates=res.data;
                        }
                    });
                    this.basicPlayerSearchLoading=false;
                }
            }
        }


    }
</script>

<style scoped>

</style>