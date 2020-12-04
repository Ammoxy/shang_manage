<template>
  <div v-loading="loading" element-loading-text="拼命加载中">
    <div class="handle-box">
      <div class="btn">
        <el-button type="primary" @click="addMerchants">添加商家</el-button>
      </div>
      <div class="btn">
        <el-input v-model="name" placeholder="请输入商家名称" class="input-with-select" @keyup.enter.native="search(name)">
          <el-button slot="append" icon="el-icon-search" @click="search(name)"></el-button>
        </el-input>
      </div>
    </div>
    <el-dialog :visible.sync="dialogMerchants" title="添加商家" @close="close" width="1000px">
      <el-form label-width="80px" :model="merchantInfo">
        <el-form-item label="商家名称">
          <el-input v-model="merchantInfo.name"></el-input>
        </el-form-item>
        <el-form-item label="商家简介">
          <el-input v-model="merchantInfo.intro"></el-input>
        </el-form-item>
        <el-form-item label="商家地址">
          <el-input v-model="merchantInfo.address"></el-input>
        </el-form-item>
        <el-form-item label="商家logo">
          <el-upload action="https://api.fengniaotuangou.cn/api/upload" ref="upload" :limit="1"
            :before-upload="beforeAvatarUpload" :on-success="handleAvatarSuccess" :on-remove="handleRemove"
            :on-exceed="handleExceed" :auto-upload="true" :on-change="handleChange" list-type="picture-card"
            :file-list='files'>
            <i slot="default" class="el-icon-plus"></i>
          </el-upload>
        </el-form-item>
        <el-form-item label="批量上传详情图片">
          <el-upload action="https://api.fengniaotuangou.cn/api/upload" ref="upload" :limit="9"
            :before-upload="beforeAvatarUpload1" :on-remove="handleRemove1" :on-exceed="handleExceed1"
            :auto-upload="true" :on-change="handleChange1" multiple list-type="picture-card" :file-list='fileLists'
            :on-success="handleAvatarSuccess1">
            <i slot="default" class="el-icon-plus"></i>
          </el-upload>
        </el-form-item>
        <el-form-item label="商家详情">
          <quill-editor ref="myQuillEditor" v-model="merchantInfo.detail" :options="editorOption"
            style="height:430px;margin:0 0 60px 0;"></quill-editor>
          <el-upload class="avatar-uploader quill-img" action="https://api.fengniaotuangou.cn/api/upload"
            :before-upload="beforeUpload" :on-success="quillImgSuccess" style="display: none">
            <el-button size="small" type="primary" id="imgInput" element-loading-text="插入中,请稍候">点击上传</el-button>
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
      <el-table-column prop="id" label="ID"></el-table-column>
      <el-table-column prop="name" label="商家名称"></el-table-column>
      <el-table-column prop="address" label="地址" width="180px"></el-table-column>
      <el-table-column prop="img" label="商家logo">
        <template slot-scope="scope">
          <img :src="scope.row.img" style="max-width:180px;max-height:80px;" />
        </template>
      </el-table-column>
      <el-table-column prop="created_at" label="创建时间"></el-table-column>
      <el-table-column label="操作" width="300px">
        <template slot-scope="scope">
          <el-button type="primary" icon="el-icon-edit" size="mini" @click="handleDetail(scope.$index, scope.row)">
          </el-button>
          <el-button type="danger" icon="el-icon-delete" size="mini" @click="handleDel(scope.$index, scope.row)">
          </el-button>
        </template>
      </el-table-column>
    </el-table>

    <!-- 分页 -->
    <div class="block">
      <el-pagination @current-change="currentChange" :current-page.sync="current" :page-sizes="[10, 20, 30, 40, 50]"
        :page-size="size" layout="sizes, prev, pager, next, jumper" :total="total" @size-change="sizeChange">
      </el-pagination>
    </div>

    <!-- 删除提示框 -->
    <el-dialog :visible.sync="dialogDel" title="删除商家" width="20%" align="center" :close-on-click-modal="false">
      <div style="font-size: 20px; margin-bottom: 30px">是否删除该商家</div>
      <span>
        <el-button type="primary" @click="toDel">删除</el-button>
        <el-button type="danger" @click="dialogDel = false">取消</el-button>
      </span>
    </el-dialog>
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
  import LoginVue from '../../../../../gzh/src/components/page/Login.vue';
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
          name: '',
          intro: '',
          detail: '',
          img: '',
          address: '',
          imgs: [],
          id: ''
        },
        name: '',
        fileLists: [],
        files: []
      };
    },
    mounted() {
      this.getList()
    },
    methods: {
      // 表格数据
      getList() {
        var self = this;
        API.merchants(self.current, self.size).then(res => {
          self.loading = false;
          self.tableData = res.data;
          self.total = res.total;
        }).catch(err => {
          self.loading = false;
        })
      },
      search() {
        var self = this;
        API.merchants(self.current, self.size, self.name).then((res) => {
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
          API.merchants(val, self.size, self.name).then((res) => {
            self.loading = false;
            self.tableData = res.data;
            self.total = res.total;
          }).catch(err => {
            self.loading = false;
          })
        } else {
          API.merchants(val, self.size).then(res => {
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
          API.merchants(self.current, val, self.name).then((res) => {
            self.loading = false;
            self.tableData = res.data;
            self.total = res.total;
          }).catch(err => {
            self.loading = false;
          })
        } else {
          API.merchants(self.current, val).then(res => {
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
        self.hasNewImage = false;
        self.hasNewImage1 = false;
        self.merchantInfo = {
          name: '',
          intro: '',
          detail: '',
          img: '',
          address: '',
          imgs: [],
          id: ''
        };
      },

      newMerchants() {
        var self = this;
        API.createMerchants(self.merchantInfo).then(res => {
          self.$message.success("提交成功");
          self.dialogMerchants = false;
          self.merchantInfo = {
            name: '',
            intro: '',
            detail: '',
            img: '',
            address: '',
            imgs: [],
            id: ''
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
        self.fileLists = fileList
        self.merchantInfo.imgs.splice(self.merchantInfo.imgs.indexOf(file.url), 1)
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
      handleDel(index, row) {
        var self = this;
        self.dialogDel = true;
        self.id = row.id;
      },
      toDel() {
        var self = this;
        API.DelMerchant(self.id).then(res => {
          self.$message.success("删除成功");
          self.dialogDel = false;
          self.getList();
        })
      },
      handleDetail(index, row) {
        var self = this;
        self.dialogMerchants = true;
        self.id = row.id;
        self.merchantInfo = {
          name: row.name,
          intro: row.intro,
          detail: row.detail,
          img: row.img,
          address: row.address,
          imgs: row.imgs,
          id: row.id
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
</style>