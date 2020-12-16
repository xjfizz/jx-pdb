import request from "@/utils/request.js"
// import URL from "@/utils/public/url.js"

const Authorization = 'Authorization-pdb'

let service =  {
	get: function(url,data) {
			 return request({
				 url:url,
				 method:'get',
				 data: data,
				 //showLoading: '正在加载中'
				 // contentType:'application/x-www-form-urlencoded'
			 })
	},
	getNoLoadToken: function(url,data) {
		const token = uni.getStorageSync('token')
			 return request({
				 url:url,
				 method:'get',
				 data: data,
				 Authorization: token,
				 noLoading:true,
				 //showLoading: '正在加载中'
				 // contentType:'application/x-www-form-urlencoded'
			 })
	},
	post: function(url,data) {
			 return request({
				 url:url,
				 method:'post',
				 data: data,
				 //showLoading: '正在加载中'
				 // contentType:'application/x-www-form-urlencoded'
			 })
	},
	postForm: function(url,data) {
			 return request({
				 url:url,
				 method:'post',
				 data: data,
				 //showLoading: '正在加载中'
				 contentType:'application/x-www-form-urlencoded'
			 })
	},
	getToken: function(url,data) {
		const token = uni.getStorageSync('token')
			 return request({
				 url:url,
				 method:'get',
				 data: data,
				 Authorization: token
				 //showLoading: '正在加载中'
				 // contentType:'application/x-www-form-urlencoded'
			 })
	},
	getTokenForm: function(url,data) {
		const token = uni.getStorageSync('token')
			 return request({
				 url:url,
				 method:'get',
				 data: data,
				 Authorization: token,
				 contentType:'application/x-www-form-urlencoded'
				 //showLoading: '正在加载中'
				 // contentType:'application/x-www-form-urlencoded'
			 })
	},
	postToken: function(url,data) {
		const token = uni.getStorageSync('token')
			 return request({
				 url:url,
				 method:'post',
				 data: data,
				 Authorization: token
				 //showLoading: '正在加载中'
				 // contentType:'application/x-www-form-urlencoded'
			 })
	},
	deleteToken: function(url,data) {
		const token = uni.getStorageSync('token')
			 return request({
				 url:url,
				 method:'delete',
				 data: data,
				 Authorization: token
				 //showLoading: '正在加载中'
				 // contentType:'application/x-www-form-urlencoded'
			 })
	},
	putToken: function(url,data) {
		const token = uni.getStorageSync('token')
			 return request({
				 url:url,
				 method:'put',
				 data: data,
				 Authorization: token
				 //showLoading: '正在加载中'
				 // contentType:'application/x-www-form-urlencoded'
			 })
	},
	 login: function(url,data) {
		 return request({
			 url:url,
			 method:'post',
			 data: data,
			 //showLoading: '正在加载中'
			 // contentType:'application/x-www-form-urlencoded'
		 })
	 },
	 // 获取微信openId,sessionId
	 getOpenId: function(data)  {
		 return request({
			 url:'/wx/openId',
			 method: 'post',
			 data:data
		 })
	 },
	loginCheck: function(data) {
			 return request({
				 url:`/wx/loginCheck`,
				 method:'post',
				 data: data,
			 })
	}, 
	 
	 list: function(data) {
	 		 return request({
	 			 url:`/test/list`,
	 			 method:'get',
	 			 data: data
	 		 })
	 },
	 
	 test: function(data) {
		 console.log('URL', URL)
	 		 return request({
	 			 url:URL.getName,
	 			 method:'post',
	 			 data: data,
	 			 // contentType:'application/x-www-form-urlencoded'
	 		 })
	 },
	 
	 message: '信息来了'
}
export default service