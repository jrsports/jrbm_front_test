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
                    <el-row>
                        <el-col :span="12">
                            <span>本赛季工资：{{totalSalary}}万/{{totalSalaryLimit}}万</span>
                        </el-col>
                    </el-row>
                    <el-table :data="myPlayerDetailData">

                        <el-table-column property="order" label="位置"></el-table-column>
                        <el-table-column property="position" label="擅长"></el-table-column>
                        <el-table-column property="chname" label="中文名"></el-table-column>
                        <el-table-column property="enname" label="英文名"></el-table-column>
                        <el-table-column property="price" label="市价"></el-table-column>
                        <el-table-column property="offensiveOverall" label="进攻综合"></el-table-column>
                        <el-table-column property="defensiveOverall" label="防守综合"></el-table-column>
                        <el-table-column property="overall" label="总评"></el-table-column>
                        <el-table-column property="grade" label="等级"></el-table-column>
                        <el-table-column property="type" label="类型"></el-table-column>
                        <el-table-column property="currentSeasonSalary" label="本赛季工资"></el-table-column>
                    </el-table>
<!--                    <el-pagination-->
<!--                            background-->
<!--                            layout="prev, pager, next"-->
<!--                            :total="currentPlayerTablePage.totalRecordCount"-->
<!--                            :page-count="currentPlayerTablePage.totalPageCount"-->
<!--                            :current-page="currentPlayerTablePage.pageNo"-->
<!--                            :page-size="currentPlayerTablePage.pageSize"-->
<!--                            @current-change="handleCurrentChange"-->
<!--                            >-->
<!--                    </el-pagination>-->
                </el-main>
            </el-container>
        </el-container>
    </el-container>
</template>

<script>
    import Sidebar from "@/views/layout/sidebar/sidebar";
    import NavBar from "@/views/layout/header/header";
    export default {
        name: "myplayerdetail",
        components: {Sidebar,NavBar},
        data(){
            return{
                myPlayerDetailData:[],
                currentPlayerTablePage:{
                    totalRecordCount:150,
                    totalPageCount:15,
                    pageNo:1,
                    pageSize:10
                },
                totalSalary:0,
                totalSalaryLimit:7800
            }
        },
        mounted(){
            this.getUserPlayerDetailList();
        },
        methods:{
            handleCurrentChange(pageNo){
                this.currentPlayerTablePage.pageNo=pageNo;
                const pageSize=this.currentPlayerTablePage.pageSize;
                this.getCurrentPlayerList(pageNo,pageSize);
            },
            getUserPlayerDetailList() {
                const me = this;
                this.axios.post("http://www.jrsports.com/api/player/userPlayer/getUserPlayerDetailList", null, {
                    headers: {
                        "userToken": localStorage.getItem("userToken"),
                        "teamToken": sessionStorage.getItem("teamToken")
                    }
                }).then(function (response) {
                    const res = response.data;
                    if (res.code === 0) {
                        let rec=res.data;
                        rec.forEach(function (item) {
                            if(item.order==1){
                                item.order="首发PG"
                            }else if(item.order==2){
                                item.order="首发SG"
                            }else if(item.order==3){
                                item.order="首发SF"
                            }else if(item.order==4){
                                item.order="首发PF"
                            }else if(item.order==5){
                                item.order="首发C"
                            }
                            if(item.position==1){
                                item.position="PG"
                            }else if(item.position==2){
                                item.position="SG"
                            }else if(item.position==3){
                                item.position="SF"
                            }else if(item.position==4){
                                item.position="PF"
                            }else if(item.position==5){
                                item.position="C"
                            }
                            
                            if(item.grade==1){
                                item.grade="S+"
                            }else if(item.grade==2){
                                item.grade="S"
                            }else if(item.grade==3){
                                item.grade="S-"
                            }else if(item.grade==4){
                                item.grade="A+"
                            }else if(item.grade==5){
                                item.grade="A"
                            }else if(item.grade==6){
                                item.grade="A-"
                            }else if(item.grade==7){
                                item.grade="B+"
                            }else if(item.grade==8){
                                item.grade="B"
                            }else if(item.grade==9){
                                item.grade="B-"
                            }else if(item.grade==10){
                                item.grade="C+"
                            }else if(item.grade==11){
                                item.grade="C"
                            }else if(item.grade==12){
                                item.grade="C-"
                            }else if(item.grade==13){
                                item.grade="D+"
                            }else if(item.grade==14){
                                item.grade="D"
                            }else if(item.grade==15){
                                item.grade="D-"
                            }



                            if(item.type==0){
                                item.type="现役";
                            }else{
                                item.type="历史";
                            }

                        });
                        me.myPlayerDetailData=rec;
                        // me.currentPlayerData.totalRecordCount=res.data.totalRecordCount;
                        // me.currentPlayerData.totalPageCount=res.data.totalPageCount;
                        // me.currentPlayerData.pageNo=res.data.pageNo;
                        // me.currentPlayerData. pageSize=res.data. pageSize;
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