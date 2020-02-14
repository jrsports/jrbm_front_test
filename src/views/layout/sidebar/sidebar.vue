<template>

    <div >
        <el-menu
                default-active="1"
                class="el-menu-vertical-demo"
                @open="handleOpen"
                @close="handleClose"
                style="height: 800px">
            <el-menu-item index="1">
                <i class="el-icon-basketball"></i>
                <span slot="title" @click="getMyTeamPage">我的球队</span>
            </el-menu-item>
            <el-menu-item index="2">
                <i class="el-icon-menu"></i>
                <span slot="title" @click="getDraftPage">选秀大会</span>
            </el-menu-item>
            <el-menu-item index="3">
                <i class="el-icon-document"></i>
                <span slot="title" @click="getFreeMarketPage">自由市场</span>
            </el-menu-item>
            <el-menu-item index="4">
                <i class="el-icon-document"></i>
                <span slot="title" @click="getMatchPage">比赛</span>
            </el-menu-item>
            <el-menu-item index="5">
                <i class="el-icon-setting"></i>
                <span slot="title" @click="getMyProfilePage">个人设置</span>
            </el-menu-item>
        </el-menu>
    </div>




</template>

<script>
    export default {
        name: "sidebar",
        data(){
            return{
                circleUrl: "https://cube.elemecdn.com/3/7c/3ea6beec64369c2642b92c6726f1epng.png",
            }
        },
        methods:{
            getMyTeamPage(){
                this.$router.push('/myteam')
            },
            getDraftPage(){
                this.$router.push('/draft')
            },
            getMyProfilePage(){
                this.$router.push('/myprofile')
            },
            getMatchPage(){
                this.$router.push('/match')
            },
            getFreeMarketPage(){
                this.$router.push('/freemarket')
            }
        }
    }
</script>

<style scoped>

</style>