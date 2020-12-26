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
                            <span>下赛季工资：{{nextTotalSalary}}万/{{nextTotalSalaryLimit}}万</span>
                        </el-col>
                    </el-row>
                    <el-table :data="myPlayerDetailData" v-loading="loading">

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
                        <el-table-column property="nextSeasonSalary" label="下赛季工资"></el-table-column>
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
    import {getUserPlayerDetailList} from "@/api/player";
    import {convertPlayerInfo} from "@/utils/PlayerInfoUtil";

    export default {
        name: "myplayerdetail",
        components: {Sidebar, NavBar},
        data() {
            return {
                myPlayerDetailData: [],
                currentPlayerTablePage: {
                    totalRecordCount: 150,
                    totalPageCount: 15,
                    pageNo: 1,
                    pageSize: 10
                },
                totalSalary: 0,
                totalSalaryLimit: 7800,
                nextTotalSalary: 0,
                nextTotalSalaryLimit: 7900,
                loading: false
            }
        },
        mounted() {
            this.getUserPlayerDetailList();
        },
        methods: {
            handleCurrentChange(pageNo) {
                this.currentPlayerTablePage.pageNo = pageNo;
                const pageSize = this.currentPlayerTablePage.pageSize;
                this.getCurrentPlayerList(pageNo, pageSize);
            },
            getUserPlayerDetailList() {
                getUserPlayerDetailList().then(res => {
                    if (res.code === 0) {
                        let rec = res.data;
                        let nextTotalSalary = 0;

                        rec.forEach(function (item) {
                            convertPlayerInfo(item);
                        });
                        this.myPlayerDetailData = rec;
                        this.nextTotalSalary = nextTotalSalary;
                    }
                });
            },
        }
    }
</script>

<style scoped>

</style>