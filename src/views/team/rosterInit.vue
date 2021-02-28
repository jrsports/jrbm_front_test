<template>
    <el-container>
        <el-container>
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

                    <el-row :gutter="12">
                        <el-col :span="12">
                            <el-table :data="selected" show-summary sum-text="总薪资">
                                <el-table-column type="index" label="序号" width="100px"></el-table-column>
                                <el-table-column property="name" label="球员"></el-table-column>
                                <el-table-column property="price" label="身价"></el-table-column>
                                <el-table-column
                                        fixed="right"
                                        label="操作"
                                        width="180">
                                    <template slot-scope="scope">
                                        <el-button @click="remove(scope.row)"
                                                   type="text" size="small">移除
                                        </el-button>
                                    </template>
                                </el-table-column>
                            </el-table>
                            <el-button @click="confirm">确认阵容</el-button>
                        </el-col>
                        <el-col :span="12">
                            <el-table :data="currentPlayerData">
                                <el-table-column property="no" label="排名"></el-table-column>
                                <el-table-column property="basic.chname" label="中文名"></el-table-column>
                                <el-table-column property="basic.enname" label="英文名"></el-table-column>
                                <el-table-column property="basic.price" label="市价"></el-table-column>
                                <el-table-column property="ability.overall" label="综合评分"></el-table-column>
                                <el-table-column property="ability.offensive" label="进攻综合"></el-table-column>
                                <el-table-column property="ability.defensive" label="防守综合"></el-table-column>
                                <el-table-column
                                        fixed="right"
                                        label="操作"
                                        width="180">
                                    <template slot-scope="scope">
                                        <el-button @click="handleBasicPlayerDetail(scope.row.basic.bpId)"
                                                   type="text" size="small">详情
                                        </el-button>
                                        <el-button @click="select(scope.row)" v-if="!scope.row.selected"
                                                   type="text" size="small">选择
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
                        </el-col>
                    </el-row>

                    <PlayerInfoDialog ref="playerInfoDialogRef"></PlayerInfoDialog>
                </el-main>
            </el-container>
        </el-container>
    </el-container>
</template>

<script>
    import {searchBasicPlayer} from "@/api/player";
    import PlayerInfoDialog from "@/components/PlayerInfoDialog";
    import {confirmRosterInitialization, getRosterInitializationCandidate} from "@/api/team";
    import GlobalWebsocket from "@/websocket/GlobalWebsocket";

    export default {
        name: "rosterInit",
        components: {PlayerInfoDialog},
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
                },
                basicPlayerSearchCandidates: [],
                basicPlayerSearchLoading: false,
                selected:[]
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
                getRosterInitializationCandidate({
                    pageRequest: {
                        pageNo: pageNo,
                        pageSize: pageSize
                    },
                    orderByPrice: this.searchForm.orderByPrice,
                    orderByOverall: this.searchForm.orderByOverall,
                }).then(res => {
                    if (res.code === 0) {
                        let me=this;
                        let rec = res.data.recordList;
                        rec.forEach(function (item, index) {
                            item.no = (res.data.pageNo - 1) * res.data.pageSize + index + 1;
                            me.selected.forEach(it=>{
                                if(me.selected.length>=8 || it.bpId===item.basic.bpId){
                                    item.selected=true;
                                }
                            });
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
            select(row){
                let totalPrice=0;
                this.selected.forEach(item=>{
                    totalPrice+=item.price;
                });
                if(totalPrice+row.basic.price>6000){
                    this.$message({
                        message: "选择该球员后将超过工资帽",
                        type: "warning"
                    });
                    return;
                }

                this.selected.push({
                    bpId:row.basic.bpId,
                    name:row.basic.chname,
                    price:row.basic.price
                });
                this.currentPlayerData.forEach((item,index)=>{
                    if(this.selected.length>=8){
                        item.selected=true;
                    }else{
                        if(item.basic.bpId===row.basic.bpId){
                            item.selected=true;
                        }
                    }
                    this.$set(this.currentPlayerData,index,item);
                });



            },
            remove(row){
                this.selected.forEach(function(item, index, arr) {
                    if(item.bpId === row.bpId) {
                        arr.splice(index, 1);
                    }
                });
                this.currentPlayerData.forEach((item,index)=>{
                    let flag=false;
                    this.selected.forEach(it=>{
                        if(it.bpId===item.basic.bpId){
                            flag=true;
                        }
                    });
                    item.selected=flag;
                    this.$set(this.currentPlayerData,index,item)
                })
            },
            confirm(){
                let bpIdList=[];
                this.selected.forEach(item=>{
                    bpIdList.push(item.bpId);
                });
                confirmRosterInitialization({bpIdList:bpIdList}).then(res=>{
                    if(res.code===0){
                        this.$message({
                            message: "确认成功",
                            type: "success"
                        });
                        GlobalWebsocket.connect();
                        this.$router.push('/myteam');
                    }
                })
            }
        }
    }
</script>

<style scoped>

</style>