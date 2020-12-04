<template>
	<div>
		<div class="header">
			<div class="logo">
				<img src="../../assets/image/logo.png" alt="">
			</div>
			<div class="title">
				<span>商城后台管理</span>
			</div>
			<!-- 折叠按钮 -->
			<div class="collapse-btn" @click="collapseChage">
				<i v-if="!collapse" class="el-icon-s-unfold icon"></i>
				<i v-else class="el-icon-s-fold icon"></i>
			</div>
			<div class="breadcrumb">
				<el-breadcrumb separator="/">
					<transition-group name="breadcrumb">
						<!-- 防止面包屑导航出现 首页/首页， v-if="route.name!='home'" -->
						<template v-for="(route,i) in crumbList">
							<el-breadcrumb-item :key="route.name" :to="{name:route.name}" v-if="route.name!='home' && route.meta.title!='首页'"
							 :class="{'is-last-link':i==crumbList.length-1}">
								{{route.meta.title}}
							</el-breadcrumb-item>
						</template>
					</transition-group>
				</el-breadcrumb>
			</div>
			<!-- 个人中心 -->
			<div class="info">
				<el-dropdown @command="handleCommand">
					<span class="el-dropdown-link">
						{{username}}
						<i class="el-icon-caret-bottom"></i>
					</span>
					<el-dropdown-menu slot="dropdown">
						<el-dropdown-item divided command="loginout">切换账号</el-dropdown-item>
						<el-dropdown-item divided command="resetPassword">修改密码</el-dropdown-item>
					</el-dropdown-menu>
				</el-dropdown>
			</div>
			<div class="logout">
				<el-button icon="el-icon-circle-close" @click="logout" size="mini" type="infor">退出</el-button>
			</div>
		</div>

		<el-dialog title="修改密码" :visible.sync="dialogResetPassWord" width="500px" :close-on-click-modal="false">
			<div class="box">
				<el-form :model="pwdForm" label-width="120px">
					<el-form-item label="旧密码">
						<el-input v-model="pwdForm.old_password"></el-input>
					</el-form-item>
					<el-form-item label="新密码">
						<el-input v-model="pwdForm.new_password"></el-input>
					</el-form-item>
					<el-form-item label="再次确认新密码">
						<el-input v-model="pwdForm.confirm_password"></el-input>
					</el-form-item>
					<div class="submit">
						<el-form-item>
							<el-button type="primary" @click="ChangePassword">提交</el-button>
						</el-form-item>
					</div>
				</el-form>
			</div>
		</el-dialog>
	</div>

</template>

<script>
	import bus from './bus'
	import API from '@/api/login.js'
	import {
		mapState
	} from 'vuex'

	export default {
		data() {
			return {
				dialogResetPassWord: false,
				pwdForm: {
					new_password: '',
					old_password: '',
					confirm_password: ''
				},
				username: localStorage.getItem('username')
			}
		},
		computed: {
			...mapState(['collapse', 'crumbList'])
		},
		methods: {
			handleCommand(command) {
				var self = this;
				if (command == 'loginout') {
					API.logout().then(res => {
						localStorage.removeItem('username')
						localStorage.removeItem('token')
						localStorage.removeItem('role')
						localStorage.removeItem('permissions')
						window.location.reload()
						self.$router.replace('/login')
					})
				}
				if (command == 'resetPassword') {
					self.dialogResetPassWord = true;
				}
			},
			ChangePassword() {
				var self = this;
				if(self.pwdForm.new_password === self.pwdForm.confirm_password) {
					API.resetPassword(self.pwdForm).then(res => {
						self.dialogResetPassWord = false;
						self.$message.success('修改成功');
						self.pwdForm = {};
					})
				} else {
					self.$message.error('新密码与确认密码不一致');
				}
			},
			collapseChage() {
				this.$store.commit('collapseChage')
			},
			logout() {
				var self = this;
				API.logout().then(res => {
					localStorage.removeItem('username')
					localStorage.removeItem('token')
					localStorage.removeItem('role')
					localStorage.removeItem('permissions')
					window.location.reload()
					self.$router.replace('/login')
				})
			}
		}
	}
</script>

<style lang="scss" scoped>
	.header {
		position: fixed;
		top: 0;
		right: 0;
		left: 0;
		height: 50px;
		font-size: 20px;
		// background-image: linear-gradient(to right, #4CA1AF , #4CA1AF);
		background: #2a9f93;
		color: #fff;
		z-index: 100;
	}
	
	.logo {
		position: absolute;
		top: 15px;
		left: 15px;
	}
	
	.logo img {
		width: 20px;
		height: 20px;
		border-radius: 5px;
	}

	.title {
		height: 50px;
		line-height: 50px;
		margin-left: 45px;
		font-size: 18px;
	}

	.collapse-btn {
		position: absolute;
		top: 15px;
		left: 210px;
		background: rgba(255, 255, 255, .1);

	}

	.collapse-btn .icon,
	.logout .icon {
		font-size: 20px;
		cursor: pointer;
	}

	.breadcrumb {
		position: absolute;
		top: 18px;
		left: 230px;
		margin-left: 10px;
		// height: 50px;
		// line-height: 50px;
	}

	.info {
		position: absolute;
		top: 15px;
		right: 80px;
		border-right: 1px #fff solid;
		padding-right: 10px;

		.el-dropdown-link {
			font-size: 20px;
			color: #fff;
		}
	}

	.logout {
		position: absolute;
		top: 12px;
		right: 10px;
	}
</style>
