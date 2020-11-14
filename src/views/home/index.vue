<template>
    <div>
        <h3>JRBM</h3>
        <el-button v-if="!ifLogin" @click="loginDialogVisible=true">登录</el-button>
        <el-button @click="testWs">TestWs</el-button>
        <el-button @click="sendWs">SendWs</el-button>
<!--        <el-button @click="room">Go To Room</el-button>-->
        <el-button @click="subscribeTopic">Subscribe</el-button>
        <el-button @click="disconnectWs">disconnect</el-button>
        <el-dialog title="登录" :visible.sync="loginDialogVisible" width="30%">
            <el-row>
                <el-col>
                    <el-form ref="form" :model="form" label-width="80px">
                        <el-form-item label="用户名">
                            <el-input v-model="form.username"></el-input>
                        </el-form-item>
                        <el-form-item label="密码" prop="pass">
                            <el-input v-model="form.password" type="password" autocomplete="off"></el-input>
                        </el-form-item>
                        <el-row>
                            <el-col :span="4" offset=20>
                                <el-checkbox v-model="form.freeLoginType">7天免登录</el-checkbox>
                            </el-col>
                        </el-row>


                    </el-form>
                </el-col>
            </el-row>
            <span slot="footer" class="dialog-footer">
                <el-button @click="loginDialogVisible = false">取 消</el-button>
                <el-button type="primary" @click="onLogin(false)">登 录</el-button>
            </span>
        </el-dialog>
        <div v-if="ifLogin">
            <span>{{welcome}}</span>
            <el-button @click="getTeamList">选择球队</el-button>
            <el-button @click="logout">退出账户</el-button>
        </div>

        <el-button v-if="!ifLogin" @click="registerDialogVisible=true;getCaptcha();" style="margin-left: 10px">注册</el-button>
        <el-dialog title="注册" :visible.sync="registerDialogVisible" width="30%">
            <el-row>
                <el-col>
                    <el-form ref="regform" :model="regform" label-width="80px">
                        <el-form-item label="用户名">
                            <el-input v-model="regform.username"></el-input>
                        </el-form-item>
                        <el-form-item label="密码" prop="pass">
                            <el-input v-model="regform.password" type="password" autocomplete="off"></el-input>
                        </el-form-item>
                        <el-form-item label="重输密码" prop="rePass">
                            <el-input v-model="regform.repassword" type="password" autocomplete="off"></el-input>
                        </el-form-item>
                        <el-form-item>
                            <el-image
                                    style="width: 130px; height: 48px"
                                    :src="captchaUrl"></el-image>
                            <el-input v-model="regform.captcha"></el-input>
                        </el-form-item>


                    </el-form>
                </el-col>
            </el-row>
            <span slot="footer" class="dialog-footer">
                <el-button @click="registerDialogVisible = false">取 消</el-button>
                <el-button type="primary" @click="onRegister">注 册</el-button>
            </span>
        </el-dialog>

        <el-dialog title="服务器和球队" :visible.sync="serverDialogVisible">
            <el-table ref="teamTable" :data="teamList" highlight-current-row @current-change="selectTeam" v-loading="loading">
                <el-table-column property="serverId" label="服务器ID"></el-table-column>
                <el-table-column property="teamId" label="球队ID" ></el-table-column>
                <el-table-column property="teamName" label="你的球队" ></el-table-column>
<!--                <el-table-column label="进入游戏">-->
<!--                    <template slot-scope="scope">-->
<!--                        <el-button @click="getGamePage(scope.row)">进入游戏</el-button>-->
<!--                    </template>-->

