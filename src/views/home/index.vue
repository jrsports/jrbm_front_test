<template>
    <div>
        <h3>JRBM</h3>
        <el-button v-if="!ifLogin" @click="loginDialogVisible=true">登录</el-button>
        <el-button @click="sendWs">SendWs</el-button>
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



    </div>
</template>

<script>
    import {getTeamList} from "@/api/user"
    import GlobalWebsocket from "@/websocket/GlobalWebsocket";
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

                loading:false,
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