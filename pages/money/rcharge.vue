<template>
	<view class="page">
		<view class="main">
			<view class="main-content">
				<view class="content">
					<view class="head">
						<view class="head-title">
							充值金额(元)
						</view>
						<view class="head-input" style="border-bottom: 1px solid #E5E5E5;padding-bottom:14upx;">
							<input placeholder-style="font-weight:400;font-size:28upx; color:#CCCCCC" type="digit" value="" placeholder="￥ 请输入充值金额"
							 v-model="MoneyNum" @input="MoneyInput" />

						</view>
						<view class="head-tips">
							充值优惠活动开始了
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
							<image src="../../static/img/money/yl-pay.png" mode=""></image>
							<text>银联支付</text>
							<radio value="2" :checked=" index === 2 " />
						</view>
					</view>
					<view class="sub">
						<view class="sub-btn" @tap="rcharge">确认充值</view>
					</view>


				</view>
			</view>
		</view>
	</view>
</template>

<script>
	const app = getApp();
	// ||'../../static/img/text.png'
	export default {
		data() {
			return {
				// imgHost: app.globalData.baseUrl + '/',../../static/img/text.png
				imgHost: '../../static/img/text.png',
				MoneyNum: '',
				index: 1
			};
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
					this.$nextTick(() => {
						this.MoneyNum = '';
					})
					return false
				}
				if (isNaN(num)) {
					app.globalData.showToast('金额为数字');
					this.$nextTick(() => {
						this.MoneyNum = '';
					})
					return false
				}
				if (event.target.value.split(".")[1] && event.target.value.split(".")[1].length > 2) {
					app.globalData.showToast('金额小数后两位');
					this.$nextTick(() => {
						this.MoneyNum = '';
					})
					return false
				}
				this.MoneyNum = num;
			},
			selectPayType(val) {
				this.index = val
			},
			// 充值
			rcharge() {
				if (this.index == 1) {
					this.rchargeGo()
				} else if (this.index == 2) {
					app.globalData.showToast('该支付方式等待开通');
				}
			},
			// 支付取消
			payCancel(item) {
				let params = {
					detailNo: item.detailNo,
					pkid: item.pkid,

				};

				this.API.service.deleteToken(`${this.URL.payCancel}?pkid=${item.pkid}&detailNo=${item.detailNo}`).then(res => {
					console.log('res', res)
					if (res.code == 200) {

					}
				})
			},
			// 充值-go
			rchargeGo() {
				const that = this;

				console.log(that.MoneyNum)
				if (!that.MoneyNum) {
					app.globalData.showToast('请输入金额');
					return false
				}

				let params = {
					openId: uni.getStorageSync('openId'),
					totalFee: that.MoneyNum,
					operatingStatus: 0, // 0充值，1支付
					rechargeType: 1, // 1微信，2银联
				};

				this.API.service.postToken(this.URL.rechage, params).then(res => {
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
								uni.reLaunch({
									url: "rcharge-list-detail"
								})
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

						.head-title {
							color: #333333;
							font-size: 30upx;
						}

						.head-input {
							margin-top: 30upx;
							// border-bottom: 1px solid #F7F7F7 ;

						}

						.head-tips {
							margin-top: 30upx;
							color: #FFC800;
							font-size: 28upx;
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
