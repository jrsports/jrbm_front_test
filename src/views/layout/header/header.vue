<template>


    <div>
        <el-menu :default-active="activeIndex" mode="horizontal">
            <el-avatar style="float:right" :src="getTeamAvatar"></el-avatar>
            <el-submenu index="2" style="float:right">
                <template slot="title">{{getTeamName}}</template>
                <el-menu-item index="3-1" @click="drawerVisible=true;getNotificationList()">通知中心</el-menu-item>
                <el-menu-item index="3-2" @click="chatVisible=true;getFriendList()">好友</el-menu-item>
                <el-menu-item index="3-3" @click="exitTeam()">退出球队</el-menu-item>
            </el-submenu>
            <el-menu-item index="3" style="float:right" @click="toSeasonPage()">{{getSeason}}</el-menu-item>
            <el-menu-item index="4" style="float:right">{{getExp}}</el-menu-item>
            <el-menu-item index="5" style="float:right">
                <i class="el-icon-money"></i>${{getTeamFund}}
                <i class="el-icon-coin"></i>{{getTeamCoin}}
            </el-menu-item>
        </el-menu>
        <el-drawer
                title="我是标题"
                :visible.sync="drawerVisible"
                :with-header="false">
            <div style="margin: 20px">
                <el-row>
                    <el-col :span="10">
                        <h3>通知中心</h3>
                    </el-col>
                    <el-col :span="10">
<!--                        <el-button size="mini">全部已读</el-button>-->
                    </el-col>
                </el-row>


                <el-collapse accordion>
                    <el-collapse-item v-for="(item,index) in notificationList" :key="index" :name="item.noteId">
                        <template slot="title">
                            <span>{{item.title}}</span><span style="margin-left: 20px">{{item.notifyTime}}</span>
                            <el-tag style="margin-left: 30px" type="success" v-if="item.read==0">未读</el-tag>
                        </template>
                        <h4>{{item.content}}</h4>
                        <!--                        <el-button type="primary" icon="el-icon-edit" v-if="item.type==1">前往确认</el-button>-->
                        <el-button type="primary" icon="el-icon-edit" v-if="item.read==0"
                                   @click="readNotice(item.noteId)">已读
                        </el-button>
                    </el-collapse-item>
                </el-collapse>
            </div>
        </el-drawer>

        <el-drawer
                title="我是标题"
                :visible.sync="chatVisible"
                :with-header="false">
            <div style="margin: 20px">
                <el-row align="middle">
                    <h3>好友</h3>
                </el-row>

                <el-tabs v-model="activeName" @tab-click="handleTabClick">
                    <el-tab-pane label="我的好友" name="myFriendListPane">
                        <div style="margin-top: 20px">
                            <el-row type="flex" align="middle" v-for="friend in getFriendList" :key="friend.friendId" style="margin-top: 10px">
                                <el-col :span="4">
                                    <a @click="chatDialogVisible=true;openChat(friend.friendTeamId,friend.friendTeamName)"
                                       style="cursor: pointer;">
                                        <el-badge :value="friend.unRead" class="item">
                                            <el-avatar :size="60" shape="square"
                                                       src="https://cube.elemecdn.com/9/c2/f0ee8a3c7c9638a54940382568c9dpng.png"
                                                        :class="friend.online?'onlineBorder':'offlineBorder'">
                                            </el-avatar>
                                        </el-badge>
                                    </a>

                                </el-col>
                                <el-col :span="12">
                                    <el-row >
                                        <a @click="getFriendDetail(friend.friendTeamId)" style="cursor: pointer">
                                            <h3 style="margin-top: 0px">{{friend.friendTeamName}}</h3>
                                        </a>

                                    </el-row>
                                    <el-row>
                                        <span style="font-size: smaller;color: gray;">霍勒迪1500w卖不卖？</span>
                                    </el-row>
                                </el-col>
                                <el-col :span="4">
                                    <el-button v-if="friend.online" icon="el-icon-connection" @click="sendTradeInvitation(friend.friendTeamId,friend.friendTeamName)"></el-button>
                                </el-col>
                                <el-col :span="4">
                                    <el-button v-if="friend.online && !friend.matching" icon="el-icon-cpu" @click="sendMatchRequest(friend.friendTeamId,friend.friendTeamName)"></el-button>
                                    <el-tag type="success" v-if="friend.matching">比赛中</el-tag>
                                </el-col>
                                <el-col :span="4">
                                    <el-button icon="el-icon-delete" @click="removeFriend(friend.friendId)"></el-button>
                                </el-col>
