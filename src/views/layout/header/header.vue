<template>


    <div>
        <el-menu :default-active="activeIndex" mode="horizontal" @select="handleSelect">
            <el-menu-item index="1" @click="drawerVisible=true;getNotice()">通知中心</el-menu-item>
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
                ]
            };
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
            }
        }
    }
</script>

<style scoped>

</style>