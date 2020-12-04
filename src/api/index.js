import axios from '@/plugins/axios'
import url from './url.js'

var API = {};

// 创建用户
API.createUser = function (data) {
	return axios.post(url.CreateUser, data)
}
// 获取用户列表
API.users = function (page, limit) {
	return axios.get(url.Users, {
		page: page,
		limit: limit
	})
}
// 删除用户
API.DelUsers = function (id) {
	return axios.del(url.Users, {
		id: id
	})
}

// 获取商家列表
API.merchants = function (page, limit, name) {
	return axios.get(url.Merchants, {
		page: page,
		limit: limit,
		name: name
	})
}
// 新增商家
API.createMerchants = function (data) {
	return axios.post(url.CreateMerchants, data)
}
// 获取商家详情
API.merchantDetails = function (id) {
	return axios.get(url.Merchant, {
		id: id
	})
}
// 删除商家
API.DelMerchant = function (id) {
	return axios.del(url.Merchant, {
		id: id
	})
}

// 获取商品列表
API.goods = function (page, limit, name) {
	return axios.get(url.Goods, {
		page: page,
		limit: limit,
		name: name
	})
}
// 新增商品
API.createGoods = function (data) {
	return axios.post(url.CreateGoods, data)
}
// 获取商品详情
API.goodsDetails = function (id) {
	return axios.get(url.Good, {
		id: id
	})
}
// 删除商品
API.DelGoods = function (id) {
	return axios.del(url.Good, {
		id: id
	})
}

// 获取轮播图列表
API.banners = function (page, limit) {
	return axios.get(url.Banners, {
		page: page,
		limit: limit,
	})
}
// 新增轮播图
API.createBanners = function (data) {
	return axios.post(url.CreateBanners, data)
}
// 删除轮播图
API.delBanner = function (id) {
	return axios.del(url.DelBanner, {
		id: id
	})
}

// 订单列表
API.orders = function (page, limit, merchant_id, goods_id) {
	return axios.get(url.Orders, {
		page: page,
		limit: limit,
		merchant_id: merchant_id,
		goods_id: goods_id
	})
}

export default API