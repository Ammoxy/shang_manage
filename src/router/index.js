import Vue from 'vue'
import Router from 'vue-router'
import DynamicRouter from './dynamicRouter.js'

Vue.use(Router)

/* 初始路由 */
export default new Router({
	mode: 'history',
	routes: [{
		path: '/login',
		name: 'login',
		component: () => import('@/views/login.vue'),
		meta: {
			title: '登录'
		}
	}]
})

/* 准备动态添加的路由 */
export const DynamicRoutes = [{
		path: '',
		component: () => import('@/components/layout/Home.vue'),
		name: 'container',
		redirect: 'desktop',
		meta: {
			requiresAuth: true,
			title: '首页'
		},
		children: [{
				path: '/desktop',
				component: () => import('@/views/home/desktop.vue'),
				name: 'desktop',
				meta: {
					title: '首页',
					icon: 'el-icon-s-home'
				}
			}
		]
	},
	{
		path: '*',
		component: () => import('@/views/404.vue')
	}

]
