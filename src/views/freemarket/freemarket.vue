<template>
    <el-container>
        <el-header>
            <nav-bar></nav-bar>
        </el-header>
        <el-container>
            <el-aside width="200px">
                <sidebar></sidebar>
            </el-aside>
            <el-container>
                <el-main>
                    <el-row>
                        <el-col :span="18">
                            <div>
                                <el-select v-model="positionFilterData" multiple placeholder="位置筛选">
                                    <el-option
                                            v-for="item in positionFilterOptions"
                                            :key="item.value"
                                            :label="item.label"
                                            :value="item.value">
                                    </el-option>
                                </el-select>
                            </div>
                        </el-col>
                        <el-col :span="4">
                            <h4 style="text-align:right" :class="{'newColor':newPlayerColorDisplay}">
                                当前自由球员人数：{{freePlayerCount}}</h4>
                        </el-col>
                        <el-col :span="2">
                            <el-button type="primary" icon="el-icon-refresh" circle
                                       @click="getFreePlayerList(-1,9)"></el-button>
                        </el-col>
                    </el-row>
                    <el-row>
                        <el-button type="info" plain @click="signHistoryDialogVisible=true;getHistoryOfferList()">签约记录
                        </el-button>
                    </el-row>

                    <el-table
                            ref="freeMarketTable"
                            :data="freePlayerListData"
                            style="width: 100%">
                        <el-table-column
                                label="球员"
                                width="100">
                            <template slot-scope="scope">
                                <div class="block" @click="handlePlayerDetail(scope.row.upId)" style="cursor:pointer;">
                                    <el-avatar shape="square" :size="50" :src="scope.row.avatar"></el-avatar>
                                </div>
                            </template>
                        </el-table-column>
                        <el-table-column
                                prop="chname"
                                label="中文名"
                                width="180">
                        </el-table-column>
                        <el-table-column
                                prop="source"
                                label="来源">
                        </el-table-column>
                        <el-table-column
                                label="报价数量"
                                width="180">
                            <template slot-scope="scope">
                                <el-tag type="success" style="cursor: pointer" @click="getOfferList(scope.row.fpId)">
                                    {{scope.row.offerCount}}
                                </el-tag>
                            </template>
                        </el-table-column>
                        <el-table-column
                                prop="timeLeft"
                                label="剩余时间">
                        </el-table-column>
                        <el-table-column label="操作">
                            <template slot-scope="scope">
                                <el-button
                                        size="mini"
                                        @click="handleAddOffer(scope.row.fpId)">谈判
                                </el-button>
                            </template>
                        </el-table-column>
                    </el-table>

                    <!--                    <el-row :gutter="20" style="margin-top: 10px">-->
                    <!--                        <el-col :span="8" v-for="fp in freePlayerListData" :key="fp.fpId">-->
                    <!--                            <div class="freePlayer" style="margin-top: 10px">-->
                    <!--                                <el-row>-->
                    <!--                                    <el-col :span="8">-->
                    <!--                                        <div class="block">-->
                    <!--                                            <el-avatar class="playerAvatar" shape="square" :src="squareUrl"></el-avatar>-->
                    <!--                                        </div>-->
                    <!--                                    </el-col>-->
                    <!--                                    <el-col :span="16">-->
                    <!--                                        <div>-->
                    <!--                                            <h3>-->
                    <!--                                                {{fp.userPlayerBriefDto.chname}}<span>{{fp.userPlayerBriefDto.enname}}</span>-->
                    <!--                                            </h3>-->
                    <!--                                            <h3>{{fp.position}}|<span>进攻：{{fp.userPlayerBriefDto.offensiveOverall}}防守：{{fp.userPlayerBriefDto.defensiveOverall}}</span>-->
                    <!--                                            </h3>-->
                    <!--                                            <h4>原属球队：{{fp.source}}</h4>-->
                    <!--                                        </div>-->
                    <!--                                    </el-col>-->
                    <!--                                </el-row>-->
                    <!--                                <el-row :gutter="10">-->
                    <!--                                    <el-col :span="12" style="text-align: center">-->
                    <!--                                        <el-button plain type="info"-->
                    <!--                                                   @click="viewPlayerDetail(fp.fpId);userPlayerDetailDialogVisible=true">-->
                    <!--                                            球员详情-->
                    <!--                                        </el-button>-->
                    <!--                                    </el-col>-->
                    <!--                                    <el-col :span="12" style="text-align: center" v-if="fp.timeValLeft>0">-->
                    <!--                                        <el-button plain type="success"-->
                    <!--                                                   @click="addOfferDialogVisible=true;addOfferForm.fpId=fp.fpId;getTeamOfferHistory();">-->
                    <!--                                            谈判报价-->
                    <!--                                        </el-button>-->
                    <!--                                    </el-col>-->
                    <!--                                </el-row>-->
                    <!--                                <el-row style="margin-top: 30px" v-if="fp.timeValLeft>0">-->
                    <!--                                    <el-col :span="12" style="text-align: center">-->
                    <!--                                        <span>剩余时间：{{fp.timeLeft}}</span>-->
                    <!--                                    </el-col>-->
                    <!--                                    <el-col :span="12" style="text-align: center">-->
                    <!--                                        <el-button type="text" @click="getOfferList(fp.fpId);offerDialogVisible = true">-->
                    <!--                                            报价情况-->
                    <!--                                        </el-button>-->
                    <!--                                    </el-col>-->
                    <!--                                </el-row>-->
                    <!--                                <el-row v-if="fp.timeValLeft<=0">-->
                    <!--                                    <h1>球员已过期</h1>-->
                    <!--                                </el-row>-->

                    <!--                            </div>-->
                    <!--                        </el-col>-->
                    <!--                    </el-row>-->
                    <el-button icon="el-icon-caret-bottom" v-if="freePlayerCount>9"
                               @click="refreshFreePlayer(lastFpId,3,true)" style="width:100%"></el-button>

                    <el-dialog title="报价列表" :visible.sync="offerDialogVisible">
                        <el-table :data="offerData">
                            <el-table-column type="index" label="排名" width="50"></el-table-column>
                            <el-table-column property="teamName" label="球队"></el-table-column>
                            <el-table-column property="offer" label="报价"></el-table-column>
                            <el-table-column property="offerTime" label="报价时间"></el-table-column>
                            <el-table-column property="intention" label="意向"></el-table-column>
                        </el-table>
                    </el-dialog>
                    <el-dialog title="报价" :visible.sync="addOfferDialogVisible">
                        <el-row>
                            <el-col :span="18">
                                <el-form ref="addOfferForm" :model="addOfferForm" label-width="100px">
                                    <el-form-item
                                            v-for="(offer, index) in addOfferForm.addOfferData"
                                            :label="'第' + (index+1)+'年'"
                                            :key="index"
                                    >
                                        <el-input-number v-model="offer.salary" @change="calculateTotalSalary" :min="0"
                                                         :max="5000" label="当年薪资"
                                                         style="width: 200px;margin-right:10px"></el-input-number>
                                        <el-button v-if="index>0" @click.prevent="removeOffer(offer)">删除</el-button>
                                    </el-form-item>
                                    <el-form-item>
                                        <el-button type="primary" @click="addOffer()" :loading="addOfferLoading">报价
                                        </el-button>
                                        <el-button v-if="addYearBtnVisible" @click="addOff">新增一年</el-button>
                                    </el-form-item>
                                </el-form>
                            </el-col>
                            <el-col :span="6">
                                <h3>总计：{{addOfferForm.totalSeason}}年{{addOfferForm.totalSalary}}万</h3>
                            </el-col>
                        </el-row>
                        <el-row>
                            <!--                            span-method="objectSpanMethod"-->
                            <h3>报价历史</h3>
                            <el-table
                                    :data="teamOfferHistoryData"
                                    border
                                    style="width: 100%; margin-top: 20px">
                                <!--                                <el-table-column-->
                                <!--                                        prop="offerContractSalaryList.times"-->
                                <!--                                        label="报价次序"-->
                                <!--                                        width="180">-->
                                <!--                                </el-table-column>-->
