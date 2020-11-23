<template>
    <el-container>
        <el-dialog :visible.sync="dialogVisible">
            <span>
                {{content}}
            </span>
            <span slot="footer" class="dialog-footer">
                <el-button @click="cancelTradeRequest">取消</el-button>
            </span>
        </el-dialog>

    </el-container>
</template>

<script>
    import {cancelTradeRequest} from "@/api/traderoom";

    let tradeWaitTime = 30;
    let tradeRequestTimer;
    export default {
        name: "TradeRequestDialog",
        data() {
            return {
                dialogVisible: false,
                content: ""
            }
        },
        created() {
            this.registerRoomRouter();
        },

        methods: {
            show(targetTeamName) {
                let me=this;
                me.content='等待'+targetTeamName+'接受交易请求...  '+tradeWaitTime+'s';
                this.dialogVisible=true;
                tradeRequestTimer = setInterval(function () {
                    if (tradeWaitTime > 0) {
                        me.content='等待'+targetTeamName+'接受交易请求...  '+(--tradeWaitTime)+'s';
                    } else {
                        clearInterval(tradeRequestTimer);
                        me.dialogVisible=false;
                        tradeWaitTime = 30;
                    }
                }, 1000)
            },
            cancelTradeRequest(){
                cancelTradeRequest().then(()=>{
                    clearInterval(tradeRequestTimer);
                    this.dialogVisible=false;
                    tradeWaitTime = 30;
                });
            },
            handleRefuseTradeRequest(body){
                clearInterval(tradeRequestTimer);
                this.dialogVisible=false;
                tradeWaitTime = 30;
                this.$message({
                    message:body.targetTeamName+"拒绝了您的交易请求",
                    type:"info"
                })
            },
            registerRoomRouter() {
                this.$store.dispatch('ws/addRouter', [
                    {
                        router:"/TRADE/request/对方拒绝交易请求",
                        function: this.handleRefuseTradeRequest
                    }
                ])
            }
        }
    }

</script>

<style scoped>

</style>