<!--                </el-table-column>-->
            </el-table>
            <div style="text-align: right">
                <el-button @click="createTeamDialogVisible=true" :disabled="teamList.length>=10" style="margin-top: 30px">创建球队</el-button>
                <el-button @click="getGamePage" :disabled="ifTeamSelected==false " style="margin-top: 30px">进入游戏</el-button>
            </div>
        </el-dialog>

        <el-dialog title="创建球队" :visible.sync="createTeamDialogVisible" width="30%">
            <el-row>
                <el-col>
                    <el-form ref="createform" :model="createform" label-width="80px">
                        <el-form-item label="服务器ID">
                            <el-input v-model="createform.serverId" disabled></el-input>
                        </el-form-item>
                        <el-form-item label="球队名" prop="teamName">
                            <el-input v-model="createform.teamName"></el-input>
                        </el-form-item>
                    </el-form>
                </el-col>
            </el-row>
            <span slot="footer" class="dialog-footer">
                <el-button @click="createTeamDialogVisible = false">取 消</el-button>
                <el-button type="primary" @click="createTeam">创 建</el-button>
            </span>
        </el-dialog>

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
                <p>当前大名单薪资/工资帽/奢侈税线/硬工资帽：{{tradeRoom.initiatorTotalSalaryBeforeTrade}}/{{tradeRoom.salaryCap}}/{{tradeRoom.luxuryLine}}/{{tradeRoom.hardCap}}</p>
                <p>交易后{{tradeRoom.initiatorInSeason?"":"最大"}}薪资：{{tradeRoom.initiatorTotalSalaryAfterTrade}}</p>
                <p>参与交易的球员薪资：{{tradeRoom.initiatorTradePlayerSalary}}</p>
                <p>参与交易的球员蛋薪资：{{tradeRoom.initiatorTradeEggSalary}}</p>
                <p>送出的薪资不得超过：{{tradeRoom.initiatorMaxSalaryLimitAfterTrade}}</p>
                <p>当前报价：{{tradeRoom.legal?"合法":"不合法"}}|{{tradeRoom.submittable?"可提交":"不可提交"}}|{{tradeRoom.confirmable?"可确认":"不可确认"}}|{{tradeRoom.legal?"":"违反的规则为："+tradeRoom.regulationContent}}</p>

            </el-col>
            <el-col :span="12">
                <el-avatar :size="50" :src="tradeRoom.targetTeam.avatar"></el-avatar>
                <span>接收方球队：{{tradeRoom.targetTeam.teamName}}({{tradeRoom.targetInSeason?"赛季中":"休赛期"}})</span>
                <span>{{tradeRoom.targetEntered?"已进入":"未进入"}}</span>
                <p>当前大名单薪资/工资帽/奢侈税线/硬工资帽：{{tradeRoom.targetTotalSalaryBeforeTrade}}/{{tradeRoom.salaryCap}}/{{tradeRoom.luxuryLine}}/{{tradeRoom.hardCap}}</p>
                <p>交易后{{tradeRoom.targetInSeason?"":"最大"}}薪资：{{tradeRoom.targetTotalSalaryAfterTrade}}</p>
                <p>参与交易的球员薪资：{{tradeRoom.targetTradePlayerSalary}}</p>
                <p>参与交易的球员蛋薪资：{{tradeRoom.targetTradeEggSalary}}</p>
                <p>送出的薪资不得超过：{{tradeRoom.targetMaxSalaryLimitAfterTrade}}</p>
                <p>当前报价：{{tradeRoom.legal?"合法":"不合法"}}|{{tradeRoom.submittable?"可提交":"不可提交"}}|{{tradeRoom.confirmable?"可确认":"不可确认"}}|{{tradeRoom.legal?"":"违反的规则为："+tradeRoom.regulationContent}}</p>

            </el-col>
        </el-row>
        <el-row>
            <el-col span= 12>
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
            <el-col span= 12>
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

    </div>
</template>

