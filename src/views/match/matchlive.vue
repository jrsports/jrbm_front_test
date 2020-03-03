<template>
    <el-container>
        <el-header style="height: 50px;background-color: #B3C0D1;text-align: center">
            <h3>Koliday 98 : 88 cccTeam</h3>
        </el-header>
        <el-main>

            <ul class="infinite-list" style="height: 500px;">
                <li v-for="i in liveContent" :key="i" style="list-style-type:none;">{{ i }}</li>
            </ul>
            <el-table ref="statTable" :data="stats" :row-class-name="onCourt" highlight-current-row
                      @current-change="handleSubstitute">
                <el-table-column property="order" label="球员序号"></el-table-column>
                <el-table-column property="chname" label="姓名"></el-table-column>
                <el-table-column property="timeMinutes" label="上场时间"></el-table-column>
                <el-table-column property="score" label="得分"></el-table-column>
                <el-table-column property="rebound" label="篮板"></el-table-column>
                <el-table-column property="assist" label="助攻"></el-table-column>
                <el-table-column property="steal" label="抢断"></el-table-column>
                <el-table-column property="turnover" label="失误"></el-table-column>
                <el-table-column property="block" label="盖帽"></el-table-column>
                <el-table-column property="beBlocked" label="被盖"></el-table-column>
                <el-table-column property="foul" label="犯规"></el-table-column>
                <el-table-column property="totalAttempt" label="总出手数"></el-table-column>
                <el-table-column property="totalIn" label="总命中数"></el-table-column>
                <el-table-column property="threeAttempt" label="三分出手"></el-table-column>
                <el-table-column property="threeIn" label="三分命中"></el-table-column>
                <el-table-column property="freeThrowAttempt" label="罚球出手"></el-table-column>
                <el-table-column property="freeThrowIn" label="罚球命中"></el-table-column>


                <!--                <el-table-column label="进入游戏">-->
                <!--                    <template slot-scope="scope">-->
                <!--                        <el-button @click="getGamePage(scope.row)">进入游戏</el-button>-->
                <!--                    </template>-->

                <!--                </el-table-column>-->
            </el-table>
        </el-main>

    </el-container>
</template>

<script>
    export default {
        name: "matchlive",
        data() {
            return {

                scores: "",
                stats: [],
                matchStatsData: [],
                matchTime: "",
                homeTeamName: "",
                awayTeamName: "",
                matchCount: 0,
                ongoingPrompt: "匹配",
                playerIn: -1,
                playerOut: -1
            }
        }
    }
</script>

<style scoped>

</style>