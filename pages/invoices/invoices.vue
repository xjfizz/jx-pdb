<template>
	<view class="page">
		<ourLoading v-if="loading" active text="加载中..." />
		<view class="main">
			<view class="main-content">
				<view class="content">
					<view class="head">
						<Tabs :TabList="TabList" :currentTab="current" @tabs="tabsChange">
							<TabPane>
								<view class="list1">
									<view class="item" v-for="item in 15">
										<view class="item-top">
											<view class="item-name">棒球帽</view>
											<view class="item-money">￥1000.00</view>
										</view>
										<view class="item-mid">
											<view class="item-title">时间:</view>
											<view class="item-value">2020-10-12 10:12:23</view>
										</view>
										<view class="item-bottom">
											<view class="create-invoice">开票</view>
										</view>
									</view>

								</view>
							</TabPane>
							<TabPane>
								<view class="list2">
									<view class="item" v-for="item in 15">
										<view class="item-top">
											<view class="item-name">棒球帽</view>
											<view class="item-money">￥1000.00</view>
										</view>
										<view class="item-mid">
											<view class="item-title">时间:</view>
											<view class="item-value">2020-10-12 10:12:23</view>
										</view>
									</view>

								</view>
							</TabPane>
							<TabPane>
								<view class="list3">
									<view class='content'>
										<view class="item">
											<view class="item-title">发票抬头</view>
											<view class="item-value">巨像信息科技</view>
										</view>
										<view class="item">
											<view class="item-title">发票税号</view>
											<view class="item-value">1234567789</view>
										</view>
									</view>
									<view class="edit-btn" @tap="invoicesEdit">编辑</view>

								</view>
							</TabPane>
						</Tabs>

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
				current: 0,
				TabList: [{
						title: '待开通'
					},
					{
						title: '开票记录'
					},
					{
						title: '发票信息'
					}
				],
			};
		},
		computed: {
			loading() {
				return this.$store.state.loadingShow
			},
		},
		onLoad(options) {
			console.log('options', options)
			if(options.current){
				this.current = options.current
			}
		},
		onShow() {
			console.log('onShow')
		},
		methods: {
			tabsChange(index) {
				this.current = index
			},
			invoicesEdit() {
				uni.navigateTo({
					url:'invoicesEdit'
				})
			}
		},
	}
</script>

<style lang="less">
	.page {
		.main {
			width: 100%;
			margin-bottom: 200upx;
			background-color: #F7F7F7;

			.main-content {
				.content {

					width: 100%;

					.head {
						.list1 {
							margin: 20upx;

							.item {
								background-color: #FFFFFF;
								min-height: 80upx;
								border-radius: 15upx;
								margin-top: 20upx;

								.item-top {
									padding-left: 20upx;
									padding-right: 20upx;
									padding-top: 10upx;
									padding-bottom: 10upx;
									display: flex;
									justify-content: space-between;

									.item-name {
										color: #333333;
										font-size: 28upx;
										font-weight: 600;
									}

									.item-money {
										color: #ffc800;
										font-size: 28upx;
									}
								}

								.item-mid {
									padding-left: 20upx;
									padding-right: 20upx;
									padding-top: 10upx;
									padding-bottom: 10upx;
									display: flex;
									align-items: center;

									.item-title {
										color: #999999;
										font-size: 25upx;
										display: flex;
										align-items: center;
									}

									.item-value {
										display: flex;
										align-items: center;
										margin-left: 10upx;
										color: #999999;
										font-size: 25upx;
									}
								}

								.item-bottom {
									border-top: 1px solid #E5E5E5;
									padding-left: 20upx;
									padding-right: 20upx;
									padding-top: 20upx;
									padding-bottom: 20upx;
									display: flex;
									justify-content: center;
									margin-top: 20upx;
									align-items: center;

									.create-invoice {
										color: #6271AC;
										font-size: 28upx;
									}
								}
							}
						}

						.list2 {
							margin: 30upx;

							.item {
								background-color: #FFFFFF;
								min-height: 80upx;
								border-radius: 15upx;
								margin-top: 20upx;

								.item-top {
									padding-left: 20upx;
									padding-right: 20upx;
									padding-top: 25upx;
									padding-bottom: 10upx;
									display: flex;
									justify-content: space-between;

									.item-name {
										color: #333333;
										font-size: 28upx;
										font-weight: 600;
									}

									.item-money {
										color: #ffc800;
										font-size: 28upx;
									}
								}

								.item-mid {
									padding-left: 20upx;
									padding-right: 20upx;
									padding-top: 10upx;
									padding-bottom: 25upx;
									display: flex;
									align-items: center;

									.item-title {
										color: #999999;
										font-size: 25upx;
										display: flex;
										align-items: center;
									}

									.item-value {
										display: flex;
										align-items: center;
										margin-left: 10upx;
										color: #999999;
										font-size: 25upx;
									}
								}

								.item-bottom {
									border-top: 1px solid #E5E5E5;
									padding-left: 20upx;
									padding-right: 20upx;
									padding-top: 20upx;
									padding-bottom: 20upx;
									display: flex;
									justify-content: center;
									margin-top: 20upx;
									align-items: center;

									.create-invoice {
										color: #6271AC;
										font-size: 28upx;
									}
								}
							}
						}

						.list3 {
							margin: 30upx;

							.content {

								border-radius: 15upx;
								background-color: #FFFFFF;

								.item {
									padding: 20upx;

									.item-title {
										margin-top: 10upx;
										margin-bottom: 20upx;
										color: #999999;
										font-size: 25upx;
									}

									.item-value {
										margin-top: 20upx;
										margin-bottom: 10upx;
										color: #333333;
										font-size: 25upx;
									}
								}

								.item:last-child {
									border-top: 1px solid #E5E5E5;

								}
							}

							.edit-btn {
								background-color: #ffc800;
								height: 70upx;
								border-radius: 15upx;
								margin-top: 20upx;
								color: #333333;
								font-size: 30upx;
								display: flex;
								align-items: center;
								justify-content: center;
							}
						}
					}


				}




			}
		}

	}
</style>
