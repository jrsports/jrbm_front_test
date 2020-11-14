<template>
    <el-dialog title="球员详情" :visible.sync="userPlayerDetailDialogVisible">
        <el-row>
            <el-col :span="6">
                <el-avatar shape="square" :size="100" :src="playerDetail.avatarUrl"></el-avatar>
            </el-col>
            <el-col :span="6">
                <h3>{{playerDetail.chname}}</h3>
                <h5>{{playerDetail.enname}}</h5>
            </el-col>
            <el-col :span="6">
                <h1>总评：{{playerDetail.overall}}</h1>
            </el-col>
            <el-col :span="6">
                <h1>等级：{{playerDetail.grade}}</h1>
            </el-col>
            <el-card style="width: 100%">
                <div slot="header">
                    <span>能力值</span>
                    <el-button style="float: right; padding: 3px 0" type="text">操作按钮</el-button>
                </div>
                <el-row>
                    <el-col :span="4">突破：{{playerDetail.ability.breakthrough}}</el-col>
                    <el-col :span="4">中距离：{{playerDetail.ability.midrange}}</el-col>
                    <el-col :span="4">内线：{{playerDetail.ability.inside}}</el-col>
                    <el-col :span="4">三分：{{playerDetail.ability.three}}</el-col>
                    <el-col :span="4">罚球：{{playerDetail.ability.freethrow}}</el-col>
                    <el-col :span="4">造犯规：{{playerDetail.ability.causefoul}}</el-col>
                </el-row>
                <el-row style="margin-top: 15px">
                    <el-col :span="4">传球稳定：{{playerDetail.ability.passStability}}</el-col>
                    <el-col :span="4">传球精确：{{playerDetail.ability.passAccuracy}}</el-col>
                    <el-col :span="4">视野：{{playerDetail.ability.passVision}}</el-col>
                    <el-col :span="4">抢断：{{playerDetail.ability.steal}}</el-col>
                    <el-col :span="4">篮板：{{playerDetail.ability.rebound}}</el-col>
                    <el-col :span="4">逼抢：{{playerDetail.ability.forcing}}</el-col>
                </el-row>
                <el-row style="margin-top: 15px">
                    <el-col :span="4">防盖帽：{{playerDetail.ability.blocking}}</el-col>
                    <el-col :span="4">防突破：{{playerDetail.ability.antiBreakthrough}}</el-col>
                    <el-col :span="4">防中距离：{{playerDetail.ability.antiMidrange}}</el-col>
                    <el-col :span="4">防三分：{{playerDetail.ability.antiThree}}</el-col>
                    <el-col :span="4">防内线：{{playerDetail.ability.antiInside}}</el-col>
                    <el-col :span="4">干净度：{{playerDetail.ability.clean}}</el-col>
                </el-row>
                <el-row style="margin-top: 15px">
                    <el-col :span="4">运球：{{playerDetail.ability.dribble}}</el-col>
                    <el-col :span="4">受助攻：{{playerDetail.ability.beAssisted}}</el-col>
                    <el-col :span="4">投篮倾向：{{playerDetail.ability.shootIncline}}</el-col>
                    <el-col :span="4">突破倾向：{{playerDetail.ability.breakthroughIncline}}</el-col>
                    <el-col :span="4">中投倾向：{{playerDetail.ability.midrangeIncline}}</el-col>
                    <el-col :span="4">三分倾向：{{playerDetail.ability.threeIncline}}</el-col>
                </el-row>
                <el-row style="margin-top: 15px">
                    <el-col :span="4">内线倾向：{{playerDetail.ability.insideIncline}}</el-col>
                    <el-col :span="4">传球倾向：{{playerDetail.ability.passIncline}}</el-col>
                    <el-col :span="4">进攻综合：{{playerDetail.ability.offensiveOverall}}</el-col>
                    <el-col :span="4">防守综合：{{playerDetail.ability.defensiveOverall}}</el-col>
                    <el-col :span="4">球权：{{playerDetail.ability.ballWeight}}</el-col>
                    <el-col :span="4"></el-col>
                </el-row>
            </el-card>

        </el-row>
    </el-dialog>
</template>

<script>
    import {getPlayerDetail} from "@/api/team";
    import {convertPlayerInfo} from "@/utils/PlayerInfoUtil";

    export default {
        name: "PlayerInfoDialog",
        data(){
            return{
                userPlayerDetailDialogVisible: false,
            }
        },
        methods:{
            show(upId) {
                getPlayerDetail(upId).then(res => {
                    if (res.code === 0) {
                        let item = res.data;
                        convertPlayerInfo(item);
                        this.playerDetail = item;
                        this.userPlayerDetailDialogVisible = true;
                    }
                })

            }
        }
    }
</script>

<style scoped>

</style>