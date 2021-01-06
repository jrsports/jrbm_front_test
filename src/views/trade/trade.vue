<template>
    <el-container>
        <el-header>
            <nav-bar></nav-bar>
        </el-header>
        <el-container>
            <el-aside width="200px">
                <sidebar></sidebar>
            </el-aside>
            <el-main>
                <el-tabs type="border-card">
<!--                    <el-tab-pane>-->
<!--                        <span slot="label"><i class="el-icon-date"></i>交易大厅</span>-->
<!--                        <div>-->
<!--                            <el-row>-->
<!--                                <el-col :span="16">-->
<!--                                    <el-row>-->
<!--                                        <h2>交易搜索器</h2>-->
<!--                                        <el-input placeholder="输入球员名或球队名"  class="input-with-select"-->
<!--                                                  style="margin-top: 15px;">-->
<!--                                            <el-select  slot="prepend" placeholder="过滤项"-->
<!--                                                       style="width:130px;background-color:#fff">-->
<!--                                                <el-option label="餐厅名" value="1"></el-option>-->
<!--                                                <el-option label="订单号" value="2"></el-option>-->
<!--                                                <el-option label="用户电话" value="3"></el-option>-->
<!--                                            </el-select>-->
<!--                                            <el-button slot="append" icon="el-icon-search"></el-button>-->
<!--                                        </el-input>-->
<!--                                    </el-row>-->
<!--                                    <el-row>-->
<!--                                        <h2>交易推荐</h2>-->
<!--                                    </el-row>-->
<!--                                </el-col>-->
<!--                                <el-col :span="8">-->
<!--                                    <h2>交易动态</h2>-->
<!--                                </el-col>-->
<!--                            </el-row>-->
<!--                            <el-button @click="createTrade">发起交易请求</el-button>-->
<!--                            <el-button @click="acceptTrade" v-if="tradeReceived">接受交易请求</el-button>-->
<!--                            <el-button @click="refuseTrade" v-if="tradeReceived">拒绝交易请求</el-button>-->
<!--                        </div>-->
<!--                    </el-tab-pane>-->
                    <el-tab-pane label="出售大厅">
                        <TradeSellTab></TradeSellTab>
                    </el-tab-pane>
                    <el-tab-pane label="求购大厅">
                        <TradePurchaseTab></TradePurchaseTab>
                    </el-tab-pane>
                </el-tabs>




            </el-main>
        </el-container>
    </el-container>
</template>

<script>
    import Sidebar from "@/views/layout/sidebar/sidebar";
    import NavBar from "@/views/layout/header/header"
    import TradeSellTab from "@/components/TradeSellTab";
    import TradePurchaseTab from "@/components/TradePurchaseTab";


    export default {
        name: "Trade",
        components: {Sidebar, NavBar,TradeSellTab,TradePurchaseTab},

        data() {
            return {
                tradeReceived: null,
                invitationId: null,

            }
        },
        methods: {
            createTrade() {
                var me = this;
                this.axiosPost.post("http://www.jrsports.com/api/trade/trade/createTradeInvitation", {
                    "targetTeamId": "432919740818919424"
                }, {
                    headers: {
                        "userToken": localStorage.getItem("userToken"),
                        "teamToken": sessionStorage.getItem("teamToken"),
                        "Content-Type": "application/json;charset=UTF-8"
                    }
                }).then(function (response) {
                    const data = response.data;
                    me.$message({
                        message: data.msg,
                        type: "primary"
                    });
                });
            },
            acceptTrade() {
                var me = this;
                this.axiosPost.post("http://www.jrsports.com/api/trade/trade/acceptTradeInvitation", {
                    "invitationId": "432919740818919424"
                }, {
                    headers: {
                        "userToken": localStorage.getItem("userToken"),
                        "teamToken": sessionStorage.getItem("teamToken"),
                        "Content-Type": "application/json;charset=UTF-8"
                    }
                }).then(function (response) {
                    const data = response.data;
                    me.$message({
                        message: data.msg,
                        type: "primary"
                    });
                });
            },
            refuseTrade() {
                var me = this;
                this.axiosPost.post("http://www.jrsports.com/api/trade/trade/createTradeInvitation", {
                    "targetTeamId": "432919740818919424"
                }, {
                    headers: {
                        "userToken": localStorage.getItem("userToken"),
                        "teamToken": sessionStorage.getItem("teamToken"),
                        "Content-Type": "application/json;charset=UTF-8"
                    }
                }).then(function (response) {
                    const data = response.data;
                    me.$message({
                        message: data.msg,
                        type: "primary"
                    });
                });
            },

        }


    }
</script>

<style scoped>

</style>