<template>
    <div v-loading="loading" element-loading-text="拼命加载中">
        <div class="handle-box">
            <div class="btn">
                <el-button type="primary" @click="addMerchants">添加商品</el-button>
            </div>
            <div class="btn">
                <el-input v-model="keyword" placeholder="请输入商品名称" class="input-with-select"
                    @keyup.enter.native="search(keyword)">
                    <el-button slot="append" icon="el-icon-search" @click="search(keyword)"></el-button>
                </el-input>
            </div>
        </div>

        <el-dialog :visible.sync="dialogMerchants" title="添加商品" @close="close" width="1000px">
            <el-form label-width="80px" :model="merchantInfo">
                <el-form-item label="选择商家">
                    <el-select v-model="merchantInfo.merchant_id" placeholder="请选择商家" @change="merchantChange">
                        <el-option v-for="item in merchantList" :key="item.id" :label="item.name" :value="item.id">
                        </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="是否上架">
                    <el-select v-model="merchantInfo.on_shelf" placeholder="请选择状态" @change="stateChange">
                        <el-option v-for="item in stateList" :key="item.id" :label="item.label" :value="item.value">
                        </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="总价格">
                    <el-input v-model="merchantInfo.total_price"></el-input>
                </el-form-item>
                <el-form-item label="优惠价">
                    <el-input v-model="merchantInfo.reduced_price"></el-input>
                </el-form-item>
                <el-form-item label="商品库存">
                    <el-input v-model="merchantInfo.repertory"></el-input>
                </el-form-item>
                <el-form-item label="商品销量">
                    <el-input v-model="merchantInfo.sales"></el-input>
                </el-form-item>
                <el-form-item label="商品名称">
                    <el-input v-model="merchantInfo.name"></el-input>
                </el-form-item>
                <el-form-item label="商品简介">
                    <el-input v-model="merchantInfo.intro"></el-input>
                </el-form-item>
                <el-form-item label="商品图片">
                    <el-upload action="https://api.fengniaotuangou.cn/api/upload" ref="upload" :limit="1"
                        :before-upload="beforeAvatarUpload" :on-success="handleAvatarSuccess" :on-remove="handleRemove"
                        :file-list='files' :on-exceed="handleExceed" list-type="picture-card" :on-change="handleChange"
                        :auto-upload="true">
                        <i slot="default" class="el-icon-plus"></i>
                    </el-upload>
                </el-form-item>
                <el-form-item label="批量上传详情图片">
                    <el-upload action="https://api.fengniaotuangou.cn/api/upload" ref="upload" :limit="9"
                        :before-upload="beforeAvatarUpload1" :on-remove="handleRemove1" :on-exceed="handleExceed1"
                        :auto-upload="true" :on-change="handleChange1" multiple list-type="picture-card"
                        :file-list='fileLists' :on-success="handleAvatarSuccess1">
                        <i slot="default" class="el-icon-plus"></i>
                    </el-upload>
                </el-form-item>
                <el-form-item label="商品详情">
                    <quill-editor ref="myQuillEditor" v-model="merchantInfo.detail" :options="editorOption"
                        style="height:430px;margin:0 0 60px 0;"></quill-editor>
                    <el-upload class="avatar-uploader quill-img" action="https://api.fengniaotuangou.cn/api/upload"
                        :before-upload="beforeUpload" :on-success="quillImgSuccess" style="display: none">
                        <el-button size="small" type="primary" id="imgInput" element-loading-text="插入中,请稍候">点击上传
                        </el-button>
                    </el-upload>
                </el-form-item>
                <div class="submit">
                    <el-form-item>
                        <el-button type="primary" @click="newMerchants">提交</el-button>
                    </el-form-item>
                </div>
            </el-form>
        </el-dialog>

        <!-- 表格数据 -->
        <el-table :data="tableData" empty-text="暂无数据" border :header-cell-style="{ background: '#f5f7fa' }"
            max-height="620">
            <el-table-column prop="id" label="商品ID" width="70"></el-table-column>
            <el-table-column prop="merchant" label="商家名称"></el-table-column>
            <el-table-column prop="name" label="商品名称"></el-table-column>
            <el-table-column prop="img" label="商家logo">
                <template slot-scope="scope">
                    <img :src="scope.row.img" style="max-width:180px;max-height:80px;" />
                </template>
            </el-table-column>
            <el-table-column prop="total_price" label="商品总价格" width="70"></el-table-column>
            <el-table-column prop="reduced_price" label="商品优惠价" width="70"></el-table-column>
            <el-table-column prop="on_shelf" label="是否上架" width="70">
                <template slot-scope="scope">
                    <div v-if="scope.row.on_shelf == 1">
                        <span>是</span>
                    </div>
                    <div v-if="scope.row.on_shelf == 2">
                        <span>否</span>
                    </div>
                </template>
            </el-table-column>
            <el-table-column prop="repertory" label="库存" width="70"></el-table-column>
            <el-table-column prop="sales" label="销量" width="70"></el-table-column>
            <el-table-column prop="created_at" label="创建时间"></el-table-column>
            <el-table-column label="操作" width="300px">
                <template slot-scope="scope">
                    <el-button type="primary" icon="el-icon-edit" size="mini"
                        @click="handleDetail(scope.$index, scope.row)">
                    </el-button>
                    <!-- <el-button type="danger" icon="el-icon-delete" size="mini"
                        @click="handleDel(scope.$index, scope.row)">
                    </el-button> -->
                </template>
            </el-table-column>
        </el-table>

        <!-- 分页 -->
        <div class="block">
            <el-pagination @current-change="currentChange" :current-page.sync="current"
                :page-sizes="[10, 20, 30, 40, 50]" :page-size="size" layout="sizes, prev, pager, next, jumper"
                :total="total" @size-change="sizeChange">
            </el-pagination>
        </div>

        <!-- 删除提示框 -->
        <!-- <el-dialog :visible.sync="dialogDel" title="删除商家" width="20%" align="center" :close-on-click-modal="false">
            <div style="font-size: 20px; margin-bottom: 30px">是否删除该商家</div>
            <span>
                <el-button type="primary" @click="toDel">删除</el-button>
                <el-button type="danger" @click="dialogDel = false">取消</el-button>
            </span>
        </el-dialog> -->
    </div>
