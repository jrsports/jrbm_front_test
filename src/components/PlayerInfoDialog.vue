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


        </el-row>
        <el-tabs v-model="activeTab" type="card">
            <el-tab-pane label="基本信息" name="basic" v-if="dialogType==='userPlayer'">
                <span>{{playerDetail.draftInfo.content}}</span>
            </el-tab-pane>
            <el-tab-pane label="能力信息" name="ability">
                <el-card style="width: 100%">
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
                        <el-col :span="4">进攻综合：{{playerDetail.ability.offensive}}</el-col>
                        <el-col :span="4">防守综合：{{playerDetail.ability.defensive}}</el-col>
                        <el-col :span="4">球权：{{playerDetail.ability.ballWeight}}</el-col>
                        <el-col :span="4"></el-col>
                    </el-row>
                </el-card>
            </el-tab-pane>
            <el-tab-pane label="生涯信息" name="career" v-if="dialogType==='userPlayer'">
                <el-table :data="playerDetail.careerRspDto.careerPeriodList">
                    <el-table-column type="expand">
                        <template slot-scope="props">
                            <el-table :data="props.row.careerSeasonStatsList">
                                <el-table-column property="season" label="赛季"></el-table-column>
                                <el-table-column label="效力球队">
                                    {{props.row.teamName}}
                                </el-table-column>
                                <el-table-column property="onCourt" label="出场"></el-table-column>
                                <el-table-column property="startup" label="首发"></el-table-column>
                                <el-table-column property="score" label="得分"></el-table-column>
                                <el-table-column property="rebound" label="篮板"></el-table-column>
                                <el-table-column property="assist" label="助攻"></el-table-column>
                            </el-table>
                        </template>
                    </el-table-column>
                    <el-table-column property="season" label="赛季"></el-table-column>
                    <el-table-column property="teamName" label="效力球队"></el-table-column>
                    <el-table-column property="inTime" label="入队时间" :formatter="dateFormatter"></el-table-column>
                    <el-table-column property="outTime" label="离队时间" :formatter="dateFormatter"></el-table-column>
                </el-table>
            </el-tab-pane>
            <el-tab-pane label="数据信息" name="stats" v-if="dialogType==='userPlayer'">

            </el-tab-pane>
            <el-tab-pane label="合同信息" name="contract" v-if="dialogType==='userPlayer'">
                <span>{{playerDetail.contract.content}}</span>
                <el-table :data="playerDetail.contract.detail">
                    <el-table-column type="index"></el-table-column>
                    <el-table-column property="salary" label="薪资"></el-table-column>
                    <el-table-column property="progress" label="履行情况"></el-table-column>
                </el-table>
            </el-tab-pane>
            <el-tab-pane label="身价趋势" name="trend">
                <v-chart :options="option" style="width: 900px"></v-chart>
            </el-tab-pane>
        </el-tabs>
    </el-dialog>
</template>

<script>
    import {getPlayerDetail} from "@/api/team";
    import {convertPlayerInfo} from "@/utils/PlayerInfoUtil";
    import {formatDate} from "@/utils/date"
    import {getBasicPlayerDetail} from "@/api/player";
    import 'echarts/lib/chart/line';
    import 'echarts/lib/component/grid';

    var trendData={
        x:[],
        y:[]
    };
    export default {
        name: "PlayerInfoDialog",
        data(){
            return{
                userPlayerDetailDialogVisible: false,
                activeTab:"ability",
                playerDetail:{},
                careerInfo:[
                    {
                        season:"1-4",
                        teamName:"Lakers",
                        inTime:"2020-1-3",
                        outTime:"2020-5-4",
                        detail:[
                            {
                                season:"4",
                                teamName:"Lakers",
                                onCourt:"24",
                                startUp:"22",
                                score:"24.1",
                                rebound:"7.3",
                                assist:"4.5"
                            }
                        ]
                    }
                ],
                dialogType:"userPlayer",
                option:{
                    title: {
                        text: '身价趋势'
                    },
                    legend: {
                        data: ['招商银行', '浦发银行', '广发银行', '上海银行']
                    },
                    xAxis: {
                        type: 'category',   // 还有其他的type，可以去官网喵两眼哦
                        data: trendData.x,   // x轴数据
                        name: '日期',   // x轴名称
                    },
                    yAxis: {
                        type: 'value',
                        name: '身价',   // y轴名称
                        scale:true
                    },
                    label: {},
                    tooltip: {
                        trigger: 'axis'   // axis   item   none三个值
                    },
                    series: [
                        {
                            data: trendData.y,
                            type: 'line'
                        }
                    ]
                }
            }
        },
        methods:{
            showBasic(bpId){
                getBasicPlayerDetail({bpId:bpId}).then(res=>{
                    if(res.code===0){
                        this.dialogType="basic";
                        let detail=res.data;
                        this.playerDetail.ability=detail.ability;
                        this.playerDetail.avatarUrl=detail.basic.avatarUrl;
                        this.playerDetail.overall=detail.ability.overall;
                        this.playerDetail.grade=detail.ability.grade;
                        trendData.x.splice(0, trendData.x.length)
                        trendData.y.splice(0, trendData.y.length)
                        detail.trend.nodes.forEach(item=>{
                            trendData.x.push(item.date);
                            trendData.y.push(item.value);
                        });
                        this.userPlayerDetailDialogVisible = true;
                    }

                });
            },
            show(upId) {
                getPlayerDetail(upId).then(res => {
                    if (res.code === 0) {
                        this.dialogType="userPlayer";
                        let item = res.data;
                        convertPlayerInfo(item);
                        this.playerDetail = item;
                        console.log(this.playerDetail.contract.detail);
                        trendData.x.splice(0, trendData.x.length)
                        trendData.y.splice(0, trendData.y.length)
                        item.trend.nodes.forEach(item=>{
                            trendData.x.push(item.date);
                            trendData.y.push(item.value);
                        });
                        this.userPlayerDetailDialogVisible = true;
                    }
                })
            },
            dateFormatter(row, column, cellValue){
                if(!cellValue){
                    return;
                }
                return formatDate(new Date(cellValue),"yyyy-MM-dd");
                // {{date.formatDate(inTime,"yyyy-MM-dd")}}
            }
        }
    }
</script>

<style>

</style>