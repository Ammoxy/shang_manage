 const BaseURL = "https://shang.fengniaotuangou.cn"
// const BaseURL = "http://192.168.0.111"

const url = {
	// 登录
	'Login': BaseURL + '/login', // 登录
	'Logout': BaseURL + '/logout', // 退出

	'CreateUser': BaseURL + '/create/user', // 创建用户
	'Users': BaseURL + '/users', // 获取用户列表

	'Merchants': BaseURL + '/merchant/list', // 获取商家列表
	'CreateMerchants': BaseURL + '/creation/merchant', // 新增商家
	'Merchant': BaseURL + '/merchant', // 获取商家详情/删除商家

	'Goods': BaseURL + '/good/list', // 获取商品列表
	'CreateGoods': BaseURL + '/creation/good', // 新增商品
	'Good': BaseURL + '/good', // 获取商品详情/删除商品

	'Banners': BaseURL + '/banner/list', // 获取轮播图列表
	'CreateBanners': BaseURL + '/creation/banner', // 新增轮播图
	'DelBanner': BaseURL + '/banner', // 删除轮播图


	'Orders': BaseURL + '/order/list', // 订单列表
}

module.exports = url;