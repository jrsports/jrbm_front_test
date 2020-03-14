<template>


    <div>
        <el-menu :default-active="activeIndex" mode="horizontal">
            <el-menu-item index="1" @click="drawerVisible=true;getNotice()">通知中心</el-menu-item>
            <el-submenu index="2" style="float:right">
                <template slot="title">{{teamName}}</template>
                <el-menu-item index="3-1" @click="chatVisible=true;getFriendList()">好友</el-menu-item>
                <el-menu-item index="3-2">选项2</el-menu-item>
                <el-menu-item index="3-3" @click="exitTeam()">退出球队</el-menu-item>
            </el-submenu>
            <el-menu-item index="3" style="float:right">{{currentSeason}}</el-menu-item>
            <el-menu-item index="4" style="float:right">资金：{{jrFund}}JR币：{{jrCoin}}</el-menu-item>
        </el-menu>
        <el-drawer
                title="我是标题"
                :visible.sync="drawerVisible"
                :with-header="false">
            <div style="margin: 20px">
                <h3>通知中心</h3>
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
                            <el-row type="flex" align="middle" v-for="friend in friendList" :key="friend.friendId" style="margin-top: 10px">
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
                                        <h3 style="margin-top: 0px">{{friend.friendTeamName}}</h3>
                                    </el-row>
                                    <el-row>
                                        <span style="font-size: smaller;color: gray;">霍勒迪1500w卖不卖？</span>
                                    </el-row>
                                </el-col>
                                <el-col :span="4">
                                    <el-button>详情</el-button>
                                </el-col>
                                <el-col :span="4">
                                    <el-button @click="removeFriend(friend.friendId)">删除</el-button>
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
                        <el-input placeholder="请输入球队名" v-model="friendSearchName" clearable>
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
                            <el-col :span="22">
                                <div>
                                    <h3>{{msg.message}}</h3>
                                </div>
                            </el-col>
                        </el-row>
                        <el-row type="flex" justify="end" :gutter="20" align="middle"
                                v-if="msg.belong=='me' && msg.toTeamId==chat.currentChatDialogTeamId  ">
                            <el-col :span="22">
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
                <el-col :span="22">
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
    </div>

</template>

