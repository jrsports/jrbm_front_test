<template>
    <div id="app">
        <router-view/>
    </div>

</template>

<script>
    import GlobalWebsocket from "@/websocket/GlobalWebsocket";

    export default {
        name: 'App',
        //app.vue
        methods:{

        },
        created(){
            // 刷新所有页面时，判断球队是否已经登录，如果登录了，需要重新连接websocket
            if(sessionStorage.getItem("teamToken") && !GlobalWebsocket.stompClient){
                //重连
                GlobalWebsocket.connect("/user/queue/team");
            }
        },


    }
</script>

<style>
</style>
