import router, {
	DynamicRoutes
} from '@/router/index'
import {
	recursionRouter
} from '@/utils/recursion-router'
import dynamicRouter from '@/router/dynamicRouter'
import API from '@/api/login.js'

export default {
	namespaced: true,
	state: {
		permissionList: null /** 所有路由 */ ,
		sidebarMenu: [] /** 导航菜单 */ ,
		currentMenu: '' /** 当前active导航菜单 */ ,
		control_list: [] /** 完整的权限列表 */ ,
		permissions: []
	},
	getters: {},
	mutations: {
		SET_PERMISSION(state, routes) {
			state.permissionList = routes
		},
		CLEAR_PERMISSION(state) {
			state.permissionList = null
		},
		SET_MENU(state, menu) {
			state.sidebarMenu = menu
		},
		CLEAR_MENU(state) {
			state.sidebarMenu = []
		},
		SET_CURRENT_MENU(state, currentMenu) {
			state.currentMenu = currentMenu
		},
		SET_CONTROL_LIST(state, list) {
			state.control_list = list
		},
		SET_NICKNAME(state, nickname) {
			state.nickname = nickname
		},
		// SET_PERMISSIONS(state, permissions) {
		// 	state.permissions = permissions
		// },
	},

	actions: {
		// login({
		// 	commit
		// }, userInfo) {
		// 	API.login(userInfo).then(res => {
		// 		commit('SET_PERMISSIONS', res.permissions)
		// 		localStorage.setItem('username', userInfo.username);
		// 		localStorage.setItem('token', res.token);
		// 		router.replace('/')
		// 	})
		// },

		async FETCH_PERMISSION({
			commit,
			state
		}) {
			let token = localStorage.getItem('token');
			// var res = await API.userInfo(token)
			// localStorage.setItem('permissions', res.permissions);
			// console.log(res)
			// commit('SET_PERMISSIONS', res.permissions)
			let routes = recursionRouter([
				"merchant", // 商家管理
				"index",
				"goods",
				"banner",
				"order"
			], dynamicRouter)
			let MainContainer = DynamicRoutes.find(v => v.path === '')
			let children = MainContainer.children
			commit('SET_CONTROL_LIST', [...children, ...dynamicRouter])
			children.push(...routes)
			commit('SET_MENU', children)
			let initialRoutes = router.options.routes
			router.addRoutes(DynamicRoutes)
			commit('SET_PERMISSION', [...initialRoutes, ...DynamicRoutes])
		}
	}
}