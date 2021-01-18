<template xmlns:el-col="http://www.w3.org/1999/html">


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
                    <el-tabs v-model="activeName" type="card">

                        <el-tab-pane label="球员选秀大会" name="playerDraft">
                            <el-tabs v-model="activeDate" type="borderCard" tab-position="left">
                                <el-tab-pane label="今日选秀" name="draft">
                                    <el-card>
                                        <div slot="header">
                                            <span>正在报名</span>
                                        </div>
                                        <el-table :data="signingUpList">
                                            <el-table-column property="draftId" label="选秀ID"></el-table-column>
                                            <el-table-column property="maxPlayerCount" label="参选球员数量"></el-table-column>
                                            <el-table-column property="currentTeamCount" label="已报名/可报名"></el-table-column>
                                            <el-table-column property="totalCardCount" label="选秀卡数量"></el-table-column>
                                            <el-table-column property="startTime" label="选秀开始时间"></el-table-column>
                                            <el-table-column
                                                    fixed="right"
                                                    label="操作"
                                                    width="100">
                                                <template slot-scope="scope">
                                                    <el-button @click="handleSignUpDialog(scope.row.draftId)" type="text" size="small">详情</el-button>
                                                </template>
                                            </el-table-column>
                                        </el-table>
                                    </el-card>
                                    <el-card style="margin-top: 50px">
                                        <div slot="header">
                                            <span>进行中</span>
                                        </div>
                                        <el-table :data="draftingList">
                                            <el-table-column property="draftId" label="选秀ID"></el-table-column>
                                            <el-table-column property="maxPlayerCount" label="参选球员数量"></el-table-column>
                                            <el-table-column property="maxTeamCount" label="球队数量"></el-table-column>
                                            <el-table-column property="progress" label="当前进度"></el-table-column>
                                        </el-table>
                                    </el-card>
                                    <el-card style="margin-top: 50px">
                                        <div slot="header">
                                            <span>即将开始</span>
                                        </div>
                                        <el-table :data="waitingStartList">
                                            <el-table-column property="draftId" label="选秀ID"></el-table-column>
                                            <el-table-column property="maxPlayerCount" label="参选球员数量"></el-table-column>
                                            <el-table-column property="maxTeamCount" label="球队数量"></el-table-column>
                                            <el-table-column property="timeLeft" label="距离开始"></el-table-column>
                                            <el-table-column
                                                    fixed="right"
                                                    label="操作"
                                                    width="100">
                                                <template slot-scope="scope">
                                                    <el-button @click="handleDraftDetail(scope.row)" type="text" size="small">详情</el-button>
                                                </template>
                                            </el-table-column>
                                        </el-table>
                                    </el-card>
                                </el-tab-pane>
                                <el-tab-pane label="选秀日历" name="calendar">

                                    <el-card>
                                        <div slot="header">
                                            <span>下一场报名开放时间</span>
                                        </div>
                                    </el-card>
                                </el-tab-pane>
                            </el-tabs>


                        </el-tab-pane>
                        <el-tab-pane label="新秀选秀大会" name="rookieDraft">

                        </el-tab-pane>

                        <el-tab-pane label="正在进行" name="ongoing">
                            <el-row :gutter="20">
                                <el-col :span="8">
                                    <el-card style="height: 300px">
                                        <div slot="header">
                                            <span>选秀编号：DR00001</span>
                                            <span style="float: right">观看人数：1250</span>
                                        </div>
                                        <div>
                                            <span>当前进度：抽签仪式</span>
                                            <el-button  style="float: right; padding: 3px 0" type="danger" round>Live</el-button>
                                        </div>
                                    </el-card>
                                </el-col>
                                <el-col :span="8">
                                    <el-card>
                                        <div slot="header">
                                            <span>卡片名称</span>
                                            <el-button  style="float: right; padding: 3px 0;font-size: 20px" type="danger" round>Live</el-button>
                                        </div>
                                    </el-card>
                                </el-col>
                                <el-col :span="8">
                                    <el-card>
                                        <div slot="header">
                                            <span>卡片名称</span>
                                            <el-button style="float: right; padding: 3px 0" type="text">操作按钮</el-button>
                                        </div>0
                                    </el-card>
                                </el-col>
                            </el-row>

                        </el-tab-pane>
                    </el-tabs>

                    <el-dialog :visible.sync="dialogVisible" title="选秀大会">
                        <div v-if="dialogType===1">
                            <el-row v-if="!isSignedUp">
                                <el-input-number v-model="cardCount" label="报名卡数量"></el-input-number>
                                <el-button @click="handleSignUp">报名</el-button>
                            </el-row>
                            <el-table :data="draftTeamListData">
                                <el-table-column
                                        prop="teamName"
                                        label="球队名">
                                </el-table-column>
                                <el-table-column
                                        prop="signUpTime"
                                        label="报名时间">
                                </el-table-column>
                                <el-table-column
                                        prop="cardCount"
                                        label="选秀卡数量">
                                </el-table-column>
                            </el-table>
                        </div>
                        <div v-if="dialogType===2">
                            <el-tabs v-model="activeDraftDetailTab" type="card">
                                <el-tab-pane label="球员名单" name="playerList">
                                    <el-table
                                            :data="draftPlayerListData"
                                            style="width: 100%">
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
                                                prop="type"
                                                label="类型">
                                        </el-table-column>
                                        <el-table-column
                                                prop="purchaseTeamName"
                                                label="求购球队"
                                                width="180">
                                        </el-table-column>
                                        <el-table-column
                                                prop="price"
                                                label="价格">
                                        </el-table-column>
                                        <el-table-column
                                                prop="salary"
                                                label="期望薪资">
                                        </el-table-column>
                                    </el-table>
                                </el-tab-pane>
                                <el-tab-pane label="球队名单&抽签结果" name="teamList">
                                    <el-table :data="draftTeamListData">
                                        <el-table-column
                                                prop="draftOrder"
                                                label="顺位">
                                        </el-table-column>
                                        <el-table-column
                                                prop="teamName"
                                                label="球队名">
                                        </el-table-column>
                                        <el-table-column
                                                prop="firstPickProb"
                                                label="状元签概率">
                                        </el-table-column>
                                        <el-table-column
                                                prop="cardCount"
                                                label="选秀卡数量">
                                        </el-table-column>
                                    </el-table>
                                </el-tab-pane>
                            </el-tabs>
                        </div>
                    </el-dialog>
                </el-main>
            </el-container>
        </el-container>
    </el-container>
