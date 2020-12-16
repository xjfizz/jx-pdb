<template>
	<view class="page">
		<view class="main">
			<view class="main-content">
				<view class="content">
					<view class="head">
						<view class="head-tips">需支付金额</view>
						<view class="head-money">
							<text class="head-money-fh">￥</text>
							<!-- <text>{{order.orderBudgetAmount}}</text> -->
							<text>{{MoneyNum}}</text>
						</view>
						<view class="head-bottom">
							<!-- <text>{{order.serverClassificationName}}</text> -->
							<text>{{order.serverClassificationName}}</text>
							<text>加工生产</text>
							<text>{{order.orderNo}}</text>
						</view>
					</view>

					<view class="bottom">
						<view class="bottom-head">支付方式</view>
						<view class="bottom-item" @tap="selectPayType(1)">
							<image src="../../static/img/money/wx-pay.png" mode=""></image>
							<text>微信支付</text>
							<radio value="1" :checked=" index === 1 " />
						</view>
						<view class="bottom-item" @tap="selectPayType(2)">
							<image src="../../static/img/money/balance-pay.png" mode=""></image>
							<text>钱包支付</text>
							<radio value="2" :checked=" index === 2 " />
						</view>
						<view class="bottom-item" @tap="selectPayType(3)">
							<image src="../../static/img/money/yl-pay.png" mode=""></image>
							<text>银联支付</text>
							<radio value="3" :checked=" index === 3 " />
						</view>
					</view>
					<view class="sub">
						<!-- <view class="sub-btn" @tap="rcharge">确认支付</view> -->
						<view class="sub-btn" @tap="rcharge">确认支付</view>
					</view>


				</view>
			</view>
		</view>
	</view>
</template>

<script>
	const app = getApp();
	export default {
		data() {
			return {
				userPkid: uni.getStorageSync('userDetail').pkid,
				MoneyNum: 1200,
				index: 1,
				order: {}
			};
		},
		onLoad(options) {
			console.log('options', options)
			let order = JSON.parse(options.order)
			console.log('order', order)
			this.order = order
			if (this.order.orderStatus == 3) { //支付定金
				this.MoneyNum = this.order.orderBudgetPayAmount
			} else if (this.order.orderStatus == 8) { // 支付尾款
				this.MoneyNum = this.order.orderActualPayAmount
			}
		},
		methods: {
			// 输入金额校验
			MoneyInput: function(event) {
				// if(){

				// }
				console.log(event.target.value)
				// this.MoneyNum = String(Math.abs((parseFloat((event.target.value))).toFixed(2)));
				var num = parseFloat(event.target.value);
				if (num < 0) {
					app.globalData.showToast('金额请大于0');
					this.MoneyNum = '';
					return false
				}
				if (event.target.value.split(".")[1] && event.target.value.split(".")[1].length > 2) {
					app.globalData.showToast('金额小数后两位');
					this.MoneyNum = '';
					return false
				}
				this.MoneyNum = num;
			},
			selectPayType(val) {
				this.index = val
			},
			// 支付测试
			rchargeTest() {
				if (this.order.orderStatus == 3) {
					this.payPreMOney()
				} else if (this.order.orderStatus == 8) {
					this.payEndMOney()
				}
			},
			// 支付尾款
			payEndMOney() {
				let params = {
					userPkid: this.userPkid,
					orderPkid: this.order.pkid,
					payType: this.index,
					payAmount: this.MoneyNum
				}
				this.API.service.postToken(this.URL.pay, params).then(res => {
					if (res.code == 200) {
						app.globalData.showToast('支付成功');
						uni.reLaunch({
							url: 'pay-success'
						})
					}
				})
			},
			// 支付定金
			payPreMOney() {

				let params = {
					userPkid: this.userPkid,
					orderPkid: this.order.pkid,
					payType: this.index,
					payAmount: this.MoneyNum
				}
				this.API.service.postToken(this.URL.pay, params).then(res => {
					if (res.code == 200) {
						app.globalData.showToast('支付成功');
						uni.reLaunch({
							url: 'pay-success'
						})
					}
				})
			},
			/* 支付-start */

			// 支付取消
			payCancel(item) {
				let params = {
					orderPkid: item.orderPkid,
					payNo: item.payNo,
					pkid: item.pkid,
					userPkid: item.userPkid,

				};

				this.API.service.deleteToken(
					`${this.URL.payOrderCancel}?orderPkid=${item.orderPkid}&payNo=${item.payNo}&pkid=${item.pkid}&userPkid=${item.userPkid}`
				).then(res => {
					console.log('res', res)
					if (res.code == 200) {

					}
				})
			},

			// 微信支付 1
			payWx() {
				let that = this
				let params = {
					openId: uni.getStorageSync('openId'),
					orderPkid: this.order.pkid,
					payAmount: that.MoneyNum,
					payOrderStatus: this.order.orderStatus, // 0充值，1支付
					payType: 1, // 1微信，2银联
				};

				this.API.service.postToken(this.URL.payOrder, params).then(res => {
					console.log('res', res)
					if (res.code == 200) {
						uni.requestPayment({
							timeStamp: res.data.timeStamp, //当前的时间(毫秒)
							nonceStr: res.data.nonceStr, //随机字符串(32)
							package: res.data.packageValue, //统一下单接口返回的 prepay_id 参数值
							signType: res.data.signType, //签名类型，默认为MD5
							paySign: res.data.paySign, //签名
							success: function(ord) {
								uni.showToast({
									title: '支付成功',
									duration: 2000,
									icon: 'success'
								});
								setTimeout(() => {
									uni.reLaunch({
										url: '../index/index'
									})
								}, 500)

							},
							fail: function(res1) {
								console.log(JSON.stringify(res1))
								if (res1.errMsg == 'requestPayment:fail cancel') {
									app.globalData.showToast('支付取消');
									that.payCancel(res.data)
								} else {
									app.globalData.showToast('支付失败');
								}

							}
						});
					}
				})
			},

			// 余额支付 2
			payBalance() {
				let params = {
					openId: uni.getStorageSync('openId'),
					orderPkid: this.order.pkid,
					payAmount: this.MoneyNum,
					payType: 2, // 1微信，2钱包 3银联
				};

				this.API.service.postToken(this.URL.payOrderWallet, params).then(res => {
					console.log('res', res)
					if (res.code == 200) {
						uni.showToast({
							title: '支付成功',
							duration: 2000,
							icon: 'success'
						});
						setTimeout(() => {
							uni.reLaunch({
								url: '../index/index'
							})
						}, 500)
					} else {
						uni.showToast({
							title: res.msg,
							duration: 2000,
							icon: "none",
							position: "top"
						});
					}
				})
			},

			/* 支付-end */
			// 充值
			rcharge() {
				if (this.index == 1) {
					// Todo-微信支付
					this.payWx()
				} else if (this.index == 2) {
					// Todo-余额支付

					uni.showModal({
						title: '确认支付?',
						content: '',
						cancelText: '关闭',
						success: res => {
							if (res.confirm) {
								// Todo
								console.log('用户点击确认');
								this.payBalance()

							} else if (res.cancel) {
								console.log('用户点击取消');
							}
						}
					});

				} else if (this.index == 3) {
					// Todo-银联支付
					return app.globalData.showToast('该支付方式等待开通');
				}
			}
		}
	}
