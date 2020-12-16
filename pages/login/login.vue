<template>
	<view class="flex flex-direction padding-top widthAuto main">
		<view class="text-xl padding flex align-center">
			<image class="jx-logo" src="../../static/img/login/jx@2x.png"></image>
			<text class="login-titlt">巨象　申请使用</text>
			</view>

		<view class="padding"><text class="login-tip">以下信息仅用于您登录小程序，我们将严格保密绝不外泄，更不会对您发送垃圾信息造成骚扰。</text></view>

		<view class="padding widthAuto">
			<view class="message-title">以下信息</view>
			<view class="item-main">
				<view class="message-item">
					<view class="item-left">
						<view class="phone">手机号</view>
						<view class="phone-tip">获取您的手机号用于实名认证</view>
					</view>
					<view class="item-right">
						<image v-if="tel" class="select-img" src="../../static/img/login/select@2x.png"></image>
					</view>
				</view>
				
				<view class="message-item bordeB">
					<view class="item-left">
						<view class="phone">获取您的公开信息　(昵称、头像)</view>
						<view class="phone-tip">获取您的公开信息方便使用全部功能</view>
					</view>
					<view class="item-right">
						<image v-if="userInfo.nickName" class="select-img" src="../../static/img/login/select@2x.png"></image>
					</view>
				</view>
			</view>

			
<!-- 			<view class="flex justify-start align-start">
				<view class="margin-right text-lg padding-top-xs"><text :class="tel ? 'cuIcon-roundcheckfill m-tx-y' : 'cuIcon-roundcheck'"></text></view>
				<view>
					<view><text class="text-df">授权手机号</text></view>
					<view><text class="text-df">获取您的手机号用于实名认证</text></view>
					
				</view>
			</view> -->

<!-- 			<view class="flex justify-start align-start margin-top">
				<view class="margin-right text-lg padding-top-xs"><text :class="userInfo.nickName ? 'cuIcon-roundcheckfill m-tx-y' : 'cuIcon-roundcheck'"></text></view>
				<view>
					<view><text class="text-df">获取您的公开信息（昵称、头像等）</text></view>
					<view><text class="text-df">获取您的公开信息方便您使用全部功能</text></view>
				</view>
			</view> -->
		</view>
		
		<view class="flex flex-direction padding">
			<button class="agree-btn" v-if="tel == ''" open-type="getPhoneNumber" @getphonenumber="getPhoneNumber" >授权手机号</button>
			<button class="agree-btn" v-else open-type="getUserInfo" @getuserinfo="bindGetUserInfo" >授权公开信息</button>
			<button class="refuse-btn"  @tap="refuse" >拒绝</button>
		</view>

		<!-- <view class="flex flex-direction padding">
			<button open-type="getPhoneNumber" @getphonenumber="getPhoneNumber" class="cu-btn m-bc-y lg" v-if="tel == ''">授权手机号</button>
			<button class="cu-btn m-bc-y lg" open-type="getUserInfo" @getuserinfo="bindGetUserInfo" v-else>授权公开信息</button>
		</view> -->
	</view>
</template>