</template>

<script>
    import API from "@/api/index.js";
    import {
        log
    } from "util";
    import md5 from "blueimp-md5";
    import {
        quillEditor
    } from "vue-quill-editor";
    import "quill/dist/quill.core.css";
    import "quill/dist/quill.snow.css";
    import "quill/dist/quill.bubble.css";
    let loading;
    export default {
        inject: ["reload"],
        components: {
            quillEditor,
        },
        data() {
            return {
                loading: true,

                tableData: [], // 表格数据
                current: 1, // 分页
                size: 10,
                total: 0,

                id: "", // 删除id
                dialogDel: false,
                dialogMerchants: false,
                editorOption: {
                    placeholder: "请输入文档内容",
                    theme: "snow",
                    modules: {
                        toolbar: {
                            container: [
                                ["bold", "italic", "underline", "strike"],
                                ["blockquote", "code-block"],
                                [{
                                    direction: "rtl",
                                }, ],
                                [{
                                    size: ["small", false, "large", "huge"],
                                }, ],
                                [{
                                    header: [1, 2, 3, 4, 5, 6, false],
                                }, ],
                                [{
                                        color: [],
                                    },
                                    {
                                        background: [],
                                    },
                                ],
                                [{
                                    font: [],
                                }, ],
                                [{
                                    align: [],
                                }, ],
                                ["clean"],
                                ["link", "image"],
                            ],
                            handlers: {
                                image: function (value) {
                                    if (value) {
                                        document.querySelector(".quill-img input").click();
                                    } else {
                                        this.quill.format("image", false);
                                    }
                                },
                            },
                        },
                    },
                },
                merchantInfo: {
                    merchant_id: '',
                    name: '',
                    intro: '',
                    detail: '',
                    img: '',
                    imgs: [],
                    total_price: '',
                    reduced_price: '',
                    on_shelf: '',
                    repertory: '',
                    id: '',
                    sales: 0
                },
                merchantList: [],
                name: '',
                stateList: [{
                        value: 1,
                        label: '是'
                    },
                    {
                        value: 2,
                        label: '否'
                    }
                ],
                state: '',
                keyword: '',
                fileLists: [],
                files: []
            };
        },
        mounted() {
            this.getList();
            this.getMerList();
        },
        methods: {
            // 表格数据
            getMerList() {
                var self = this;
                API.merchants(1, 100).then(res => {
                    self.merchantList = res.data;
                })
            },
            getList() {
                var self = this;
                API.goods(self.current, self.size).then(res => {
                    self.loading = false;
                    self.tableData = res.data;
                    self.total = res.total;
                }).catch(err => {
                    self.loading = false;
                })
            },
            search() {
                var self = this;
                API.goods(self.current, self.size, self.keyword).then((res) => {
                    self.loading = false;
                    self.tableData = res.data;
                    self.total = res.total;
                }).catch(err => {
                    self.loading = false;
                })
            },
            // 分页
            currentChange(val) {
                var self = this;
                self.current = val;
                self.loading = true;
                if (self.name) {
                    API.goods(val, self.size, self.keyword).then((res) => {
                        self.loading = false;
                        self.tableData = res.data;
                        self.total = res.total;
                    }).catch(err => {
                        self.loading = false;
                    })
                } else {
                    API.goods(val, self.size).then(res => {
                        self.loading = false;
                        self.tableData = res.data;
                        self.total = res.total;
                    }).catch(err => {
                        self.loading = false;
                    })
                }
            },
            // 每页几条
            sizeChange(val) {
                var self = this;
                self.size = val;
                self.loading = true;
                if (self.name) {
                    API.goods(self.current, val, self.keyword).then((res) => {
                        self.loading = false;
                        self.tableData = res.data;
                        self.total = res.total;
                    }).catch(err => {
                        self.loading = false;
                    })
                } else {
                    API.goods(self.current, val).then(res => {
                        self.loading = false;
                        self.tableData = res.data;
                        self.total = res.total;
                    }).catch(err => {
                        self.loading = false;
                    })
                }
            },

            addMerchants() {
                var self = this;
                self.dialogMerchants = true;
                self.merchantInfo = {
                    merchant_id: '',
                    name: '',
                    intro: '',
                    detail: '',
                    img: '',
                    imgs: [],
                    total_price: '',
                    reduced_price: '',
                    on_shelf: '',
                    repertory: '',
                    id: '',
                    sales: 0
                };
                if (self.$refs.upload) {
                    self.$refs.upload.clearFiles();
                }
            },
            merchantChange(val) {
                var self = this;
                self.merchantInfo.merchant_id = val;
            },

            stateChange(val) {
                var self = this;
                self.merchantInfo.on_shelf = val;
            },

            newMerchants() {
                var self = this;
                console.log(self.merchantInfo);
                API.createGoods(self.merchantInfo).then(res => {
                    self.$message.success("添加成功");
                    self.dialogMerchants = false;
                    self.merchantInfo = {
                        merchant_id: '',
                        name: '',
                        intro: '',
                        detail: '',
                        img: '',
                        imgs: [],
                        total_price: '',
                        reduced_price: '',
                        on_shelf: '',
                        repertory: '',
                        id: '',
                        sales: 0
                    };
                    self.getList();
                })
            },

            // 富文本选择图片时的事件
            beforeUpload() {
                // 显示加载动画
                loading = this.$loading({
                    lock: true,
                    text: "图片上传中",
                    spinner: "el-icon-loading",
                    background: "rgba(0, 0, 0, 0.7)",
                });
            },
            // 富文本插入图片时上传图片
            quillImgSuccess(res, file) {
                let quill = this.$refs.myQuillEditor.quill;
                // 关闭动画
                loading.close();
                if (res.data) {
                    let length = quill.getSelection().index;
                    quill.insertEmbed(length, "image", res.data);
                    quill.setSelection(length + 1);
                } else {
                    this.$message.error("图片插入失败");
                }
            },
            handleRemove(file, fileList) {
                //移除图片
                var self = this;
                self.files = fileList
                self.merchantInfo.img = ''
            },
            beforeAvatarUpload(file) {
                //文件上传之前调用做一些拦截限制
                // const isLt2M = file.size / 1024 / 1024 < 2;
                // if (!isLt2M) {
                //     this.$message.error("上传图片大小不能超过 2MB!");
                // }
                const isLt2M = 300 * 1024;
                if (!isLt2M) {
                    this.$message.error("上传图片大小不能超过300KB");
                }
                return isLt2M;
            },
            handleAvatarSuccess(res, file) {
                //图片上传成功
                var self = this;
                self.merchantInfo.img = file.response.data;
            },
            handleExceed(files, fileList) {
                //图片上传超过数量限制
                var self = this;
                self.$message.error("上传图片不能超过1张!");
            },

            handleChange(file, fileList) {
                var self = this;
                self.files = fileList;
            },

            handleRemove1(file, fileList) {
                //移除图片
                var self = this;

                console.log(file);
                self.fileLists = fileList
                self.merchantInfo.imgs.splice(self.merchantInfo.imgs.indexOf(file.url), 1)
                console.log(self.merchantInfo.imgs);
                self.hasNewImage1 = false;
            },
            beforeAvatarUpload1(file) {
                //文件上传之前调用做一些拦截限制

                if (this.fileLists.length > 9) {
                    this.$message.error('最多只能上传9张图片')
                }
                const isLt500K = file.size / 1024 < 500
                if (!isLt500K) {
                    this.$message.error('上传产品图片大小不能超过 500K!')
                }
                return isLt500K && this.fileLists.length <= 9
            },
            handleAvatarSuccess1(res, file) {
                //图片上传成功
                var self = this;
                self.merchantInfo.imgs.push(file.response.data);
            },
            handleExceed1(files, fileList) {
                //图片上传超过数量限制
                var self = this;
                self.$message.error("上传图片不能超过9张!");
            },

            handleChange1(file, fileList) {
                var self = this;
                self.fileLists = fileList;
            },

            // 删除
            // handleDel(index, row) {
            //     var self = this;
            //     self.dialogDel = true;
            //     self.id = row.id;
            // },
            // toDel() {
            //     var self = this;
            //     API.DelMerchant(self.id).then(res => {
            //         if (res.code == 10004) {
            //             self.$message.success(res.toast);
            //         } else {
            //             self.$message.success("删除成功");
            //             self.dialogDel = false;
            //             self.getList();
            //         }
            //     })
            // },
            handleDetail(index, row) {
                var self = this;
                self.dialogMerchants = true;
                self.id = row.id;
                API.goodsDetails(self.id).then(res => {
                    self.merchantInfo = {
                        merchant_id: res.merchant_id,
                        name: res.name,
                        intro: res.intro,
                        detail: res.detail,
                        img: res.img,
                        imgs: res.imgs,
                        total_price: res.total_price,
                        reduced_price: res.reduced_price,
                        on_shelf: res.on_shelf,
                        repertory: res.repertory,
                        id: res.id,
                        sales: res.sales
                    }
                    self.fileLists = self.merchantInfo.imgs.map(t => {
                        var obj = {};
                        obj.url = t;
                        return obj;
                    })

                    let urlStr = self.merchantInfo.img.split(",");
                    urlStr.forEach(item => {
                        let obj = new Object();
                        obj.url = item;
                        self.files.push(obj);
                    });
                })
            },

            close() {
                var self = this;
                self.fileLists = [];
                self.files = [];
            },
        },
    };
</script>

<style>
</style>

<style scoped>
    .service {
        display: flex;
        flex-wrap: wrap;
    }

    .service-item {
        margin: 10px;
        padding: 0 10px;
    }

    .upload-btn {
        margin-top: 10px;
    }

    .up-img {
        display: inline-block;
        margin: 10px;
    }

    .pic-box {
        max-width: 100%;
        height: 200px;
    }

    .auto-img {
        max-width: 100%;
        height: 100px;
        margin: 10px 0 10px 10px;
    }

    .tips {
        margin-bottom: 20px;
        color: red;
    }

    .bi {
        display: inline;
    }

    .wth {
        width: 100px;
    }
</style>