</script>

<style lang="less">
	.page {
		.main {
			width: 100%;
			min-height: 100%;
			margin-bottom: 200upx;
			background-color: #F7F7F7;
			;

			.main-content {
				width: 100%;
				min-height: 100%;

				// padding: 30upx;
				.content {
					.head {
						background-color: #FFFFFF;
						padding: 30upx;
						display: flex;
						justify-content: center;
						align-items: center;
						flex-direction: column;

						.head-tips {
							color: #333333;
							font-size: 26upx;
							margin-top: 20upx;
						}

						.head-money {
							margin-top: 20upx;
							color: #FFC800;
							font-size: 45upx;
							font-weight: 600;

							.head-money-fh {
								font-size: 23upx;
							}
						}

						.head-bottom {
							margin-top: 20upx;
							width: 100%;
							color: #999999;
							font-size: 26upx;
							display: flex;
							justify-content: center;
							align-items: center;

							text {
								margin-left: 15upx;
							}
						}

					}

					.bottom {

						.bottom-head {
							color: #999999;
							padding: 30upx;
						}

						.bottom-item {
							padding-left: 30upx;
							padding-right: 30upx;
							background-color: #FFFFFF;
							border-bottom: 1px solid #E5E5E5;
							display: flex;
							align-items: center;
							justify-content: flex-start;
							height: 80upx;

							image {
								width: 48upx;
								height: 48upx;
							}

							text {
								margin-left: 15upx;
							}

							radio {
								margin-left: auto;
								color: #FFC800;

							}
						}
					}

					.sub {
						width: 100%;
						margin-top: 30upx;
						display: flex;
						align-items: center;
						justify-content: center;

						.sub-btn:active {
							opacity: 0.55;
						}

						.sub-btn {
							background-color: #FFC800;
							display: flex;
							align-items: center;
							justify-content: center;
							font-size: 33upx;
							width: 94%;
							border-radius: 15upx;
							height: 80upx;
							font-weight: 600;
						}
					}

				}

			}
		}
	}
</style>
<style>
	radio .wx-radio-input.wx-radio-input-checked {
		border: 1rpx solid #FFC800 !important;
		background: #FFC800 !important;
	}
</style>
