<template>


    <div>
        <el-menu :default-active="activeIndex" mode="horizontal" @select="handleSelect">
            <el-menu-item index="1" @click="drawerVisible=true;getNotice()">通知中心</el-menu-item>
            <el-submenu index="2" style="float:right">
                <template slot="title">{{teamName}}</template>
                <el-menu-item index="3-1" @click="chatVisible=true;getFriendList()">好友</el-menu-item>
                <el-menu-item index="3-2">选项2</el-menu-item>
                <el-menu-item index="3-3">退出球队</el-menu-item>
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
                <el-collapse  accordion>
                    <el-collapse-item v-for="(item,index) in notificationList" :key="index" :name="item.noteId">
                        <template slot="title">
                            <span>{{item.title}}</span><span style="margin-left: 20px">{{item.notifyTime}}</span>
                            <el-tag style="margin-left: 30px" type="success" v-if="item.read==0">未读</el-tag>
                        </template>
                        <h4>{{item.content}}</h4>
<!--                        <el-button type="primary" icon="el-icon-edit" v-if="item.type==1">前往确认</el-button>-->
                        <el-button type="primary" icon="el-icon-edit" v-if="item.read==0" @click="readNotice(item.noteId)">已读</el-button>
                    </el-collapse-item>
                </el-collapse>
            </div>
        </el-drawer>

        <el-drawer
                title="我是标题"
                :visible.sync="chatVisible"
                :with-header="false">
            <div style="margin: 20px">
                <h3>好友列表</h3>
<!--                <el-divider content-position="center">在线好友</el-divider>-->
                <div>
                    <el-row type="flex" align="middle" v-for="friend in friendList" :key="friend">
                        <el-col :span="6">
                            <a @click="chatDialogVisible=true;openChat()" style="cursor: pointer">
                                <el-avatar :size="80" shape="square"
                                            src="https://cube.elemecdn.com/9/c2/f0ee8a3c7c9638a54940382568c9dpng.png">
                                </el-avatar>
                            </a>

                        </el-col>
                        <el-col :span="14">
                            <el-row>
                                <h3>{{friend.friendTeamName}}</h3>
                            </el-row>
                            <el-row>
                                <span>霍勒迪1500w卖不卖？</span>
                            </el-row>
                        </el-col>
                        <el-col :span="4">
                            <el-button>详情</el-button>
                        </el-col>
                    </el-row>

                </div>
<!--                <el-divider content-position="center">离线好友</el-divider>-->
            </div>
        </el-drawer>
        <el-dialog :title="Koliday" :visible.sync="chatDialogVisible"></el-dialog>
    </div>

</template>

<script>
    export default {
        name: "header",
        data() {
            return {
                activeIndex: '1',
                drawerVisible:false,
                notificationList:[
                    {
                        noteId:1,
                        type:1,
                        title:"自由市场球员签约确认",
                        content:"自由球员朱-霍勒迪希望与您签约，请在4小时内确认！",
                        data:null,
                        read:0,
                        notifyTime:"今天22:02"
                    }
                ],
                friendList:[],
                currentSeason:"休赛期",
                teamName:"",
                jrFund:"$22,456,152,000  ",
                jrCoin:152,
                chatVisible:false,
                count:5,
                chatDialogVisible:false
            };
        },
        mounted(){
            this.teamName=sessionStorage.getItem("teamName")
        },
        methods: {
            readNotice(noteId){
                var note=this.notificationList.filter((n)=>{
                   return n.noteId==noteId;
                });
                console.log(note.read);
                if(note[0].read==1){
                    return;
                }
                this.axios.post("http://www.jrsports.com/api/user/notice/read/"+noteId, null, {
                    headers: {
                        "userToken": localStorage.getItem("userToken"),
                        "teamToken": sessionStorage.getItem("teamToken")
                    }
                }).then(function (response) {
                    const res = response.data;
                    if(res.code==0){
                        note[0].read=1;
                    }else{
                        alert(res.msg);
                    }
                });
            },
            getNotice(){
                const me=this;
                this.axios.post("http://www.jrsports.com/api/user/notice/getNotificationList", {
                    pageNo:1,
                    pageSize:10
                }, {
                    headers: {
                        "userToken": localStorage.getItem("userToken"),
                        "teamToken": sessionStorage.getItem("teamToken")
                    }
                }).then(function (response) {
                    const res = response.data;
                    if(res.code==0){
                        me.notificationList=res.data.recordList;
                    }else{
                        alert(res.msg);
                    }
                });
            },
            exitTeam(){
                sessionStorage.removeItem("teamToken");
                sessionStorage.removeItem("teamName");
                this.$router.push('/');
            },
            openChat(){

            },
            getFriendList(){
                const me=this;
                this.axios.post("http://www.jrsports.com/api/user/friend/getFriendList", null, {
                    headers: {
                        "userToken": localStorage.getItem("userToken"),
                        "teamToken": sessionStorage.getItem("teamToken")
                    }
                }).then(function (response) {
                    const res = response.data;
                    if(res.code==0){
                        me.friendList=res.data;
                    }else{
                        alert(res.msg);
                    }
                });
            }
        }
    }
</script>

<style scoped>
    .friend{
        height: 50px;
        width: 100%;
        margin-top: 10px;
    }
</style>