<template>
	<view class="page">
		<ourLoading v-if="loading" active text="加载中..." />
		<view class="main">
			<view class="top">
				<view class="title">
					<view class="top-left">我的余额</view>
					<view class="top-right" @tap="goRechargeList">明细</view>
				</view>
				<view class="content">
					<view class="bac-img">
						<image src="../../static/img/money/balance-bac.png"></image>
					</view>

					<view class="recharge-btn" @tap="goRecharge">充值</view>
					<view class="money-title">账户余额(元)</view>
					<view class="money-count">{{banlance}}</view>
				</view>
			</view>
			<view class="bottom">
				<view class="title">
					<view class="top-left">我的银行卡</view>
					<view class="top-right">更换</view>
				</view>
				<view class="content">
					<view class="bac-img">
						<image src="../../static/img/money/bank-gsyh.png"></image>
					</view>

					
					<view class="money-title">中国工商银行</view>
					<view class="money-count">{{factory.formatBankNo(bankCard)}}</view>
				</view>
			</view>

		</view>
	</view>
</template>

<script>
	import factory from '@/utils/factory';
	const app = getApp();
	// ||'../../static/img/text.png'
	export default {
		data() {
			return {
				userPkid:uni.getStorageSync('userDetail').pkid,
				factory: require('@/utils/factory.js'),
				// imgHost: app.globalData.baseUrl + '/',../../static/img/text.png
				imgHost: '../../static/img/text.png',
				imageSrc: '../../static/img/money/balance-bac.png',
				bankCard:'1234567812345678',
				banlance:0,
			};
		},
		onShow() {
			this.getBanlance()
		},
		computed:{
			loading() {
				return this.$store.state.loadingShow
			},
		},
		methods:{
			// 获取我的余额
			getBanlance() {
				let params = {
					userPkid:this.userPkid
				};
				
				this.API.service.getToken(`${this.URL.walletBalance}/${this.userPkid}`,).then(res => {
					console.log('res', res)
					if (res.code == 200) {
						this.banlance = res.data.balanceAmount || 0
					}
				})
			},
			// 余额明细页面
			goRechargeList() {
				uni.navigateTo({
					url:"rcharge-list-detail"
				})
			},
			// 充值页面
			goRecharge() {
				uni.navigateTo({
					url:"rcharge"
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
			background-color: #FFFFFF;
			padding: 30upx;

			.top {
				margin-top: 30upx;

				.title {
					display: flex;
					justify-content: space-between;
					align-items: center;

					.top-left {
						color: #333333;
						font-size: 32upx;
						font-weight: 600;
					}

					.top-right {
						color: #333333;
						font-size: 28upx;
					}
				}

				.content {
					margin-top: 15upx;
					position: relative;
					height: 330upx;

					.bac-img {
						width: 100%;
						position: absolute;

						image {
							width: 100%;
							height: 324upx;
							background-repeat: no-repeat;
							background-size: cover;
						}
					}

					.recharge-btn:active {
						opacity: 0.55;
					}

					.recharge-btn {
						font-size: 24upx;
						color: #FFC800;
						position: absolute;
						right: 0upx;
						top: 40rpx;
						line-height: 51upx;
						text-align: center;
						z-index: 99;

						width: 108upx;
						height: 51upx;
						background: linear-gradient(270deg, #FFF0BB 0%, #FFF9DB 100%);
						border-radius: 24px 0px 0px 24px;
					}

					.money-title {
						position: absolute;
						top: 27%;
						width: 100%;
						text-align: center;
						color: #FFFFFF;
						font-size: 25upx;
					}
					

					.money-count {
						position: absolute;
						top: 43%;
						width: 100%;
						text-align: center;
						color: #FFFFFF;
						font-size: 50upx;
					}
					
				}
			}

			.bottom {
				margin-top: 30upx;

				.title {
					display: flex;
					justify-content: space-between;
					align-items: center;

					.top-left {
						color: #333333;
						font-size: 32upx;
						font-weight: 600;
					}

					.top-right {
						color: #333333;
						font-size: 28upx;
					}
				}

				.content {
					margin-top: 15upx;
					position: relative;
					height: 330upx;

					.bac-img {
						width: 100%;
						position: absolute;

						image {
							width: 100%;
							height: 292upx;
							background-repeat: no-repeat;
							background-size: cover;
						}
					}

					.recharge-btn:active {
						opacity: 0.55;
					}

					.recharge-btn {
						font-size: 24upx;
						color: #FFC800;
						position: absolute;
						right: 0upx;
						top: 40rpx;
						line-height: 51upx;
						text-align: center;
						z-index: 99;

						width: 108upx;
						height: 51upx;
						background: linear-gradient(270deg, #FFF0BB 0%, #FFF9DB 100%);
						border-radius: 24px 0px 0px 24px;
					}

					.money-title {
						position: absolute;
						top: 13%;
						left: 8%;
						//width: 100%;
						//margin-left: 8%;
						display: flex;
						align-items: center;
						color: #FFFFFF;
						font-size: 28upx;

					}

					.money-count {
						position: absolute;
						left: 8%;
						top: 53%;
						display: flex;
						align-items: center;
						// width: 100%;
						color: #FFFFFF;
						font-size: 50upx;

					}
				}
			}

		}
	}
</style>
