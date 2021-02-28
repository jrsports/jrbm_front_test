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

                    <el-form :inline="true" :model="searchForm">
                        <el-form-item label="球员">
                            <el-select
                                    v-model="searchForm.bpId"
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
                        <el-form-item>
                            <el-button type="primary" @click="getCurrentPlayerList(1,10)">搜索</el-button>
                        </el-form-item>
                        <el-form-item label="排序">
                            <el-button-group>
                                <el-button size="mini"
                                           @click="searchForm.orderByPrice=true;searchForm.orderByOverall=false;getCurrentPlayerList(1, 10)">
                                    按身价降序
                                </el-button>
                                <el-button size="mini"
                                           @click="searchForm.orderByPrice=false;searchForm.orderByOverall=true;getCurrentPlayerList(1, 10)">
                                    按综评降序
                                </el-button>
                            </el-button-group>
                        </el-form-item>

                    </el-form>
                    <el-table :data="currentPlayerData">
                        <el-table-column property="no" label="排名"></el-table-column>
                        <el-table-column property="chname" label="中文名"></el-table-column>
                        <el-table-column property="enname" label="英文名"></el-table-column>
                        <el-table-column property="ability.price" label="市价"></el-table-column>
                        <el-table-column property="ability.overall" label="综合评分"></el-table-column>
                        <el-table-column property="ability.offensive" label="进攻综合"></el-table-column>
                        <el-table-column property="ability.defensive" label="防守综合"></el-table-column>
                        <el-table-column
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
    import {getCurrentPlayerList, searchBasicPlayer} from "@/api/player";
    import PlayerInfoDialog from "@/components/PlayerInfoDialog";

    export default {
        name: "currentplayer",
        components: {Sidebar, NavBar, PlayerInfoDialog},
        data() {
            return {
                currentPlayerData: [],
                currentPlayerTablePage: {
                    totalRecordCount: 150,
                    totalPageCount: 15,
                    pageNo: 1,
                    pageSize: 10
                },
                searchForm: {
                    orderByPrice: true,
                    orderByOverall: false,
                    bpId: null
                },
                basicPlayerSearchCandidates: [],
                basicPlayerSearchLoading: false,
            }
        },
        mounted() {
            this.getCurrentPlayerList(1, 10);
        },
        methods: {
            handleCurrentChange(pageNo) {
                this.getCurrentPlayerList(pageNo, 10);
            },
            handleBasicPlayerDetail(bpId) {
                this.$refs.playerInfoDialogRef.showBasic(bpId);
            },
            getCurrentPlayerList(pageNo, pageSize) {
                getCurrentPlayerList({
                    pageRequest: {
                        pageNo: pageNo,
                        pageSize: pageSize
                    },
                    orderByPrice: this.searchForm.orderByPrice,
                    orderByOverall: this.searchForm.orderByOverall,
                    bpId:this.searchForm.bpId
                }).then(res => {
                    if (res.code === 0) {
                        let rec = res.data.recordList;
                        rec.forEach(function (item, index) {
                            item.no = (res.data.pageNo - 1) * res.data.pageSize + index + 1;
                            item.ability.price.delta = item.ability.price.delta > 0 ? ("+" + item.ability.price.delta) : item.ability.price.delta;
                            item.ability.offensive.delta = item.ability.offensive.delta > 0 ? ("+" + item.ability.offensive.delta) : item.ability.offensive.delta;
                            item.ability.defensive.delta = item.ability.defensive.delta > 0 ? ("+" + item.ability.defensive.delta) : item.ability.defensive.delta;
                            item.ability.overall.delta = item.ability.overall.delta > 0 ? ("+" + item.ability.overall.delta) : item.ability.overall.delta;

                            item.ability.price = item.ability.price.value + "(" + item.ability.price.delta + ")";
                            item.ability.offensive = item.ability.offensive.value + "(" + item.ability.offensive.delta + ")";
                            item.ability.defensive = item.ability.defensive.value + "(" + item.ability.defensive.delta + ")";
                            item.ability.overall = item.ability.overall.value + "(" + item.ability.overall.delta + ")";
                        });
                        this.currentPlayerData = rec;

                        this.currentPlayerTablePage.totalRecordCount = res.data.totalRecordCount;
                        this.currentPlayerTablePage.totalPageCount = res.data.totalPageCount;
                        this.currentPlayerTablePage.pageNo = res.data.pageNo;
                        this.currentPlayerTablePage.pageSize = res.data.pageSize;
                    }
                });
            },
            searchBasicPlayer(chname) {
                if (chname !== '') {
                    this.basicPlayerSearchLoading = true;
                    searchBasicPlayer({chname: chname}).then(res => {
                        if (res.code === 0) {
                            this.basicPlayerSearchCandidates = res.data;
                        }
                    });
                    this.basicPlayerSearchLoading = false;
                }
            },
        }
    }
</script>

<style scoped>

</style>