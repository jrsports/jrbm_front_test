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
                    <el-button-group>
                        <el-button size="mini" @click="orderByPrice=true;orderByOverall=false;getCurrentPlayerList(1, 10)">按身价降序</el-button>
                        <el-button size="mini" @click="orderByPrice=false;orderByOverall=true;getCurrentPlayerList(1, 10)">按综评降序</el-button>
                    </el-button-group>
                    <el-table :data="currentPlayerData">
                        <el-table-column property="no" label="排名"></el-table-column>
                        <el-table-column property="chname" label="中文名"></el-table-column>
                        <el-table-column property="enname" label="英文名"></el-table-column>
                        <el-table-column property="ability.price" label="市价"></el-table-column>
                        <el-table-column property="ability.overall" label="综合评分"></el-table-column>
                        <el-table-column property="ability.offensive" label="进攻综合"></el-table-column>
                        <el-table-column property="ability.defensive" label="防守综合"></el-table-column><el-table-column
                            fixed="right"
                            label="操作"
                            width="180">
                        <template slot-scope="scope">
                            <el-button @click="handleBasicPlayerDetail(scope.row.bpId)"
                                       type="text" size="small">详情
                            </el-button>
                        </template>
                    </el-table-column>
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

                    <PlayerInfoDialog ref="playerInfoDialogRef"></PlayerInfoDialog>
                </el-main>
            </el-container>
        </el-container>
    </el-container>
</template>

<script>
    import Sidebar from "@/views/layout/sidebar/sidebar";
    import NavBar from "@/views/layout/header/header";
    import {getCurrentPlayerList} from "@/api/player";
    import PlayerInfoDialog from "@/components/PlayerInfoDialog";

    export default {
        name: "currentplayer",
        components: {Sidebar, NavBar,PlayerInfoDialog},
        data() {
            return {
                currentPlayerData: [],
                currentPlayerTablePage: {
                    totalRecordCount: 150,
                    totalPageCount: 15,
                    pageNo: 1,
                    pageSize: 10
                },
                orderByPrice:true,
                orderByOverall: false
            }
        },
        mounted() {
            this.getCurrentPlayerList(1, 10);
        },
        methods: {
            handleCurrentChange(pageNo) {
                this.getCurrentPlayerList(pageNo,10);
            },
            handleBasicPlayerDetail(bpId){
                this.$refs.playerInfoDialogRef.showBasic(bpId);
            },
            getCurrentPlayerList(pageNo, pageSize) {
                getCurrentPlayerList({
                    pageRequest: {
                        pageNo: pageNo,
                        pageSize: pageSize
                    },
                    orderByPrice: this.orderByPrice,
                    orderByOverall: this.orderByOverall
                }).then(res => {
                    if (res.code === 0) {
                        let rec = res.data.recordList;
                        rec.forEach(function (item, index) {
                            item.no = (res.data.pageNo - 1) * res.data.pageSize + index + 1;
                            item.ability.price.delta=item.ability.price.delta>0?("+"+item.ability.price.delta):item.ability.price.delta;
                            item.ability.offensive.delta=item.ability.offensive.delta>0?("+"+item.ability.offensive.delta):item.ability.offensive.delta;
                            item.ability.defensive.delta=item.ability.defensive.delta>0?("+"+item.ability.defensive.delta):item.ability.defensive.delta;
                            item.ability.overall.delta=item.ability.overall.delta>0?("+"+item.ability.overall.delta):item.ability.overall.delta;

                            item.ability.price=item.ability.price.value+"("+item.ability.price.delta+")";
                            item.ability.offensive=item.ability.offensive.value+"("+item.ability.offensive.delta+")";
                            item.ability.defensive=item.ability.defensive.value+"("+item.ability.defensive.delta+")";
                            item.ability.overall=item.ability.overall.value+"("+item.ability.overall.delta+")";
                        });
                        this.currentPlayerData = rec;
                        this.currentPlayerData.totalRecordCount = res.data.totalRecordCount;
                        this.currentPlayerData.totalPageCount = res.data.totalPageCount;
                        this.currentPlayerData.pageNo = res.data.pageNo;
                        this.currentPlayerData.pageSize = res.data.pageSize;
                    }
                });
            },
        }
    }
</script>

<style scoped>

</style>