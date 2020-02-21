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
                    <el-table :data="currentPlayerData">
                        <el-table-column property="no" label="排名"></el-table-column>
                        <el-table-column property="chname" label="中文名"></el-table-column>
                        <el-table-column property="enname" label="英文名"></el-table-column>
                        <el-table-column property="price" label="市价"></el-table-column>
                        <el-table-column property="offensive" label="进攻综合"></el-table-column>
                        <el-table-column property="defensive" label="防守综合"></el-table-column>
                    </el-table>
                    <el-pagination
                            background
                            layout="prev, pager, next"
                            :total="currentPlayerTablePage.totalRecordCount"
                            :page-count="currentPlayerTablePage.totalPageCount"
                            :current-page="currentPlayerTablePage.pageNo"
                            :page-size="currentPlayerTablePage.pageSize"
                            @current-change="handleCurrentChange"
                            >
                    </el-pagination>
                </el-main>
            </el-container>
        </el-container>
    </el-container>
</template>

<script>
    import Sidebar from "@/views/layout/sidebar/sidebar";
    import NavBar from "@/views/layout/header/header";
    export default {
        name: "currentability",
        components: {Sidebar,NavBar},
        data(){
            return{
                currentPlayerData:[],
                currentPlayerTablePage:{
                    totalRecordCount:150,
                    totalPageCount:15,
                    pageNo:1,
                    pageSize:10
                }
            }
        },
        mounted(){
            this.getCurrentPlayerList(1,10);
        },
        methods:{
            handleCurrentChange(pageNo){
                this.currentPlayerTablePage.pageNo=pageNo;
                const pageSize=this.currentPlayerTablePage.pageSize;
                this.getCurrentPlayerList(pageNo,pageSize);
            },
            getCurrentPlayerList(pageNo,pageSize) {
                const me = this;
                this.axios.post("http://www.jrsports.com/api/player/basic/getCurrentPlayerList", {
                    pageNo:pageNo,
                    pageSize:pageSize
                }, {
                    headers: {
                        "userToken": localStorage.getItem("userToken"),
                        "teamToken": sessionStorage.getItem("teamToken")
                    }
                }).then(function (response) {
                    const res = response.data;
                    if (res.code === 0) {
                        let rec=res.data.recordList;
                        rec.forEach(function (item,index) {
                            item.no=(res.data.pageNo-1)*res.data. pageSize+index+1;
                        });
                        me.currentPlayerData=rec;
                        me.currentPlayerData.totalRecordCount=res.data.totalRecordCount;
                        me.currentPlayerData.totalPageCount=res.data.totalPageCount;
                        me.currentPlayerData.pageNo=res.data.pageNo;
                        me.currentPlayerData. pageSize=res.data. pageSize;
                    } else {
                        alert(res.message);
                    }
                });
            },
        }
    }
</script>

<style scoped>

</style>