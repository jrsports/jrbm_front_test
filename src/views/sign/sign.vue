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

                    <el-tabs v-model="activeSignTab" type="card" @tab-click="switchTab">
                        <el-tab-pane name="negotiation">
                            <div slot="label">
                                <el-badge is-dot :hidden="!hasNegotiation">
                                    <span>待谈判</span>
                                </el-badge>
                            </div>
                            <el-button @click="getNegotiationHistory">谈判历史</el-button>
                            <el-dialog :visible.sync="negotiationHistoryDialog" width="1200px" title="谈判历史">
                                <el-table :data="negotiationHistoryData">
                                    <el-table-column
                                            prop="negotiationId"
                                            label="谈判ID">
                                    </el-table-column>
                                    <el-table-column
                                            prop="chname"
                                            label="球员名">
                                    </el-table-column>
                                    <el-table-column
                                            prop="type"
                                            label="来源">
                                    </el-table-column>
                                    <el-table-column
                                            prop="expectSalary"
                                            label="期望薪资">
                                    </el-table-column>
                                    <el-table-column
                                            prop="lastOffer"
                                            label="最近一次报价">
                                    </el-table-column>
                                    <el-table-column
                                            prop="status"
                                            label="谈判状态">
                                    </el-table-column>
                                </el-table>
                            </el-dialog>
                            <el-table :data="negotiationListData">
                                <el-table-column
                                        prop="negotiationId"
                                        label="谈判ID">
                                </el-table-column>
                                <el-table-column
                                        prop="chname"
                                        label="球员名">
                                </el-table-column>
                                <el-table-column
                                        prop="type"
                                        label="来源">
                                </el-table-column>
                                <el-table-column
                                        prop="expectSalary"
                                        label="期望薪资">
                                </el-table-column>
                                <el-table-column
                                        prop="lastOffer"
                                        label="最近一次报价">
                                </el-table-column>
                                <el-table-column
                                        prop="status"
                                        label="谈判状态">
                                </el-table-column>
                                <el-table-column
                                        prop="timeLeft"
                                        label="剩余时间">
                                </el-table-column>
                                <el-table-column
                                        label="操作"
                                        width="100">
                                    <template slot-scope="scope">
                                        <el-button @click="negotiate(scope.row)" type="text" size="small">
                                            谈判
                                        </el-button>
                                    </template>
                                </el-table-column>
                            </el-table>

                        </el-tab-pane>


                        <el-tab-pane label="待签约" name="unsigned">
                            <el-table
                                    :data="unSignedData"
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
                                        prop="contractContent"
                                        label="合同">
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
                        </el-tab-pane>
                        <el-tab-pane label="签约历史" name="history">
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
                                        prop="contractContent"
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
                        </el-tab-pane>

                    </el-tabs>
                    <el-dialog title="合同详情" :visible.sync="contractDetailDialogVisible">
                        <el-table :data="contractDetailData">
                            <el-table-column property="season" label="赛季"></el-table-column>
                            <el-table-column property="salary" label="薪资"></el-table-column>
                        </el-table>
                    </el-dialog>
                    <PlayerInfoDialog ref="playerInfoDialogRef"></PlayerInfoDialog>
                    <OfferDialog ref="offerDialogRef"></OfferDialog>
                </el-main>
            </el-container>
        </el-container>
    </el-container>
</template>

