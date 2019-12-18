<template xmlns:el-col="http://www.w3.org/1999/html">
    <el-row class="tac">
        <el-col :span="2">
            <sidebar></sidebar>
        </el-col>
        <el-col :span="22">
            这里是游戏主页
        </el-col>
    </el-row>
</template>

<script>
    import Sidebar from "@/views/layout/sidebar/sidebar";
    import axios from 'axios'
    export default {
        name: "gameindex",
        components: {Sidebar},
        mounted(){
            //初始化时加载球队信息
            axios.post("http://www.jrsports.com/api/team/login",{
                username:this.form.username,
                password:this.form.password,
                freeLoginType:this.freeLoginType?1:0
            }).then(function (response) {
                var loginResponse=response.data;
                if(loginResponse.code===0){
                    localStorage.setItem("token",loginResponse.token);
                    me.loginDialogVisible=false;
                    me.ifLogin=true;
                    me.welcome="欢迎"+loginResponse.username;
                }else{
                    alert(loginResponse.message);
                }
            }).catch(function (error) {
                alert(error);
            });
        },
        methods:{

        }
    }
</script>

<style scoped>

</style>