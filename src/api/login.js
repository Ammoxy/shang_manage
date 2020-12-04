import axios from '@/plugins/axios'
import url from './url.js'

const API = {}
API.login = function(formData) {
	return axios.post(url.Login, formData)
}

API.userInfo = function(token) {
	return axios.get(url.Permissions,{token: token})
}

API.logout = function() {
	return axios.get(url.Logout)
}

// 重置密码
API.resetPassword = function(data) {
	return axios.post(url.ResetPassword, data)
}

export default API