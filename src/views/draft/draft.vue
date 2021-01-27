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
                    <el-tabs v-model="activeName" type="card" @tab-click="switchTab">

                        <el-tab-pane label="球员选秀大会" name="playerDraft">
                            <el-tabs v-model="activeDate" type="borderCard" tab-position="left" @tab-click="switchPlayerDraftTab">
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
                                                    width="180">
                                                <template slot-scope="scope">
                                                    <el-button @click="handleSignUpDialog(scope.row.draftId)" type="text" size="small">详情</el-button>
                                                </template>
                                            </el-table-column>
                                        </el-table>
                                    </el-card>
                                    <el-card style="margin-top: 50px">
                                        <div slot="header">
                                            <span>抽签中</span>
                                        </div>
                                        <el-table :data="drawingList">
                                            <el-table-column property="draftId" label="选秀ID"></el-table-column>
                                            <el-table-column property="maxPlayerCount" label="参选球员数量"></el-table-column>
                                            <el-table-column property="maxTeamCount" label="球队数量"></el-table-column>
                                            <el-table-column property="progress" label="当前进度"></el-table-column>
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
                                            <el-table-column
                                                    fixed="right"
                                                    label="操作"
                                                    width="100">
                                                <template slot-scope="scope">
                                                    <el-button @click="handleDraftDetail(scope.row,4)" type="text" size="small">详情</el-button>
                                                </template>
                                            </el-table-column>
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
                                                    <el-button @click="handleDraftDetail(scope.row,3)" type="text" size="small">详情</el-button>
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

                    <el-dialog :visible.sync="dialogVisible" title="选秀大会" width="1100px">
                        <div v-if="dialogType===1">
                            <el-row v-if="!isSignedUp">
                                <el-input-number v-model="cardCount" label="报名卡数量"></el-input-number>
                                <el-button @click="handleSignUp">报名</el-button>
                            </el-row>
                            <el-table :data="draftTeamListData" height="800px">
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
                        <div v-if="dialogType!==1">
                            <el-tabs v-model="activeDraftDetailTab" type="card">
                                <el-tab-pane label="选秀直播" name="pick" v-if="dialogType===3">
                                    <el-table :data="draftRoomData.teamList">
                                        <el-table-column
                                                prop="draftOrder"
                                                label="顺位">
                                        </el-table-column>
                                        <el-table-column
                                                prop="teamName"
                                                label="球队名">
                                        </el-table-column>
                                        <el-table-column
                                                prop="pickStatus"
                                                label="选人状态">
                                        </el-table-column>
                                    </el-table>
                                </el-tab-pane>
                                <el-tab-pane label="球员名单" name="playerList">
                                    <el-table
                                            :data="draftPlayerListData"
                                            height="500px"
                                            style="width: 100%">
                                        <el-table-column
                                                label="球员"
                                                width="100">
                                            <template slot-scope="scope">
                                                <div class="block" @click="handlePlayerDetail(scope.row.upId)" style="cursor:pointer;">
                                                    <el-avatar shape="square" :size="50" :src="scope.row.avatarUrl"></el-avatar>
                                                </div>
                                            </template>
                                        </el-table-column>
                                        <el-table-column
                                                prop="chname"
                                                label="中文名"
                                                width="180">
                                        </el-table-column>
                                        <el-table-column
                                                prop="position"
                                                label="位置">
                                        </el-table-column>
                                        <el-table-column
                                                prop="type"
                                                label="类型">
                                        </el-table-column>
                                        <el-table-column
                                                prop="price"
                                                label="市价">
                                        </el-table-column>
                                        <el-table-column
                                                prop="expectSalary"
                                                label="期望薪资">
                                        </el-table-column>
                                        <el-table-column
                                                v-if="dialogType===3"
                                                fixed="right"
                                                label="操作"
                                                width="100">
                                            <template slot-scope="scope">
                                                <el-button v-if="canPick(scope.row)" @click="pickPlayer(scope.row)" type="text" size="small">
                                                    选择
                                                </el-button>
                                                <el-tag v-if="!isPicked(scope.row)">未被选</el-tag>
                                                <el-tag v-if="isPicked(scope.row)" type="success">已被选</el-tag>
                                            </template>
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
    import {
        getDraftList,
        getDraftPlayerList,
        getDraftRoom,
        getDraftTeamList,
        pickPlayer,
        signUpDraft
    } from "@/api/draft";
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
                isSignedUp:false,
                draftRoomData:{}
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
                        },
                        {
                            router: "/DRAFT/info/选秀抽签",
                            function: this.handleDrawMsg
                        }
                    ]
                });
                GlobalWebsocket.subscribe(channel);
            },
            connectDraftRoomChannel(draftId){
                let channel = "/channel/draft/room/"+draftId;
                this.$store.dispatch('ws/addRouter', {
                    "channel": channel,
                    "routers": [
                        {
                            router: "/DRAFT/room/下一个选人",
                            function: this.handleNextPick
                        }
                    ]
                });
                GlobalWebsocket.subscribe(channel);
            },
            switchTab(tab){
              if(tab.name==="playerDraft"){
                  this.getDraftList();
              }
            },
            switchPlayerDraftTab(tab){
                if(tab.name==="draft"){
                    this.getDraftList();
                }
            },
            canPick(row){
              return this.draftRoomData.currentTeam && row.teamId===null;
            },
            isPicked(row){
                return row.teamId!==null;
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
            pickPlayer(row){
                pickPlayer({draftId:row.draftId,draftPlayerId:row.draftPlayerId}).then(res=>{
                    if(res.code===0){
                        this.$message({
                            message: "选人成功",
                            type: "success"
                        });
                    }
                });
            },
            handleNewSignUp(body){
                console.log(body);
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
            handleDraftDetail(row,draftStatus){
                if(draftStatus===4){
                    this.dialogType=3;
                }else{
                    this.dialogType=2;
                }

                if(this.dialogType===3){
                    this.connectDraftRoomChannel(row.draftId);
                    this.getDraftRoom(row.draftId);
                    this.dialogVisible=true;
                }else{
                    getDraftTeamList({draftId:row.draftId}).then(res=>{
                        if(res.code===0){
                            this.draftTeamListData=res.data.teamList;
                            this.draftTeamListData.forEach(item=>{
                                if(item.draftOrder===1){
                                    item.draftOrder="状元";
                                } else if(item.draftOrder===2){
                                    item.draftOrder="榜眼";
                                }else if(item.draftOrder===3){
                                    item.draftOrder="探花";
                                }
                            });
                            this.dialogVisible=true;

                        }
                    });
                    getDraftPlayerList({draftId:row.draftId}).then(res=>{
                        if(res.code===0){
                            this.draftPlayerListData=res.data.playerList;
                        }
                    });
                }

            },
            handleSignUp(){
                signUpDraft({draftId:this.selectedDraftId,cardCount:this.cardCount}).then(res=>{
                    if(res.code===0){
                        this.handleSignUpDialog(this.selectedDraftId);
                        this.getDraftList();
                        this.$message({
                            message: "报名成功",
                            type: "success"
                        });
                    }
                })
            },
            handleDrawMsg(body){
                this.drawingList.forEach((item, index)=>{
                    if(item.draftId===body.draftId){
                        item.progress=body.content;
                        this.$set(this.drawingList, index, item);
                    }
                })
            },
            handleNextPick(body){
                console.log(body);
                this.getDraftRoom(body.draftId);
            },
            getDraftRoom(draftId){
                getDraftRoom({draftId:draftId}).then(res=>{
                    this.draftRoomData=res.data;
                    this.draftPlayerListData=res.data.playerList;
                    setInterval(this.handlePickTimer,200,this.draftRoomData)
                });
            },
            handlePickTimer(data){
                // if(!data){
                //     return;
                // }
                data.teamList.forEach((item, index)=>{
                    if(item.teamId===this.draftRoomData.currentTeamId){
                        let secondsLeft = parseInt((data.currentExpire - new Date().getTime()) / 1000);
                        if (secondsLeft > 0) {
                            item.pickStatus = secondsToTime(secondsLeft);
                        } else {
                            item.pickStatus = "已过期"
                        }
                        this.$set(data, index, item);
                    }
                })
            }
        }
    }
</script>

<style scoped>

</style>