</template>

<script>
    import NavBar from "@/views/layout/header/header";
    import Sidebar from "@/views/layout/sidebar/sidebar";
    import {getDraftList, getDraftTeamList, signUpDraft} from "@/api/draft";
    import {secondsToTime} from "@/utils/timeUtil";
    import {formatDate} from "@/utils/date";
    import GlobalWebsocket from "@/websocket/GlobalWebsocket";
    export default {
        components: {Sidebar,NavBar},
        mounted(){
            this.getDraftList();
            this.connectDraftChannel();
        },
        data(){
            return{
                teamName: "null",
                squareUrl: "https://cube.elemecdn.com/9/c2/f0ee8a3c7c9638a54940382568c9dpng.png",
                activeName: 'playerDraft',
                activeDate: 'draft',
                draftingList:[],
                signingUpList:[],
                drawingList:[],
                waitingStartList:[],
                dialogVisible:false,
                activeDraftDetailTab:"playerList",
                draftPlayerListData:[],
                draftTeamListData:[],
                dialogType:1,
                selectedDraftId:-1,
                cardCount:1,
                isSignedUp:false
            }
        },
        methods:{
            connectDraftChannel() {
                let channel = "/channel/draft/info/info";
                this.$store.dispatch('ws/addRouter', {
                    "channel": channel,
                    "routers": [
                        {
                            router: "/DRAFT/info/球队报名选秀大会",
                            function: this.handleNewSignUp
                        }
                    ]
                });
                GlobalWebsocket.subscribe(channel);
            },
            getDraftList(){
                getDraftList({date:new Date().getTime()}).then(res=>{
                    if(res.code===0){
                        let data=res.data;
                        this.draftingList=data.draftingList;
                        this.waitingStartList=data.waitingStartList;
                        this.drawingList=data.drawingList;
                        this.signingUpList=data.signingUpList;
                        this.signingUpList.forEach(item=>{
                            item.currentTeamCount=item.currentTeamCount+"/"+item.maxTeamCount;
                            item.startTime=formatDate(new Date(item.startTime), "yyyy-MM-dd hh:mm:ss");
                        });
                        setInterval(this.handleWaitingStartTimer,200,this.waitingStartList)
                    }
                });
            },
            handleNewSignUp(body){
                console.log(body.teamId+"报名了选秀大会"+body.draftId);
                this.getDraftList();
            },
            handleWaitingStartTimer(data){
                data.forEach((item, index)=>{
                    let secondsLeft = parseInt((item.startTime - new Date().getTime()) / 1000);
                    if (secondsLeft > 0) {
                        item.timeLeft = secondsToTime(secondsLeft);
                    } else {
                        item.timeLeft = "正在进行"
                    }
                    this.$set(data, index, item);
                })
            },
            handleSignUpDialog(draftId){
                getDraftTeamList({draftId:draftId}).then(res=>{
                    if(res.code===0){
                        this.draftTeamListData=res.data.teamList;
                        this.dialogType=1;
                        this.isSignedUp=res.data.isSignedUp;
                        this.selectedDraftId=draftId;
                        this.dialogVisible=true;
                        this.draftTeamListData.forEach(item=>{
                            item.signUpTime=formatDate(new Date(item.signUpTime), "yyyy-MM-dd hh:mm:ss");
                        });
                    }
                });
            },
            handleDraftDetail(row){
                getDraftTeamList({draftId:row.draftId}).then(res=>{
                    if(res.code===0){
                        this.draftTeamListData=res.data;
                        this.dialogVisible=true;
                        this.dialogType=2;
                    }
                });
            },
            handleSignUp(){
                signUpDraft({draftId:this.selectedDraftId,cardCount:this.cardCount}).then(res=>{
                    if(res.code===0){
                        this.handleSignUpDialog(this.selectedDraftId);
                        this.$message({
                            message: "报名成功",
                            type: "success"
                        });
                    }
                })
            }
        }
    }
</script>

<style scoped>

</style>