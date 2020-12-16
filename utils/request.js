import store from "@/store"
import config from './public/config.js'

function api(obj) {
	return new Promise((resolve, reject) => {
		// const HOST = 'http://192.168.1.126:9999/xujun/';
		//const HOST = 'https://test.net/';
		// const HOST = 'https://share.qingchuangweb.com' // 线上
		// const HOST = "https://test.qingchuangweb.com:8443"; //测试请求' // 测试
		//const HOST = "http://192.168.1.52:8891/dev-api"; // 东强线下测试
		const HOST = config.HOST; // 东强线下测试
		var method = obj.method || "GET";
		var url = HOST + obj.url || "";
		var data = obj.data || {};
		var header = {
			'Content-Type': obj.contentType || 'application/json',
			'Authorization-pdb': obj.Authorization ? ('Bearer ' + obj.Authorization) : '' // obj.Authentication || '' // ('Bearer ' +  obj.Authentication) || ''
		};
		var success = obj.success; // 成功回调函数
		var fail = obj.fail; //表示失败后，要执行的回调函数

		var noLoading = obj.noLoading;

		// if (obj.showLoading) {
		// 	uni.showLoading({
		// 		title: obj.showLoading || '正在加载中',
		// 	})
		// }
		if(!uni.getStorageSync('isLogin') && url.indexOf('login') == -1 && url.indexOf('decrypt') == -1 && url.indexOf('openid') == -1 && url.indexOf('check-register') == -1  && url.indexOf('user-register') == -1 && url.indexOf('list-industry') == -1  ) {
			uni.showToast({
				title: '当前未登陆,请前往登陆!',
				icon: "none"
			})
			
			store.commit('logout')
			setTimeout( () => {
				 uni.reLaunch({
					url:'/pages/login/login'
				})
			},500)
			
			return
		}
		
	if (!noLoading) {
			console.log(store)
			store.commit('SET_LOADING_OPEN')
		}

		// setTimeout( ()=> {
		// 		if (!noLoading) {
		// 			console.log(store)
		// 			store.commit('SET_LOADING_CLOSE')
		// 		}
		// },3000)

		const app = getApp()
		// 网络状态判断
		uni.onNetworkStatusChange(function(res) {
			console.log('网络判断ing', res)
			let isConnected = res.isConnected
			let networkType = res.networkType
			let networkTypeArr = ['4g', '3g', 'wifi']
			// 无网
			if (!isConnected) {
				uni.showToast({
					title: '请检查是否连接网络',
					icon: "none"
				})
			} else {
				// 无网或弱网
				if (!networkTypeArr.includes(networkType)) {
					uni.showToast({
						title: '请检查当前网络是否稳定',
						icon: "none"
					})
				}
			}
		})


		uni.request({
			url: url,
			data: data,
			method: method,
			header: header,
			success: ((res) => {
				console.log('request-res', res)
				if (res.statusCode === 403 || res.statusCode === 401) {
					store.commit('SET_LOADING_CLOSE')
					// 错误处理，返回登录页
					uni.reLaunch({
						url: '/pages/login/login'
					})
				} else if (res.statusCode === 200) {
					store.commit('SET_LOADING_CLOSE')

					/* 状态控制-start */
					if (res.data.code == 401) { //认证失败，无法访问系统资源

						uni.showToast({
							title: '登陆已过期,请重新登陆!',
							icon: "none"
						})
						
						setTimeout( () => {
							uni.reLaunch({
								url: '/pages/login/login'
							})
						},500)
					}
					/* 状态控制-end */


					resolve(res.data)
				}
				// if (obj.showLoading) {
				// 	uni.hideLoading()
				// }
				// store.commit('SET_LOADING_CLOSE')
			}),
			fail: ((err) => {
				// if (obj.showLoading) {
				// 	uni.hideLoading()
				// }
				uni.showToast({
					title: '请检查网络连接!',
					icon: "none"
				})
				// uni.reLaunch({
				// 	url: '/pages/common/netWork/no-netWork'
				// })

				store.commit('SET_LOADING_CLOSE')
				reject(err)
			})
		})
	})
}
export default api
