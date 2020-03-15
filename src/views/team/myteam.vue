<template xmlns:el-col="http://www.w3.org/1999/html">


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
                    <el-row type="flex" align="middle">
                        <el-col :span="10"></el-col>
                        <el-col :span="4">
                            <h3>总进攻：156</h3>
                        </el-col>
                        <el-col :span="4">
                            <h3>总防守：122</h3>
                        </el-col>
                        <el-col :span="6">
                            <div>
                                <el-button icon="el-icon-sort" @click="openSubstitute">换人</el-button>
                            </div>
                        </el-col>

                    </el-row>
                    <el-row :gutter="20">
                        <el-col :span="2">
                            <h3>
                                首发阵容
                            </h3>
                        </el-col>
                        <el-col :span="4" style="text-align: center" v-for="player in starting" :key="player.upId">
                            <div class="block" @click="selectPlayer($event,player.upId)">
                                <el-popover
                                        placement="top-start"
                                        :title="player.chname"
                                        width="200"
                                        trigger="hover">
                                    <p>攻：{{player.offensive}}，防：{{player.defensive}}</p>
                                    <p>位置：{{player.position}}，工资：{{player.salary}}w</p>
                                    <el-button type="primary" icon="el-icon-edit" circle
                                               @click="getUserPlayerDetail(player.upId);userPlayerDetailDialogVisible=true"></el-button>
                                    <el-avatar slot=reference shape="square" :size="100"
                                               :src="player.avatarUrl"></el-avatar>
                                </el-popover>
                                <p>{{player.chname}}</p>
                                <p>{{player.enname}}</p>

                            </div>
                        </el-col>
                        <el-col :span="2">

                        </el-col>
                    </el-row>
                    <el-row :gutter="20">
                        <el-col :span="2">
                            <h3>
                                替补阵容
                            </h3>
                        </el-col>
                        <el-col :span="4" style="text-align: center" v-for="player in sub" :key="player">
                            <div class="block" @click="selectPlayer($event,player.upId)">
                                <el-avatar shape="square" :size="100" :src="player.avatarUrl"></el-avatar>
                                <p>{{player.chname}}</p>
                                <p>{{player.enname}}</p>
                                <p>攻：{{player.offensive}}，防：{{player.defensive}}</p>
                                <p>位置：{{player.position}}，工资：{{player.salary}}w</p>
                            </div>
                        </el-col>
                        <el-col :span="2">

                        </el-col>
                    </el-row>

                    <el-dialog title="球员详情" :visible.sync="userPlayerDetailDialogVisible">
                        <el-row>
                            <el-col span="6">
                                <el-avatar shape="square" :size="100" :src="playerDetail.avatarUrl"></el-avatar>
                            </el-col>
                            <el-col span="6">
                                <h3>{{playerDetail.chname}}</h3>
                                <h5>{{playerDetail.enname}}</h5>
                            </el-col>
                            <el-col span="6">
                                <h1>总评：{{playerDetail.overall}}</h1>
                            </el-col>
                            <el-col span="6">
                                <h1>等级：{{playerDetail.grade}}</h1>
                            </el-col>
                            <el-card style="width: 100%">
                                <div slot="header">
                                    <span>能力值</span>
                                    <el-button style="float: right; padding: 3px 0" type="text">操作按钮</el-button>
                                </div>
                                <el-row>
                                    <el-col span="4">突破：{{playerDetail.ability.breakthrough}}</el-col>
                                    <el-col span="4">中距离：{{playerDetail.ability.midrange}}</el-col>
                                    <el-col span="4">内线：{{playerDetail.ability.inside}}</el-col>
                                    <el-col span="4">三分：{{playerDetail.ability.three}}</el-col>
                                    <el-col span="4">罚球：{{playerDetail.ability.freethrow}}</el-col>
                                    <el-col span="4">造犯规：{{playerDetail.ability.causefoul}}</el-col>
                                </el-row>
                                <el-row style="margin-top: 15px">
                                    <el-col span="4">传球稳定：{{playerDetail.ability.passStability}}</el-col>
                                    <el-col span="4">传球精确：{{playerDetail.ability.passAccuracy}}</el-col>
                                    <el-col span="4">视野：{{playerDetail.ability.passVision}}</el-col>
                                    <el-col span="4">抢断：{{playerDetail.ability.steal}}</el-col>
                                    <el-col span="4">篮板：{{playerDetail.ability.rebound}}</el-col>
                                    <el-col span="4">逼抢：{{playerDetail.ability.forcing}}</el-col>
                                </el-row>
                                <el-row style="margin-top: 15px">
                                    <el-col span="4">防盖帽：{{playerDetail.ability.blocking}}</el-col>
                                    <el-col span="4">防突破：{{playerDetail.ability.antiBreakthrough}}</el-col>
                                    <el-col span="4">防中距离：{{playerDetail.ability.antiMidrange}}</el-col>
                                    <el-col span="4">防三分：{{playerDetail.ability.antiThree}}</el-col>
                                    <el-col span="4">防内线：{{playerDetail.ability.antiInside}}</el-col>
                                    <el-col span="4">干净度：{{playerDetail.ability.clean}}</el-col>
                                </el-row>
                                <el-row style="margin-top: 15px">
                                    <el-col span="4">运球：{{playerDetail.ability.dribble}}</el-col>
                                    <el-col span="4">受助攻：{{playerDetail.ability.beAssisted}}</el-col>
                                    <el-col span="4">投篮倾向：{{playerDetail.ability.shootIncline}}</el-col>
                                    <el-col span="4">突破倾向：{{playerDetail.ability.breakthroughIncline}}</el-col>
                                    <el-col span="4">中投倾向：{{playerDetail.ability.midrangeIncline}}</el-col>
                                    <el-col span="4">三分倾向：{{playerDetail.ability.threeIncline}}</el-col>
                                </el-row>
                                <el-row style="margin-top: 15px">
                                    <el-col span="4">内线倾向：{{playerDetail.ability.insideIncline}}</el-col>
                                    <el-col span="4">传球倾向：{{playerDetail.ability.passIncline}}</el-col>
                                    <el-col span="4">进攻综合：{{playerDetail.ability.offensiveOverall}}</el-col>
                                    <el-col span="4">防守综合：{{playerDetail.ability.defensiveOverall}}</el-col>
                                    <el-col span="4">球权：{{playerDetail.ability.ballWeight}}</el-col>
                                    <el-col span="4"></el-col>
                                </el-row>
                            </el-card>

                        </el-row>
                    </el-dialog>
                </el-main>
            </el-container>
        </el-container>
    </el-container>
