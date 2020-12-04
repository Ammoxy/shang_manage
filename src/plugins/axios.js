import Vue from 'vue'
import axios from 'axios'
import {
	Message
} from 'element-ui'
import {
	MessageBox
} from 'element-ui';
var Qs = require('qs')

const http = {}

const instance = axios.create({
	timeout: 30000,
	headers: {
		'Content-Type': 'application/x-www-form-urlencoded'
	}
})

// 请求拦截
instance.interceptors.request.use(config => {
	var token = localStorage.getItem('token');
	if (token) {
		config.headers.common['token'] = `${token}`
	}
	return config
}, err => {
	return Promise.reject(err)
})

// 响应拦截
instance.interceptors.response.use(res => {
	if (res.status === 200) {
		switch (res.data.code) {
			case 10001:
				Message.warning({
					message: '请重新登录'
				})
				setTimeout(() => {
					localStorage.removeItem('username')
					localStorage.removeItem('token')
					localStorage.removeItem('role')
					localStorage.removeItem('permissions')
					window.location.reload()
					this.$router.replace('/login')
				}, 1000)
				break;
			case 10002:
				Message.warning({
					message: res.data.toast
				})
				
				break;
			case 10003:
				Message.warning({
					message: res.data.toast
				})
				break;
			case 10004:
				Message.warning({
					message: res.data.toast
				})
				break;
			case 10005:
				Message.warning({
					message: res.data.toast
				})
		}
		return res.data;
	}
}, err => {
	console.log(err);
	if (err) {
		Message.warning({
			message: err
		})
	}
	// if (err.response.data.msg === 'need login') {
	// 	Message.warning({
	// 		message: '请重新登录'
	// 	})
	// 	localStorage.removeItem('username')
	// 	localStorage.removeItem('token')
	// 	localStorage.removeItem('role')
	// 	localStorage.removeItem('permissions')
	// 	window.location.reload()
	// 	this.$router.replace('/login')
	// }
	return Promise.reject(err)
})

http.get = function (url, data = {}) {
	return new Promise((resolve, reject) => {
		instance.get(url, {
			params: data
		}).then(res => {
			resolve(res.data)
		}).catch(err => {
			reject(err);
		})
	})
}

http.del = function (url, data = {}) {
	return new Promise((resolve, reject) => {
		instance.delete(url, {
			params: data
		}).then(res => {
			resolve(res.data)
		}).catch(err => {
			reject(err);
		})
	})
}

http.post = function (url, data) {
	return new Promise((resolve, reject) => {
		instance.post(url, Qs.stringify(data)).then(res => {
			resolve(res.data)
		}).catch(err => {
			reject(err);
		})
	})
}

http.put = function (url, data) {
	return new Promise((resolve, reject) => {
		instance.put(url, Qs.stringify(data)).then(res => {
			resolve(res.data)
		}).catch(err => {
			reject(err);
		})
	})
}
export default http