<script>
    // import SockJS from "sockjs-client";
    import Stomp from "stompjs";
    import {getTeamList} from "@/api/user"
    import GlobalWebsocket from "@/websocket/GlobalWebsocket";
    var teamId=-1;
    var serverId=-1;
    var captchaToken=-1;

    var stompClient=null;
    export default {
        name: "index",
        data() {
            return {
                welcome: "",
                loginDialogVisible: false,
                registerDialogVisible: false,
                serverDialogVisible:false,
                createTeamDialogVisible:false,
                ifLogin:false,
                captchaUrl:"",
                chatMsg:[],
                loading:false,
                // tradeRoom:{
                //
                    // initiatorChip:{},
                    // targetChip:{},
                    // initiatorTeam:{},
                    // targetTeam:{},
                    // initiatorEntered:false,
                    // targetEntered:false
                // },
                tradeRoom:{"targetChip":{"draftChipList":[],"valuesSelected":0,"playerChipList":[{"upId":4,"nextSeasonSalary":500,"values":0,"name":"特雷-杨","chipId":"1319835288893263882","chipType":"PLAYER","status":"UNSELECTED"},{"upId":5,"nextSeasonSalary":1000,"values":0,"name":"凯里-欧文","chipId":"1319835288893263884","chipType":"PLAYER","status":"UNSELECTED"},{"upId":13,"nextSeasonSalary":1673,"values":0,"name":"布兰顿-英格拉姆","chipId":"1319835288893263885","chipType":"PLAYER","status":"UNSELECTED"},{"upId":14,"nextSeasonSalary":800,"values":0,"name":"帕斯卡尔-西亚卡姆","chipId":"1319835288893263886","chipType":"PLAYER","status":"UNSELECTED"},{"upId":16,"nextSeasonSalary":250,"values":0,"name":"扎克-拉文","chipId":"1319835288893263887","chipType":"PLAYER","status":"UNSELECTED"},{"upId":17,"nextSeasonSalary":340,"values":0,"name":"多诺万-米切尔","chipId":"1319835288893263888","chipType":"PLAYER","status":"UNSELECTED"},{"upId":15,"nextSeasonSalary":1560,"values":0,"name":"拉塞尔-威斯布鲁克","chipId":"1319835288893263889","chipType":"PLAYER","status":"UNSELECTED"},{"upId":19,"nextSeasonSalary":1560,"values":0,"name":"保罗-乔治","chipId":"1319835288893263890","chipType":"PLAYER","status":"UNSELECTED"}],"tradeChipMap":{"1319835288893263889":{"upId":15,"nextSeasonSalary":1560,"values":0,"name":"拉塞尔-威斯布鲁克","chipId":"1319835288893263889","chipType":"PLAYER","status":"UNSELECTED"},"1319835288893263888":{"upId":17,"nextSeasonSalary":340,"values":0,"name":"多诺万-米切尔","chipId":"1319835288893263888","chipType":"PLAYER","status":"UNSELECTED"},"1319835288893263887":{"upId":16,"nextSeasonSalary":250,"values":0,"name":"扎克-拉文","chipId":"1319835288893263887","chipType":"PLAYER","status":"UNSELECTED"},"1319835288893263886":{"upId":14,"nextSeasonSalary":800,"values":0,"name":"帕斯卡尔-西亚卡姆","chipId":"1319835288893263886","chipType":"PLAYER","status":"UNSELECTED"},"1319835288893263885":{"upId":13,"nextSeasonSalary":1673,"values":0,"name":"布兰顿-英格拉姆","chipId":"1319835288893263885","chipType":"PLAYER","status":"UNSELECTED"},"1319835288893263884":{"upId":5,"nextSeasonSalary":1000,"values":0,"name":"凯里-欧文","chipId":"1319835288893263884","chipType":"PLAYER","status":"UNSELECTED"},"1319835288893263883":{"upId":1,"values":0,"name":"詹姆斯-哈登","salary":7550,"chipId":"1319835288893263883","chipType":"EGG","status":"UNSELECTED"},"1319835288893263882":{"upId":4,"nextSeasonSalary":500,"values":0,"name":"特雷-杨","chipId":"1319835288893263882","chipType":"PLAYER","status":"UNSELECTED"},"1319835288893263881":{"upId":2,"values":0,"name":"扬尼斯-阿德托昆博","salary":2450,"chipId":"1319835288893263881","chipType":"EGG","status":"UNSELECTED"},"1319835288893263890":{"upId":19,"nextSeasonSalary":1560,"values":0,"name":"保罗-乔治","chipId":"1319835288893263890","chipType":"PLAYER","status":"UNSELECTED"}},"eggChipList":[{"upId":2,"values":0,"name":"扬尼斯-阿德托昆博","salary":2450,"chipId":"1319835288893263881","chipType":"EGG","status":"UNSELECTED"},{"upId":1,"values":0,"name":"詹姆斯-哈登","salary":7550,"chipId":"1319835288893263883","chipType":"EGG","status":"UNSELECTED"}],"valuesOverall":0},"targetTotalSalaryAfterTrade":0,"initiatorEntered":false,"roomId":"4dde2d87-c609-46c6-80d1-959acb469b6c","targetTeam":{"teamName":"ccTeam","teamId":432919740818919424},"targetEntered":false,"confirmable":false,"initiatorTotalSalaryAfterTrade":0,"legal":false,"initiatorTeam":{"teamName":"superTeam","teamId":432919908310061056},"targetInSeason":false,"targetTradeEggSalary":0,"targetTotalSalaryBeforeTrade":17683,"regulationContent":"AT_LEAST_ONE_PLAYER_OR_EGG","submittable":false,"initiatorMaxSalaryLimitAfterTrade":0,"initiatorInSeason":true,"targetTradePlayerSalary":0,"initiatorTotalSalaryBeforeTrade":12252,"expireTime":1603508528883,"round":0,"initiatorChip":{"draftChipList":[],"valuesSelected":0,"playerChipList":[{"upId":6,"nextSeasonSalary":1345,"values":0,"name":"布拉德利-比尔","chipId":"1319835288893263872","chipType":"PLAYER","status":"UNSELECTED"},{"upId":7,"nextSeasonSalary":1547,"values":0,"name":"安东尼-戴维斯","chipId":"1319835288893263873","chipType":"PLAYER","status":"UNSELECTED"},{"upId":8,"nextSeasonSalary":1666,"values":0,"name":"达米安-利拉德","chipId":"1319835288893263874","chipType":"PLAYER","status":"UNSELECTED"},{"upId":9,"nextSeasonSalary":2009,"values":0,"name":"卡尔-安东尼-唐斯","chipId":"1319835288893263875","chipType":"PLAYER","status":"UNSELECTED"},{"upId":10,"nextSeasonSalary":500,"values":0,"name":"德文-布克","chipId":"1319835288893263876","chipType":"PLAYER","status":"UNSELECTED"},{"upId":11,"nextSeasonSalary":2685,"values":0,"name":"科怀-伦纳德","chipId":"1319835288893263877","chipType":"PLAYER","status":"UNSELECTED"},{"upId":12,"nextSeasonSalary":3000,"values":0,"name":"勒布朗-詹姆斯","chipId":"1319835288893263878","chipType":"PLAYER","status":"UNSELECTED"},{"upId":3,"nextSeasonSalary":2678,"values":0,"name":"卢卡-东契奇","chipId":"1319835288893263879","chipType":"PLAYER","status":"UNSELECTED"},{"upId":18,"nextSeasonSalary":100,"values":0,"name":"安德鲁-威金斯","chipId":"1319835288893263880","chipType":"PLAYER","status":"UNSELECTED"}],"tradeChipMap":{"1319835288893263879":{"upId":3,"nextSeasonSalary":2678,"values":0,"name":"卢卡-东契奇","chipId":"1319835288893263879","chipType":"PLAYER","status":"UNSELECTED"},"1319835288893263878":{"upId":12,"nextSeasonSalary":3000,"values":0,"name":"勒布朗-詹姆斯","chipId":"1319835288893263878","chipType":"PLAYER","status":"UNSELECTED"},"1319835288893263877":{"upId":11,"nextSeasonSalary":2685,"values":0,"name":"科怀-伦纳德","chipId":"1319835288893263877","chipType":"PLAYER","status":"UNSELECTED"},"1319835288893263876":{"upId":10,"nextSeasonSalary":500,"values":0,"name":"德文-布克","chipId":"1319835288893263876","chipType":"PLAYER","status":"UNSELECTED"},"1319835288893263875":{"upId":9,"nextSeasonSalary":2009,"values":0,"name":"卡尔-安东尼-唐斯","chipId":"1319835288893263875","chipType":"PLAYER","status":"UNSELECTED"},"1319835288893263874":{"upId":8,"nextSeasonSalary":1666,"values":0,"name":"达米安-利拉德","chipId":"1319835288893263874","chipType":"PLAYER","status":"UNSELECTED"},"1319835288893263873":{"upId":7,"nextSeasonSalary":1547,"values":0,"name":"安东尼-戴维斯","chipId":"1319835288893263873","chipType":"PLAYER","status":"UNSELECTED"},"1319835288893263872":{"upId":6,"nextSeasonSalary":1345,"values":0,"name":"布拉德利-比尔","chipId":"1319835288893263872","chipType":"PLAYER","status":"UNSELECTED"},"1319835288893263880":{"upId":18,"nextSeasonSalary":100,"values":0,"name":"安德鲁-威金斯","chipId":"1319835288893263880","chipType":"PLAYER","status":"UNSELECTED"}},"eggChipList":[],"valuesOverall":0},"initiatorTradeEggSalary":0,"initiatorTradePlayerSalary":0,"targetMaxSalaryLimitAfterTrade":0},changeChipList:[],
                chipMap:new Map(),

                form:{
                    username:"",
                    password:"",
                    freeLoginType:false
                },
                regform:{
                    username:"",
                    password:"",
                    repassword:"",
                    captcha:""
                },
                createform:{
                  serverId:"默认",
                  teamName:""
                },
                teamList:[{
                    serverId:"",
                    teamId: "",
                    teamName: ""
                },
                ],
                ifTeamSelected:false,
                ifServerHasTeam:false
            }
        },
        mounted(){//主面初始化时，检查是否登录
            if(localStorage.getItem("userToken")!=null){
                this.ifLogin=true
            }
        },
        methods: {
            async getGamePage(){
                await this.teamLogin(false);
            },
            async teamLogin(ifForceKick){
                const me=this;
                this.$store.dispatch('team/teamLogin',{
                    teamId:teamId,
                    forceKick:ifForceKick
                }).then((response)=>{
                    if(response.code===0){
                        GlobalWebsocket.connect();
                        me.serverDialogVisible=false;
                        me.$router.push('/myteam');
                    }else{
                        me.$confirm(response.msg, '账号异常', {
                            confirmButtonText: '强制下线',
                            cancelButtonText: '取消登录',
                            type: 'warning'
                        }).then(() => {
                            me.teamLogin(true);
                        }).catch(() => {

                        });
                    }

                }).catch(()=>{

                })
            },
            room(){
                var me=this;
                console.log(sessionStorage.getItem("roomId"));
                stompClient.subscribe("/channel/trade/room/"+sessionStorage.getItem("roomId"), function (response) {
                    console.log("room:"+response.body);
                    var res=JSON.parse(response.body);
                    var operation=res.operation;
                    var body=res.body;
                    if(operation=="房间聊天消息"){
                        me.chatMsg.push(body.content);
                    }else if(operation=="球队进入房间"){
                        if(body.initiatorEntered){
                            me.tradeRoom.initiatorEntered=true;
                        }else{
                            me.tradeRoom.targetEntered=true;
                        }
                    }else if(operation=="筹码更新" || operation=="提交报价"){
                        me.getRoom();
                    }
                });
            },
            getTeamList(){
                const me = this;
                this.ifTeamSelected=false;
                this.loading=true;
                getTeamList().then(response => {
                    me.teamList=response.data;
                    me.loading=false;
                    this.serverDialogVisible=true
                })
            },
            selectTeam(val) {
                teamId=val.teamId;
                serverId=val.serverId;
                this.createform.serverId=serverId;
                this.ifTeamSelected=true;
                if(teamId==null){
                    this.ifServerHasTeam=false;
                }else{
                    this.ifServerHasTeam=true;
                }
                this.currentRow = val;
            },
            onLogin() {
                this.$store.dispatch('user/userLogin',{
                    userName:this.form.username,
                    password:this.form.password,
                    freeLoginType:this.freeLoginType?1:0
                }).then(()=>{
                    console.log("!!")
                    this.loginDialogVisible = false;
                    this.ifLogin = true;
                }).catch(()=>{

                })

                // const me=this;
                // this.axiosPost.post("http://www.jrsports.com/api/user/user/userLogin",{
                //     userName:this.form.username,
                //     password:this.form.password,
                //     freeLoginType:this.freeLoginType?1:0,
                // }).then(function (response) {
                //     const loginResponse=response.data;
                //     if(loginResponse.code===0) {
                //         localStorage.setItem("userToken", loginResponse.data.userToken);
                //         localStorage.setItem("userName", loginResponse.data.userName);
                //         me.loginDialogVisible = false;
                //         me.ifLogin = true;
                //         me.$message({
                //             message: loginResponse.msg,
                //             type: "success"
                //         });
                //     }else{
                //         me.$message({
                //             message: loginResponse.msg,
                //             type: "warning"
                //         });
                //     }
                // });
            },

            testWs(){
                let me=this;
                this.axiosPost.post("http://www.jrsports.com/api/user/websocket/apply", null, {
                    headers: {
                        "userToken": localStorage.getItem("userToken"),
                        "teamToken": sessionStorage.getItem("teamToken")
                    }
                }).then(function (response) {
                    const serverResponse = response.data;
                    // sessionStorage.setItem("wsToken", serverResponse.data);
                    // var socket = new SockJS("http://localhost:5266/global");
                    var socket=new WebSocket("ws://www.jrsports.com/global?wsToken="+serverResponse.data);
                    // var sockets = new SockJS("http://www.jrsports.com/global?wsToken="+serverResponse.data);

                    stompClient = Stomp.over(socket);

                    stompClient.connect({
                        // "wsToken":serverResponse.data
                    }, function(frame) {
                        console.log('Connected:' + frame);
                        stompClient.subscribe("/user/queue/team", function (response) {
                            let res=JSON.parse(response.body);
                            me.$message({
                                message: res.operation,
                                type: "success"
                            });
                            me.handleOperation(res.operation,res.body);

                        });
                    },function () {
                        //断开处理
                        console.log('Info: STOMP connection closed.');
                    });

                });



            },

            handleSelectionChange(selectedRows) {
                // console.log(val);
                var me=this;
                me.changeChipList=[];
                selectedRows.forEach(row=>{
                    me.changeChipList.push(row.chipId);
                });
            },
            // handleSelect(selection,row){
            //   // console.log(selection);
            //   // console.log(row);
            // },

            handleOperation(operation,body){
                let me=this;
                if(operation=="交易房间创建完毕"){
                    sessionStorage.setItem("roomId",body.tradeRoom.roomId);
                    this.room();
                    this.tradeRoom=body.tradeRoom;
                    this.tradeRoom.initiatorChip.playerChipList.foreach(chip=>{
                        me.chipMap.set(chip.chipId);
                    });

                }
            },
            subscribeTopic(){
                stompClient.subscribe("/channel/trade/room/"+sessionStorage.getItem("roomId"), function (response) {
                    console.log(response.body);

                });
            },
            sendWs(){
                stompClient.send("/service/trade", {}, JSON.stringify({'name': 'xst'}));
            },
            disconnectWs(){
                stompClient.disconnect();
            },
            addChip(){
                console.log(this.changeChipList);
                const me=this;
                this.axiosPost.post("http://www.jrsports.com/api/trade/room/addChip",{
                    chipIdList:me.changeChipList
                },{
                    headers:{
                        "userToken":localStorage.getItem("userToken"),
                        "teamToken":sessionStorage.getItem("teamToken")
                    }
                }).then(function (response) {
                    const createResponse=response.data;
                    if(createResponse.code==0){
                        me.$message({
                            message: "添加成功",
                            type: "success"
                        });
                        me.getRoom();
                    }else{
                        me.$message({
                            message: createResponse.msg,
                            type: "warning"
                        });
                    }
                });
            },
            removeChip(){
                console.log(this.changeChipList);
                const me=this;
                this.axiosPost.post("http://www.jrsports.com/api/trade/room/removeChip",{
                    chipIdList:me.changeChipList
                },{
                    headers:{
                        "userToken":localStorage.getItem("userToken"),
                        "teamToken":sessionStorage.getItem("teamToken")
                    }
                }).then(function (response) {
                    const createResponse=response.data;
                    if(createResponse.code==0){
                        me.$message({
                            message: "移除成功",
                            type: "success"
                        });
                        me.getRoom();
                    }else{
                        me.$message({
                            message: createResponse.msg,
                            type: "warning"
                        });
                    }
                });
            },
            getRoom(){
                const me=this;
                this.axiosPost.post("http://www.jrsports.com/api/trade/room/getRoom",{

                },{
                    headers:{
                        "userToken":localStorage.getItem("userToken"),
                        "teamToken":sessionStorage.getItem("teamToken")
                    }
                }).then(function (response) {
                    const createResponse=response.data;
                    if(createResponse.code==0){
                        me.tradeRoom=createResponse.data;

                    }else{
                        me.$message({
                            message: createResponse.msg,
                            type: "warning"
                        });
                    }
                });
            },
            addOffer(){
                const me=this;
                this.axiosPost.post("http://www.jrsports.com/api/trade/room/submit",{
                    comment:"一段带话"
                },{
                    headers:{
                        "userToken":localStorage.getItem("userToken"),
                        "teamToken":sessionStorage.getItem("teamToken")
                    }
                }).then(function (response) {
                    const createResponse=response.data;
                    if(createResponse.code==0){
                        me.$message({
                            message: "提交成功",
                            type: "success"
                        });
                        me.getRoom();
                    }else{
                        me.$message({
                            message: createResponse.msg,
                            type: "warning"
                        });
                    }
                });
            },

            confirmOffer(){
                const me=this;
                this.axiosPost.post("http://www.jrsports.com/api/trade/room/confirm",{

                },{
                    headers:{
                        "userToken":localStorage.getItem("userToken"),
                        "teamToken":sessionStorage.getItem("teamToken")
                    }
                }).then(function (response) {
                    const createResponse=response.data;
                    if(createResponse.code==0){
                        me.$message({
                            message: "确认成功",
                            type: "success"
                        });
                        me.getRoom();
                    }else{
                        me.$message({
                            message: createResponse.msg,
                            type: "warning"
                        });
                    }
                });
            },

            getCaptcha() {
                var me=this;
                this.axiosPost.get("http://www.jrsports.com/api/user/captcha/",{

                }).then(function (response) {
                    const captchaResponse=response.data;
                    me.captchaUrl=captchaResponse.captcha;
                    captchaToken=captchaResponse.captchaToken;
                });
            },
            onRegister() {
                const me=this;
                this.axiosPost.post("http://www.jrsports.com/api/user/user/userRegister",{
                    userName:this.regform.username,
                    password:this.regform.password,
                    rePassword:this.regform.repassword,
                    captchaToken:captchaToken,
                    captcha:this.regform.captcha,
                }).then(function (response) {
                    const registerResponse=response.data;
                    if(registerResponse.code==0){
                        localStorage.setItem("userToken",registerResponse.data.userToken);
                        localStorage.setItem("userName", registerResponse.data.userName);
                        me.registerDialogVisible=false;
                        me.ifLogin=true;
                    }else{
                        me.getCaptcha();
                        me.$message({
                            message: registerResponse.msg,
                            type: "warning"
                        });
                    }
                });
            },
            createTeam(){
                const me=this;
                this.axiosPost.post("http://www.jrsports.com/api/user/team/createTeam",{
                    teamName:me.createform.teamName
                },{
                    headers:{
                        "userToken":localStorage.getItem("userToken")
                    }
                }).then(function (response) {
                    const createResponse=response.data;
                    if(createResponse.code==0){
                        me.getTeamList();
                        me.createTeamDialogVisible=false;
                        me.$message({
                            message: createResponse.msg,
                            type: "success"
                        });
                    }else{
                        me.getCaptcha();
                        me.$message({
                            message: createResponse.msg,
                            type: "warning"
                        });
                    }
                });
            },
            logout(){
                localStorage.removeItem("userToken");
                localStorage.removeItem("userName");
                sessionStorage.removeItem("teamToken");
                sessionStorage.removeItem("teamName");
                location.reload();
            }
        }
    }
</script>

<style scoped>

</style>