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
                                    prop="signToken"
                                    label="签约编号">
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

                    </el-card>
                </el-main>
            </el-container>
        </el-container>
    </el-container>
</template>

<script>
    import Sidebar from "@/views/layout/sidebar/sidebar";
    import NavBar from "@/views/layout/header/header"
    export default {
        components: {Sidebar,NavBar},
        name: "sign",
        data(){
            return{
                unSignedData:[]
            }
        },
        mounted(){
          this.getUnsignedContractList();
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
                       me.unSignedData=res.data.recordList;
                    } else {
                        alert(res.message);
                    }
                });
            },
            signContract(row) {
                const me = this;
                this.axios.post("http://www.jrsports.com/api/sign/sign/signContract/"+row.signToken, null, {
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
                    } else {
                        alert(res.message);
                    }
                });
            },
            refuseContract(row) {
                const me = this;
                this.axios.post("http://www.jrsports.com/api/sign/sign/refuseContract/"+row.signToken, null, {
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
                    } else {
                        alert(res.message);
                    }
                });
            }
        }
    }
</script>

<style scoped>

</style>