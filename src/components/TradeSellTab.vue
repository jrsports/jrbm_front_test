<template>
    <div>
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
                <el-button @click="handleHistorySellPublish">历史成交</el-button>
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
        <el-dialog :visible.sync="mySellPublishDialogVisible" title="我的出售" width="80%">
            <el-form :inline="true" :model="mySellPublishSearchForm">
                <el-form-item label="球员">
                    <el-select
                            v-model="mySellPublishSearchForm.bpId"
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
                <el-form-item label="出售状态">
                    <el-select v-model="mySellPublishSearchForm.status"
                               clearable
                               placeholder="全部">
                        <el-option
                                v-for="item in sellStatusMap"
                                :key="item[0]"
                                :label="item[1]"
                                :value="item[0]">
                        </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item>
                    <el-button type="primary" @click="getMySellPublish">搜索</el-button>
                </el-form-item>
            </el-form>
            <el-table :data="mySellPublishTableData"  height="550" style="width: 100%">
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
                        prop="buyerTeamName"
                        label="购买球队">
                </el-table-column>
                <el-table-column
                        prop="timeLeft"
                        label="剩余时间">
                </el-table-column>
                <el-table-column label="操作">
                    <template slot-scope="scope">
                        <el-button
                                v-if="scope.row.status===2"
                                size="mini"
                                @click="handleCancelSell(scope.row)">撤回</el-button>
                    </template>
                </el-table-column>
            </el-table>
        </el-dialog>
        <el-dialog :visible.sync="historySellPublishDialogVisible" title="历史成交" width="80%">
            <el-form :inline="true" :model="historySellPublishSearchForm">
                <el-form-item label="球员">
                    <el-select
                            v-model="historySellPublishSearchForm.bpId"
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
                    <el-button type="primary" @click="handleHistorySellPublish">搜索</el-button>
                </el-form-item>
            </el-form>
            <el-table :data="historySellPublishTableData"  height="550" style="width: 100%">
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
                        prop="sellerTeamName"
                        label="出售球队">
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
                                @click="handleCancelSell(scope.row)">撤回</el-button>
                    </template>
                </el-table-column>
            </el-table>
        </el-dialog>

        <PlayerInfoDialog ref="playerInfoDialogRef"></PlayerInfoDialog>
    </div>
</template>

<script>
    import {
        buySell,
        cancelSell,
        getHistorySellPublish,
        getMySellPublish,
        getSellPublish,
        getTradable,
        publishSell
    } from "@/api/trade";
    import {secondsToTime} from "@/utils/timeUtil";
    import PlayerInfoDialog from "@/components/PlayerInfoDialog";
    import {searchBasicPlayer} from "@/api/player";
    import {formatDate} from "@/utils/date"
    export default {
        name: "TradeSellTab",
        components:{PlayerInfoDialog},
        data(){
            return{
                sellPublishTableData: [],
                mySellPublishTableData:[],
                historySellPublishTableData:[],
                sellPublishDialogVisible: false,
                mySellPublishDialogVisible:false,
                historySellPublishDialogVisible:false,
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
                mySellPublishSearchForm:{
                    bpId:null,
                    status:null
                },
                historySellPublishSearchForm:{
                    bpId:null
                },
                basicPlayerSearchCandidates:[],
                basicPlayerSearchLoading:false,
                sellStatusMap:new Map([
                    [0,"出售中"],
                    [1,"已出售"],
                    [2,"已过期"],
                    [3,"已撤销"]
                ])
            }
        },
        mounted() {
            this.getSellPublish();
        },
        methods: {
            getSellPublish() {
                let query=this.sellPublishSearchForm;
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
                    if (item.status===0) {
                        if(secondsLeft > 0){
                            item.timeLeft = secondsToTime(secondsLeft);
                        }else{
                            item.timeLeft = "已过期"
                        }

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
                this.mySellPublishDialogVisible=true;
                this.getMySellPublish();
            },
            handleHistorySellPublish(){
                this.historySellPublishDialogVisible=true;
                let query=this.historySellPublishSearchForm;
                query.pageRequest={pageNo: 1, pageSize: 10};
                getHistorySellPublish(query).then(res => {
                    if (res.code === 0) {
                        this.historySellPublishTableData = res.data.recordList;
                        this.historySellPublishTableData.forEach(item=>{
                            let price="";
                            if(item.fundPrice>0){
                                price+=item.fundPrice+"万资金"
                            }
                            if(item.coinPrice>0){
                                price+="/"+item.coinPrice+"JR币";
                            }
                            item.price=price;
                            item.gmtCreate=formatDate(new Date(item.gmtCreate),"yyyy-MM-dd hh:mm:ss");
                            item.dealTime=formatDate(new Date(item.dealTime),"yyyy-MM-dd hh:mm:ss");
                        });
                    }
                });
            },
            getMySellPublish(){
                let query=this.mySellPublishSearchForm;
                query.pageRequest={pageNo: 1, pageSize: 10};
                getMySellPublish(query).then(res=>{
                    if(res.code===0){
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
                            item.status=this.sellStatusMap.get(item.status);
                            item.gmtCreate=formatDate(new Date(item.gmtCreate),"yyyy-MM-dd hh:mm:ss");
                            if(item.dealTime){
                                item.dealTime=formatDate(new Date(item.dealTime),"yyyy-MM-dd hh:mm:ss");
                            }

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