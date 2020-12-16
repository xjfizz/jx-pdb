<template>
	<view :class="loginState ? 'main' : '' ">
		<ourLoading v-if="loading" active text="加载中..." />
		<uni-popup ref="popup" type="kefu">
			<keFuPop ref="kefuPop" :phone="customerPhone" @call="call"></keFuPop>
		</uni-popup>
		<tab-bar :selected="1"></tab-bar>
		<view v-if="loginState">
			<view class="my">
				<view class="header flex align-center">
					<view class="head-img" @tap="goUserDetail">
						<image class="user-img" :src="userInfo.avatar"></image>
					</view>
					<view class="user-msg">
						<view class="msg-top">
							<text class="msg-top-username">{{userInfo.enterpriseName}}</text>
							
						</view>

						<view class="msg-bottom">
							<text class="user-phone">{{userInfo.phone}}</text>
							<text v-if="userInfo.identity == 1" class="user-org">个人</text>
							<text v-if="userInfo.identity == 0" class="user-org">企业</text>
							<text v-if="userInfo.verifyStatus == 1" class="user-org">待审核</text>
							<text v-if="userInfo.verifyStatus == 3" class="user-org">已拒绝</text>
						</view>
					</view>
					<view class="edit-user" @tap.stop="updateUserInfo">
						<image src="../../static/img/my/edit.png"></image>
						<text>更新</text>
					</view>
				</view>

				<view class="mid">
					<view class="mid-item"  @tap="goMoney()">
						<image class="item-img" src="../../static/img/money.png" alt=''></image>
						<view class="item-title">我的钱包</view>
						<image class="item-right" src="../../static/img/right.png" alt=''></image>
					</view>
					<view class="mid-item"  @tap="goAddress()">
						<image class="item-img" src="../../static/img/address.png" alt=''></image>
						<view class="item-title">地址管理</view>
						<image class="item-right" src="../../static/img/right.png" alt=''></image>
					</view>
					<view class="mid-item" @tap="goInvoices">
						<image class="item-img" src="../../static/img/fp.png" alt=''></image>
						<view class="item-title">发票管理</view>
						<image class="item-right" src="../../static/img/right.png" alt=''></image>
					</view>
					<view class="mid-item border-bn" @tap="kf()">
						<image class="item-img" src="../../static/img/kf.png" alt=''></image>
						<view class="item-title">客服</view>
						<image class="item-right" src="../../static/img/right.png" alt=''></image>
					</view>
				</view>

				<view class="logut">
					<view class="logut-btn-sty" @tap="logOut()">
						<text>退出登录</text>
					</view>
				</view>

			</view>

		</view>
		<view class="login" v-else>
			<view class="view-logo">
				<view class="logo-sty">
					<image class="logo" src="../../static/img/login/jx-logo.png" alt=''></image>
				</view>
			</view>
			<view class="phone-btn">
				<button class="btn-sty m-bc-y" @tap="loginByphone()">
					<text>手机号登陆</text>
				</button>
			</view>
		</view>
	</view>
</template>

<script>
	const app = getApp();
	export default {
		data() {
			return {
				userInfo: {},
				phone: uni.getStorageSync('tel') || '',
				openId:uni.getStorageSync('openId') || '',
				customerPhone:''

			}
		},
		computed: {
			user() {
				return this.$store.state.user
			},
			loginState() {
				 // return this.$store.state.loginState
				return uni.getStorageSync('isLogin')
			},
			loading() {
				return this.$store.state.loadingShow
			},
		},
		onLoad(options) {
			console.log('onLoad', this.user)
		},
		onShow() {
			console.log('onShow', this.user, this.loginState)
			if(this.loginState) {
				this.getUserInfo()
				this.getCustomer()
			}
		},
		onHide() {
			console.log('onHide', this.user)
		},
		methods: {
			// 手机号登陆
			loginByphone() {
				uni.navigateTo({
					url: "../login/login"
				})
			},
			// 获取用户信息
			getUserInfo() {
				let params = {
					openId:this.openId,
					phoneNumber:this.phone
				}
				this.API.service.getToken(this.URL.getUser,params).then(res => {
					if (res.code == 200) {
						if(!res.data) {
							app.globalData.showToast('用户信息不存在!');
							setTimeout( () => {
									this.loginByphone()
							},500)
						}
						this.userInfo = res.data
						uni.setStorageSync('userDetail', res.data)
					}
				})
			},
			// 获取客服电话
			getCustomer() {
				this.API.service.getNoLoadToken(this.URL.getCustomer).then(res => {
					if (res.code == 200) {
						this.customerPhone = res.data[0].infoPhone
						uni.setStorageSync('customerPhone',  res.data[0].infoPhone)
					}
				})
			},
			// 更新个人信息
			updateUserInfo() {
				uni.navigateTo({
					url: '/pages/my/userEdit'
				});
			},
			// 个人信息详情
			goUserDetail() {
				uni.navigateTo({
					url: '/pages/my/userDetail'
				});
			},
			// 客服弹框
			kf() {
				this.$refs.popup.open()
			},
			// 拨打电话
			call(phone) {
				// TODO 做一些其他的事情，手动执行 done 才会关闭对话框
				uni.makePhoneCall({
					phoneNumber: phone //仅为示例
				});
				this.$refs.kefuPop.close()
			},
			// 我的钱包
			goMoney() {
				uni.navigateTo({
					url:'../money/money'
				})
				},
			// 地址页
			goAddress(){
				uni.navigateTo({
					url:'../address/address'
				})
			},
			// 发票管理
			goInvoices(){
				uni.navigateTo({
					url:'../invoices/invoices'
				})
			},
			// 退出登录
			logOut() {
				const that = this
				uni.showModal({
					title: '提示',
					content: '您确定要退出吗？',
					success: function(res) {
						if (res.confirm) {
							console.log('用户点击确定');
							
							let url = that.URL.loginOut
							that.API.service.postToken(url).then( res => {
								if(res.code == 200) {
									that.$store.commit('logout')
									uni.reLaunch({
										url: '/pages/login/login'
									});
								}
							})
							
							
						} else if (res.cancel) {
							console.log('用户点击取消');
						}
					}
				});
				

			}
		}


	}