<!--                                <el-col :span="4">-->
<!--                                    <el-badge :value="12" class="item">-->
<!--                                        <el-button icon="el-icon-chat-line-round"></el-button>-->
<!--                                    </el-badge>-->
<!--                                </el-col>-->
                            </el-row>

                        </div>
                    </el-tab-pane>
                    <el-tab-pane label="好友请求" name="friendRequestPane">
                        <el-scrollbar style="height: 100%">
                            <div style="height:700px;margin-top: 20px;">
                                <el-divider content-position="center">收到的好友申请</el-divider>
                                <div v-for="friend in friendRequestList" :key="friend">
                                    <el-card shadow="hover">
                                        <el-row type="flex" align="middle">
                                            <el-col :span="14">
                                                <h3>{{friend.friendTeamName}}</h3>
                                            </el-col>
                                            <el-col :span="5">
                                                <el-button type="success" @click="acceptFriendRequest(friend.friendId)">
                                                    同意
                                                </el-button>
                                            </el-col>
                                            <el-col :span="5">
                                                <el-button type="warning" @click="refuseFriendRequest(friend.friendId)">
                                                    拒绝
                                                </el-button>
                                            </el-col>
                                        </el-row>

                                    </el-card>
                                    <el-divider></el-divider>
                                </div>
                                <el-divider content-position="center">发出的好友申请</el-divider>
                                <div v-for="friend in myFriendRequestList" :key="friend">
                                    <el-card shadow="hover">
                                        <el-row type="flex" align="middle">
                                            <el-col :span="20">
                                                <h3>{{friend.friendTeamName}}</h3>
                                            </el-col>
                                            <el-col :span="4">
                                                <el-button type="success" @click="cancelFriendRequest(friend.friendId)">
                                                    撤销
                                                </el-button>
                                            </el-col>
                                        </el-row>

                                    </el-card>
                                    <el-divider></el-divider>
                                </div>
                            </div>
                        </el-scrollbar>
                    </el-tab-pane>
                    <el-tab-pane label="添加好友" name="addFriendPane">
                        <el-input placeholder="请输入球队名" v-model="friendSearchName" clearable @input="searchFriend(friendSearchName)">
                            <el-button slot="append" icon="el-icon-search"
                                       @click="searchFriend(friendSearchName)"></el-button>
                        </el-input>
                        <p style="margin-top: 20px;">搜索到{{searchFriendCount}}支球队</p>
                        <el-scrollbar style="height: 100%">
                            <div style="height:700px;margin-top: 20px;">
                                <div v-for="friend in searchFriendList" :key="friend">
                                    <el-card shadow="hover">
                                        <el-row type="flex" align="middle">
                                            <el-col :span="14">
                                                <h3>{{friend.teamName}}</h3>
                                            </el-col>
                                            <el-col :span="5">
                                                <el-button icon="el-icon-warning-outline">查看</el-button>
                                            </el-col>
                                            <el-col :span="5">
                                                <el-button type="info" v-if="friend.friendStatus==0"
                                                           icon="el-icon-circle-plus-outline"
                                                           @click="sendFriendRequest(friend.teamId);friend.friendStatus=1;">
                                                    添加
                                                </el-button>
                                                <el-button type="info" v-if="friend.friendStatus==1" disabled>已发送
                                                </el-button>
                                                <el-button type="info" v-if="friend.friendStatus==2"
                                                           icon="el-icon-chat-round">聊天
                                                </el-button>
                                            </el-col>
                                        </el-row>

                                    </el-card>
                                    <el-divider></el-divider>
                                </div>
                            </div>
                        </el-scrollbar>
                    </el-tab-pane>
                </el-tabs>


            </div>
        </el-drawer>
        <el-dialog :title="chat.currentChatDialogTeamName" :visible.sync="chatDialogVisible">
            <el-scrollbar>
                <div style="height: 500px;margin-bottom: 80px;">
                    <div v-for="msg in chat.chatRecordList" :key="msg.msgId">
                        <el-row type="flex" align="middle"
                                v-if="msg.belong=='friend' && msg.fromTeamId==chat.currentChatDialogTeamId">
                            <el-col :span="2">
                                <el-avatar :size="40" shape="square"
                                           src="https://cube.elemecdn.com/9/c2/f0ee8a3c7c9638a54940382568c9dpng.png">
                                </el-avatar>
                            </el-col>
                            <el-col span="22">
                                <div>
                                    <h3>{{msg.message}}</h3>
                                </div>
                            </el-col>
                        </el-row>
                        <el-row type="flex" justify="end" :gutter="20" align="middle"
                                v-if="msg.belong=='me' && msg.toTeamId==chat.currentChatDialogTeamId  ">
                            <el-col span="22">
                                <div style="text-align: right">
                                    <h3>{{msg.message}}</h3>
                                </div>
                            </el-col>
                            <el-col :span="2">
                                <el-avatar :size="40" shape="square"
                                           src="https://cube.elemecdn.com/9/c2/f0ee8a3c7c9638a54940382568c9dpng.png">
                                </el-avatar>
                            </el-col>
                        </el-row>
                    </div>
                </div>
            </el-scrollbar>
            <el-row type="flex" align="middle">
                <el-col span="22">
                    <el-input
                            type="textarea"
                            :rows="1"
                            resize="none"
                            maxlength="200"
                            show-word-limit
                            placeholder="请输入内容"
                            v-model="msgSendContent"
                            @keyup.enter.native="sendMsg()">
                    </el-input>
                </el-col>
                <el-col :span="2">
                    <el-button style="float: right" @click="sendMsg">发送</el-button>
                </el-col>
            </el-row>


        </el-dialog>
        <TradeRoomDialog></TradeRoomDialog>
        <TradeInvitationDialog ref="tradeInvitationDialogRef"></TradeInvitationDialog>
        <MatchInvitationDialog ref="matchInvitationDialogRef"></MatchInvitationDialog>
        <TeamInfoDialog ref="teamInfoDialogRef"></TeamInfoDialog>
    </div>

