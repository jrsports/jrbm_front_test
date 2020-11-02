<template>
    <div>
        <el-button @click="createTrade">发起交易请求</el-button>
        <el-button @click="acceptTrade" v-if="tradeReceived">接受交易请求</el-button>
        <el-button @click="refuseTrade" v-if="tradeReceived">拒绝交易请求</el-button>
    </div>
</template>

<script>
    import Trade from '../../global/wsConnection'
    export default {
        name: "Trade",
        data(){
            return{
                tradeReceived:Trade.getTradeReceived(),
                tradeRequestId:Trade.getTradeRequestId()
            }
        },
        methods:{
            createTrade(){
                var me=this;
                this.axiosPost.post("http://www.jrsports.com/api/trade/trade/createTradeRequest",{
                    "targetTeamId": "432919740818919424"
                },{
                    headers: {
                        "userToken": localStorage.getItem("userToken"),
                        "teamToken": sessionStorage.getItem("teamToken"),
                        "Content-Type": "application/json;charset=UTF-8"
                    }
                }).then(function (response) {
                    const data=response.data;
                    me.$message({
                        message: data.msg,
                        type: "primary"
                    });
                });
            },
            acceptTrade(){
                var me=this;
                this.axiosPost.post("http://www.jrsports.com/api/trade/trade/acceptTradeRequest",{
                    "tradeRequestId": "432919740818919424"
                },{
                    headers: {
                        "userToken": localStorage.getItem("userToken"),
                        "teamToken": sessionStorage.getItem("teamToken"),
                        "Content-Type": "application/json;charset=UTF-8"
                    }
                }).then(function (response) {
                    const data=response.data;
                    me.$message({
                        message: data.msg,
                        type: "primary"
                    });
                });
            },
            refuseTrade(){
                var me=this;
                this.axiosPost.post("http://www.jrsports.com/api/trade/trade/createTradeRequest",{
                    "targetTeamId": "432919740818919424"
                },{
                    headers: {
                        "userToken": localStorage.getItem("userToken"),
                        "teamToken": sessionStorage.getItem("teamToken"),
                        "Content-Type": "application/json;charset=UTF-8"
                    }
                }).then(function (response) {
                    const data=response.data;
                    me.$message({
                        message: data.msg,
                        type: "primary"
                    });
                });
            }
        }


    }
</script>

<style scoped>

</style>