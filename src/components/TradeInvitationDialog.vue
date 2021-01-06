<template>
    <el-container>
        <el-dialog :visible.sync="dialogVisible" width="300px">
            <span>
                {{content}}
            </span>
            <span slot="footer" class="dialog-footer">
                <el-button @click="cancelTradeInvitation">取消</el-button>
            </span>
        </el-dialog>


    </el-container>
</template>

<script>
    import {cancelTradeInvitation} from "@/api/traderoom";

    let tradeWaitTime = 30;
    let tradeInvitationTimer;
    export default {
        name: "TradeInvitationDialog",
        data() {
            return {
                dialogVisible: false,
                content: ""
            }
        },
        created() {
            this.registerTradeInvitationRouter();
        },

        methods: {
            show(targetTeamName) {
                let me = this;
                me.content = '等待' + targetTeamName + '接受交易请求...  ' + tradeWaitTime + 's';
                this.dialogVisible = true;
                tradeInvitationTimer = setInterval(function () {
                    if (tradeWaitTime > 0) {
                        me.content = '等待' + targetTeamName + '接受交易请求...  ' + (--tradeWaitTime) + 's';
                    } else {
                        clearInterval(tradeInvitationTimer);
                        me.dialogVisible = false;
                        tradeWaitTime = 30;
                    }
                }, 1000)
            },
            cancelTradeInvitation() {
                cancelTradeInvitation().then(() => {
                    clearInterval(tradeInvitationTimer);
                    this.dialogVisible = false;
                    tradeWaitTime = 30;
                });
            },
            handleAcceptTradeInvitation(body) {
                clearInterval(tradeInvitationTimer);
                this.dialogVisible = false;
                tradeWaitTime = 30;
                this.$message({
                    message: body.targetTeamName + "接受了您的交易请求，等待房间创建",
                    type: "success"
                })

            },
            handleRefuseTradeInvitation(body) {
                clearInterval(tradeInvitationTimer);
                this.dialogVisible = false;
                tradeWaitTime = 30;
                this.$message({
                    message: body.targetTeamName + "拒绝了您的交易请求",
                    type: "info"
                })
            },
            registerTradeInvitationRouter() {
                this.$store.dispatch('ws/addRouter', {
                        "channel": "/user/queue/team",
                        "routers": [
                            {
                                router: "/TRADE/request/拒绝邀请",
                                function: this.handleRefuseTradeInvitation
                            },
                            {
                                router: "/TRADE/request/接受邀请",
                                function: this.handleAcceptTradeInvitation
                            }
                        ]
                    }
                )
            }
        }
    }

</script>

<style scoped>

</style>