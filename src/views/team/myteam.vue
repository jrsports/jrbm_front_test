<template xmlns:el-col="http://www.w3.org/1999/html">


    <el-container>
        <el-header>
            <el-menu  mode="horizontal" style="text-align: right">
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
                        <el-col :span="4" style="text-align: center">
                            <div class="block">
                                <el-avatar shape="square" :size="100" :src="squareUrl"></el-avatar>
                                <span></span>
                            </div>
                        </el-col>
                        <el-col :span="5" style="text-align: center">
                            <div class="block"><el-avatar shape="square" :size="100" :src="squareUrl"></el-avatar></div>
                        </el-col>
                        <el-col :span="5" style="text-align: center">
                            <div class="block"><el-avatar shape="square" :size="100" :src="squareUrl"></el-avatar></div>
                        </el-col>
                        <el-col :span="5" style="text-align: center">
                            <div class="block"><el-avatar shape="square" :size="100" :src="squareUrl"></el-avatar></div>
                        </el-col>
                        <el-col :span="5" style="text-align: center">
                            <div class="block"><el-avatar shape="square" :size="100" :src="squareUrl"></el-avatar></div>
                        </el-col>
                    </el-row>
                </el-main>
            </el-container>
        </el-container>
    </el-container>
</template>

<script>
    import Sidebar from "@/views/layout/sidebar/sidebar";
    import axios from 'axios'
    export default {
        name: "gameindex",
        components: {Sidebar},
        mounted(){
            const me = this;
            //初始化时加载球队信息
            axios.post("http://www.jrsports.com/api/user/team/getTeamInfo",null,{
                headers:{
                    "userToken":localStorage.getItem("userToken"),
                    "teamToken":localStorage.getItem("teamToken")
                }
            }).then(function (response) {
                const teamInfoResponse = response.data;
                if(teamInfoResponse.code===0){
                    console.log(teamInfoResponse);
                    me.teamName=teamInfoResponse.data.teamName;
                }else{
                    alert(teamInfoResponse.message);
                }
            }).catch(function (error) {
                alert(error);
            });
        },
        data(){
            return{
                teamName: "null",
                squareUrl: "https://cube.elemecdn.com/9/c2/f0ee8a3c7c9638a54940382568c9dpng.png"
            }
        },
        methods:{

        }
    }
</script>

<style scoped>

</style>