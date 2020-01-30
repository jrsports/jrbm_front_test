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
                    <el-tabs v-model="activeName" type="card" @tab-click="handleClick">
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
                        <el-tab-pane label="即将开始" name="upcoming">即将开始</el-tab-pane>
                        <el-tab-pane label="已结束" name="finished">已结束</el-tab-pane>
                    </el-tabs>
                </el-main>
            </el-container>
        </el-container>
    </el-container>
</template>

<script>
    import Sidebar from "@/views/layout/sidebar/sidebar";
    import axios from 'axios'
    export default {
        components: {Sidebar},
        mounted(){
            const me = this;
            //初始化时加载球队信息
            axios.post("http://www.jrsports.com/api/user/team/getTeamInfo",null,{
                headers:{
                    "userToken":sessionStorage.getItem("userToken"),
                    "teamToken":sessionStorage.getItem("teamToken")
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
                squareUrl: "https://cube.elemecdn.com/9/c2/f0ee8a3c7c9638a54940382568c9dpng.png",
                activeName: 'ongoing'
            }
        },
        methods:{

        }
    }
</script>

<style scoped>

</style>