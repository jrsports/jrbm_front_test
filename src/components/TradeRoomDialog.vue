<template>
    <el-container>
        <el-dialog>
            <el-row>
                <el-col :span="12">
                    <ul class="infinite-list" style="height: 200px;">
                        <li v-for="i in chatMsg" :key="i" style="list-style-type:none;">{{ i }}</li>
                    </ul>
                </el-col>
                <el-col>
                    <el-button @click="addChip">添加筹码</el-button>
                    <el-button @click="removeChip">移除筹码</el-button>
                    <el-button @click="addOffer" v-if="tradeRoom.submittable && tradeRoom.legal">提交报价</el-button>
                    <el-button @click="confirmOffer" v-if="tradeRoom.confirmable">确认报价</el-button>
                </el-col>
            </el-row>
            <el-row>
                <el-col :span="12">
                    <el-avatar :size="50" :src="tradeRoom.initiatorTeam.avatar"></el-avatar>
                    <span>发起方球队：{{tradeRoom.initiatorTeam.teamName}}({{tradeRoom.initiatorInSeason?"赛季中":"休赛期"}})</span>
                    <span>{{tradeRoom.initiatorEntered?"已进入":"未进入"}}</span>
                    <p>
                        当前大名单薪资/工资帽/奢侈税线/硬工资帽：{{tradeRoom.initiatorTotalSalaryBeforeTrade}}/{{tradeRoom.salaryCap}}/{{tradeRoom.luxuryLine}}/{{tradeRoom.hardCap}}</p>
                    <p>交易后{{tradeRoom.initiatorInSeason?"":"最大"}}薪资：{{tradeRoom.initiatorTotalSalaryAfterTrade}}</p>
                    <p>参与交易的球员薪资：{{tradeRoom.initiatorTradePlayerSalary}}</p>
                    <p>参与交易的球员蛋薪资：{{tradeRoom.initiatorTradeEggSalary}}</p>
                    <p>送出的薪资不得超过：{{tradeRoom.initiatorMaxSalaryLimitAfterTrade}}</p>
                    <p>
                        当前报价：{{tradeRoom.legal?"合法":"不合法"}}|{{tradeRoom.submittable?"可提交":"不可提交"}}|{{tradeRoom.confirmable?"可确认":"不可确认"}}|{{tradeRoom.legal?"":"违反的规则为："+tradeRoom.regulationContent}}</p>

                </el-col>
                <el-col :span="12">
                    <el-avatar :size="50" :src="tradeRoom.targetTeam.avatar"></el-avatar>
                    <span>接收方球队：{{tradeRoom.targetTeam.teamName}}({{tradeRoom.targetInSeason?"赛季中":"休赛期"}})</span>
                    <span>{{tradeRoom.targetEntered?"已进入":"未进入"}}</span>
                    <p>
                        当前大名单薪资/工资帽/奢侈税线/硬工资帽：{{tradeRoom.targetTotalSalaryBeforeTrade}}/{{tradeRoom.salaryCap}}/{{tradeRoom.luxuryLine}}/{{tradeRoom.hardCap}}</p>
                    <p>交易后{{tradeRoom.targetInSeason?"":"最大"}}薪资：{{tradeRoom.targetTotalSalaryAfterTrade}}</p>
                    <p>参与交易的球员薪资：{{tradeRoom.targetTradePlayerSalary}}</p>
                    <p>参与交易的球员蛋薪资：{{tradeRoom.targetTradeEggSalary}}</p>
                    <p>送出的薪资不得超过：{{tradeRoom.targetMaxSalaryLimitAfterTrade}}</p>
                    <p>
                        当前报价：{{tradeRoom.legal?"合法":"不合法"}}|{{tradeRoom.submittable?"可提交":"不可提交"}}|{{tradeRoom.confirmable?"可确认":"不可确认"}}|{{tradeRoom.legal?"":"违反的规则为："+tradeRoom.regulationContent}}</p>

                </el-col>
            </el-row>
            <el-row>
                <el-col span=12>
                    <el-table
                            ref="initTable"
                            :data="tradeRoom.initiatorChip.playerChipList"
                            style="width: 100%"
                            @selection-change="handleSelectionChange">
                        <el-table-column
                                type="selection"
                                width="55">
                        </el-table-column>
                        <el-table-column
                                prop="name"
                                label="球员姓名"
                                width="180">
                        </el-table-column>
                        <el-table-column
                                prop="chipId"
                                label="筹码ID"
                                width="180">
                        </el-table-column>
                        <el-table-column
                                prop="chipType"
                                label="筹码类型"
                                width="180">
                        </el-table-column>
                        <el-table-column
                                prop="nextSeasonSalary"
                                label="下赛季薪资"
                                width="180">
                        </el-table-column>
                        <el-table-column
                                prop="status"
                                label="状态"
                                width="180">
                        </el-table-column>
                    </el-table>
                </el-col>
                <el-col :span="12">
                    <el-table
                            ref="targetTable"
                            :data="tradeRoom.targetChip.playerChipList"
                            style="width: 100%"
                            @selection-change="handleSelectionChange"
                            @select="handleSelect">
                        <el-table-column
                                type="selection"
                                width="55">
                        </el-table-column>
                        <el-table-column
                                prop="name"
                                label="球员姓名"
                                width="180">
                        </el-table-column>
                        <el-table-column
                                prop="chipId"
                                label="筹码ID"
                                width="180">
                        </el-table-column>
                        <el-table-column
                                prop="chipType"
                                label="筹码类型"
                                width="180">
                        </el-table-column>
                        <el-table-column
                                prop="nextSeasonSalary"
                                label="下赛季薪资"
                                width="180">
                        </el-table-column>
                        <el-table-column
                                prop="status"
                                label="状态"
                                width="180">
                        </el-table-column>
                    </el-table>
                </el-col>
            </el-row>
            <el-row>
                <el-col span=12>
                    <el-table
                            ref="initEggTable"
                            :data="tradeRoom.initiatorChip.eggChipList"
                            style="width: 100%"
                            @selection-change="handleSelectionChange">
                        <el-table-column
                                type="selection"
                                width="55">
                        </el-table-column>
                        <el-table-column
                                prop="name"
                                label="球员姓名"
                                width="180">
                        </el-table-column>
                        <el-table-column
                                prop="chipId"
                                label="筹码ID"
                                width="180">
                        </el-table-column>
                        <el-table-column
                                prop="chipType"
                                label="筹码类型"
                                width="180">
                        </el-table-column>
                        <el-table-column
                                prop="salary"
                                label="薪资"
                                width="180">
                        </el-table-column>
                        <el-table-column
                                prop="status"
                                label="状态"
                                width="180">
                        </el-table-column>
                    </el-table>
                </el-col>
                <el-col :span="12">
                    <el-table
                            ref="targetEggTable"
                            :data="tradeRoom.targetChip.eggChipList"
                            style="width: 100%"
                            @selection-change="handleSelectionChange"
                            @select="handleSelect">
                        <el-table-column
                                type="selection"
                                width="55">
                        </el-table-column>
                        <el-table-column
                                prop="name"
                                label="球员姓名"
                                width="180">
                        </el-table-column>
                        <el-table-column
                                prop="chipId"
                                label="筹码ID"
                                width="180">
                        </el-table-column>
                        <el-table-column
                                prop="chipType"
                                label="筹码类型"
                                width="180">
                        </el-table-column>
                        <el-table-column
                                prop="salary"
                                label="薪资"
                                width="180">
                        </el-table-column>
                        <el-table-column
                                prop="status"
                                label="状态"
                                width="180">
                        </el-table-column>
                    </el-table>
                </el-col>
            </el-row>
        </el-dialog>

        <el-dialog :visible.sync="dialogVisible" width="300px" >
            <span>
                {{content}}
            </span>
            <span slot="footer" class="dialog-footer">
                <el-button @click="refuseTradeRequest">拒绝</el-button>
                <el-button type="primary" @click="acceptTradeRequest">接受</el-button>
            </span>
        </el-dialog>
    </el-container>