<!--                                <el-table-column-->
<!--                                        prop="contractDetailReqDtoList.season"-->
<!--                                        label="赛季">-->
<!--                                </el-table-column>-->
<!--                                <el-table-column-->
<!--                                        prop="contractDetailReqDtoList.salary"-->
<!--                                        label="薪资">-->
<!--                                </el-table-column>-->
                                <el-table-column prop="offer" label="报价"></el-table-column>
                                <el-table-column prop="intention" label="意向"></el-table-column>
                                <el-table-column prop="offerTime" label="报价时间"></el-table-column>

                            </el-table>
                        </el-row>

                    </el-dialog>
                    <el-dialog title="签约历史" :visible.sync="signHistoryDialogVisible">
                        <el-table :data="signHistoryData" v-loading="loading">
                            <el-table-column property="playerName" label="球员"></el-table-column>
                            <el-table-column property="offerCount" label="报价人数"></el-table-column>
                            <el-table-column property="intendedOfferCount" label="球员心仪报价"></el-table-column>
                            <el-table-column property="expireTime" label="球员过期时间"></el-table-column>
                            <el-table-column property="status" label="状态"></el-table-column>
                            <el-table-column property="offerFlowId" label="流程ID" width="0"></el-table-column>
                            <el-table-column label="签约流程">
                                <template slot-scope="scope">
                                    <el-button
                                            v-if="scope.row.offerFlowId!=null"
                                            size="mini"
                                            @click="signFlowDialogVisible=true;viewSignFlow(scope.row)">查看
                                    </el-button>
                                </template>
                            </el-table-column>
                        </el-table>
                    </el-dialog>
                    <el-dialog title="签约流程" :visible.sync="signFlowDialogVisible">
                        <el-steps :active="offerFlow.status" finish-status="success" align-center>
                            <el-step title="签署流程发起" :description="offerFlow.flowStartTime"></el-step>
                            <el-step title="签署中" :description="offerFlow.currentProgress"></el-step>
                            <el-step title="签署完成" :description="offerFlow.flowFinishTime"></el-step>
                        </el-steps>
                        <el-table :data="signFlowData">
                            <el-table-column type="index" label="意向排名"></el-table-column>
                            <el-table-column property="offerRecordDto.teamName" label="候选球队"></el-table-column>
                            <el-table-column property="sendTime" label="发送时间"></el-table-column>
                            <el-table-column property="expireTime" label="过期时间"></el-table-column>
                            <el-table-column property="finishTime" label="（拒绝）签署时间"></el-table-column>
                            <el-table-column property="status" label="签署状态"></el-table-column>
                        </el-table>
                    </el-dialog>
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
                    <PlayerInfoDialog ref="playerInfoDialogRef"></PlayerInfoDialog>
                </el-main>
            </el-container>
        </el-container>
    </el-container>