<script>
    import Friend from '../../../global/globalWebsocket'
    export default {
        name: "navHeader",
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
                teamName: "",
                jrFund: "$22,456,152,000  ",
                jrCoin: 152,
                chatVisible: false,
                count: 5,
                chatDialogVisible: false,
                searchDialogVisible: false,
                searchLoading: false,
                chat: {
                    currentChatDialogTeamId: -1,
                    currentChatDialogTeamName: "",
                    chatRecordList: Friend.chatMsgRecord()
                }
            };
        },
        mounted() {
            this.teamName = sessionStorage.getItem("teamName");
            // this.chat.chatRecordList = this.globalws.chatMsgRecord;
            // this.friendList=this.globalws.friendList;
        },
        methods: {
            readNotice(noteId) {
                var note = this.notificationList.filter((n) => {
                    return n.noteId == noteId;
                });
                console.log(note.read);
                if (note[0].read == 1) {
                    return;
                }
                this.axios.post("http://www.jrsports.com/api/user/notice/read/" + noteId, null, {
                    headers: {
                        "userToken": localStorage.getItem("userToken"),
                        "teamToken": sessionStorage.getItem("teamToken")
                    }
                }).then(function (response) {
                    const res = response.data;
                    if (res.code == 0) {
                        note[0].read = 1;
                    } else {
                        alert(res.msg);
                    }
                });
            },
            getNotice() {
                const me = this;
                this.axios.post("http://www.jrsports.com/api/user/notice/getNotificationList", {
                    pageNo: 1,
                    pageSize: 10
                }, {
                    headers: {
                        "userToken": localStorage.getItem("userToken"),
                        "teamToken": sessionStorage.getItem("teamToken")
                    }
                }).then(function (response) {
                    const res = response.data;
                    if (res.code == 0) {
                        me.notificationList = res.data.recordList;
                    } else {
                        alert(res.msg);
                    }
                });
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
            getFriendList() {
                const me = this;
                this.axios.post("http://www.jrsports.com/api/user/friend/getFriendList", null, {
                    headers: {
                        "userToken": localStorage.getItem("userToken"),
                        "teamToken": sessionStorage.getItem("teamToken")
                    }
                }).then(function (response) {
                    const res = response.data;
                    if (res.code == 0) {
                        let fl=res.data;
                        fl.forEach(function (item) {
                            item.unRead=0;
                        });
                        Friend.setFriendList(fl);
                        me.friendList=res.data;
                        setInterval(function () {
                            me.friendList=Friend.friendList();
                        }, 1000);
                    } else {
                        alert(res.msg);
                    }
                });
            },
            handleTabClick(tab) {
                if (tab.name == "friendRequestPane") {
                    this.getFriendRequestList();
                    this.getMyFriendRequestList();
                } else if (tab.name == "myFriendListPane") {
                    this.getFriendList();
                }
            },
            getFriendRequestList() {
                const me = this;
                this.axios.post("http://www.jrsports.com/api/user/friend/getOtherFriendRequestList", null, {
                    headers: {
                        "userToken": localStorage.getItem("userToken"),
                        "teamToken": sessionStorage.getItem("teamToken")
                    }
                }).then(function (response) {
                    const res = response.data;
                    if (res.code == 0) {
                        me.friendRequestList = res.data;
                    } else {
                        alert(res.msg);
                    }
                });
            },
            getMyFriendRequestList() {
                const me = this;
                this.axios.post("http://www.jrsports.com/api/user/friend/getMyFriendRequestList", null, {
                    headers: {
                        "userToken": localStorage.getItem("userToken"),
                        "teamToken": sessionStorage.getItem("teamToken")
                    }
                }).then(function (response) {
                    const res = response.data;
                    if (res.code == 0) {
                        me.myFriendRequestList = res.data;
                    } else {
                        alert(res.msg);
                    }
                });
            },
            acceptFriendRequest(friendId) {
                const me = this;
                this.axios.post("http://www.jrsports.com/api/user/friend/acceptFriendRequest/" + friendId, null, {
                    headers: {
                        "userToken": localStorage.getItem("userToken"),
                        "teamToken": sessionStorage.getItem("teamToken")
                    }
                }).then(function (response) {
                    const res = response.data;
                    if (res.code == 0) {
                        me.$message({
                            message: "同意成功",
                            type: "success"
                        });
                        me.getFriendRequestList();
                        me.getMyFriendRequestList();
                    } else {
                        alert(res.msg);
                    }
                });
            },
            refuseFriendRequest(friendId) {
                const me = this;
                this.axios.post("http://www.jrsports.com/api/user/friend/refuseFriendRequest/" + friendId, null, {
                    headers: {
                        "userToken": localStorage.getItem("userToken"),
                        "teamToken": sessionStorage.getItem("teamToken")
                    }
                }).then(function (response) {
                    const res = response.data;
                    if (res.code == 0) {
                        me.$message({
                            message: "拒绝成功",
                            type: "success"
                        });
                        me.getFriendRequestList();
                        me.getMyFriendRequestList();
                    } else {
                        alert(res.msg);
                    }
                });
            },
            cancelFriendRequest(friendId) {
                const me = this;
                this.axios.post("http://www.jrsports.com/api/user/friend/cancelFriendRequest/" + friendId, null, {
                    headers: {
                        "userToken": localStorage.getItem("userToken"),
                        "teamToken": sessionStorage.getItem("teamToken")
                    }
                }).then(function (response) {
                    const res = response.data;
                    if (res.code == 0) {
                        me.$message({
                            message: "撤销成功",
                            type: "success"
                        });
                        me.getFriendRequestList();
                        me.getMyFriendRequestList();
                    } else {
                        alert(res.msg);
                    }
                });
            },
            removeFriend(friendId) {
                const me = this;
                this.axios.post("http://www.jrsports.com/api/user/friend/removeFriend/" + friendId, null, {
                    headers: {
                        "userToken": localStorage.getItem("userToken"),
                        "teamToken": sessionStorage.getItem("teamToken")
                    }
                }).then(function (response) {
                    const res = response.data;
                    if (res.code == 0) {
                        me.$message({
                            message: "删除成功",
                            type: "success"
                        });
                        me.getFriendList();
                    } else {
                        alert(res.msg);
                    }
                });
            },
            searchFriend(name) {
                if (name == "" || name == null) {
                    this.searchFriendList = [];
                    this.searchFriendCount = 0;
                    return;
                }
                const me = this;
                this.axios.post("http://www.jrsports.com/api/user/friend/searchFriend", {
                    name: name
                }, {
                    headers: {
                        "userToken": localStorage.getItem("userToken"),
                        "teamToken": sessionStorage.getItem("teamToken")
                    }
                }).then(function (response) {
                    const res = response.data;
                    if (res.code == 0) {
                        me.searchFriendList = res.data;
                        me.searchFriendCount = res.data.length;
                    } else {
                        alert(res.msg);
                    }
                });
            },
            sendFriendRequest(teamId) {
                const me = this;
                this.axios.post("http://www.jrsports.com/api/user/friend/sendFriendRequest/" + teamId, null, {
                    headers: {
                        "userToken": localStorage.getItem("userToken"),
                        "teamToken": sessionStorage.getItem("teamToken")
                    }
                }).then(function (response) {
                    const res = response.data;
                    if (res.code == 0) {
                        me.$message({
                            message: "好友请求发送成功",
                            type: "success"
                        });
                    } else {
                        alert(res.msg);
                    }
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
            handleChatMessage() {

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