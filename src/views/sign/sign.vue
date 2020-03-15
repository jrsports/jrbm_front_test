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
                                    prop="playerChname"
                                    label="球员">
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
                                    prop="expireTime"
                                    label="截止时间">
                            </el-table-column>
                            <el-table-column label="签约">
                                <template slot-scope="scope">
                                    <el-button
                                            size="mini"
                                            @click="signContract(scope.row)">接受</el-button>
                                    <el-button
                                            size="mini"
                                            @click="refuseContract(scope.row)">拒绝</el-button>
                                </template>
                            </el-table-column>
                        </el-table>
                    </el-card>
                    <el-divider></el-divider>
                    <el-card class="box-card">
                        <div slot="header">
                            <span>已签约</span>
                        </div>
                        <el-table
                                v-loading="loading"
                                :data="signedData"
                                style="width: 100%">
                            <el-table-column
                                    prop="contractId"
                                    label="合同编号">
                            </el-table-column>
                            <el-table-column
                                    prop="playerChname"
                                    label="球员">
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
                                            @click="viewContractDetail(scope.row);contractDetailDialogVisible=true">详情</el-button>
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
                </el-main>
            </el-container>
        </el-container>
    </el-container>
</template>

<script>
    import Sidebar from "@/views/layout/sidebar/sidebar";
    import NavBar from "@/views/layout/header/header";
    export default {
        components: {Sidebar,NavBar},
        name: "sign",
        data(){
            return{
                unSignedData:[],
                signedData:[],
                colShow:false,
                contractDetailDialogVisible:false,
                contractDetailData:[
                    {
                        season:"第一赛季",
                        salary:"500万"
                    },
                    {
                        season:"第二赛季",
                        salary:"600万"
                    },
                    {
                        season:"第三赛季",
                        salary:"700万"
                    },
                    {
                        season:"第四赛季",
                        salary:"800万"
                    },
                ],
                loading:true
            }
        },
        mounted(){
          this.getUnsignedContractList();
          this.getSignedContractList();
        },
        methods:{
            getUnsignedContractList() {
                const me = this;
                this.axios.post("http://www.jrsports.com/api/sign/sign/getUnsignedContractList", {
                    pageNo:1,
                    pageSize:10
                }, {
                    headers: {
                        "userToken": localStorage.getItem("userToken"),
                        "teamToken": sessionStorage.getItem("teamToken")
                    }
                }).then(function (response) {
                    const res = response.data;
                    if (res.code === 0) {
                        let sd=res.data.recordList;
                        sd.forEach(function (item) {
                            if(item.source==1){
                                item.source="自由市场";
                            }
                            if(item.type==1){
                                item.type="签约";
                            }
                        });
                       me.unSignedData=sd;
                    } else {
                        me.$message({
                            message: res.msg,
                            type: "warning"
                        });
                    }
                });
            },
            getSignedContractList() {
                const me = this;
                this.axios.post("http://www.jrsports.com/api/sign/sign/getSignedContractList", {
                    pageNo:1,
                    pageSize:10
                }, {
                    headers: {
                        "userToken": localStorage.getItem("userToken"),
                        "teamToken": sessionStorage.getItem("teamToken")
                    }
                }).then(function (response) {
                    const res = response.data;
                    if (res.code === 0) {
                        let sd=res.data.recordList;
                        sd.forEach(function (item) {
                            if(item.source==1){
                                item.source="自由市场";
                            }
                            if(item.type==1){
                                item.type="签约";
                            }
                            if(item.status==2){
                                item.status="签约成功";
                            }else if(item.status==3){
                                item.status="拒绝签约";
                            }else if(item.status==4){
                                item.status="已过期";
                            }
                            item.contract=item.contractDetailDto.totalSeason+"年"+item.contractDetailDto.totalSalary+"万"
                        });
                        me.signedData=sd;
                        me.loading=false;
                    } else {
                        me.$message({
                            message: res.msg,
                            type: "warning"
                        });
                    }
                });
            },
            signContract(row) {
                const me = this;
                this.axios.post("http://www.jrsports.com/api/sign/sign/signContract", {
                    contractId:row.contractId,
                    signToken:row.signToken
                }, {
                    headers: {
                        "userToken": localStorage.getItem("userToken"),
                        "teamToken": sessionStorage.getItem("teamToken")
                    }
                }).then(function (response) {
                    const res = response.data;
                    if (res.code === 0) {
                        me.$message({
                            message: "签约成功",
                            type: "success"
                        });
                        me.getUnsignedContractList();
                        me.getSignedContractList();
                    } else {
                        me.$message({
                            message: res.msg,
                            type: "warning"
                        });
                    }
                });
            },
            refuseContract(row) {
                const me = this;
                this.axios.post("http://www.jrsports.com/api/sign/sign/refuseContract", {
                    contractId:row.contractId,
                    signToken:row.signToken
                }, {
                    headers: {
                        "userToken": localStorage.getItem("userToken"),
                        "teamToken": sessionStorage.getItem("teamToken")
                    }
                }).then(function (response) {
                    const res = response.data;
                    if (res.code === 0) {
                        me.$message({
                            message: "拒绝成功",
                            type: "success"
                        });
                        me.getUnsignedContractList();
                        me.getSignedContractList();
                    } else {
                        me.$message({
                            message: res.msg,
                            type: "warning"
                        });
                    }
                });
            },
            viewContractDetail(row){
                const me=this;
                const d=me.signedData;
                d.forEach(function (item) {
                    if(item.contractId==row.contractId){
                        me.contractDetailData=item.contractDetailDto.contractSalaryEntityList;
                    }
                })
            }
        }
    }
</script>

<style scoped>

</style>