</template>

<script>
    import GlobalWebsocket from "@/websocket/GlobalWebsocket";
    import {acceptTradeRequest, refuseTradeRequest} from "@/api/traderoom";

    let tradeWaitTime = 30;
    let tradeRequestTimer;
    export default {
        name: "TradeRoomDialog",
        data() {
            return {
                tradeRoom: {
                    "targetChip": {
                        "draftChipList": [],
                        "valuesSelected": 0,
                        "playerChipList": [{
                            "upId": 4,
                            "nextSeasonSalary": 500,
                            "values": 0,
                            "name": "特雷-杨",
                            "chipId": "1319835288893263882",
                            "chipType": "PLAYER",
                            "status": "UNSELECTED"
                        }, {
                            "upId": 5,
                            "nextSeasonSalary": 1000,
                            "values": 0,
                            "name": "凯里-欧文",
                            "chipId": "1319835288893263884",
                            "chipType": "PLAYER",
                            "status": "UNSELECTED"
                        }, {
                            "upId": 13,
                            "nextSeasonSalary": 1673,
                            "values": 0,
                            "name": "布兰顿-英格拉姆",
                            "chipId": "1319835288893263885",
                            "chipType": "PLAYER",
                            "status": "UNSELECTED"
                        }, {
                            "upId": 14,
                            "nextSeasonSalary": 800,
                            "values": 0,
                            "name": "帕斯卡尔-西亚卡姆",
                            "chipId": "1319835288893263886",
                            "chipType": "PLAYER",
                            "status": "UNSELECTED"
                        }, {
                            "upId": 16,
                            "nextSeasonSalary": 250,
                            "values": 0,
                            "name": "扎克-拉文",
                            "chipId": "1319835288893263887",
                            "chipType": "PLAYER",
                            "status": "UNSELECTED"
                        }, {
                            "upId": 17,
                            "nextSeasonSalary": 340,
                            "values": 0,
                            "name": "多诺万-米切尔",
                            "chipId": "1319835288893263888",
                            "chipType": "PLAYER",
                            "status": "UNSELECTED"
                        }, {
                            "upId": 15,
                            "nextSeasonSalary": 1560,
                            "values": 0,
                            "name": "拉塞尔-威斯布鲁克",
                            "chipId": "1319835288893263889",
                            "chipType": "PLAYER",
                            "status": "UNSELECTED"
                        }, {
                            "upId": 19,
                            "nextSeasonSalary": 1560,
                            "values": 0,
                            "name": "保罗-乔治",
                            "chipId": "1319835288893263890",
                            "chipType": "PLAYER",
                            "status": "UNSELECTED"
                        }],
                        "tradeChipMap": {
                            "1319835288893263889": {
                                "upId": 15,
                                "nextSeasonSalary": 1560,
                                "values": 0,
                                "name": "拉塞尔-威斯布鲁克",
                                "chipId": "1319835288893263889",
                                "chipType": "PLAYER",
                                "status": "UNSELECTED"
                            },
                            "1319835288893263888": {
                                "upId": 17,
                                "nextSeasonSalary": 340,
                                "values": 0,
                                "name": "多诺万-米切尔",
                                "chipId": "1319835288893263888",
                                "chipType": "PLAYER",
                                "status": "UNSELECTED"
                            },
                            "1319835288893263887": {
                                "upId": 16,
                                "nextSeasonSalary": 250,
                                "values": 0,
                                "name": "扎克-拉文",
                                "chipId": "1319835288893263887",
                                "chipType": "PLAYER",
                                "status": "UNSELECTED"
                            },
                            "1319835288893263886": {
                                "upId": 14,
                                "nextSeasonSalary": 800,
                                "values": 0,
                                "name": "帕斯卡尔-西亚卡姆",
                                "chipId": "1319835288893263886",
                                "chipType": "PLAYER",
                                "status": "UNSELECTED"
                            },
                            "1319835288893263885": {
                                "upId": 13,
                                "nextSeasonSalary": 1673,
                                "values": 0,
                                "name": "布兰顿-英格拉姆",
                                "chipId": "1319835288893263885",
                                "chipType": "PLAYER",
                                "status": "UNSELECTED"
                            },
                            "1319835288893263884": {
                                "upId": 5,
                                "nextSeasonSalary": 1000,
                                "values": 0,
                                "name": "凯里-欧文",
                                "chipId": "1319835288893263884",
                                "chipType": "PLAYER",
                                "status": "UNSELECTED"
                            },
                            "1319835288893263883": {
                                "upId": 1,
                                "values": 0,
                                "name": "詹姆斯-哈登",
                                "salary": 7550,
                                "chipId": "1319835288893263883",
                                "chipType": "EGG",
                                "status": "UNSELECTED"
                            },
                            "1319835288893263882": {
                                "upId": 4,
                                "nextSeasonSalary": 500,
                                "values": 0,
                                "name": "特雷-杨",
                                "chipId": "1319835288893263882",
                                "chipType": "PLAYER",
                                "status": "UNSELECTED"
                            },
                            "1319835288893263881": {
                                "upId": 2,
                                "values": 0,
                                "name": "扬尼斯-阿德托昆博",
                                "salary": 2450,
                                "chipId": "1319835288893263881",
                                "chipType": "EGG",
                                "status": "UNSELECTED"
                            },
                            "1319835288893263890": {
                                "upId": 19,
                                "nextSeasonSalary": 1560,
                                "values": 0,
                                "name": "保罗-乔治",
                                "chipId": "1319835288893263890",
                                "chipType": "PLAYER",
                                "status": "UNSELECTED"
                            }
                        },
                        "eggChipList": [{
                            "upId": 2,
                            "values": 0,
                            "name": "扬尼斯-阿德托昆博",
                            "salary": 2450,
                            "chipId": "1319835288893263881",
                            "chipType": "EGG",
                            "status": "UNSELECTED"
                        }, {
                            "upId": 1,
                            "values": 0,
                            "name": "詹姆斯-哈登",
                            "salary": 7550,
                            "chipId": "1319835288893263883",
                            "chipType": "EGG",
                            "status": "UNSELECTED"
                        }],
                        "valuesOverall": 0
                    },
                    "targetTotalSalaryAfterTrade": 0,
                    "initiatorEntered": false,
                    "roomId": "4dde2d87-c609-46c6-80d1-959acb469b6c",
                    "targetTeam": {"teamName": "ccTeam", "teamId": 432919740818919424},
                    "targetEntered": false,
                    "confirmable": false,
                    "initiatorTotalSalaryAfterTrade": 0,
                    "legal": false,
                    "initiatorTeam": {"teamName": "superTeam", "teamId": 432919908310061056},
                    "targetInSeason": false,
                    "targetTradeEggSalary": 0,
                    "targetTotalSalaryBeforeTrade": 17683,
                    "regulationContent": "AT_LEAST_ONE_PLAYER_OR_EGG",
                    "submittable": false,
                    "initiatorMaxSalaryLimitAfterTrade": 0,
                    "initiatorInSeason": true,
                    "targetTradePlayerSalary": 0,
                    "initiatorTotalSalaryBeforeTrade": 12252,
                    "expireTime": 1603508528883,
                    "round": 0,
                    "initiatorChip": {
                        "draftChipList": [],
                        "valuesSelected": 0,
                        "playerChipList": [{
                            "upId": 6,
                            "nextSeasonSalary": 1345,
                            "values": 0,
                            "name": "布拉德利-比尔",
                            "chipId": "1319835288893263872",
                            "chipType": "PLAYER",
                            "status": "UNSELECTED"
                        }, {
                            "upId": 7,
                            "nextSeasonSalary": 1547,
                            "values": 0,
                            "name": "安东尼-戴维斯",
                            "chipId": "1319835288893263873",
                            "chipType": "PLAYER",
                            "status": "UNSELECTED"
                        }, {
                            "upId": 8,
                            "nextSeasonSalary": 1666,
                            "values": 0,
                            "name": "达米安-利拉德",
                            "chipId": "1319835288893263874",
                            "chipType": "PLAYER",
                            "status": "UNSELECTED"
                        }, {
                            "upId": 9,
                            "nextSeasonSalary": 2009,
                            "values": 0,
                            "name": "卡尔-安东尼-唐斯",
                            "chipId": "1319835288893263875",
                            "chipType": "PLAYER",
                            "status": "UNSELECTED"
                        }, {
                            "upId": 10,
                            "nextSeasonSalary": 500,
                            "values": 0,
                            "name": "德文-布克",
                            "chipId": "1319835288893263876",
                            "chipType": "PLAYER",
                            "status": "UNSELECTED"
                        }, {
                            "upId": 11,
                            "nextSeasonSalary": 2685,
                            "values": 0,
                            "name": "科怀-伦纳德",
                            "chipId": "1319835288893263877",
                            "chipType": "PLAYER",
                            "status": "UNSELECTED"
                        }, {
                            "upId": 12,
                            "nextSeasonSalary": 3000,
                            "values": 0,
                            "name": "勒布朗-詹姆斯",
                            "chipId": "1319835288893263878",
                            "chipType": "PLAYER",
                            "status": "UNSELECTED"
                        }, {
                            "upId": 3,
                            "nextSeasonSalary": 2678,
                            "values": 0,
                            "name": "卢卡-东契奇",
                            "chipId": "1319835288893263879",
                            "chipType": "PLAYER",
                            "status": "UNSELECTED"
                        }, {
                            "upId": 18,
                            "nextSeasonSalary": 100,
                            "values": 0,
                            "name": "安德鲁-威金斯",
                            "chipId": "1319835288893263880",
                            "chipType": "PLAYER",
                            "status": "UNSELECTED"
                        }],
                        "tradeChipMap": {
                            "1319835288893263879": {
                                "upId": 3,
                                "nextSeasonSalary": 2678,
                                "values": 0,
                                "name": "卢卡-东契奇",
                                "chipId": "1319835288893263879",
                                "chipType": "PLAYER",
                                "status": "UNSELECTED"
                            },
                            "1319835288893263878": {
                                "upId": 12,
                                "nextSeasonSalary": 3000,
                                "values": 0,
                                "name": "勒布朗-詹姆斯",
                                "chipId": "1319835288893263878",
                                "chipType": "PLAYER",
                                "status": "UNSELECTED"
                            },
                            "1319835288893263877": {
                                "upId": 11,
                                "nextSeasonSalary": 2685,
                                "values": 0,
                                "name": "科怀-伦纳德",
                                "chipId": "1319835288893263877",
                                "chipType": "PLAYER",
                                "status": "UNSELECTED"
                            },
                            "1319835288893263876": {
                                "upId": 10,
                                "nextSeasonSalary": 500,
                                "values": 0,
                                "name": "德文-布克",
                                "chipId": "1319835288893263876",
                                "chipType": "PLAYER",
                                "status": "UNSELECTED"
                            },
                            "1319835288893263875": {
                                "upId": 9,
                                "nextSeasonSalary": 2009,
                                "values": 0,
                                "name": "卡尔-安东尼-唐斯",
                                "chipId": "1319835288893263875",
                                "chipType": "PLAYER",
                                "status": "UNSELECTED"
                            },
                            "1319835288893263874": {
                                "upId": 8,
                                "nextSeasonSalary": 1666,
                                "values": 0,
                                "name": "达米安-利拉德",
                                "chipId": "1319835288893263874",
                                "chipType": "PLAYER",
                                "status": "UNSELECTED"
                            },
                            "1319835288893263873": {
                                "upId": 7,
                                "nextSeasonSalary": 1547,
                                "values": 0,
                                "name": "安东尼-戴维斯",
                                "chipId": "1319835288893263873",
                                "chipType": "PLAYER",
                                "status": "UNSELECTED"
                            },
                            "1319835288893263872": {
                                "upId": 6,
                                "nextSeasonSalary": 1345,
                                "values": 0,
                                "name": "布拉德利-比尔",
                                "chipId": "1319835288893263872",
                                "chipType": "PLAYER",
                                "status": "UNSELECTED"
                            },
                            "1319835288893263880": {
                                "upId": 18,
                                "nextSeasonSalary": 100,
                                "values": 0,
                                "name": "安德鲁-威金斯",
                                "chipId": "1319835288893263880",
                                "chipType": "PLAYER",
                                "status": "UNSELECTED"
                            }
                        },
                        "eggChipList": [],
                        "valuesOverall": 0
                    },
                    "initiatorTradeEggSalary": 0,
                    "initiatorTradePlayerSalary": 0,
                    "targetMaxSalaryLimitAfterTrade": 0
                }, changeChipList: [],
                chipMap: new Map(),
                dialogVisible:false,
                content:"",
                tradeRequestId:-1
            }
        },
        created() {
            this.registerRoomRouter();
        },
        methods: {
            room() {
                var me = this;
                console.log(sessionStorage.getItem("roomId"));
                GlobalWebsocket.stompClient.subscribe("/channel/trade/room/" + sessionStorage.getItem("roomId"), function (response) {
                    console.log("room:" + response.body);
                    var res = JSON.parse(response.body);
                    var operation = res.operation;
                    var body = res.body;
                    if (operation == "房间聊天消息") {
                        me.chatMsg.push(body.content);
                    } else if (operation == "球队进入房间") {
                        if (body.initiatorEntered) {
                            me.tradeRoom.initiatorEntered = true;
                        } else {
                            me.tradeRoom.targetEntered = true;
                        }
                    } else if (operation == "筹码更新" || operation == "提交报价") {
                        me.getRoom();
                    }
                });
            },
            handleRoomCreated(body) {
                let me = this;
                sessionStorage.setItem("roomId", body.tradeRoom.roomId);
                this.room();
                this.tradeRoom = body.tradeRoom;
                this.tradeRoom.initiatorChip.playerChipList.foreach(chip => {
                    me.chipMap.set(chip.chipId);
                });
            },
            handleTradeRequest(body) {
                let me=this;
                me.content=body.initiatorTeamName+'向你发起交易 '+tradeWaitTime+'s';
                this.tradeRequestId=body.tradeRequestId;
                this.dialogVisible=true;
                tradeRequestTimer = setInterval(function () {
                    if (tradeWaitTime > 0) {
                        me.content=body.initiatorTeamName+'向你发起交易 '+(--tradeWaitTime)+'s';
                    } else {
                        clearInterval(tradeRequestTimer);
                        me.dialogVisible=false;
                        tradeWaitTime = 30;
                    }
                }, 1000)
            },
            handleCancelTradeRequest(body){
                clearInterval(tradeRequestTimer);
                this.dialogVisible=false;
                tradeWaitTime = 30;
                this.$message({
                    message:body.initiatorTeamName+"已取消交易请求",
                    type:"info"
                })
            },

            acceptTradeRequest(){
                this.dialogVisible = false;
                acceptTradeRequest({tradeRequestId:this.tradeRequestId}).then(res=>{
                    if(res.code===0){
                        this.$message({
                            message:"接受成功",
                            type:"info"
                        })
                    }
                })
            },
            refuseTradeRequest(){
                this.dialogVisible = false;
                refuseTradeRequest({tradeRequestId:this.tradeRequestId}).then(res=>{
                    if(res.code===0){
                        this.$message({
                            message:"拒绝成功",
                            type:"info"
                        })
                    }
                })
            },
            addChip() {
                console.log(this.changeChipList);
                const me = this;
                this.axiosPost.post("http://www.jrsports.com/api/trade/room/addChip", {
                    chipIdList: me.changeChipList
                }, {
                    headers: {
                        "userToken": localStorage.getItem("userToken"),
                        "teamToken": sessionStorage.getItem("teamToken")
                    }
                }).then(function (response) {
                    const createResponse = response.data;
                    if (createResponse.code == 0) {
                        me.$message({
                            message: "添加成功",
                            type: "success"
                        });
                        me.getRoom();
                    } else {
                        me.$message({
                            message: createResponse.msg,
                            type: "warning"
                        });
                    }
                });
            },
            removeChip() {
                console.log(this.changeChipList);
                const me = this;
                this.axiosPost.post("http://www.jrsports.com/api/trade/room/removeChip", {
                    chipIdList: me.changeChipList
                }, {
                    headers: {
                        "userToken": localStorage.getItem("userToken"),
                        "teamToken": sessionStorage.getItem("teamToken")
                    }
                }).then(function (response) {
                    const createResponse = response.data;
                    if (createResponse.code == 0) {
                        me.$message({
                            message: "移除成功",
                            type: "success"
                        });
                        me.getRoom();
                    } else {
                        me.$message({
                            message: createResponse.msg,
                            type: "warning"
                        });
                    }
                });
            },
            getRoom() {
                const me = this;
                this.axiosPost.post("http://www.jrsports.com/api/trade/room/getRoom", {}, {
                    headers: {
                        "userToken": localStorage.getItem("userToken"),
                        "teamToken": sessionStorage.getItem("teamToken")
                    }
                }).then(function (response) {
                    const createResponse = response.data;
                    if (createResponse.code == 0) {
                        me.tradeRoom = createResponse.data;

                    } else {
                        me.$message({
                            message: createResponse.msg,
                            type: "warning"
                        });
                    }
                });
            },
            addOffer() {
                const me = this;
                this.axiosPost.post("http://www.jrsports.com/api/trade/room/submit", {
                    comment: "一段带话"
                }, {
                    headers: {
                        "userToken": localStorage.getItem("userToken"),
                        "teamToken": sessionStorage.getItem("teamToken")
                    }
                }).then(function (response) {
                    const createResponse = response.data;
                    if (createResponse.code == 0) {
                        me.$message({
                            message: "提交成功",
                            type: "success"
                        });
                        me.getRoom();
                    } else {
                        me.$message({
                            message: createResponse.msg,
                            type: "warning"
                        });
                    }
                });
            },
            confirmOffer() {
                const me = this;
                this.axiosPost.post("http://www.jrsports.com/api/trade/room/confirm", {}, {
                    headers: {
                        "userToken": localStorage.getItem("userToken"),
                        "teamToken": sessionStorage.getItem("teamToken")
                    }
                }).then(function (response) {
                    const createResponse = response.data;
                    if (createResponse.code == 0) {
                        me.$message({
                            message: "确认成功",
                            type: "success"
                        });
                        me.getRoom();
                    } else {
                        me.$message({
                            message: createResponse.msg,
                            type: "warning"
                        });
                    }
                });
            },
            registerRoomRouter() {
                this.$store.dispatch('ws/addRouter', [
                    {
                        router: "/TRADE/room/交易房间创建完毕",
                        function: this.handleRoomCreated
                    },
                    {
                        router: "/TRADE/request/我方收到交易请求",
                        function: this.handleTradeRequest
                    },
                    {
                        router:"/TRADE/request/对方取消交易请求",
                        function: this.handleCancelTradeRequest
                    }
                ])
            }
        }
    }
</script>

<style scoped>

</style>