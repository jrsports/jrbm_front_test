<template>
    <el-container>
        <el-dialog :visible.sync="dialogVisible" width="500px">
            <el-form ref="addOfferForm" :model="addOfferForm" label-width="100px">
                <el-form-item
                        v-for="(offer, index) in addOfferForm.detail"
                        :label="'第' + (index+1)+'年'"
                        :key="index"
                >
                    <el-input-number v-model="offer.salary" @change="calculateTotalSalary" :min="0"
                                     :max="5000" label="当年薪资"
                                     style="width: 200px;margin-right:10px"></el-input-number>
                    <el-button v-if="index>0" @click.prevent="removeOffer(offer)">删除</el-button>
                </el-form-item>
                <el-form-item>
                    <el-button type="primary" @click="confirm" :loading="addOfferLoading">报价
                    </el-button>
                    <el-button v-if="addYearBtnVisible" @click="addOff">新增一年</el-button>
                </el-form-item>
            </el-form>
        </el-dialog>


    </el-container>
</template>

<script>

    export default {
        name: "OfferDialog",
        data() {
            return {
                dialogVisible: false,
                addOfferForm: {
                    totalYear: 1,
                    totalSalary: 0,
                    detail: [
                        {
                            salary: 0
                        }
                    ],
                },
                addYearBtnVisible: true,
                addOfferLoading: false,
                confirmFunc:function () {
                    alert("no confirm func");
                }
            }
        },
        methods: {
            show(confirmFunc) {
                this.confirmFunc = confirmFunc;
                this.dialogVisible=true;
            },
            confirm() {
                this.confirmFunc(this.addOfferForm);
                this.dialogVisible=false;
            },
            removeOffer(item) {
                const index = this.addOfferForm.detail.indexOf(item);
                this.addOfferForm.totalYear--;
                this.addOfferForm.detail.splice(index, 1)
                this.calculateTotalSalary();
                this.addYearBtnVisible = true;
            },
            addOff() {
                if (++this.addOfferForm.totalYear === 5) {
                    this.addYearBtnVisible = false;
                }
                this.addOfferForm.detail.push({
                    // season: this.addOfferForm.totalYear,
                    salary: 0
                });
                this.calculateTotalSalary()
            },
            calculateTotalSalary() {
                let total = 0;
                this.addOfferForm.detail.forEach(function (item) {
                    total += item.salary;
                });
                this.addOfferForm.totalSalary = total;
            }
        }
    }

</script>

<style scoped>

</style>