<template>
    <el-container>
        <el-header>
            <el-menu mode="horizontal" style="text-align: right">
                <el-submenu index="1">
                    <template slot="title">欢迎{{teamName}}</template>
                    <el-menu-item index="2-1">我的账户</el-menu-item>
                    <el-menu-item index="2-2">充值</el-menu-item>
                    <el-menu-item index="2-3">设置</el-menu-item>
                </el-submenu>
            </el-menu>
        </el-header>
        <el-container>
            <el-aside width="200px">
                <sidebar></sidebar>
            </el-aside>
            <el-container>
                <el-main>
                    <el-row>
                        <el-col :span="20">
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
                            <h4 style="text-align:right" :class="{'newColor':newPlayerColorDisplay}">当前自由球员人数：{{freePlayerCount}}</h4>
                        </el-col>
                    </el-row>
                    <el-row>
                        <el-button type="info" plain @click="signHistoryDialogVisible=true;getHistoryOfferList()">查看签约历史</el-button>
                    </el-row>
                    <el-row :gutter="20">
                        <el-col :span="8" v-for="fp in freePlayerListData" :key="fp">
                            <div class="freePlayer">
                                <el-row>
                                    <el-col :span="8">
                                        <div class="block"><el-avatar class="playerAvatar" shape="square"  :src="squareUrl"></el-avatar></div>
                                    </el-col>
                                    <el-col :span="16">
                                        <div>
                                            <h3>{{fp.player.chname}}<span>{{fp.player.enname}}</span></h3>
                                            <h3>{{fp.player.position}}|<span>进攻：{{fp.player.offensive}}防守：{{fp.player.defensive}}</span></h3>
                                            <h4>原属球队：{{fp.source}}</h4>
                                        </div>
                                    </el-col>
                                </el-row>
                                <el-row :gutter="10">
                                    <el-col :span="12" style="text-align: center">
                                        <el-button plain type="info">球员详情</el-button>
                                    </el-col>
                                    <el-col :span="12" style="text-align: center">
                                        <el-button plain type="success" @click="addOfferDialogVisible=true;addOfferForm.fpId=fp.fpId">谈判报价</el-button>
                                    </el-col>
                                </el-row>
                                <el-row style="margin-top: 30px">
                                    <el-col :span="12" style="text-align: center">
                                        <span>剩余时间：{{fp.timeLeft}}</span>
                                    </el-col>
                                    <el-col :span="12" style="text-align: center">
                                        <el-button type="text" @click="getOfferList(fp.fpId);offerDialogVisible = true">报价情况</el-button>
                                    </el-col>
                                </el-row>

                            </div>
                        </el-col>
                    </el-row>

                    <el-dialog title="报价列表" :visible.sync="offerDialogVisible">
                        <el-table :data="offerData">
                            <el-table-column type="index" label="排名" width="50"></el-table-column>
                            <el-table-column property="teamName" label="球队"></el-table-column>
                            <el-table-column property="offer" label="报价"></el-table-column>
                            <el-table-column property="offerDate" label="报价时间"></el-table-column>
                            <el-table-column property="intention" label="意向"></el-table-column>
                        </el-table>
                    </el-dialog>
                    <el-dialog title="报价" :visible.sync="addOfferDialogVisible">
                        <el-row>
                            <el-col span="18">
                                <el-form ref="addOfferForm" :model="addOfferForm" label-width="100px">
                                    <el-form-item
                                            v-for="(offer, index) in addOfferForm.addOfferData"
                                            :label="'第' + (index+1)+'年'"
                                            :key="index"
                                    >
                                        <el-input-number v-model="offer.salary" @change="calculateTotalSalary" :min="0" :max="5000" label="当年薪资" style="width: 200px;margin-right:10px"></el-input-number><el-button v-if="index>0" @click.prevent="removeOffer(offer)">删除</el-button>
                                    </el-form-item>
                                    <el-form-item>
                                        <el-button type="primary" @click="addOffer()">报价</el-button>
                                        <el-button v-if="addYearBtnVisible" @click="addOff">新增一年</el-button>
                                    </el-form-item>
                                </el-form>
                            </el-col>
                            <el-col span="6">
                                <h3>总计：{{addOfferForm.totalSeason}}年{{addOfferForm.totalSalary}}万</h3>
                            </el-col>
                        </el-row>

                    </el-dialog>
                    <el-dialog title="签约历史" :visible.sync="signHistoryDialogVisible">
                        <el-table :data="signHistoryData">
                            <el-table-column property="playerName" label="球员"></el-table-column>
                            <el-table-column property="offerCount" label="报价人数"></el-table-column>
                            <el-table-column property="intendedOfferCount" label="球员心仪报价"></el-table-column>
                            <el-table-column property="expireTime" label="球员过期时间"></el-table-column>
                            <el-table-column property="status" label="状态"></el-table-column>
                            <el-table-column property="offerFlowId" label="流程ID" width="0"></el-table-column>
                            <el-table-column label="签约流程">
                                <template slot-scope="scope">
                                    <el-button
                                            size="mini"
                                            @click="signFlowDialogVisible=true;viewSignFlow(scope.row)">查看</el-button>
                                </template>
                            </el-table-column>
                        </el-table>
                    </el-dialog>
                    <el-dialog title="签约流程" :visible.sync="signFlowDialogVisible">
                        <el-steps :active="offerFlow.status" finish-status="success" align-center >
                            <el-step title="签署流程发起" :description="offerFlow.flowStartTime"></el-step>
                            <el-step title="签署中" :description="offerFlow.currentProgress"></el-step>
                            <el-step title="签署完成" :description="offerFlow.flowFinishTime"></el-step>
                        </el-steps>
                        <el-table :data="signFlowData">
                            <el-table-column type="index" label="意向排名"></el-table-column>
                            <el-table-column property="teamName" label="候选球队"></el-table-column>
                            <el-table-column property="sendTime" label="发送时间"></el-table-column>
                            <el-table-column property="expireTime" label="过期时间"></el-table-column>
                            <el-table-column property="finishTime" label="（拒绝）签署时间"></el-table-column>
                            <el-table-column property="status" label="签署状态"></el-table-column>
                        </el-table>
                    </el-dialog>
                </el-main>
            </el-container>
        </el-container>
    </el-container>

