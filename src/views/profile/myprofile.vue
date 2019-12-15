<template>
    <el-container>
        <el-aside width="10%" style="background-color: rgb(238, 241, 246)">
            <sidebar></sidebar>
        </el-aside>
        <el-container>
            <el-header style="text-align: right; font-size: 12px">
                <el-dropdown>
                    <i class="el-icon-setting" style="margin-right: 15px"></i>
                    <el-dropdown-menu slot="dropdown">
                        <el-dropdown-item>查看</el-dropdown-item>
                        <el-dropdown-item>新增</el-dropdown-item>
                        <el-dropdown-item>删除</el-dropdown-item>
                    </el-dropdown-menu>
                </el-dropdown>
                <span>{{username}}</span>
            </el-header>

            <el-main>
                <el-button>退出球队</el-button>
            </el-main>
        </el-container>

    </el-container>
</template>

<script>
    import Sidebar from "@/views/layout/sidebar/sidebar";
    export default {
        name: "myprofile",
        data() {
            return{
                username:"未登录"
            }
        },
        components:{Sidebar}
    }
</script>

<style scoped>
    .el-header {
        background-color: #B3C0D1;
        color: #333;
        line-height: 60px;
    }
</style>