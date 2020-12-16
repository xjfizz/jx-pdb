<template>
	<view class="page">
		<view class="main">
			
			
			
			<view class="main-content">
				<view class="top">
					<view class="content">
						<view class="bac-img">
							<image src="../../static/img/money/balance-bac.png"></image>
						</view>


						<view class="money-title">账户余额(元)</view>
						<view class="money-count">{{banlance}}</view>
					</view>
				</view>
				
				
				<view class="main-no" v-if="recordList && recordList.length == 0">
				
					<view class="no-image">
						<image src="../../static/img/no-data.png"></image>
					</view>
					<view class="no-title">暂无余额明细</view>
				</view>
				
				<view class="bottom" v-else>
					<view class="bottom-item" v-for="(item,index) in recordList" :key="index">
						<view class="item-left">
							<view class="left-top" v-if="item.rechargeType == 1">微信充值</view>
							<view class="left-top" v-if="item.rechargeType == 2">银联充值</view>
							<view class="left-bottom">{{item.createTime}}</view>
						</view>
						<view class="item-right-add" v-if="!factory.isHaveStr(item.detailAmount, '-')">+{{item.detailAmount}}</view>
						<view class="item-right" v-else> {{item.detailAmount}}</view>
					</view>
					</view>
			</view>
			
			
			<!-- <view v-if="isBottom && recordList.length > 0" class="isBottom">我是最后的底线~</view> -->
					
			
			<view class="sub-btn" @tap="goRecharge">
				充值
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
				userPkid: uni.getStorageSync('userDetail').pkid,
				factory: require('@/utils/factory.js'),
				// imgHost: app.globalData.baseUrl + '/',../../static/img/text.png
				imgHost: '../../static/img/text.png',
				imageSrc: '../../static/img/money/balance-bac.png',
				bankCard: '1234567812345678',
				recordList: [],
				page: {
					pageNum: 1,
					pageSize: 10
				},
				isBottom: false,
				total: 0,
				banlance:0,
			};
		},
		onShow() {
			this.init()
		},
		methods: {
			// 初始化
			init() {
				this.page.pageNum = 1
				this.recordList = []
				this.isBottom = false
				this.getPayList()
				this.getBanlance()
			},
			// 余额明细页面
			goRecharge() {
				uni.navigateTo({
					url: "rcharge-list-detail"
				})
			},
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
			// 获取支付记录
			getPayList() {
				let params = {
					userPkid: this.userPkid,
					pageNum: this.page.pageNum,
					pageSize: this.page.pageSize,
				};

				this.API.service.getToken(this.URL.walletDetails, params).then(res => {
					console.log('res', res)
					if (res.code == 200) {
						this.total = res.total
						this.recordList = this.recordList.concat(res.rows)
					}
				})
			},
			// 充值页面
			goRecharge() {
				uni.navigateTo({
					url:"rcharge"
				})
			},
			// 下拉刷新
				onPullDownRefresh() {
					this.init()
					setTimeout(() => {
						uni.stopPullDownRefresh(); //停止下拉刷新动画
					}, 500)
				},
				// 上拉加载
				onReachBottom() { //监听下拉加载生命周期
			
					if (this.recordList.length >= this.total) {
						this.isBottom = true
					} else {
						this.isBottom = false
					}
			
					if (this.isBottom) {
						return app.globalData.showToast('已经到底啦(*^▽^*)');
					}
					this.page.pageNum = this.page.pageNum + 1
					this.getPayList()
				
			},
		}
	}
</script>

<style lang="less">
	.page {
		background-color: #f7f7f7!important;
		
		.main {
			width: 100%;
			min-height: 100%;
			margin-bottom: 200upx;
			background-color: #f7f7f7!important;

			.main-content {
				width: 100%;
				min-height: 100%;
				background-color: #ffffff;
				padding-top: 30upx;
				padding-left: 30upx;
				padding-right: 30upx;

				.top {
					margin-top: 30upx;



					.content {
						margin-top: 15upx;
						position: relative;
						height: 330upx;
						background-color: #FFFFFF;

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
					margin-top: 10upx;
					
					.bottom-item {
						padding-top: 15upx;
						padding-bottom: 15upx;
						display: flex;
						justify-content: space-between;
						align-items: center;
						border-bottom: 1px solid #E5E5E5;

						.item-left {

							.left-top {
								padding-top: 8upx;
								padding-bottom: 8upx;
								color: #333333;
								font-size: 30upx;
							}

							.left-bottom {
								padding-top: 8upx;
								padding-bottom: 8upx;
								color: #999999;
								font-size: 26upx;
							}
						}

						.item-right {
							color: #FFC800;
						}

						.item-right-add {
							color: #00DB7B;
						}
					}
				}

				.bottom-item:nth-last-child(1) {
					border-bottom: none;
					
				}
			}


			.sub-btn {
				width: 100%;
				position: fixed;
				bottom: 0;
				background-color: #FFC800;
				height: 90upx;
				// border-radius: 15upx;
				display: flex;
				align-items: center;
				justify-content: center;
				color: #333333;
				font-size: 28upx;
			}
		}
	}
	
	.isBottom {
		margin-top: 30upx;
		display: flex;
		align-items: center;
		justify-content: center;
		font-size: 25upx;
		color: #999999;
	}
	
	.main-no {
		width: 100%;
		display: flex;
		// justify-content: center;
		margin-top: 20%;
		height: 100%;
		align-items: center;
		flex-direction: column;
		
		
	
		.no-image {
			image {
				width: 243upx;
				height: 130upx;
	
			}
		}
	
		.no-title {
			color: #999999;
			font-size: 33upx;
			font-weight: 600;
		}
	
		.no-tips {
			color: #999999;
			font-size: 25upx;
			margin-top: 20upx;
		}
	
		.publish-btn {
			width: 400upx;
			height: 80upx;
			background-color: #FFC800;
			display: flex;
			justify-content: center;
			align-items: center;
			border-radius: 15upx;
			margin-top: 55upx;
			color: #333333;
			font-size: 32 upx;
		}
	}
	
</style>