</template>

<script>
    import Friend from '../../../global/globalWebsocket'
    import TradeRoomDialog from "@/components/TradeRoomDialog"
    import TeamInfoDialog from "@/components/TeamInfoDialog";
    import TradeInvitationDialog from "@/components/TradeInvitationDialog";
    import MatchInvitationDialog from "@/components/MatchInvitationDialog";
    import {
        acceptFriendRequest, cancelFriendRequest,
        getMyFriendRequestList,
        getOtherFriendRequestList,
        refuseFriendRequest, removeFriend, searchFriend, sendFriendRequest
    } from "@/api/friend";
    import {getNotificationList, readNotification} from "@/api/notification";
    import {sendTradeInvitation} from "@/api/traderoom";
    import {} from "@/api/match";
    import {Notification} from "element-ui";
    import {sendFriendMatchInvitation} from "@/api/match";
    export default {
        name: "navHeader",
        components: {TradeRoomDialog, TeamInfoDialog,TradeInvitationDialog,MatchInvitationDialog},
        computed:{
            getTeamName(){
                return this.$store.getters.teamName
            },
            getTeamAvatar(){
                return this.$store.getters.teamAvatar
            },
            getTeamFund(){
                return this.$store.getters.fund
            },
            getTeamCoin(){
                return this.$store.getters.coin
            },
            getFriendList(){
                return this.$store.getters.friendList
            },
            getSeason(){
                let season=this.$store.getters.season;
                if(season<=0){
                    return "休赛期";
                }else{
                    return "第"+season+"赛季";
                }
            },
            getExp(){
                return "Lv "+this.$store.getters.exp;
            }
        },
        mounted() {
            this.getMyTeamInfo();
            this.initFriendList();
        },
        created() {
            this.registerNotificationRouter();
            this.registerFriendRouter();
        },
        data() {
            return {
                activeIndex: '1',

                drawerVisible: false,
                msgSendContent: "",
                notificationList: [
                    {
                        noteId: 1,
                        type: 1,
                        title: "自由市场球员签约确认",
                        content: "自由球员朱-霍勒迪希望与您签约，请在4小时内确认！",
                        data: null,
                        read: 0,
                        notifyTime: "今天22:02"
                    }
                ],
                friendList: [],
                searchFriendList: [],
                friendRequestList: [],
                myFriendRequestList: [],
                activeName: "myFriendListPane",
                friendSearchName: "",
                currentSeason: "休赛期",
                searchFriendCount: 0,
                chatVisible: false,
                count: 5,
                chatDialogVisible: false,
                searchDialogVisible: false,
                teamDetailDialogVisible:true,
                searchLoading: false,
                chat: {
                    currentChatDialogTeamId: -1,
                    currentChatDialogTeamName: "",
                    chatRecordList: Friend.chatMsgRecord()
                }
            };
        },
        methods: {
            getMyTeamInfo(){
                let me=this;
                this.$store.dispatch('team/getMyTeamInfo').then((res)=>{
                    if(res.code===0){
                        if(res.data.status===2){
                            me.$router.push('/rosterInit');
                        }
                    }
                }).catch(()=>{

                })
            },
            toSeasonPage(){
                this.$router.push('/season');
            },
            readNotice(noteId) {
                var note = this.notificationList.filter((n) => {
                    return n.noteId == noteId;
                });
                if (note[0].read == 1) {
                    return;
                }
                readNotification(noteId).then(()=>{
                    note[0].read = 1;
                });
            },
            getNotificationList() {
                getNotificationList({pageNo:1,pageSize:100}).then(res=>{
                    this.notificationList = res.data.recordList;
                })
            },
            exitTeam() {
                sessionStorage.removeItem("teamToken");
                sessionStorage.removeItem("teamName");
                this.$router.push('/');
            },
            openChat(friendTeamId, friendTeamName) {
                this.chat.currentChatDialogTeamId = friendTeamId;
                this.chat.currentChatDialogTeamName = friendTeamName;
                Friend.resetUnRead(friendTeamId);
            },
            initFriendList() {
                this.$store.dispatch('team/getFriendList').then(()=>{

                }).catch(()=>{

                })
            },
            handleTabClick(tab) {
                if (tab.name == "friendRequestPane") {
                    this.getFriendRequestList();
                    this.getMyFriendRequestList();
                } else if (tab.name == "myFriendListPane") {
                    this.initFriendList();
                }
            },
            getFriendRequestList() {
                getOtherFriendRequestList().then(res=>{
                    this.friendRequestList = res.data;
                });
            },
            getMyFriendRequestList() {
                getMyFriendRequestList().then(res=>{
                    this.myFriendRequestList = res.data;
                });
            },
            acceptFriendRequest(friendId) {
                acceptFriendRequest(friendId).then(res=>{
                    if(res.code===0){
                        this.$message({
                            message: "同意成功",
                            type: "success"
                        });
                        this.getFriendRequestList();
                        this.getMyFriendRequestList();
                        this.initFriendList();
                    }

                });
            },
            refuseFriendRequest(friendId) {
                refuseFriendRequest(friendId).then(res=>{
                    if(res.code===0){
                        this.$message({
                            message: "拒绝成功",
                            type: "success"
                        });
                        this.getFriendRequestList();
                        this.getMyFriendRequestList();
                    }

                });
            },
            cancelFriendRequest(friendId) {
                cancelFriendRequest(friendId).then(res=>{
                    if(res.code===0){
                        this.$message({
                            message: "取消成功",
                            type: "success"
                        });
                        this.getFriendRequestList();
                        this.getMyFriendRequestList();
                    }
                });
            },
            getFriendDetail(teamId){
                this.$refs.teamInfoDialogRef.show(teamId)
            },
            removeFriend(friendId) {
                removeFriend(friendId).then(res=>{
                    if(res.code===0){
                        this.$message({
                            message: "删除成功",
                            type: "success"
                        });
                        this.initFriendList();
                    }
                });
            },
            searchFriend(name) {
                if (name === "" || name == null) {
                    this.searchFriendList = [];
                    this.searchFriendCount = 0;
                    return;
                }
                const me = this;
                searchFriend({name:name}).then(res=>{
                    me.searchFriendList = res.data;
                    me.searchFriendCount = res.data.length;
                });
            },
            sendFriendRequest(teamId) {
                sendFriendRequest(teamId).then(()=>{
                    this.$message({
                        message: "好友请求发送成功",
                        type: "success"
                    });
                });
            },
            sendMsg() {

                const msgContent = this.msgSendContent;
                if (msgContent.trim() == "") {
                    return;
                }
                const toTeamId = this.chat.currentChatDialogTeamId;
                this.msgSendContent = "";
                Friend.pushMsgRecord({
                    message: msgContent,
                    belong: "me",
                    toTeamId: toTeamId
                });
                this.globalws.ws.send(JSON.stringify({
                    type: 100,
                    time: new Date().getTime(),
                    message: msgContent,
                    toTeamId: toTeamId
                }));
            },


            sendTradeInvitation(targetTeamId,targetTeamName){
                sendTradeInvitation({targetTeamId:targetTeamId}).then(res=>{
                    if(res.code===0){
                        this.$refs.tradeInvitationDialogRef.show(targetTeamName);
                    }
                });
            },
            sendMatchRequest(opponentTeamId,targetTeamName){
                sendFriendMatchInvitation({opponentTeamId:opponentTeamId}).then(res=>{
                    if(res.code===0){
                        this.$refs.matchInvitationDialogRef.show(targetTeamName);
                    }
                });
            },
            handleChatMessage() {

            },
            handleReceiveNotification(body){
                Notification({
                    title: body.title,
                    message: body.content
                })
            },
            handleReceiveFriendRefresh(){
                this.initFriendList();
            },
            registerNotificationRouter() {
                this.$store.dispatch('ws/addRouter', {
                    "channel": "/user/queue/team",
                    "routers":[
                    {
                        router:"/USER/notification/收到通知",
                        function: this.handleReceiveNotification
                    }
                ]})
            },
            registerFriendRouter() {
                this.$store.dispatch('ws/addRouter', {
                    "channel": "/user/queue/team",
                    "routers":[
                        {
                            router:"/USER/friend/刷新好友列表",
                            function: this.handleReceiveFriendRefresh
                        }
                    ]})
            }

        }
    }
</script>

<style scoped>
    .friend {
        height: 50px;
        width: 100%;
        margin-top: 10px;
    }
    .offlineBorder{
        border: 2px solid gray;
    }
    .onlineBorder{
        border: 2px solid greenyellow;
    }
</style>