const dynamicRouter = [{
		path: '/merchant',
		name: 'merchant',
		component: () => import('@/views/merchant/merchant.vue'),
		meta: {
			title: '商家管理',
			icon: 'el-icon-s-custom'
		}
	},
	{
		path: '/index',
		name: 'index',
		component: () => import('@/views/goods/index.vue'),
		meta: {
			title: '商品管理',
			icon: 'el-icon-s-goods'
		},
		children: [{
			path: '/goods',
			name: 'goods',
			component: () => import('@/views/goods/goods.vue'),
			meta: {
				title: '商品列表'
			}
		}, {
			path: '/banner',
			name: 'banner',
			component: () => import('@/views/goods/banner.vue'),
			meta: {
				title: '轮播图管理'
			}
		}]
	},
	{
		path: '/order',
		name: 'order',
		component: () => import('@/views/order/order.vue'),
		meta: {
			title: '订单管理',
			icon: 'el-icon-s-order'
		}
	},
]

export default dynamicRouter