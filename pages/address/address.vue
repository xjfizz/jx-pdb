<template>
	<view class="page">
		<ourLoading v-if="loading" active text="加载中..." />
		<view class="main">
			<view class="main-content">
				<view class="content" :class="isNoData ? 'flex-content' : '' " >

				
					<!-- <view v-if="addressList && addressList.length == 0" class="no-data">暂无数据</view> -->
					<view class="main-no" v-if="addressList && addressList.length == 0">
					
						<view class="no-image">
							<image src="../../static/img/no-data.png"></image>
						</view>
						<view class="no-title">暂无数据</view>
					</view>
					
					

					<view class="item" v-else @tap="selectAddress(item)" v-for="(item,index) in addressList" :key="index">
						<view class="head">
							<text class="head-name">{{item.receiveName}}</text>
							<text class="head-phone">{{item.receivePhoneNumber}}</text>
						</view>
						<view class="mid">
							<text class="mid-address">{{item.province}}{{item.city}}{{item.region}}{{item.detailAddress}}</text>
						</view>
						<view class="bottom">
							<view class="bottom-left">
								<radio value=true :checked=" item.defaultStatus == '0' " @tap.stop="selectDefault(item)" />
								<text class="radio-tips">设为默认</text>
							</view>
							<view class="bottom-right">
								<view class="delete-btn" @tap.stop="del(item)">删除</view>
								<view class="edit-btn" @tap.stop="edit(item)">编辑</view>
							</view>
						</view>
					</view>

					<view v-if="isBottom && addressList.length > 0" class="isBottom">我是最后的底线~</view>
					<view class="add-btn" :class="isNoData ? 'fix-bottom' : '' " @tap="goAdd">
						<image class="add" src="../../static/img/address/add.png"></image>

						<text>新增</text>

					</view>

					<!-- 	<image class="add-icon" src="../../static/img/address/add-icon.png" @tap="goAdd"></image> -->

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
				index: 1,
				btnFix: false,
				addressList: [],
				page: {
					pageNum: 1,
					pageSize: 10
				},
				isBottom: false,
				total: 0

			};
		},
		computed: {
			loading() {
				return this.$store.state.loadingShow
			},
			isNoData() {
				return this.addressList && this.addressList.length == 0
			}
		},
		onShow() {
			this.init()
		},
		methods: {
			// 初始化
			init() {
				this.page.pageNum = 1
				this.addressList = []
				this.isBottom = false
				this.getList()
			},
			// 获取地址列表
			getList() {
				let params = {
					userPkid: this.userPkid,
					pageNum: this.page.pageNum,
					pageSize: this.page.pageSize,
					orderByColumn: 'default_status',
					isAsc: 'asc'
				}
				this.API.service.getToken(this.URL.addressList, params).then(res => {
					if (res.code == 200) {
						this.total = res.total
						this.addressList = this.addressList.concat(res.rows)
						// app.globalData.showToast('加载成功!');
					}
				})
			},
			selectDefault(item) {
				console.log(item)
				// if(item.defaultStatus == '1') {
				// 	item.defaultStatus = '0'
				// } else if(item.defaultStatus == '0') {
				// 	item.defaultStatus = '1'
				// }
				this.setDefault(item)
			},
			// 设置为默认
			setDefault(item) {
				let params = {
					userPkid: item.userPkid,
					pkid: item.pkid
				}
				this.API.service.putToken(this.URL.addressSetDefault, params).then(res => {
					if (res.code == 200) {
						app.globalData.showToast(res.msg);
						this.init()
					}
				})
			},
			// 删除
			delAddress(item) {
				let params = {
					pkid: item.pkid,
				}
				this.API.service.deleteToken(`${this.URL.addressDel}/${params.pkid}`).then(res => {
					if (res.code == 200) {
						this.init()
						app.globalData.showToast(res.msg);
					}
				})
			},
			// 是否删除
			del(item) {
				uni.showModal({
					title: '确认删除?',
					cancelText: '关闭',
					success: res => {
						if (res.confirm) {
							// Todo
							this.delAddress(item)
							console.log('用户点击确认');

						} else if (res.cancel) {
							console.log('用户点击取消');
						}
					}
				});
			},
			// 编辑
			edit(item) {
				// Todo
				uni.navigateTo({
					url: `addressEdit?pkid=${item.pkid}`
				})
			},
			// 新增
			goAdd() {
				uni.navigateTo({
					url: 'addressAdd'
				})
			},
			// 选择地址
			selectAddress(item) {

				let pages = getCurrentPages(); //获取所有页面栈实例列表
				let nowPage = pages[pages.length - 1]; //当前页页面实例
				let prevPage = pages[pages.length - 2]; //上一页页面实例
				prevPage.$vm.form.shippingAddressId = item.pkid; //修改上一页data里面的searchVal参数值为1211
				prevPage.$vm.form.province = item.province;
				prevPage.$vm.form.city = item.city;
				prevPage.$vm.form.region = item.region;
				prevPage.$vm.form.detailAddress = item.detailAddress;
				prevPage.$vm.form.username = item.receiveName;
				prevPage.$vm.form.phone = item.receivePhoneNumber;
				uni.navigateBack({ //uni.navigateTo跳转的返回，默认1为返回上一级
					delta: 1
				});
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

				if (this.addressList.length >= this.total) {
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
		},

		onPageScroll(e) {
			// this.btnFix = true
		}
	}
</script>

<style lang="less">
	.page {
		.main {
			width: 100%;
			margin-bottom: 150upx;
			background-color: #F7F7F7;

			.main-content {
				.content {
					padding: 25upx;
					width: 100%;
					.item {
						margin-top: 20upx;
						background: #FFFFFF;
						padding: 20upx;
						border-radius: 15upx;
						min-height: 100upx;

						.head {
							display: flex;
							align-items: center;
							color: #333333;
							font-size: 35upx;

							// font-weight: 600;
							.head-name {
								display: flex;
								align-items: center;
							}

							.head-phone {
								display: flex;
								align-items: center;
								margin-left: 20upx;
							}
						}

						.mid {
							display: flex;
							align-items: center;
							padding-top: 20upx;
							padding-bottom: 20upx;

							.mid-address {
								overflow: hidden;
								text-overflow: ellipsis;
								white-space: nowrap;

								color: #999999;
								font-size: 28upx;
							}
						}

						.bottom {
							display: flex;
							align-items: center;
							border-top: 1px solid #E5E5E5;
							padding-top: 25upx;

							// padding-bottom: 15upx;
							.bottom-left {
								width: 70%;
								display: flex;

								radio {}

								.radio-tips {
									margin-left: 15upx;
									color: #999999;
									font-size: 28upx;
								}
							}

							.bottom-right {
								width: 30%;
								display: flex;
								align-items: center;
								justify-content: space-around;
								color: #6271AC;
								font-size: 28upx;

								.delete {}

								.edit {}
							}
						}
					}
					.add-btn:active{
						background-color: #ece7e7;
					}
					.add-btn {
						position: sticky;
						bottom: 0;
						margin-top: 20upx;
						background-color: #FFFFFF;
						display: flex;
						justify-content: center;
						align-items: center;
						height: 80upx;
						border-radius: 15upx;

						// border-top: 1px solid #E5E5E5;
						.add {
							width: 32upx;
							height: 32upx;
						}

						text {
							margin-left: 10upx;
							color: #333333;
							font-size: 30upx;
							font-weight: 600;
						}
					}

					.btn-fix {
						width: 100%;
						position: fixed;
						bottom: 20%;

					}

					.add-icon {
						width: 64upx;
						height: 64upx;
						position: fixed;
						right: 30upx;
						bottom: 20%;
					}

				}




			}
		}

	}

	.no-data {
		// margin-top: 300upx;
		display: flex;
		align-items: center;
		justify-content: center;
		font-size: 25upx;
		color: #999999;
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
		margin-top: 40%;
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
	.fix-bottom{
		position: fixed !important;
		bottom:20upx !important;
		width: 90%;
		//top: 50upx;
	}
	.flex-content{
		display: flex;
		justify-content: center;
		align-items: center;
		flex-direction: column;
	}
</style>
<style>
	radio .wx-radio-input.wx-radio-input-checked {
		border: 1rpx solid #FFC800 !important;
		background: #FFC800 !important;
	}
</style>