</template>

<script>
    import Sidebar from "@/views/layout/sidebar/sidebar";
    import NavBar from "@/views/layout/header/header"
    // import Chat from "@/views/layout/chat/chat";
    var ifSubstitute = false;
    var substituteList = [];
    export default {
        name: "gameindex",
        components: {Sidebar, NavBar},
        mounted() {
            this.getUserPlayerList();
        },
        computed: {
            starting: function () {
                return this.playerList.filter(function (player) {
                    return player.order <= 5
                })
            },
            sub: function () {
                return this.playerList.filter(function (player) {
                    return player.order > 5
                })
            }
        },
        data() {
            return {
                teamName: "null",
                playerList: [{
                    avatarUrl: "https://cube.elemecdn.com/9/c2/f0ee8a3c7c9638a54940382568c9dpng.png",
                    chname: "默认",
                    enname: "default",
                    offensive: 126,
                    defensive: 110,
                    position: "PG/SG",
                    salary: 4800,
                    order: 1
                }],
                userPlayerDetailDialogVisible: false,
                playerDetail: {
                    avatarUrl: "https://cube.elemecdn.com/9/c2/f0ee8a3c7c9638a54940382568c9dpng.png",
                    chname: "",
                    ability: {}
                }
            }
        },
        methods: {


            getUserPlayerList() {
                const me = this;
                this.axios.post("http://www.jrsports.com/api/player/userPlayer/getUserPlayerDetailList", null, {
                    headers: {
                        "userToken": localStorage.getItem("userToken"),
                        "teamToken": sessionStorage.getItem("teamToken")
                    }
                }).then(function (response) {
                    const res = response.data;
                    if (res.code === 0) {
                        let rec=res.data;
                        let nextTotalSalary=0;
                        rec.forEach(function (item) {
                            if(item.order==1){
                                item.orderStr="首发PG"
                            }else if(item.order==2){
                                item.orderStr="首发SG"
                            }else if(item.order==3){
                                item.orderStr="首发SF"
                            }else if(item.order==4){
                                item.orderStr="首发PF"
                            }else if(item.order==5){
                                item.orderStr="首发C"
                            }
                            if(item.position==1){
                                item.position="PG"
                            }else if(item.position==2){
                                item.position="SG"
                            }else if(item.position==3){
                                item.position="SF"
                            }else if(item.position==4){
                                item.position="PF"
                            }else if(item.position==5){
                                item.position="C"
                            }

                            if(item.grade==1){
                                item.grade="S+"
                            }else if(item.grade==2){
                                item.grade="S"
                            }else if(item.grade==3){
                                item.grade="S-"
                            }else if(item.grade==4){
                                item.grade="A+"
                            }else if(item.grade==5){
                                item.grade="A"
                            }else if(item.grade==6){
                                item.grade="A-"
                            }else if(item.grade==7){
                                item.grade="B+"
                            }else if(item.grade==8){
                                item.grade="B"
                            }else if(item.grade==9){
                                item.grade="B-"
                            }else if(item.grade==10){
                                item.grade="C+"
                            }else if(item.grade==11){
                                item.grade="C"
                            }else if(item.grade==12){
                                item.grade="C-"
                            }else if(item.grade==13){
                                item.grade="D+"
                            }else if(item.grade==14){
                                item.grade="D"
                            }else if(item.grade==15){
                                item.grade="D-"
                            }



                            if(item.type==0){
                                item.type="现役";
                            }else{
                                item.type="历史";
                            }

                            nextTotalSalary+=item.nextSeasonSalary;
                            me.loading=false;
                        });
                        me.playerList=rec;
                        me.nextTotalSalary=nextTotalSalary;
                        // me.currentPlayerData.totalRecordCount=res.data.totalRecordCount;
                        // me.currentPlayerData.totalPageCount=res.data.totalPageCount;
                        // me.currentPlayerData.pageNo=res.data.pageNo;
                        // me.currentPlayerData. pageSize=res.data. pageSize;
                    } else {
                        alert(res.message);
                    }
                });
            },
            selectPlayer(event, upId) {
                if (ifSubstitute) {
                    substituteList.push(upId);
                    if (substituteList.length == 2) {
                        this.substitute(substituteList[0], substituteList[1]);
                        substituteList = [];

                    }
                }
            },
            openSubstitute() {
                if (!ifSubstitute) {
                    ifSubstitute = true;
                    this.subs = "关闭换人";
                } else {
                    ifSubstitute = false;
                    this.subs = "开启换人";
                }
            },
            substitute(fromUpId, toUpId) {
                const me = this;
                //获取服务器列表和球队
                this.axios.post("http://www.jrsports.com/api/user/team/substitutePlayer", {
                    fromUpId: fromUpId,
                    toUpId: toUpId
                }, {
                    headers: {
                        "userToken": localStorage.getItem("userToken"),
                        "teamToken": sessionStorage.getItem("teamToken")
                    }
                }).then(function (response) {
                    const serverResponse = response.data;
                    if (serverResponse.code == 0) {
                        me.$message({
                            message: "换人成功",
                            type: "success"
                        });
                        me.playerList = serverResponse.data;
                    } else {
                        alert(serverResponse.msg);
                    }

                });
            },
            getUserPlayerDetail(upId) {
                const me = this;
                this.axios.post("http://www.jrsports.com/api/player/userPlayer/getUserPlayerDetail/" + upId, null, {
                    headers: {
                        "userToken": localStorage.getItem("userToken"),
                        "teamToken": sessionStorage.getItem("teamToken")
                    }
                }).then(function (response) {
                    const res = response.data;
                    if (res.code === 0) {
                        let item = res.data;
                        if (item.order == 1) {
                            item.order = "首发PG"
                        } else if (item.order == 2) {
                            item.order = "首发SG"
                        } else if (item.order == 3) {
                            item.order = "首发SF"
                        } else if (item.order == 4) {
                            item.order = "首发PF"
                        } else if (item.order == 5) {
                            item.order = "首发C"
                        }
                        if (item.position == 1) {
                            item.position = "PG"
                        } else if (item.position == 2) {
                            item.position = "SG"
                        } else if (item.position == 3) {
                            item.position = "SF"
                        } else if (item.position == 4) {
                            item.position = "PF"
                        } else if (item.position == 5) {
                            item.position = "C"
                        }

                        if (item.grade == 1) {
                            item.grade = "S+"
                        } else if (item.grade == 2) {
                            item.grade = "S"
                        } else if (item.grade == 3) {
                            item.grade = "S-"
                        } else if (item.grade == 4) {
                            item.grade = "A+"
                        } else if (item.grade == 5) {
                            item.grade = "A"
                        } else if (item.grade == 6) {
                            item.grade = "A-"
                        } else if (item.grade == 7) {
                            item.grade = "B+"
                        } else if (item.grade == 8) {
                            item.grade = "B"
                        } else if (item.grade == 9) {
                            item.grade = "B-"
                        } else if (item.grade == 10) {
                            item.grade = "C+"
                        } else if (item.grade == 11) {
                            item.grade = "C"
                        } else if (item.grade == 12) {
                            item.grade = "C-"
                        } else if (item.grade == 13) {
                            item.grade = "D+"
                        } else if (item.grade == 14) {
                            item.grade = "D"
                        } else if (item.grade == 15) {
                            item.grade = "D-"
                        }


                        if (item.type == 0) {
                            item.type = "现役";
                        } else {
                            item.type = "历史";
                        }


                        me.playerDetail = item;
                    } else {
                        alert(res.message);
                    }
                });

            }
        }
    }
</script>

<style scoped>

</style>