</template>

<script>
    import Sidebar from "@/views/layout/sidebar/sidebar";


    export default {
        name: "freemarket",
        components: {Sidebar},
        data(){
            return{
                teamName:"",
                squareUrl: "https://cube.elemecdn.com/9/c2/f0ee8a3c7c9638a54940382568c9dpng.png",
                freePlayerCount:0,
                offensive:200,
                defensive:200,
                originalTeam:"originalTeam",
                position:"PG",
                offerDialogVisible:false,
                addOfferDialogVisible:false,
                signHistoryDialogVisible:false,
                signFlowDialogVisible:false,
                lastFpId:-1,
                newPlayerColorDisplay:false,
                addYearBtnVisible:true,
                offerFlow:{
                    status:1,
                    flowStartTime:"2020/2/16 11:46",
                    flowFinishTime:"2020/2/16 11:46",
                    currentProgress:"等待 ccTeam 同意签约"
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
                positionFilterData:[],
                offerData:[
                    // {
                    //     teamName:"koliday",
                    //     offer:"3年2500万",
                    //     offerTime:"2020/2/3 16:14:18",
                    //     intention:"97%"
                    // }
                ],
                signFlowData:[
                    {
                        teamName:"Koliday",
                        sendTime:"2020/2/16 12:12",
                        expireTime:"2020/2/16 14:12",
                        finishTime:"2020/2/16 13:27",
                        status:"已拒绝"
                    },
                    {
                        teamName:"ccTeam",
                        sendTime:"2020/2/16 12:12",
                        expireTime:"2020/2/16 14:12",
                        finishTime:"",
                        status:"待签署"
                    },
                    {
                        teamName:"kkTeam",
                        sendTime:"",
                        expireTime:"",
                        finishTime:"",
                        status:"未发送"
                    }
                ],
                signHistoryData:[
                    {
                        playerName:"朱-霍勒迪",
                        offerCount:5,
                        intendedOfferCount:3,
                        expireTime:"2020/2/16 17:09",
                        status:"签约中",
                        offerFlowId:1
                    }
                ],
                addOfferForm:{
                    fpId:-1,
                    totalSeason:1,
                    totalSalary:0,
                    addOfferData:[
                        {
                            season:1,
                            salary:0
                        }
                    ],
                },
                freePlayerListData:[]
            }

        },
        mounted(){
            this.teamName=sessionStorage.getItem("teamName");
            this.refreshFreePlayer();
            this.iniFreemarketWebsocket();
            setInterval(this.startTimer,1000);
        },
        methods:{
            getMoreFreePlayer(){
                const me = this;
                this.axios.post("http://www.jrsports.com/api/freemarket/free/getFreePlayerList", {
                    fpIdOffset:this.lastFpId,
                    count:9
                }, {
                    headers: {
                        "userToken": localStorage.getItem("userToken"),
                        "teamToken": sessionStorage.getItem("teamToken")
                    }
                }).then(function (response) {
                    const freeResponse = response.data;
                    if (freeResponse.code === 0) {
                        const newFreePlayerList=freeResponse.data;
                        newFreePlayerList.forEach(function (item) {
                            item.timeLeft=me.secondsToTime((item.expireTimeStamp-new Date().getTime())/1000)
                            me.freePlayerListData.push(item)
                        });
                    } else {
                        me.$message({
                            message: freeResponse.msg,
                            type: "warning"
                        });
                    }
                });
            },
            refreshFreePlayer(){
                const me = this;
                this.axios.post("http://www.jrsports.com/api/freemarket/free/getFreePlayerList", {
                    fpIdOffset:this.lastFpId,
                    count:9
                }, {
                    headers: {
                        "userToken": localStorage.getItem("userToken"),
                        "teamToken": sessionStorage.getItem("teamToken")
                    }
                }).then(function (response) {
                    const freeResponse = response.data;
                    if (freeResponse.code === 0) {
                        const newFreePlayerList=freeResponse.data;
                        me.freePlayerCount=newFreePlayerList.length;
                        me.freePlayerListData=[];
                        newFreePlayerList.forEach(function (item) {
                            item.timeLeft=me.secondsToTime(parseInt((item.expireTimeStamp-new Date().getTime())/1000));
                            me.freePlayerListData.push(item)
                        });
                    } else {
                        me.$message({
                            message: freeResponse.msg,
                            type: "warning"
                        });
                    }
                });
            },
            getOfferList(fpId){
                const me = this;
                this.axios.post("http://www.jrsports.com/api/freemarket/offer/getOfferList/"+fpId, null, {
                    headers: {
                        "userToken": localStorage.getItem("userToken"),
                        "teamToken": sessionStorage.getItem("teamToken")
                    }
                }).then(function (response) {
                    const freeResponse = response.data;
                    if (freeResponse.code === 0) {
                        me.offerData=freeResponse.data;
                        me.offerData.forEach(function(item){
                            item.offer=item.offerContractDetail.totalSeason+"年"+item.offerContractDetail.totalSalary+"万"
                        });
                    } else {
                        me.$message({
                            message: freeResponse.msg,
                            type: "warning"
                        });
                    }
                });
            },
            getHistoryOfferList(){
                const me = this;
                this.axios.post("http://www.jrsports.com/api/freemarket/free/getHistory", {
                    pageNo:1,
                    pageSize:10
                }, {
                    headers: {
                        "userToken": localStorage.getItem("userToken"),
                        "teamToken": sessionStorage.getItem("teamToken")
                    }
                }).then(function (response) {
                    const freeResponse = response.data;
                    if (freeResponse.code === 0) {
                        let d=freeResponse.data.recordList;
                        d.forEach(function (item) {
                            if(item.status==2){
                                item.status="等待签约";
                            }else if(item.status==3){
                                item.status="已签约";
                            }else if(item.status==4){
                                item.status="消失";
                            }
                        });
                        me.signHistoryData=d;
                    } else {
                        me.$message({
                            message: freeResponse.msg,
                            type: "warning"
                        });
                    }
                });
            },
            viewSignFlow(row){
                const me = this;
                this.axios.post("http://www.jrsports.com/api/freemarket/offer/getSignFlow/"+row.offerFlowId, null, {
                    headers: {
                        "userToken": localStorage.getItem("userToken"),
                        "teamToken": sessionStorage.getItem("teamToken")
                    }
                }).then(function (response) {
                    const freeResponse = response.data;
                    if (freeResponse.code === 0) {
                        let candidate=freeResponse.data.teamCandidateList;
                        candidate.forEach(function (item) {
                            if(item.status==0){
                                item.status="未发送";
                            }else if(item.status==1){
                                item.status="已发送";
                            }else if(item.status==2){
                                item.status="拒绝签约";
                            }else if(item.status==3){
                                item.status="签约成功";
                            }else if(item.status==4){
                                item.status="签约过期";
                            }
                        });
                        me.signFlowData=candidate;
                        const of=freeResponse.data.offerFlow;
                        me.offerFlow.status=of.status;
                        me.offerFlow.flowStartTime=of.flowStartTime;
                        if(of.status==1){
                            me.offerFlow.currentProgress="等待"+of.currentSignTeam+"确认签约";
                        }else if(of.status==2){
                            me.offerFlow.currentProgress=of.currentSignTeam+"签约成功";
                        }else if(of.status==3){
                            me.offerFlow.currentProgress="无人签约";
                        }

                        me.offerFlow.flowFinishTime=of.flowFinishTime;
                    } else {
                        me.$message({
                            message: freeResponse.msg,
                            type: "warning"
                        });
                    }
                });
            },
            addOffer(){
                const me = this;
                this.axios.post("http://www.jrsports.com/api/freemarket/offer/addOffer", {
                    fpId:this.addOfferForm.fpId,
                    offerContractSalaryList:this.addOfferForm.addOfferData
                }, {
                    headers: {
                        "userToken": localStorage.getItem("userToken"),
                        "teamToken": sessionStorage.getItem("teamToken")
                    }
                }).then(function (response) {
                    const freeResponse = response.data;
                    if (freeResponse.code === 0) {
                        me.offerData=freeResponse.data;
                        me.$message({
                            message: "报价成功",
                            type: "success"
                        });
                        me.addOfferDialogVisible=false;
                    } else {
                        me.$message({
                            message: freeResponse.msg,
                            type: "warning"
                        });
                    }
                });
            },
            async iniFreemarketWebsocket(){
                await this.globalws.applyWsToken();
                const wsToken = sessionStorage.getItem("wsToken");
                const url = "ws://www.jrsports.com/api/ws/freemarket/free?wsToken=" + wsToken;
                this.freemarketWs = new WebSocket(url);
                this.freemarketWs.onopen=this.freemarketWsOnopen;
                this.freemarketWs.onclose=this.freemarketWsOnclose;
                this.freemarketWs.onmessage=this.freemarketWsOnmessage;
                this.freemarketWs.onerror=this.freemarketWsOnerror;
            },
            freemarketWsOnopen(){
                this.$message({
                    message: "已连接到自由市场",
                    type: "success"
                });
            },
            freemarketWsOnclose(){

            },
            freemarketWsOnmessage(msg){
                const response = JSON.parse(msg.data);
                if(response.type==2){
                    this.freePlayerCount=response.freePlayerCount;
                    this.newPlayerColorDisplay=true;
                    this.$notify({
                        title: '自由市场消息',
                        message: '有新的球员流入自由市场',
                        type: 'success'
                    });
                }

            },
            freemarketWsOnerror(){

            },
            secondsToTime(s) {
                let h;
                h = Math.floor(s / 60);
                s = s % 60;
                h += '';
                s += '';
                h = (h.length == 1) ? '0' + h : h;
                s = (s.length == 1) ? '0' + s : s;
                return h + ':' + s;
            },
            startTimer(){
                const me=this;
                this.freePlayerListData.forEach(function (item) {
                    item.timeLeft=me.secondsToTime(parseInt((item.expireTimeStamp-new Date().getTime())/1000));
                });
            },
            removeOffer(item) {
                const index = this.addOfferForm.addOfferData.indexOf(item);
                this.addOfferForm.totalSeason--;
                this.addOfferForm.addOfferData.splice(index, 1)
                this.calculateTotalSalary();
                this.addYearBtnVisible=true;
            },
            addOff(){
                if(++this.addOfferForm.totalSeason==5){
                    this.addYearBtnVisible=false;
                }
                this.addOfferForm.addOfferData.push({
                    season: this.addOfferForm.totalSeason,
                    salary:0
                });
                this.calculateTotalSalary()
            },
            calculateTotalSalary(){
                let total = 0;
                this.addOfferForm.addOfferData.forEach(function(item){
                    total+=item.salary;
                });
                this.addOfferForm.totalSalary=total;
            }
        }
    }
</script>

<style>
    .freePlayer{
        background-color: #d3dce6;
        width:500px;
        height: 300px;
    }
    .playerAvatar{
        width:120px;
        height:120px;
        margin-left: 10px;
        margin-top: 10px;
    }
    .newColor{
        color: seagreen;
    }
</style>