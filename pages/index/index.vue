<template>
	<view class="page">
		<ourLoading v-if="loading" active text="加载中..." />
		<uni-popup ref="popup" type="kefu">
			<keFuPop ref="kefuPop" :phone="phone" @call="call"></keFuPop>
		</uni-popup>

		<!-- 		<view class="top-tabs"> 
			<SmTabs :current="current" :values="items" bgc="#fff"  :scrollFlag="true" :isEqually="false" @clickItem="onClickItem" ></SmTabs>
		</view> -->

		<view class="main" v-if="isShow">
			<view class="content">
				<view class="item" v-for="(item,index) in orderList" :key="index" @tap="goDetail(item)">
					<view class="top">
						<!-- <text>{{item.status}}</text> -->
						<!-- 状态控制-start -->


						<view class="status-icon" :style="{backgroundColor: statusUnit[item.orderStatus].color}"></view>
						<view class="status-text" :style="{color: statusUnit[item.orderStatus].color}">{{statusUnit[item.orderStatus].statusText}}</view>

						<!-- 状态控制end -->

						<view class="order-tips" v-if="(item.orderStatus == 6 || item.orderStatus == 7) && item.pdbWechatOrderOperateHistories">
							{{item.pdbWechatOrderOperateHistories[0].orderOperateTitle}}
						</view>
						<view class="item-left">
							<image src="../../static/img/right.png" mode=""></image>
						</view>
					</view>
					<view class="mid" :class="(item.orderStatus == 0 || item.orderStatus == 11 || item.orderStatus == 12) ? 'no-bottom-btn' : '' ">
						<view class="mid-top">{{item.serverClassificationName}}</view>
						<view class="mid-item">
							<view class="item-left">
								<view class="item-title">交货:</view>
								<view class="item-value">{{item.orderExpectTime}}</view>
							</view>
							<view class="item-right">
								<view class="item-title">数量:</view>
								<view class="item-value">{{item.orderTotalQuantity}}件</view>
							</view>
						</view>
						<view class="mid-item">
							<view class="item-left">
								<view class="item-title">预算:</view>
								<view class="item-value">{{item.orderBudgetAmount}}元</view>
							</view>
							<view class="item-right">
								<view class="item-title">预付:</view>
								<view class="item-value">{{item.orderBudgetProportion}}%</view>
							</view>
						</view>
					</view>
					<view class="bottom" v-if="(item.orderStatus && item.orderStatus != 0 && item.orderStatus != 11 && item.orderStatus != 12)">
						<!-- v-if="operationBtns[item.status].length > 0" -->
						<!-- 						<view  class="bottom-item" v-for="(btn,btnIndex) in operationBtns[item.status -1]" :key="btnIndex"  @tap="btnsConfig(item, btn.optText)">
							<text>{{btn.optText}}</text>
						</view> -->
						<view v-if="item.orderStatus == 1 || item.orderStatus == 2" class="bottom-item" @tap.stop="btnsConfig(item, 'editOrder')">
							<text>修改需求</text>
						</view>

						<view v-if="item.orderStatus == 2 || item.orderStatus == 4 || item.orderStatus == 5 || item.orderStatus == 6 || item.orderStatus == 7 || item.orderStatus == 8 || item.orderStatus == 9 || item.orderStatus == 10"
						 class="bottom-item" @tap.stop="btnsConfig(item, 'contact')">
							<text>联系平台</text>
						</view>

						<view v-if="item.orderStatus == 1 || item.orderStatus == 2" class="bottom-item" @tap.stop="btnsConfig(item, 'cancelPublish')">
							<text>取消发布</text>
						</view>

						<view v-if="item.orderStatus == 3" class="bottom-item" @tap.stop="btnsConfig(item, 'cancelOrder')">
							<text>取消订单</text>
						</view>

						<view v-if="item.orderStatus == 3" class="bottom-item" @tap.stop="btnsConfig(item, 'payPreMoney')">
							<text>支付定金</text>
						</view>




						<view v-if="item.orderStatus == 4 || item.orderStatus == 5" class="bottom-item" @tap.stop="btnsConfig(item, 'returnPreMoney')">
							<text>退款</text>
						</view>

						<view v-if="item.orderStatus == 8" class="bottom-item" @tap.stop="btnsConfig(item, 'payEndMoney')">
							<text>支付尾款</text>
						</view>

						<view v-if="item.orderStatus == 10" class="bottom-item" @tap.stop="btnsConfig(item, 'ensureRequire')">
							<text>确认收货</text>
						</view>

					</view>
				</view>

				<view v-if="isBottom && orderList.length > 0" class="isBottom">我是最后的底线~</view>

			</view>

		</view>
		<view class="main-no" v-else>

			<view class="no-image">
				<image src="../../static/img/no-data.png"></image>
			</view>
			<view class="no-title">暂无订单</view>
			<view class="no-tips">您还没有发过订单哦~</view>
			<view class="publish-btn" @tap="publish">去下单</view>
		</view>

		<tab-bar :selected="0"></tab-bar>

	</view>
