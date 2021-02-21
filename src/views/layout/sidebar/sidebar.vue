<template>

    <div >
        <el-menu
                default-active="1"
                class="el-menu-vertical-demo"
                style="height: 800px">
            <el-submenu index="1">
                <template slot="title">
                    <i class="el-icon-location"></i>
                    <span>我的球队</span>
                </template>
                <el-menu-item index="1-1" @click="getMyTeamPage">我的阵容</el-menu-item>
                <el-menu-item index="1-2" @click="getMyPlayerDetailPage">球员数据</el-menu-item>
            </el-submenu>
            <el-menu-item index="2">
                <i class="el-icon-menu"></i>
                <span slot="title" @click="getDraftPage">选秀大会</span>
            </el-menu-item>
            <el-menu-item index="3">
                <i class="el-icon-document"></i>
                <span slot="title" @click="getFreeMarketPage">自由市场</span>
            </el-menu-item>
            <el-submenu index="4">
                <template slot="title">
                    <i class="el-icon-location"></i>
                    <span>比赛中心</span>
                </template>
                <el-menu-item index="4-1" @click="getSeasonPage">赛季</el-menu-item>
                <el-menu-item index="4-2" @click="getMatchPage">排位</el-menu-item>
                <el-menu-item index="4-3">杯赛</el-menu-item>
                <el-menu-item index="4-4" @click="getMatchRecordPage">比赛记录</el-menu-item>
            </el-submenu>
            <el-menu-item index="5">
                <i class="el-icon-document"></i>
                <span slot="title" @click="getTradePage">交易中心</span>
            </el-menu-item>
            <el-menu-item index="6">
                <i class="el-icon-menu"></i>
                <span slot="title" @click="getSignPage">签约中心</span>
            </el-menu-item>
            <el-submenu index="7">
                <template slot="title">
                    <i class="el-icon-location"></i>
                    <span>排行榜</span>
                </template>
                <el-menu-item index="6-1" @click="getCurrentAbilityPage">能力市价</el-menu-item>
                <el-menu-item index="6-2" @click="getTeamRankPage">球队排名</el-menu-item>
            </el-submenu>
            <el-menu-item index="8">
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
            getSeasonPage(){
                this.$router.push('/season')
            },
            getFreeMarketPage(){
                this.$router.push('/freemarket')
            },
            getSignPage(){
                this.$router.push('/sign')
            },
            getTradePage(){
                this.$router.push('/trade')
            },
            getCurrentAbilityPage(){
                this.$router.push('/currentplayer')
            },
            getMyPlayerDetailPage(){
                this.$router.push('/myplayerdetail')
            },
            getMatchRecordPage(){
                this.$router.push('/matchrecord')
            }
        }
    }
</script>

<style scoped>

</style>