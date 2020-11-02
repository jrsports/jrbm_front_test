<template>
    <div id="app">
        <router-view/>
    </div>

</template>

<script>
    export default {
        name: 'App',
        //app.vue
        methods:{
            // async refreshTeamToken() {
            //     console.log("refresh");
            //     const me=this;
            //     await this.axiosPost.post("http://www.jrsports.com/api/user/team/refreshTeamToken", null, {
            //         headers: {
            //             "userToken": localStorage.getItem("userToken"),
            //             "teamToken": sessionStorage.getItem("teamToken"),
            //             "refresh":true
            //         }
            //     }).then(function (response) {
            //         const loginResponse=response.data;
            //         if(loginResponse.code===0){
            //             console.log("更新teamToken");
            //             sessionStorage.setItem("teamToken",loginResponse.teamToken);
            //         }else{
            //             me.$message({
            //                 message: loginResponse.msg,
            //                 type: "error"
            //             });
            //         }
            //     });
            // },
        },
        created(){
            //刷新所有页面时，判断球队是否已经登录，如果登录了，需要重新连接websocket
            // if(sessionStorage.getItem("teamToken")){
            //     //重连
            //     this.globalws.connectToGlobalServer();
            // }
        },


    }
</script>

<style>
</style>
