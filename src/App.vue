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
            //     await this.axios.post("http://www.jrsports.com/api/user/team/refreshTeamToken", null, {
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
        async beforeCreate(){
            console.log("beforeCreate start");
            //刷新所有页面时，判断球队是否已经登录，如果登录了，需要重新连接websocket
            if(sessionStorage.getItem("teamToken")){
                //拿原来的token去刷新，换取新的token
                await this.globalws.refreshTeamToken();
                //重连
                await this.globalws.connectToGlobalServer();
            }
            console.log("beforeCreate finish");
        },
        mounted(){

        },
        async beforeDestroy(){
            // alert("beforeDestroy");
            //刷新所有页面时，判断球队是否已经登录，如果登录了，需要重新连接websocket
            // if(sessionStorage.getItem("teamToken")){
            //     //拿原来的token去刷新，换取新的token
            //     await this.refreshTeamToken();
            //     //重连
            //     await this.globalws.connectToGlobalServer();
            // }
            // alert("beforeDestroy end")
        },
        destroyed() {
            window.onbeforeunload = null;
        }


    }
</script>

<style>
</style>
