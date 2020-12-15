<template>
    <div v-loading="loading" element-loading-text="拼命加载中">
        <div class="handle-box">
            <div class="btn">
                <span>商家:</span>
                <el-select v-model="merchant" placeholder="请选择商家" @change="changeMerchant">
                    <el-option v-for="item in merchantList" :key="item.id" :label="item.name" :value="item.id">
                    </el-option>
                </el-select>
            </div>
            <div class="btn">
                <span>商品:</span>
                <el-select v-model="commodity" placeholder="请选择商品" @change="changeCommodity">
                    <el-option v-for="item in commodityList" :key="item.id" :label="item.name" :value="item.id">
                    </el-option>
                </el-select>
                <el-button slot="append" icon="el-icon-search" @click="search"></el-button>
            </div>
        </div>
        <!-- 表格数据 -->
        <el-table :data="tableData" empty-text="暂无数据" border :header-cell-style="{background:'#f5f7fa'}"
            max-height="620">
            <el-table-column prop="user_id" label="用户ID">
            </el-table-column>
            <el-table-column prop="no" label="订单号" width="180px">
            </el-table-column>
            <el-table-column prop="goodName" label="商品名称">
            </el-table-column>
            <el-table-column prop="count" label="商品数量">
            </el-table-column>
            <el-table-column prop="userName" label="用户名">
            </el-table-column>
            <el-table-column prop="studentName" label="学生姓名">
            </el-table-column>
            <el-table-column prop="total_money" label="总金额">
            </el-table-column>
            <el-table-column prop="paid_money" label="已付金额">
            </el-table-column>
            <el-table-column prop="refund_money" label="退还金额">
            </el-table-column>
            <el-table-column prop="real_money" label="实付金额">
            </el-table-column>
            <el-table-column prop="status" label="状态">
                <template slot-scope="scope">
                    <span v-if="scope.row.status == 1">提交</span>
                    <span v-else-if="scope.row.status == 2">已付款</span>
                    <span v-else-if="scope.row.status == 3">无效</span>
                    <span v-else-if="scope.row.status == 4">退款</span>
                </template>
            </el-table-column>
            <el-table-column prop="created_at" label="创建时间" width="180px">
            </el-table-column>
            <!-- <el-table-column label="操作" width="300px">
                <template slot-scope="scope">
                    <el-button type="danger" size="mini" @click="handleDel(scope.$index, scope.row)">删除</el-button>
                </template>
            </el-table-column> -->
        </el-table>

        <div class="block">
            <el-pagination @current-change="currentChange" :current-page.sync="current"
                :page-sizes="[10, 20, 30, 40, 50]" :page-size="size" layout="sizes, prev, pager, next, jumper"
                :total="total" @size-change="sizeChange">
            </el-pagination>
        </div>
    </div>
</template>

<script>
    import API from "@/api/index.js";

    export default {
        data() {
            return {
                loading: true,
                tableData: [],
                current: 1, // 全部 分页
                size: 10,
                total: 0,
                state: "",
                merchant: '',
                merchant_id: '',
                goods_id: '',
                merchantList: [],
                commodity: '',
                commodityList: [],
            };
        },
        mounted() {
            this.getOrder(this.current, this.size);
            this.getGoods();
            this.getMerchant();
        },
        methods: {
            getOrder(cur, list, merchant_id, goods_id) {
                let self = this;
                API.orders(cur, list, merchant_id, goods_id).then(res => {
                    self.loading = false;
                    self.tableData = res.data;
                    self.total = res.total;
                }).catch(err => {
                    self.loading = false;
                })
            },
            currentChange(val) {
                let self = this;
                self.current = val;
                self.loading = true;
                if (self.merchant_id && self.goods_id) {
                    self.getOrder(val, self.size, self.merchant_id, self.goods_id);
                } else {
                    self.getOrder(val, self.size);
                }
            },
            sizeChange(val) {
                let self = this;
                self.size = val;
                self.current = 1;
                self.loading = true;
                if (self.merchant_id && self.goods_id) {
                    self.getOrder(1, val, self.merchant_id, self.goods_id);
                } else {
                    self.getOrder(1, val);
                }
            },
            getGoods() {
                var self = this;
                API.goods(1, 100).then(res => {
                    self.commodityList = res.data;
                })
            },
            getMerchant() {
                var self = this;
                API.merchants(1, 100).then(res => {
                    self.merchantList = res.data;
                })
            },
            changeMerchant(val) {
                var self = this;
                self.merchant_id = val;
            },
            changeCommodity(val) {
                var self = this;
                self.goods_id = val;
            },
            search() {
                var self = this;
                self.loading = true;
                self.current = 1;
                self.getOrder(self.current, self.size, self.merchant_id, self.goods_id);
            },

        },
    }
</script>

<style lang="scss" scoped>

</style>