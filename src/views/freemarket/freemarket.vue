<template>
    <el-container>
        <el-header>
            <el-menu mode="horizontal" style="text-align: right">
                <el-submenu index="1">
                    <template slot="title">欢迎{{teamName}}</template>
                    <el-menu-item index="2-1">我的账户</el-menu-item>
                    <el-menu-item index="2-2">充值</el-menu-item>
                    <el-menu-item index="2-3">设置</el-menu-item>
                </el-submenu>
            </el-menu>
        </el-header>
        <el-container>
            <el-aside width="200px">
                <sidebar></sidebar>
            </el-aside>
            <el-container>
                <el-main>
                    <el-row>
                        <el-col :span="20">
                            <div>
                                <el-select v-model="positionFilterData" multiple placeholder="位置筛选">
                                    <el-option
                                            v-for="item in positionFilterOptions"
                                            :key="item.value"
                                            :label="item.label"
                                            :value="item.value">
                                    </el-option>
                                </el-select>
                            </div>
                        </el-col>
                        <el-col :span="4">
                            <h4 style="text-align:right">自由球员人数：{{freePlayerCount}}</h4>
                        </el-col>
                    </el-row>
                    <el-row :gutter="20">
                        <el-col :span="8" v-for="fp in freePlayerListData" :key="fp">
                            <div class="freePlayer">
                                <el-row>
                                    <el-col :span="8">
                                        <div class="block"><el-avatar class="playerAvatar" shape="square"  :src="squareUrl"></el-avatar></div>
                                    </el-col>
                                    <el-col :span="16">
                                        <div>
                                            <h3>{{fp.basicPlayer.chname}}<span>{{fp.basicPlayer.enname}}</span></h3>
                                            <h3>{{fp.basicPlayer.position}}|<span>进攻：{{fp.basicPlayer.offensive}}防守：{{fp.basicPlayer.defensive}}</span></h3>
                                            <h4>原属球队：{{fp.source}}</h4>
                                        </div>
                                    </el-col>
                                </el-row>
                                <el-row :gutter="10">
                                    <el-col :span="12" style="text-align: center">
                                        <el-button plain type="info">球员详情</el-button>
                                    </el-col>
                                    <el-col :span="12" style="text-align: center">
                                        <el-button plain type="success">谈判报价</el-button>
                                    </el-col>
                                </el-row>
                                <el-row style="margin-top: 30px">
                                    <el-col :span="12" style="text-align: center">
                                        <span>剩余时间：{{fp.timeLeft}}</span>
                                    </el-col>
                                    <el-col :span="12" style="text-align: center">
                                        <el-button type="text" @click="offerDialogVisible = true">报价情况</el-button>
                                    </el-col>
                                </el-row>

                            </div>
                        </el-col>
                    </el-row>

                    <el-dialog title="报价列表" :visible.sync="offerDialogVisible">
                        <el-table :data="offerData">
                            <el-table-column type="index" label="排名" width="50"></el-table-column>
                            <el-table-column property="teamName" label="球队"></el-table-column>
                            <el-table-column property="offer" label="报价"></el-table-column>
                            <el-table-column property="offerTime" label="报价时间"></el-table-column>
                            <el-table-column property="intention" label="意向"></el-table-column>
                        </el-table>
                    </el-dialog>
                </el-main>
            </el-container>
        </el-container>
    </el-container>

</template>

<script>
    import Sidebar from "@/views/layout/sidebar/sidebar";


    export default {
        name: "freemarket",
        components: {Sidebar},
        data(){
            return{
                teamName:"",
                squareUrl: "https://cube.elemecdn.com/9/c2/f0ee8a3c7c9638a54940382568c9dpng.png",
                freePlayerCount:0,
                offensive:200,
                defensive:200,
                originalTeam:"originalTeam",
                position:"PG",
                offerDialogVisible:false,
                lastFpId:-1,
                positionFilterOptions: [{
                    value: '1',
                    label: 'PG（控球后卫）'
                }, {
                    value: '2',
                    label: 'SG（得分后卫）'
                }, {
                    value: '3',
                    label: 'SF（小前锋）'
                }, {
                    value: '4',
                    label: 'PF（大前锋）'
                }, {
                    value: '5',
                    label: 'C（中锋）'
                }],
                positionFilterData:[],
                offerData:[
                    {
                        teamName:"koliday",
                        offer:"3年2500万",
                        offerTime:"2020/2/3 16:14:18",
                        intention:"97%"
                    }
                ],
                freePlayerListData:[]
            }

        },
        mounted(){
            this.teamName=sessionStorage.getItem("teamName");
            this.refreshFreePlayer();
            setInterval(this.startTimer,1000);
        },
        methods:{
            getMoreFreePlayer(){
                const me = this;
                this.axios.post("http://www.jrsports.com/api/freemarket/free/getFreePlayerList", {
                    fpIdOffset:this.lastFpId,
                    count:9
                }, {
                    headers: {
                        "userToken": localStorage.getItem("userToken"),
                        "teamToken": sessionStorage.getItem("teamToken")
                    }
                }).then(function (response) {
                    const freeResponse = response.data;
                    if (freeResponse.code === 0) {
                        const newFreePlayerList=freeResponse.data;
                        newFreePlayerList.forEach(function (item) {
                            item.timeLeft=me.secondsToTime((item.expireTimeStamp-new Date().getTime())/1000)
                            me.freePlayerListData.push(item)
                        });
                    } else {
                        me.$message({
                            message: freeResponse.msg,
                            type: "warning"
                        });
                    }
                });
            },
            refreshFreePlayer(){
                const me = this;
                this.axios.post("http://www.jrsports.com/api/freemarket/free/getFreePlayerList", {
                    fpIdOffset:this.lastFpId,
                    count:9
                }, {
                    headers: {
                        "userToken": localStorage.getItem("userToken"),
                        "teamToken": sessionStorage.getItem("teamToken")
                    }
                }).then(function (response) {
                    const freeResponse = response.data;
                    if (freeResponse.code === 0) {
                        const newFreePlayerList=freeResponse.data;
                        me.freePlayerListData=[];
                        newFreePlayerList.forEach(function (item) {
                            item.timeLeft=me.secondsToTime(parseInt((item.expireTimeStamp-new Date().getTime())/1000));
                            me.freePlayerListData.push(item)
                        });
                    } else {
                        me.$message({
                            message: freeResponse.msg,
                            type: "warning"
                        });
                    }
                });
            },
            secondsToTime(s) {
                let h;
                h = Math.floor(s / 60);
                s = s % 60;
                h += '';
                s += '';
                h = (h.length == 1) ? '0' + h : h;
                s = (s.length == 1) ? '0' + s : s;
                return h + ':' + s;
            },
            startTimer(){
                const me=this;
                this.freePlayerListData.forEach(function (item) {
                    item.timeLeft=me.secondsToTime(parseInt((item.expireTimeStamp-new Date().getTime())/1000));
                });
            }
        }
    }
</script>

<style>
    .freePlayer{
        background-color: #d3dce6;
        width:500px;
        height: 300px;
    }
    .playerAvatar{
        width:120px;
        height:120px;
        margin-left: 10px;
        margin-top: 10px;
    }
</style>