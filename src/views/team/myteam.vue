<template xmlns:el-col="http://www.w3.org/1999/html">


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
                    <el-row :gutter="20">
                        <el-col :span="2">
                            <h3>
                                首发阵容
                            </h3>
                        </el-col>
                        <el-col :span="4" style="text-align: center" v-for="player in starting" :key="player">
                            <div class="block" @click="selectPlayer($event,player.upId)">
                                <el-avatar shape="square" :size="100" :src="player.avatarUrl"></el-avatar>
                                <p>{{player.chname}}</p>
                                <p>{{player.enname}}</p>
                                <p>攻：{{player.offensive}}，防：{{player.defensive}}</p>
                                <p>位置：{{player.position}}，工资：{{player.salary}}w</p>
                            </div>
                        </el-col>
                        <el-col :span="2">
                            <div>
                                <el-button @click="openSubstitute">{{subs}}</el-button>
                            </div>
                        </el-col>
                    </el-row>
                    <el-row :gutter="20">
                        <el-col :span="2">
                            <h3>
                                替补阵容
                            </h3>
                        </el-col>
                        <el-col :span="4" style="text-align: center" v-for="player in sub" :key="player">
                            <div class="block" @click="selectPlayer($event,player.upId)">
                                <el-avatar shape="square" :size="100" :src="player.avatarUrl"></el-avatar>
                                <p>{{player.chname}}</p>
                                <p>{{player.enname}}</p>
                                <p>攻：{{player.offensive}}，防：{{player.defensive}}</p>
                                <p>位置：{{player.position}}，工资：{{player.salary}}w</p>
                            </div>
                        </el-col>
                        <el-col :span="2">

                        </el-col>
                    </el-row>

                </el-main>
            </el-container>
        </el-container>
    </el-container>
</template>

<script>
    import Sidebar from "@/views/layout/sidebar/sidebar";
    // import Chat from "@/views/layout/chat/chat";
    import axios from 'axios'
    var ifSubstitute=false;
    var substituteList=[];
    export default {
        name: "gameindex",
        components: {Sidebar},
        mounted() {
            const me = this;
            //初始化时加载球队信息
            axios.post("http://www.jrsports.com/api/user/team/getTeamInfo", null, {
                headers: {
                    "userToken": sessionStorage.getItem("userToken"),
                    "teamToken": sessionStorage.getItem("teamToken")
                }
            }).then(function (response) {
                const teamInfoResponse = response.data;
                if (teamInfoResponse.code === 0) {
                    console.log(teamInfoResponse);
                    me.teamName = teamInfoResponse.data.teamName;
                } else {
                    alert(teamInfoResponse.message);
                }
            }).catch(function (error) {
                alert(error);
            });
            this.getTeamPlayerList();
        },
        computed: {
            starting: function () {
                return this.playerList.filter(function (player) {
                    return player.order <= 5
                })
            },
            sub: function () {
                return this.playerList.filter(function (player) {
                    return player.order > 5
                })
            }
        },
        data() {
            return {
                teamName: "null",
                playerList: [{
                    avatarUrl: "https://cube.elemecdn.com/9/c2/f0ee8a3c7c9638a54940382568c9dpng.png",
                    chname: "默认",
                    enname: "default",
                    offensive: 126,
                    defensive: 110,
                    position: "PG/SG",
                    salary: 4800,
                    order: 1
                }],
                subs:"开启换人"
            }
        },
        methods: {
            getTeamPlayerList() {
                const me = this;
                //获取服务器列表和球队
                axios.post("http://www.jrsports.com/api/user/team/getTeamPlayerList", null, {
                    headers: {
                        "userToken": sessionStorage.getItem("userToken"),
                        "teamToken": sessionStorage.getItem("teamToken")
                    }
                }).then(function (response) {
                    const serverResponse = response.data;
                    me.playerList = serverResponse.data;
                }).catch(function (error) {
                    alert(error);
                });
            },
            selectPlayer(event,upId){
                if(ifSubstitute){
                    substituteList.push(upId);
                    if(substituteList.length==2){
                        this.substitute(substituteList[0],substituteList[1]);
                        console.log("换人："+substituteList[0]+"换"+substituteList[1]);
                        substituteList=[];

                    }
                }
            },
            openSubstitute(){
                if(!ifSubstitute){
                    ifSubstitute=true;
                    this.subs="关闭换人";
                }else{
                    ifSubstitute=false;
                    this.subs="开启换人";
                }
            },
            substitute(fromUpId,toUpId){
                const me = this;
                //获取服务器列表和球队
                axios.post("http://www.jrsports.com/api/user/team/substitutePlayer", {
                    fromUpId:fromUpId,
                    toUpId:toUpId
                }, {
                    headers: {
                        "userToken": sessionStorage.getItem("userToken"),
                        "teamToken": sessionStorage.getItem("teamToken")
                    }
                }).then(function (response) {
                    const serverResponse = response.data;
                    if(serverResponse.code==0){
                        me.$message({
                            message:"换人成功",
                            type:"success"
                        });
                        me.playerList = serverResponse.data;
                    }else{
                        alert(serverResponse.msg);
                    }

                }).catch(function (error) {
                    alert(error);
                });
            },
        }
    }
</script>

<style scoped>

</style>