<script>
    import Sidebar from "@/views/layout/sidebar/sidebar";
    import NavBar from "@/views/layout/header/header";
    import PlayerInfoDialog from "@/components/PlayerInfoDialog";
    import OfferDialog from "@/components/OfferDialog";
    // eslint-disable-next-line no-unused-vars
    import {getNegotiationList, getSignContractList, negotiate} from "@/api/sign";
    import {signContract} from "@/api/sign";
    import {refuseContract} from "@/api/sign";
    import {secondsToTime} from "@/utils/timeUtil";
    import {formatDate} from "@/utils/date";

    export default {
        components: {Sidebar, NavBar,PlayerInfoDialog,OfferDialog},
        name: "sign",
        data() {
            return {
                unSignedData: [],
                signedData: [],
                activeSignTab:"negotiation",
                negotiationListData:[],
                negotiationHistoryData:[],
                negotiationHistoryDialog:false,
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
                loading: true,
                hasNegotiation:false
            }
        },
        mounted() {
            this.getNegotiationList(false);
            this.getUnsignedContractList();
            this.getSignContractList(2);
        },
        methods: {
            getUnsignedContractList() {
                getSignContractList({
                    status: 1,
                    pageRequest: {
                        pageNo: 1,
                        pageSize: 10
                    }
                }).then(res => {
                    if (res.code === 0) {
                        let sd = res.data.recordList;
                        sd.forEach(function (item) {
                            if (item.source === 1) {
                                item.source = "自由市场";
                            }else if(item.source===2){
                                item.source="选秀";
                            }
                            if (item.type === 1) {
                                item.type = "签约";
                            }
                            item.contractContent = item.contract.totalYear + "年" + item.contract.totalSalary + "万"
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
                            }else if(item.source===2){
                                item.source="选秀";
                            }else if(item.source===4){
                                item.source="初始阵容";
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
                            item.contractContent = item.contract.totalYear + "年" + item.contract.totalSalary + "万";
                            item.signTime = formatDate(new Date(item.signTime), "yyyy-MM-dd hh:mm:ss");

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
            getNegotiationHistory(){
                getNegotiationList({history:true}).then(res=>{
                    if(res.code===0){
                        this.negotiationHistoryDialog=true;
                        this.negotiationHistoryData=res.data.negotiationList;
                        this.hasNegotiation=this.negotiationListData.length>0;
                        this.negotiationHistoryData.forEach(item=>{
                            if(item.type===1){
                                item.type="球员选秀"
                            }else if(item.type===2){
                                item.type="新秀选秀"
                            }else if(item.type===3){
                                item.type="续约"
                            }
                            if(item.status===1){
                                item.status="未谈判";
                            }else if(item.status===2){
                                item.status="谈判中"
                            }else if(item.status===3){
                                item.status="已拒绝";
                            }else if(item.status===4){
                                item.status="已接受";
                            }
                            if(item.lastOffer!==null){
                                item.lastOffer=item.lastOffer.totalYear+"年"+item.lastOffer.totalSalary+"万";
                            }
                        })
                    }
                })
            },
            getNegotiationList(isHistory){
              getNegotiationList({history:isHistory}).then(res=>{
                  if(res.code===0){
                      this.negotiationListData=res.data.negotiationList;
                      this.hasNegotiation=this.negotiationListData.length>0;
                      this.negotiationListData.forEach(item=>{
                          if(item.type===1){
                              item.type="球员选秀"
                          }else if(item.type===2){
                              item.type="新秀选秀"
                          }else if(item.type===3){
                              item.type="续约"
                          }
                          if(item.status===1){
                              item.status="未谈判";
                          }else if(item.status===2){
                              item.status="谈判中"
                          }else if(item.status===3){
                              item.status="已拒绝";
                          }else if(item.status===4){
                              item.status="已接受";
                          }
                          if(item.lastOffer!==null){
                              item.lastOffer=item.lastOffer.totalYear+"年"+item.lastOffer.totalSalary+"万";
                          }
                      })
                  }
              })
            },
            startTimer() {
                let temp = [];
                this.unSignedData.forEach(function (item) {
                    var t = parseInt((item.expireTime - new Date().getTime()) / 1000);
                    if (t > 0) {
                        item.timeValLeft = t;
                        // console.log(item.timeValLeft);
                        item.timeLeft = secondsToTime(t);
                    } else {
                        item.timeLeft = "已过期";
                    }
                    temp.push(item);
                });
                this.unSignedData = temp;

                this.negotiationListData.forEach((item,index)=>{
                    var t = parseInt((item.expireTime - new Date().getTime()) / 1000);
                    if (t > 0) {
                        item.timeValLeft = t;
                        // console.log(item.timeValLeft);
                        item.timeLeft = secondsToTime(t);
                    } else {
                        item.timeLeft = "已过期";
                    }
                    this.$set(this.negotiationListData,index,item)
                })
            },
            switchTab(tab) {
                if (tab.name === "negotiation") {
                    this.getNegotiationList(false);
                }else if(tab.name==="unsigned"){
                    this.getUnsignedContractList();
                }else if(tab.name==="history"){
                    this.getSignContractList(2);
                }
            },
            negotiate(row){
                let me=this;
                this.$refs.offerDialogRef.show((form)=>{
                    negotiate({
                        negotiationId:row.negotiationId,
                        offer:form
                    }).then(res=>{
                        if(res.code===0){
                            me.$message({
                                message: res.data.isAccepted?"球员接收了您的报价":"球员暂定了您的报价",
                                type: "success"
                            });
                            me.getNegotiationList(false);
                        }
                    });
                });


            }
        }
    }
</script>

<style scoped>

</style>