</script>

<style scoped lang="less">
	.main {
		background-color: #F7F7F7;
		min-height: 100%;
	}

	.login {
		padding-top: 235upx;
	}

	.view-logo {}

	.logo-sty {
		display: flex;
		justify-content: center;
		/* 		margin-top: 20%; */
	}

	.logo {
		width: 235upx;
		height: 427upx;
		border-radius: 15upx;
	}

	.logo-text {
		font-size: 28upx;
		color: #333333;
		margin: 30upx auto 0;
		display: flex;
		justify-content: center;
	}

	.phone-btn {
		margin-top: -70upx;
	}

	.btn-sty {
		color: #333333;
		width: 425upx;
		border-radius: 15upx;
		font-size: 30upx;
		letter-spacing: 5upx;
		font-weight: 600;
		margin: 30upx auto 0;
		padding: 2upx;
	}

	.my {
		background-color: #f7f7f7;
		min-height: 100%;
	}

	.header {
		height: 220upx;
		background-color: #ffffff;
		justify-content: flex-start;
		padding: 20upx 0 20upx 20upx;
	}

	.head-img {
		width: 150upx;
		height: 150upx;
	}

	.user-img {
		width: 132upx;
		height: 132upx;
		border-radius: 50%;

	}

	.user-msg {
		color: #333333;
		margin-left: 20upx;
		font-size: 34upx;
		padding-top: 12rpx;
		line-height: 50upx;
		padding-right: 20upx;
		width: 70%;
		
	}

	.msg-top {
		
		display: flex;
		justify-content: flex-start;
		align-items: center;
		 
	}
	.msg-mid{
		display: flex;
		justify-content: flex-start;
		align-items: center;
	}
	

	.msg-bottom {
		display: flex;
		align-items: center;
		//justify-content: center;
		font-size: 25upx;
		color: #999999;
	}

	.user-org {
		display: flex;
		align-items: center;
		border-radius: 20upx;
		padding: 5upx 8upx;
		text-align: center;
		color: #ffc800;
		margin-left: 20upx;
		font-size: 22upx;
		vertical-align: middle;

		line-height: 30upx;
		height: 27upx;
		background: #fff2c3;
	}
	.user-phone{
		display: flex;
		align-items: center;
		padding: 5upx 8upx 5upx 0;
	}
	.msg-top-username{
		text-overflow: -o-ellipsis-lastline;
		 overflow: hidden;
		 text-overflow: ellipsis;
		 display: -webkit-box;
		 -webkit-line-clamp: 2;
		 line-clamp: 2;
		 -webkit-box-orient: vertical;
	}


	.edit-user {
		width: 30%;
		margin-left: auto;
		margin-right: 20upx;
		font-size: 24upx;
		width: 120upx;
		height: 50upx;
		display: flex;
		justify-content: space-around;
		align-items: center;
		color: #333333;
		border-radius: 30upx;
		border: 1px solid #f7f7f7;
		box-shadow: 0 0 5upx 5upx #f7f7f7; //边框阴影
		padding: 5upx 10upx;

		image {
			width: 28upx;
			height: 28upx;
		}
	}

	.mid {
		padding-left: 20upx;
		padding-right: 20upx;
		margin-top: 20upx;
		background-color: #FFFFFF;
		
		.mid-item {
			display: flex;
			align-items: center;
			justify-content: flex-start;
			border-bottom: 1px solid #E5E5E5;
			padding-top: 5upx;
			padding-bottom: 5upx;
			height: 100upx;

			.item-img {
				width: 40upx;
				height: 40upx;
			}

			.item-title {
				margin-left: 20upx;
				font-size: 30upx;
			}

			.item-right {
				margin-left: auto;
				width: 32upx;
				height: 32upx;
			}
		}
		.mid-item:last-child {
			border: none;
		}
	}

	.border-bn {
		border: none;
	}

	.logut {
		margin-top: 20upx;
		display: flex;
		justify-content: center;
		.logut-btn-sty:active{
			background-color: #ece7e7;
		}
		.logut-btn-sty {
			font-size: 33upx;
			margin-top: 30upx;
			width: 450upx;
			height: 85upx;
			background-color: #ffffff;
			color: #333333;
			border-radius: 15upx;
			display: flex;
			align-items: center;
			justify-content: center;

		}
	}
</style>
