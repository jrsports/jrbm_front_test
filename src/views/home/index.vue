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
            <el-button @click="getServerList">选择服务器和球队</el-button>
            <el-button @click="logout">退出账户</el-button>
        </div>

        <el-dialog title="服务器和球队" :visible.sync="serverDialogVisible">
            <el-table :data="serverList">
                <el-table-column property="serverId" label="服务器" ></el-table-column>
                <el-table-column property="teamName" label="你的球队" ></el-table-column>
                <el-table-column label="进入游戏">
                    <template slot-scope="scope">
                        <el-button @click="getGamePage(scope.row)">进入游戏</el-button>
                    </template>

                </el-table-column>
            </el-table>
        </el-dialog>

    </div>
</template>

<script>
    import axios from 'axios'

    export default {
        name: "index",
        data() {
            return {
                welcome: "",
                loginDialogVisible: false,
                serverDialogVisible:false,
                ifLogin:false,
                form:{
                    username:"",
                    password:"",
                    freeLoginType:false
                },
                serverList:[{
                    serverId: "",
                    teamName: ""
                }
                ]
            }
        },
        mounted(){//主面初始化时，检查是否登录
            if(localStorage.getItem("token")!=null){
                this.ifLogin=true
            }
        },
        methods: {
            getGamePage(row){
                //获取点击的服务器并跳转
                var serverId=row.serverId;

                this.$router.push({path:"/myteam",params:{serverId:}})
            },
            getServerList(){
                var me=this;
                //获取服务器列表和球队
                axios.post("http://www.jrsports.com/api/user/getServerTeamList",null,{
                    headers:{
                        "token":localStorage.getItem("token")
                    }
                }).then(function (response) {
                    var serverResponse=response.data;
                    me.serverList=serverResponse.data;
                }).catch(function (error) {
                    alert(error);
                });
                this.serverDialogVisible=true
            },
            onLogin() {
                var me=this;
                axios.post("http://www.jrsports.com/api/user/userLogin",{
                    username:this.form.username,
                    password:this.form.password,
                    freeLoginType:this.freeLoginType?1:0
                }).then(function (response) {
                    var loginResponse=response.data;
                    if(loginResponse.code===0){
                        localStorage.setItem("token",loginResponse.token);
                        me.loginDialogVisible=false;
                        me.ifLogin=true;
                        me.welcome="欢迎"+loginResponse.username;
                    }else{
                        alert(loginResponse.message);
                    }
                }).catch(function (error) {
                    alert(error);
                });
            },
            logout(){
                localStorage.removeItem("token");
                location.reload();
            }
        }
    }
</script>

<style scoped>

</style>