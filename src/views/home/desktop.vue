<template>
  <div v-loading="loading" element-loading-text="拼命加载中">
    <div class="handle-box">
      <div class="btn">
        <el-button type="primary" size="medium" icon="el-icon-circle-plus-outline" @click="addUser">添加用户</el-button>
      </div>
    </div>

    <!-- 表格数据 -->
    <el-table :data="tableData" empty-text="暂无数据" border :header-cell-style="{background:'#f5f7fa'}" max-height="620">
      <el-table-column prop="id" label="ID">
      </el-table-column>
      <el-table-column prop="name" label="用户名">
      </el-table-column>
      <el-table-column prop="enable" label="状态">
        <template slot-scope="scope">
          <span v-text="scope.row.enable == '1' ? '启用' : '禁用'"></span>
        </template>
      </el-table-column>
      <el-table-column prop="created_at" label="创建时间">
      </el-table-column>
      <el-table-column label="操作" width="300px">
        <template slot-scope="scope">
          <el-button type="danger" icon="el-icon-delete" size="mini" @click="handleDel(scope.$index, scope.row)"></el-button>
        </template>
      </el-table-column>
    </el-table>

    <div class="block">
      <el-pagination @current-change="currentChange" :current-page.sync="current" :page-sizes="[10, 20, 30, 40, 50]"
        :page-size="size" layout="sizes, prev, pager, next, jumper" :total="total" @size-change="sizeChange">
      </el-pagination>
    </div>

    <!-- 添加用户 -->
    <el-dialog title="添加用户" :visible.sync="dialogUser" width="500px">
      <div class="box">
        <el-form :model="userInfo" label-width="80px">
          <el-form-item label="用户名">
            <el-input v-model="userInfo.username"></el-input>
          </el-form-item>
          <el-form-item label="密码">
            <el-input v-model="userInfo.password" type="password"></el-input>
          </el-form-item>
          <el-form-item label="选择状态">
            <el-select v-model="userInfo.enable" placeholder="请选择状态">
              <el-option v-for="item in stateList" :key="item.value" :label="item.label" :value="item.value">
              </el-option>
            </el-select>
          </el-form-item>
          <div class="submit">
            <el-form-item>
              <el-button type="primary" @click="newUser">提交</el-button>
            </el-form-item>
          </div>
        </el-form>
      </div>
    </el-dialog>

    <!-- 删除用户 -->
    <el-dialog :visible.sync="dialogDel" title="删除用户" width="20%" align="center" :close-on-click-modal="false">
      <div style="font-size: 20px; margin-bottom: 30px;">是否删除该用户</div>
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
  require("echarts");

  export default {
    inject: ["reload"],

    data() {
      return {
        loading: true,
        tableData: [],
        current: 1, // 全部 分页
        size: 10,
        total: 0,
        userInfo: {
          username: '',
          password: '',
          enable: ''
        },
        dialogUser: false,
        stateList: [{
            label: "启用",
            value: 1,
          },
          {
            label: "禁用",
            value: 2,
          },
        ],
        dialogDel: false,
        id: ''
      };
    },
    mounted() {
      this.getUser();
    },
    methods: {
      // 刷新
      // refresh() {
      //   this.reload();
      // },

      // 获取用户
      getUser() {
        let self = this;
        API.users(self.current, self.size).then(res => {
          console.log(res);
          self.loading = false;
          self.tableData = res.data;
          self.total = res.total;
        }).catch(err => {
          self.loading = false;
        })
      },

      currentChange(val) {
        let self = this;
        self.loading = true;
        self.current = val;
        API.users(val, self.size).then(res => {
          console.log(res);
          self.loading = false;
          self.tableData = res.data;
          self.total = res.total;
        }).catch(err => {
          self.loading = false;
        })
      },
      sizeChange(val) {
        let self = this;
        self.loading = true;
        self.size = val;
        API.users(self.current, val).then(res => {
          console.log(res);
          self.loading = false;
          self.tableData = res.data;
          self.total = res.total;
        }).catch(err => {
          self.loading = false;
        })
      },

      // 添加用户
      addUser() {
        let self = this;
        self.dialogUser = true;
      },
      newUser() {
        let self = this;
        console.log(self.userInfo);
        API.createUser(self.userInfo).then(res => {
          self.dialogUser = false;
        })
      },

      handleDel(index, row) {
        let self = this;
        self.dialogDel = true;
        self.id = row.id;
      },
      toDel() {
        let self = this;
        API.DelUsers(self.id).then(res => {
          self.dialogDel = false;
          self.$message.success("删除成功");
          self.getUser();
        })
      },

    },
  };
</script>

<style lang="scss" scoped>

</style>