<script>
	import API from '@/api/index.js'
	const app = getApp();
	export default {
		data() {
			return {
				userInfo: '',
				sessionKey: '',
				openId: '',
				tel: '',
				isAgree:false
			}
		},
		onLoad(options) {
			const that = this;
			setTimeout(function() {
				that.wxLogin();
			}, 200);
		},
		onShow() {

		},
		onHide() {

		},
		methods: {
			// 微信登陆
			wxLogin() {
				let that = this
				uni.login({
					success: res => {
						console.log('wxLogin', res)
						that.getOpenId(res.code)
					}
				})
			},
			// 获取openId
			getOpenId(data) {
				let params = {
					jscode: data
				}
				API.service.get(this.URL.getWXOpendId,params).then(res => {
					console.log('openId', res, this)
					if (res.code == 200) {
						this.openId = res.data.openid
						this.sessionKey = res.data.session_key
						uni.setStorageSync('openId', this.openId);
						
					}
				})
			},
			// 获取手机号
			getPhoneNumber(e) {
				console.log('getPhoneNumber', e, this)
				const that = this;
				if (e.detail.errMsg == 'getPhoneNumber:fail user deny') {
					uni.showModal({
						title: '提示',
						showCancel: false,
						content: '未授权',
						success: function(res) {
							that.tel = '';
						}
					});
				} else {
					console.log('sessionKey',this.sessionKey)
					let params = {
							encryptedData: e.detail.encryptedData,
							iv: e.detail.iv,
							sessionKey: this.sessionKey
						};

						
						API.service.get(this.URL.getTel, params).then( res => {
							console.log('openId', res, this)
							if (res.code == 200) {
								let options = JSON.parse(res.data.decryptUserInfo)
								console.log(options)
								that.tel = options.phoneNumber
								uni.setStorageSync('tel',options.phoneNumber)
							}
						})
						
					}
				
			},
			// 获取用户信息
			bindGetUserInfo(e) {

				if (e.detail.userInfo) {
					// 授权成功获取用户信息
					console.log('userInfo', e.detail.userInfo)
					this.userInfo = e.detail.userInfo;
					// this.$store.commit('login', e.detail.userInfo)
					uni.setStorageSync('userInfo', e.detail.userInfo)
					this.registerCheck() 
				} else {
					// Todo
				}
			},
			// 拒绝
			refuse() {
				uni.navigateBack()
			},
			// 检查注册
			registerCheck() {
				let isRegister = true
				let params = {
					openId: this.openId
				}
				API.service.get(this.URL.registerCheck, params).then( res => {
					console.log('===注册检查==', res)
					if(res.code == 200) {
						if(res.data) {

							this.getTokenLogin()
						} else {
							console.log('进入注册')
							//Todo-注册页面
							uni.reLaunch({
								url: './register'
							})
						}
					}
				})
				

			},
			getTokenLogin() {
				let params = {
					openId:uni.getStorageSync('openId')
				}
				let url = this.URL.loginToken
				API.service.post(url, params).then( res => {
					if(res.code == 200) {
						uni.setStorageSync('token',res.token)
						 this.$store.commit('isLogin')
						 uni.setStorageSync('isLogin', true)
						
						
						// app.globalData.showToast('操作成功!');
						
						uni.reLaunch({
							url: '../my/my'
						})
					}
				})
			}
		}


	}
</script>

<style scoped>
	.main{
		padding: 10upx;
	}
	.login-titlt{
		font-size: 30upx;
		color: #333333;
		font-weight: 600;
		margin-left: 20upx;
	}
.jx-logo{
	width: 64upx;
	height: 64upx;
}
.login-tip{
	font-size: 25upx;
	color: #999999;
	letter-spacing: 3upx;
}
.message-title{
	font-size: 31upx;
	color: #333333;
	font-weight: 600;

}
.select-img{
	width: 28upx;
	height: 21upx;
}
.item-main{
	margin-top: 30upx;
}
.message-item{
	/* margin-top: 20upx; */
	border-top: 1px solid #E5E5E5;
	padding-top: 20upx;
	padding-bottom: 20upx;
	display: flex;
	justify-content: space-between;
	align-items: center;
}
.item-left{
	
}
.phone{
	font-size: 28upx;
	color: #333333;
	font-weight: 600;
	padding-bottom:5upx;
}
.phone-tip{
	font-size: 25upx;
	color: #999999;
	padding-bottom:5upx;
	letter-spacing: 3upx;
}
.bordeB{
	border-bottom: 1px solid #E5E5E5;
}
.agree-btn{
	font-size: 33upx;
	font-weight: 600;
	width: 450upx;
	height: 85upx;
	background-color: #ffc800;
	color: #333333;
}
.agree-btn:active {
	opacity: 0.55;
}
.refuse-btn{
	font-size: 33upx;
	font-weight: 600;
	margin-top: 30upx;
	width: 450upx;
	height: 85upx;
	background-color: #F7F7F7;
	color: #ffc800;
}
.refuse-btn:active {
	opacity: 0.55;
}
</style>
