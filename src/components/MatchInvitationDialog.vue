<template>
    <el-container>
        <el-dialog :visible.sync="dialogVisible" width="300px">
            <span>
                {{content}}
            </span>
            <span slot="footer" class="dialog-footer">
                <el-button @click="cancelMatchInvitation">取消</el-button>
            </span>
        </el-dialog>

        <el-dialog :visible.sync="responseDialogVisible" width="300px">
            <span>
                {{responseContent}}
            </span>
            <span slot="footer" class="dialog-footer">
                <el-button @click="refuseMatchInvitation">拒绝</el-button>
                <el-button type="primary" @click="acceptMatchInvitation">接受</el-button>
            </span>
        </el-dialog>
    </el-container>
</template>

<script>
    import {acceptFriendMatchInvitation, cancelFriendMatchInvitation, refuseFriendMatchInvitation} from "@/api/match";

    let invitationWaitTime = 30;
    let MatchInvitationTimer;
    let responseWaitTime = 30;
    let responseInvitationTimer;
    export default {
        name: "MatchInvitationDialog",
        data() {
            return {
                dialogVisible: false,
                content: "",
                responseDialogVisible:false,
                responseContent:""
            }
        },
        created() {
            this.registerMatchInvitationRouter();
        },

        methods: {
            show(targetTeamName) {
                let me = this;
                me.content = '等待' + targetTeamName + '接受比赛邀请...  ' + invitationWaitTime + 's';
                this.dialogVisible = true;
                MatchInvitationTimer = setInterval(function () {
                    if (invitationWaitTime > 0) {
                        me.content = '等待' + targetTeamName + '接受比赛邀请...  ' + (--invitationWaitTime) + 's';
                    } else {
                        clearInterval(MatchInvitationTimer);
                        me.dialogVisible = false;
                        invitationWaitTime = 30;
                    }
                }, 1000)
            },
            cancelMatchInvitation() {
                cancelFriendMatchInvitation().then(() => {
                    clearInterval(MatchInvitationTimer);
                    this.dialogVisible = false;
                    invitationWaitTime = 30;
                });
            },
            acceptMatchInvitation() {
                acceptFriendMatchInvitation({invitationId: this.invitationId}).then(res => {
                    if (res.code === 0) {
                        clearInterval(responseInvitationTimer);
                        this.responseDialogVisible = false;
                        responseWaitTime = 30;
                        this.$message({
                            message: "接受成功，等待房间初始化",
                            type: "success"
                        });
                    }
                })
            },
            refuseMatchInvitation() {
                refuseFriendMatchInvitation({invitationId: this.invitationId}).then(res => {
                    if (res.code === 0) {
                        clearInterval(responseInvitationTimer);
                        this.responseDialogVisible = false;
                        responseWaitTime = 30;
                        this.$message({
                            message: "拒绝成功",
                            type: "info"
                        })
                    }
                })
            },
            handleAcceptMatchInvitation(body) {
                clearInterval(MatchInvitationTimer);
                this.dialogVisible = false;
                invitationWaitTime = 30;
                this.$message({
                    message: body.targetTeamName + "接受了您的比赛邀请，等待房间创建",
                    type: "success"
                })
            },
            handleRefuseMatchInvitation(body) {
                clearInterval(MatchInvitationTimer);
                this.dialogVisible = false;
                invitationWaitTime = 30;
                this.$message({
                    message: body.targetTeamName + "拒绝了您的比赛邀请",
                    type: "info"
                })
            },
            handleMatchInvitation(body) {
                let me = this;
                me.content = body.inviterTeamName + '向你发起比赛邀请 ' + responseWaitTime + 's';
                this.invitationId = body.invitationId;
                this.responseDialogVisible = true;
                responseInvitationTimer = setInterval(function () {
                    if (responseWaitTime > 0) {
                        me.responseContent = body.inviterTeamName + '向你发起比赛邀请 ' + (--responseWaitTime) + 's';
                    } else {
                        clearInterval(responseInvitationTimer);
                        me.responseDialogVisible = false;
                        responseWaitTime = 30;
                    }
                }, 1000)
            },
            handleCancelMatchInvitation(body) {
                clearInterval(responseInvitationTimer);
                this.responseDialogVisible = false;
                responseWaitTime = 30;
                this.$message({
                    message: body.inviterTeamName + "已取消比赛邀请",
                    type: "info"
                })
            },
            registerMatchInvitationRouter() {
                this.$store.dispatch('ws/addRouter', {
                        "channel": "/user/queue/team",
                        "routers": [
                            {
                                router: "/MATCH_SERVER/friendMatch/拒绝邀请",
                                function: this.handleRefuseMatchInvitation
                            },
                            {
                                router: "/MATCH_SERVER/friendMatch/接受邀请",
                                function: this.handleAcceptMatchInvitation
                            },
                            {
                                router: "/MATCH_SERVER/friendMatch/发送邀请",
                                function: this.handleMatchInvitation
                            },
                            {
                                router: "/MATCH_SERVER/friendMatch/取消邀请",
                                function: this.handleCancelMatchInvitation
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