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
    export default {
        name: "gameindex",
        components: {Sidebar}
    }
</script>

<style scoped>

</style>