</template>

<script>
	// import API from '../../api/index.js'
	import config from '@/utils/public/config.js'
	// import operationBtns from '@/components/custom-components/operationBtns/operationBtns.vue'

	const {
		windowHeight
	} = uni.getSystemInfoSync();
	const app = getApp();
	export default {
		components: {
			// operationBtns
		},
		data() {


			return {
				current: 0,
				items: [{
						status: [1],
						statusText: '待受理',
					},
					{
						status: [2],
						statusText: '受理中',
					},
					{
						status: [3],
						statusText: '待支付定金',
					},
					{
						status: [4, 5],
						statusText: '待生产',
					},
					{
						status: [6, 7],
						statusText: '进行中',
					},
					{
						status: [8],
						statusText: '待支付尾款',
					},
					{
						status: [9],
						statusText: '待发货',
					},
					{
						status: [10],
						statusText: '待收货',
					},
					{
						status: [11, 12],
						statusText: '已完成',
					},
					{
						status: [0],
						statusText: '已取消',
					},
				],
				current: 0,
				userPkid: uni.getStorageSync('userDetail').pkid,
				isShow: false,
				phone: uni.getStorageSync('customerPhone'),
				orderList: [],
				orderStatusList: [{
						key: 1,
						value: '待受理'
					},
					{
						key: 2,
						value: '受理中'
					},
					{
						key: 3,
						value: '待支付定金'
					},
					{
						key: 4,
						value: '进行中'
					},
					{
						key: 5,
						value: '待支付尾款'
					},
					{
						key: 6,
						value: '确认收货'
					},
					{
						key: 7,
						value: '已完成'
					},
				],
				operationBtns: [
					[],
					[{
						opt: 'editOrder',
						optText: '修改需求'
					}, {
						opt: 'cancelPublish',
						optText: '取消发布'
					}],
					[{
						opt: 'editOrder',
						optText: '修改需求'
					}, {
						opt: 'cancelPublish',
						optText: '取消发布'
					}],
					[{
						opt: 'cancelOrder',
						optText: '取消订单'
					}, {
						opt: 'payPreMoney',
						optText: '支付定金'
					}],
					[{
						opt: 'contact',
						optText: '联系平台'
					}],
					[{
						opt: 'contact',
						optText: '联系平台'
					}, {
						opt: 'payEndMoney',
						optText: '支付尾款'
					}],
					[{
						opt: 'contact',
						optText: '联系平台'
					}, {
						opt: 'ensureRequire',
						optText: '确认收货'
					}],
					[],

				],
				page: {
					pageNum: 1,
					pageSize: 10
				},
				isBottom: false,
				total: 0
			}
		},
		computed: {
			loading() {
				return this.$store.state.loadingShow
			},
			statusUnit() {
				return this.$config.statusSty
			}
		},
		onLoad(val) {
			console.log('onload', config, this.operationBtns[6])

		},

		onShow() {
			this.init()
		},
		methods: {
			// Todo-滑动tab
			onClickItem(val) {
				this.current = val.currentIndex
			},
			// 初始化
			init() {
				this.getUserInfo()
				this.page.pageNum = 1
				this.orderList = []
				this.isBottom = false
				this.getList()
			},

			// 获取订单列表
			getList() {
				let params = {
					userPkid: this.userPkid,
					pageNum: this.page.pageNum,
					pageSize: this.page.pageSize,
					orderByColumn: 'createTime',
					isAsc: 'desc',
				}
				this.API.service.getToken(this.URL.orderList, params).then(res => {
					if (res.code == 200) {
						this.total = res.total
						this.orderList = this.orderList.concat(res.rows) || []
						this.isShow = this.orderList.length

						// app.globalData.showToast('加载成功!');
					}
				})
			},
			
			// 获取用户信息
			getUserInfo() {
				let params = {
					openId:uni.getStorageSync('openId'),
					phoneNumber:uni.getStorageSync('tel')
				}
				this.API.service.getToken(this.URL.getUser,params).then(res => {
					if (res.code == 200) {
						if(!res.data) {
							app.globalData.showToast('用户信息不存在!');
							setTimeout( () => {
									uni.reLaunch({
										url:'../login/login'
									})
							},500)
						}
						uni.setStorageSync('userDetail', res.data)
					}
				})
			},
			
			publish() {
				//this.isShow = !this.isShow
				// 审核验证
				if (uni.getStorageSync('userDetail') != '' && uni.getStorageSync('userDetail').verifyStatus == 1) {
					return app.globalData.showToast('请耐心等待管理员审核!');
				} else if (uni.getStorageSync('userDetail') != '' && uni.getStorageSync('userDetail').verifyStatus == 3) {
					return app.globalData.showToast('您已被管理员审核拒绝!');
				}

				uni.reLaunch({
					url: '../publish/publish'

				})

			},
			// 修改需求
			editOrder(item) {

				let order = JSON.stringify(item)
				uni.navigateTo({
					url: `../publish/publish-edit?order=${order}`
				})
			},

			// 执行取消订单API
			cancelOrderGo(item) {
				let params = {
					userPkid: this.userPkid,
					pkid: item.pkid
				}
				this.API.service.putToken(this.URL.orderCancel, params).then(res => {
					if (res.code == 200) {
						app.globalData.showToast('取消成功!');
						this.init()
					}
				})
			},

			// 取消发布
			cancelPublish(item) {
				uni.showModal({
					title: '确认取消发布?',
					content: '',
					cancelText: '关闭',
					success: res => {
						if (res.confirm) {
							// Todo
							console.log('用户点击确认');
							this.cancelOrderGo(item)

						} else if (res.cancel) {
							console.log('用户点击取消');
						}
					}
				});
			},
			// 取消订单
			cancelOrder(item) {
				uni.showModal({
					title: '确认取消订单?',
					content: '',
					cancelText: '关闭',
					success: res => {
						if (res.confirm) {
							// Todo
							console.log('用户点击确认');
							this.cancelOrderGo(item)
						} else if (res.cancel) {
							console.log('用户点击取消');
						}
					}
				});
			},

			// 退款api
			returnMoney(item) {
				if(item.orderDepositPayType == 1) { // 微信支付退款
					// Todo
					this.returnMoneyByWx(item)
					// app.globalData.showToast('微信支付退款-Todo!');
				} else if(item.orderDepositPayType == 2) { // 余额支付退款
					// Todo
					this.returnMoneyByBanlance(item)
				}  else if(item.orderDepositPayType == 3) { // 银联支付退款 
					// Todo
					app.globalData.showToast('银联支付退款-Todo!');
				} 
			},
			// 余额-支付退款
			returnMoneyByBanlance(item) {
				let params = {
					orderPkid: item.pkid,
					openId: uni.getStorageSync('openId'),
				}
				this.API.service.postToken(this.URL.payRefundByBanlance, params).then(res => {
					if (res.code == 200) {
						app.globalData.showToast('退款成功!');
						this.init()
					} else {
						app.globalData.showToast('退款失败!');
						this.init()
					}
				})
			},
			// 微信-支付退款
			returnMoneyByWx(item) {
				let params = {
					orderPkid: item.pkid,
					openId: uni.getStorageSync('openId'),
					payRefundAmount: item.orderDepositPayAmount
				}
				this.API.service.postToken(this.URL.payRefundByWx, params).then(res => {
					if (res.code == 200) {
						app.globalData.showToast('已提交退款申请,请耐心等待!');
						this.init()
					} else {
						app.globalData.showToast('退款失败!');
						this.init()
					}
				})
			},

			// 退定金
			returnPreMoney(item) {
				uni.showModal({
					title: '确认退款?',
					content: '',
					cancelText: '关闭',
					success: res => {
						if (res.confirm) {
							// Todo
							console.log('用户点击确认');
							this.returnMoney(item)
						} else if (res.cancel) {
							console.log('用户点击取消');
						}
					}
				});
			},
			// 支付定金
			payPreMoney(item) {
				console.log('payPreMoney', item)
				let order = JSON.stringify(item)
				uni.navigateTo({
					url: `../order/orderPay?order=${order}`
				})
			},
			// 联系平台
			contact(item) {
				this.$refs.popup.open()
			},
			// 支付尾款
			payEndMoney(item) {
				console.log('payEndMoney', item)
				let order = JSON.stringify(item)
				uni.navigateTo({
					url: `../order/orderPay?order=${order}`
				})
			},
			// 确认收货api
			receiverOrder(item) {
				let params = {
					orderPkid: item.pkid,
					userPkid: this.userPkid,
				}
				this.API.service.putToken(this.URL.receiverOrder, params).then(res => {
					if (res.code == 200) {
						app.globalData.showToast('收货成功!');
						this.init()
					}
				})
			},
			// 确认收货
			ensureRequire(item) {
				console.log('ensureRequire', item)
				uni.showModal({
					title: '确认收货?',
					content: '',
					cancelText: '关闭',
					success: res => {
						if (res.confirm) {
							// Todo
							console.log('用户点击确认');
							this.receiverOrder(item)
						} else if (res.cancel) {
							console.log('用户点击取消');
						}
					}
				});
			},


			// 订单操作配置
			btnsConfig(item, btn) {
				console.log(item, btn)
				this[btn](item)

			},

			// 拨打电话
			call(phone) {
				// TODO 做一些其他的事情，手动执行 done 才会关闭对话框
				uni.makePhoneCall({
					phoneNumber: phone //仅为示例
				});
				this.$refs.kefuPop.close()
			},
			// 订单详情
			goDetail(item) {
				let order = JSON.stringify(item)
				uni.navigateTo({
					url: `../order/orderDetail?order=${order}`
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

				if (this.orderList.length >= this.total) {
					this.isBottom = true
				} else {
					this.isBottom = false
				}

				if (this.isBottom) {
					return app.globalData.showToast('已经到底啦(*^▽^*)');
				}
				this.page.pageNum = this.page.pageNum + 1
				this.getList()
			},
		}
	}
</script>

<style scoped lang="less">
	page {
		background-color: #F7F7F7 !important;
	}

	.page {
		width: 100%;
		display: flex;
		//justify-content: center;

		align-items: center;
		flex-direction: column;


	}

	.top-tabs {
		width: 100%;
	}

	.main {
		width: 100%;
		height: 100%;
		margin-bottom: 150upx;

		.content {
			width: 100%;
			//padding-top: 25upx;
			padding-left: 25upx;
			padding-right: 25upx;
			padding-bottom: 25upx;

			.item {
				//padding: 10upx;
				padding-top: 10upx;
				//padding-bottom: 20upx;
				margin-top: 20upx;
				width: 100%;
				background: #fff;
				border-radius: 15upx;

				.top {
					display: flex;
					justify-content: flex-start;
					align-items: center;
					padding-top: 15upx;
					padding-bottom: 15upx;
					padding-right: 15upx;
					padding-left: 30upx;
					border-bottom: 1px solid #E5E5E5;

					.status-icon {
						width: 10upx;
						height: 10upx;
						background-color: #007AFF;
					}

					.status-text {
						color: #007AFF;
						margin-left: 10upx;
						font-size: 27upx;
						letter-spacing: 1upx;

					}

					.order-tips {
						// background-color:#FF7F00;
						background: linear-gradient(270deg, #FF7F00 0%, #ffb663 100%);
						color: #FFFFFF;
						border-radius: 40upx;
						padding-top: 2upx;
						padding-bottom: 2upx;
						padding-left: 12upx;
						padding-right: 12upx;
						font-size: 22upx;
						margin-left: 10upx;
					}

					.item-left {
						margin-left: auto;

						image {
							width: 32upx;
							height: 32upx;
						}
					}
				}

				.no-bottom-btn {
					border-radius: 15upx !important;
					border: none !important;
				}

				.mid {
					margin-top: 15upx;
					padding-left: 30upx;
					padding-right: 20upx;
					padding-bottom: 20upx;
					border-bottom: 1px solid #E5E5E5;

					.mid-top {
						font-size: 31upx;
						color: #333333;
						font-weight: 600;
						margin-top: 10upx;
					}

					.mid-item {
						margin-top: 10upx;
						display: flex;
						justify-content: space-between;
						font-size: 28upx;
						color: #999999;

						.item-left {
							display: flex;
							align-items: center;
							width: 60%;

							.item-title {}

							.item-value {
								margin-left: 10upx;
							}
						}

						.item-right {
							width: 40%;
							display: flex;
							align-items: center;

							.item-title {}

							.item-value {
								margin-left: 10upx;
							}
						}

					}

				}

				.bottom {
					display: flex;

					color: #6271AC;
					font-size: 30upx;
					//margin-top: 10upx;
					height: 80upx;
					justify-content: center;
					align-items: center;
					.bottom-item:active{
						background-color: #ece7e7;
					}
					.bottom-item {
						// width: 50%;
						flex: 1;
						height: 100%;
						display: flex;
						justify-content: center;
						align-items: center;
						border-right: 1px solid #E5E5E5;
					}

					view:last-child {
						border: none;
						// width: 100%;
					}
				}
			}
		}
	}

	.main-no {
		width: 100%;
		display: flex;
		// justify-content: center;
		margin-top: 40%;
		align-items: center;
		flex-direction: column;

		.no-image {
			image {
				width: 243upx;
				height: 130upx;

			}
		}

		.no-title {
			color: #333333;
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

	.order-status-sty-1 {
		//待受理
		color: #007AFF !important;
	}

	.order-status-sty-2 {
		//受理中
		color: #0ACFF4 !important;
	}

	.order-status-sty-3 {
		//待支付定金
		color: #FFC800 !important;
	}

	.order-status-sty-4 {
		//进行中
		color: #1EC9FE !important;
	}

	.order-status-sty-5 {
		//待支付尾款
		color: #FF8500 !important;
	}

	.order-status-sty-6 {
		// 确认收货
		color: #405CFF !important;
	}

	.order-status-sty-7 {
		// 已完成
		color: #00DB7B !important;
	}

	.isBottom {
		margin-top: 30upx;
		display: flex;
		align-items: center;
		justify-content: center;
		font-size: 25upx;
		color: #999999;
	}
</style>