</template>

<script>
    import Sidebar from "@/views/layout/sidebar/sidebar";
    import NavBar from "@/views/layout/header/header";
    import PlayerInfoDialog from "@/components/PlayerInfoDialog";
    import {addOffer, getFreePlayerList, getOfferRecordList, getTeamOfferRecordHistory} from "@/api/freeMarket";
    import GlobalWebsocket from "@/websocket/GlobalWebsocket";
    import {secondsToTime} from "@/utils/timeUtil";
    import {formatDate} from "@/utils/date";

    export default {
        name: "freemarket",
        components: {Sidebar, NavBar, PlayerInfoDialog},
        data() {
            return {
                freePlayerListData: [],
                freePlayerCount: 0,
                offensive: 200,
                defensive: 200,
                teamOfferHistoryData: [{
                    contractDetailReqDtoList: {
                        season:1,
                        salary:100
                    }
                }
                ],
                originalTeam: "originalTeam",
                position: "PG",
                offerDialogVisible: false,
                addOfferDialogVisible: false,
                signHistoryDialogVisible: false,
                signFlowDialogVisible: false,
                userPlayerDetailDialogVisible: false,
                lastFpId: -1,
                loading: true,
                newPlayerColorDisplay: false,
                addOfferLoading: false,
                addYearBtnVisible: true,
                offerFlow: {
                    status: 1,
                    flowStartTime: "2020/2/16 11:46",
                    flowFinishTime: "2020/2/16 11:46",
                    currentProgress: "等待 ccTeam 同意签约"
                },
                playerDetail: {
                    ability: {}
                },
                positionFilterOptions: [{
                    value: '1',
                    label: 'PG（控球后卫）'
                }, {
                    value: '2',
                    label: 'SG（得分后卫）'
                }, {
                    value: '3',
                    label: 'SF（小前锋）'
                }, {
                    value: '4',
                    label: 'PF（大前锋）'
                }, {
                    value: '5',
                    label: 'C（中锋）'
                }],
                positionFilterData: [],
                offerData: [],
                signFlowData: [
                    {
                        teamName: "Koliday",
                        sendTime: "2020/2/16 12:12",
                        expireTime: "2020/2/16 14:12",
                        finishTime: "2020/2/16 13:27",
                        status: "已拒绝"
                    },
                    {
                        teamName: "ccTeam",
                        sendTime: "2020/2/16 12:12",
                        expireTime: "2020/2/16 14:12",
                        finishTime: "",
                        status: "待签署"
                    },
                    {
                        teamName: "kkTeam",
                        sendTime: "",
                        expireTime: "",
                        finishTime: "",
                        status: "未发送"
                    }
                ],
                signHistoryData: [],
                addOfferForm: {
                    fpId: -1,
                    totalSeason: 1,
                    totalSalary: 0,
                    addOfferData: [
                        {
                            season: 1,
                            salary: 0
                        }
                    ],
                },

            }

        },
        mounted() {
            this.connectFreeMarketChannel();
            this.getFreePlayerList(-1, 9);
            // setInterval(this.startTimer, 1000);
        },
        methods: {
            connectFreeMarketChannel() {
                let channel = "/channel/freeMarket/freeMarket/freeMarket";
                this.$store.dispatch('ws/addRouter', {
                    "channel": channel,
                    "routers": [
                        {
                            router: "/FREE_MARKET/freeMarket/新的自由球员流入",
                            function: this.handleNewFreePlayer
                        }
                    ]
                });
                GlobalWebsocket.connect(channel);
            },
            handlePlayerDetail(upId) {
                this.$refs.playerInfoDialogRef.show(upId);
            },
            getFreePlayerList(fpIdOffset, count) {
                getFreePlayerList({
                    fpIdOffset: fpIdOffset,
                    count: count
                }).then(res => {
                    if (res.code === 0) {
                        this.$message({
                            message: "自由市场已自动刷新",
                            type: "success"
                        });
                        // const newFreePlayerList=res.data.freePlayerList;
                        this.freePlayerCount = res.data.count;
                        this.freePlayerListData = res.data.freePlayerList;

                        this.freePlayerListData.forEach((item) => {
                            if (item.source === 1) {
                                item.source = "被" + item.lastTeamName + "解雇";
                            } else if (item.source === 5) {
                                item.source = "落选秀";
                            }
                            let secondsLeft = parseInt((item.expireTime - new Date().getTime()) / 1000);
                            if (secondsLeft > 0) {
                                item.timeLeft = secondsToTime(secondsLeft);
                            } else {
                                item.timeLeft = "已过期"
                            }
                        });
                        setInterval(this.handleFreePlayerTime, 200, this.freePlayerListData);
                    }
                });
            },
            handleFreePlayerTime(data) {
                this.freePlayerListData.forEach((item, index) => {
                    let secondsLeft = parseInt((item.expireTime - new Date().getTime()) / 1000);
                    if (secondsLeft > 0) {
                        item.timeLeft = secondsToTime(secondsLeft);
                    } else {
                        item.timeLeft = "已过期"
                    }
                    this.$set(data, index, item);
                });

            },
            handleNewFreePlayer() {
                this.getFreePlayerList(-1, 9);
            },
            handleAddOffer(fpId) {
                this.addOfferDialogVisible = true;
                this.addOfferForm.fpId = fpId;
                this.getTeamOfferHistory();
            },
            getOfferList(fpId) {
                getOfferRecordList(fpId).then(res => {
                    if (res.code === 0) {
                        this.offerDialogVisible = true;
                        this.offerData = res.data;
                        this.offerData.forEach(function (item) {
                            item.offerTime=formatDate(new Date(item.offerTime), "yyyy-MM-dd hh:mm:ss");
                            const l = item.contractDetailReqDtoList;
                            const totalSeason = l.length;
                            let totalSalary = 0;
                            l.forEach(function (i) {
                                totalSalary += i.salary;
                            });
                            item.offer = totalSeason + "年" + totalSalary + "万"
                        });
                    }
                });
            },
            getHistoryOfferList() {
                const me = this;
                this.axiosPost.post("http://www.jrsports.com/api/freemarket/free/getHistory", {
                    pageNo: 1,
                    pageSize: 10
                }, {
                    headers: {
                        "userToken": localStorage.getItem("userToken"),
                        "teamToken": sessionStorage.getItem("teamToken")
                    }
                }).then(function (response) {
                    const freeResponse = response.data;
                    if (freeResponse.code === 0) {
                        let d = freeResponse.data.recordList;
                        d.forEach(function (item) {
                            if (item.status == 2) {
                                item.status = "等待签约";
                            } else if (item.status == 3) {
                                item.status = "已签约";
                            } else if (item.status == 4) {
                                item.status = "消失";
                            }
                        });
                        me.signHistoryData = d;
                        me.loading = false;
                    } else {
                        me.$message({
                            message: freeResponse.msg,
                            type: "warning"
                        });
                    }
                });
            },
            viewSignFlow(row) {
                const me = this;
                this.axiosPost.post("http://www.jrsports.com/api/sign/offerFlow/getOfferFlow/" + row.offerFlowId, null, {
                    headers: {
                        "userToken": localStorage.getItem("userToken"),
                        "teamToken": sessionStorage.getItem("teamToken")
                    }
                }).then(function (response) {
                    const freeResponse = response.data;
                    if (freeResponse.code === 0) {
                        let candidate = freeResponse.data.flowOfferList;
                        candidate.forEach(function (item) {
                            if (item.status == 0) {
                                item.status = "未发送";
                            } else if (item.status == 1) {
                                item.status = "已发送";
                            } else if (item.status == 2) {
                                item.status = "拒绝签约";
                            } else if (item.status == 3) {
                                item.status = "签约成功";
                            } else if (item.status == 4) {
                                item.status = "签约过期";
                            }
                        });
                        me.signFlowData = candidate;
                        const of = freeResponse.data;
                        me.offerFlow.status = of.status;
                        me.offerFlow.flowStartTime = of.flowStartTime;
                        if (of.status == 1) {
                            me.offerFlow.currentProgress = "等待" + of.currentSignTeam + "确认签约";
                        } else if (of.status == 2) {
                            me.offerFlow.currentProgress = of.currentSignTeam + "签约成功";
                        } else if (of.status == 3) {
                            me.offerFlow.currentProgress = "无人签约";
                        }

                        me.offerFlow.flowFinishTime = of.flowFinishTime;
                    } else {
                        me.$message({
                            message: freeResponse.msg,
                            type: "warning"
                        });
                    }
                });
            },
            addOffer() {
                this.addOfferLoading = true;
                addOffer({
                    fpId: this.addOfferForm.fpId,
                    contractDetailReqDtoList: this.addOfferForm.addOfferData
                }).then(res => {
                    if (res.code === 0) {
                        this.offerData = res.data;
                        this.$message({
                            message: "报价成功",
                            type: "success"
                        });
                        this.addOfferDialogVisible = false;
                        this.getFreePlayerList(-1, 9);
                    }
                    this.addOfferLoading = false;
                });

            },
            getTeamOfferHistory() {
                getTeamOfferRecordHistory(this.addOfferForm.fpId).then(res => {
                    if (res.code === 0) {
                        this.teamOfferHistoryData = res.data;
                        this.teamOfferHistoryData.forEach(function (item) {
                            item.offerTime=formatDate(new Date(item.offerTime), "yyyy-MM-dd hh:mm:ss");
                            const l = item.contractDetailReqDtoList;
                            const totalSeason = l.length;
                            let totalSalary = 0;
                            l.forEach(function (i) {
                                totalSalary += i.salary;
                            });
                            item.offer = totalSeason + "年" + totalSalary + "万"
                        });
                    }
                });

            },
            removeOffer(item) {
                const index = this.addOfferForm.addOfferData.indexOf(item);
                this.addOfferForm.totalSeason--;
                this.addOfferForm.addOfferData.splice(index, 1)
                this.calculateTotalSalary();
                this.addYearBtnVisible = true;
            },
            addOff() {
                if (++this.addOfferForm.totalSeason == 5) {
                    this.addYearBtnVisible = false;
                }
                this.addOfferForm.addOfferData.push({
                    season: this.addOfferForm.totalSeason,
                    salary: 0
                });
                this.calculateTotalSalary()
            },
            calculateTotalSalary() {
                let total = 0;
                this.addOfferForm.addOfferData.forEach(function (item) {
                    total += item.salary;
                });
                this.addOfferForm.totalSalary = total;
            }
        }
    }
</script>

<style>
    .freePlayer {
        background-color: #d3dce6;
        width: 500px;
        height: 300px;
    }

    .playerAvatar {
        width: 120px;
        height: 120px;
        margin-left: 10px;
        margin-top: 10px;
    }

    .newColor {
        color: seagreen;
    }
</style>