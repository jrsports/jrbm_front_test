<template>
    <div>
        <h3>JRBM</h3>
        <el-button v-if="!ifLogin" @click="loginDialogVisible=true">登录</el-button>
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
                            <el-col span=4 offset=20>
                                <el-checkbox v-model="form.freeLoginType">7天免登录</el-checkbox>
                            </el-col>
                        </el-row>


                    </el-form>
                </el-col>
            </el-row>
            <span slot="footer" class="dialog-footer">
                <el-button @click="loginDialogVisible = false">取 消</el-button>
                <el-button type="primary" @click="onLogin">登 录</el-button>
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
                                    :src="captchaUrl"
                                    :fit="fit"></el-image>
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
            <el-table ref="teamTable" :data="teamList" highlight-current-row @current-change="selectTeam">
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
                <el-button @click="createTeamDialogVisible=true" :disabled="ifTeamSelected==false || ifServerHasTeam==true" style="margin-top: 30px">创建球队</el-button>
                <el-button @click="getGamePage" :disabled="ifTeamSelected==false || ifServerHasTeam==false" style="margin-top: 30px">进入游戏</el-button>
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

    </div>
</template>

<script>
    var teamId=-1;
    var serverId=-1;
    var captchaToken=-1;
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
                  serverId:"",
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
            async localSocket() {
                const me=this;
                await this.applyWsToken();
                const wsToken = sessionStorage.getItem("wsToken");
                let that = this;
                if ("WebSocket" in window) {
                    const url = "ws://www.jrsports.com/api/ws/global/global?wsToken=" + wsToken;
                    that.globalws.ws = new WebSocket(url);
                } else {
                    // 浏览器不支持 WebSocket
                    console.log("您的浏览器不支持 WebSocket!");
                }
                this.globalws.ws.onopen=function () {
                    me.startHeartBeat();
                }
            },
            async applyWsToken() {
                await this.axios.post("http://www.jrsports.com/api/user/websocket/apply", null, {
                    headers: {
                        "userToken": localStorage.getItem("userToken"),
                        "teamToken": sessionStorage.getItem("teamToken")
                    }
                }).then(function (response) {
                    const serverResponse = response.data;
                    if (serverResponse.code == 0) {
                        sessionStorage.setItem("wsToken", serverResponse.data);
                    } else {
                        alert(serverResponse.msg);
                    }

                });
            },
            startHeartBeat(){
                setInterval(this.sendHeartBeat,3000);
            },
            sendHeartBeat(){
                console.log("send heartbeat");
                this.globalws.ws.send(JSON.stringify({type:-100,time:new Date().getTime()}))
            },
            async getGamePage(){
                await this.teamLogin();
            },
            async teamLogin(){
                const me=this;
                //球队登录
                await this.axios.post("http://www.jrsports.com/api/user/team/teamLogin",{
                    teamId:teamId
                },{
                    headers:{
                        "userToken":localStorage.getItem("userToken")
                    }
                }).then(function (response) {
                    const loginResponse=response.data;
                    if(loginResponse.code===0){
                        sessionStorage.setItem("teamToken",loginResponse.teamToken);
                        me.localSocket();
                        me.loadTeamInfo();
                        me.$router.push('/myteam');
                    }else{
                        me.$message({
                            message: loginResponse.msg,
                            type: "error"
                        });
                    }
                });
            },
            loadTeamInfo(){
                //初始化时加载球队信息
                this.axios.post("http://www.jrsports.com/api/user/team/getTeamInfo", null, {
                    headers: {
                        "userToken": localStorage.getItem("userToken"),
                        "teamToken": sessionStorage.getItem("teamToken")
                    }
                }).then(function (response) {
                    const teamInfoResponse = response.data;
                    if (teamInfoResponse.code === 0) {
                        sessionStorage.setItem("teamName",teamInfoResponse.data.teamName);
                    } else {
                        alert(teamInfoResponse.message);
                    }
                });
            },
            getTeamList(){
                const me = this;
                this.ifTeamSelected=false;
                //获取服务器列表和球队
                this.axios.post("http://www.jrsports.com/api/user/user/getServerTeamList",null,{
                    headers:{
                        "userToken":localStorage.getItem("userToken")
                    }
                }).then(function (response) {
                    const serverResponse = response.data;
                    me.teamList=serverResponse.data;
                });
                this.serverDialogVisible=true
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
                var me=this;
                this.axios.post("http://www.jrsports.com/api/user/user/userLogin",{
                    username:this.form.username,
                    password:this.form.password,
                    freeLoginType:this.freeLoginType?1:0
                }).then(function (response) {
                    const loginResponse=response.data;
                    if(loginResponse.code===0) {
                        localStorage.setItem("userToken", loginResponse.userToken);
                        me.loginDialogVisible = false;
                        me.ifLogin = true;
                        me.welcome = "欢迎" + loginResponse.username;
                        me.$message({
                            message: loginResponse.msg,
                            type: "success"
                        });
                    }else{
                        me.$message({
                            message: loginResponse.msg,
                            type: "warning"
                        });
                    }
                });
            },
            getCaptcha() {
                var me=this;
                this.axios.get("http://www.jrsports.com/api/user/captcha/",{

                }).then(function (response) {
                    const captchaResponse=response.data;
                    me.captchaUrl=captchaResponse.captcha;
                    captchaToken=captchaResponse.captchaToken;
                });
            },
            onRegister() {
                var me=this;
                this.axios.post("http://www.jrsports.com/api/user/user/userRegister",{
                    username:this.regform.username,
                    password:this.regform.password,
                    rePassword:this.regform.repassword,
                    captchaToken:captchaToken,
                    captcha:this.regform.captcha,
                    registerType:0
                }).then(function (response) {
                    const registerResponse=response.data;
                    if(registerResponse.code==0){
                        localStorage.setItem("userToken",registerResponse.userToken);
                        me.regDialogVisible=false;
                        me.ifLogin=true;
                        me.welcome="欢迎"+registerResponse.username;
                    }else{
                        me.getCaptcha();
                        alert(registerResponse.message);
                    }
                });
            },
            createTeam(){
                const me=this;
                this.axios.post("http://www.jrsports.com/api/user/team/createTeam",{
                    serverId:me.createform.serverId,
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
                    }else{
                        alert(createResponse.msg);
                    }
                });
            },
            logout(){
                localStorage.removeItem("userToken");
                sessionStorage.removeItem("teamToken");
                location.reload();
            }
        }
    }
</script>

<style scoped>

</style>