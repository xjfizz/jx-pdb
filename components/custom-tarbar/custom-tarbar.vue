<template>
	<view class="tabbar_box">
		<view class="tabbar_box_item" v-for="(item, index) in tabbar.value.list " :key="index" @tap="changeTab(item)">
			<view v-if="item.isSpecial" class="tabbar_nav" hover-class="none" :url="item.pagePath" :style="{color:tabbar.selectedColor}">
				<view class='special-wrapper'>
					<image :class="[item.selected == selected  ? 'tabbar_icon acImg' : 'tabbar_icon']" :src="item.iconPath"></image>
				</view>
				<image class='special-text-wrapper'></image>
				<text>{{item.text}}</text>
			</view>
			<view v-else class="tabbar_nav" hover-class="none" :url="item.pagePath" :style="{color:item.selected == selected ? tabbar.value.selectedColor : tabbar.value.color}">
				<image :class="[item.selected == selected  ? 'tabbar_icon acImg' : 'tabbar_icon']" :src="item.selected == selected ? item.selectedIconPath : item.iconPath"></image>
				<text>{{item.text}}</text>
			</view>
		</view>
	</view>

</template>

<script>
	const app = getApp();
	export default {
		props: ['selected'],
		data() {
			return {
				tabbar: {
					value: {
						istab: 9,
						"backgroundColor": "#ffffff",
						"color": "#333333",
						"selectedColor": "#333333",
						"list": [


							{
								"pagePath": "../../pages/index/index",
								"text": "订单",
								"iconPath": "../../static/img/menu/order-no.png",
								"selectedIconPath": "../../static/img/menu/order-selected.png",
								"selected": "0"
							},
							{
								"pagePath": "../../pages/publish/publish",
								"iconPath": "../../static/img/menu/order-publish.png",
								"isSpecial": true,
								"text": "下单",
								"selected": "2"
							},
							{
								"pagePath": "../../pages/my/my",
								"text": "我的",
								"iconPath": "../../static/img/menu/my-no.png",
								"selectedIconPath": "../../static/img/menu/my-selected.png",
								"selected": "1"
							},

						]
					}
				}
			}
		},
		onLoad() {},
		methods: {
			changeTab(item) {
				console.log('item', item)
				// 这里使用reLaunch关闭所有的页面，打开新的栏目页面
				// uni.redirectTo({
				// 	url: item.pagePath
				// })
				
				// 审核验证
				if(item.selected == '2') {
					if(uni.getStorageSync('userDetail') != '' && uni.getStorageSync('userDetail').verifyStatus == 1) {
						 return app.globalData.showToast('请耐心等待管理员审核!');
					} else if(uni.getStorageSync('userDetail') != '' && uni.getStorageSync('userDetail').verifyStatus == 3) {
						 return app.globalData.showToast('您已被管理员审核拒绝!');
					}
				}


				let url = item.pagePath
				uni.reLaunch({
					url
				})
			},
		}
	};
</script>

<style>
	.tabbar_box {
		display: flex;
		flex-direction: row;
		justify-content: space-around;
		position: fixed;
		bottom: 0;
		left: 0;
		z-index: 999;
		width: 100%;
		height: 100upx;
		/* box-shadow: 0 0 2px rgba(0, 0, 0, 0.1); */
		border-top: 1upx solid #f7f7f7;
		background-color: #FFFFFF;
	}



	.middle-wrapper {
		position: absolute;
		right: 310upx;
		bottom: 0;
		background-color: rgb(121, 27, 27);
		/* width: 120upx; */
		width: 100%;
		height: 120upx;
		border-radius: 50%;
		border-top: 2upx solid #f7f7f7;
	}
	.tabbar_box_item{
		width: 33%;
	}

	/* 	.middle-wrapper.iphoneX-height {
		bottom: 66rpx;
	} */

	.tabbar_nav {
		/* flex: 1; */
		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: center;
		font-size: 20upx;
		height: 100%;
		padding: 5upx 0px 0px 0px;
		position: relative;
	}

	.tabbar_icon {
		width: 55upx;
		height: 55upx;
		padding-bottom: 2upx;
	}

	.special-wrapper {
		position: absolute;
		/* left: 77rpx; */
		top: -36rpx;
		width: 96rpx;
		height: 96rpx;
		border-radius: 50%;
		border-top: 2rpx solid #f7f7f7;
		background-color: #fff;
		text-align: center;
		box-sizing: border-box;
		padding: 6rpx;
	}

	.special-wrapper .tabbar_icon {
		width: 85rpx;
		height: 85rpx;
	}

	.special-text-wrapper {
		width: 56rpx;
		height: 56rpx;
	}

	text {
		padding-bottom: 5upx;
	}

	/*  图标抖动 */
	tabImg {}

	@-webkit-keyframes bounce {
    0% {
        transform: scale(1);
    }
    50% {
        transform: scale(1.4);
    }
    100% {
        transform: scale(1);
    }
}
 
.acImg{
	animation: bounce .3s;
}

/* 	.acImg {
		animation: bounce 0.3s;
	}

	@keyframes bounce {

		0%,
		100% {
			transform: translateX(0)
		}



		30% {
			transform: translateX(-7px)
		}

		40% {
			transform: translateX(6px)
		}


		70% {
			transform: translateX(-3px)
		}

		80% {
			transform: translateX(2px)
		}

		90% {
			transform: translateX(-1px)
		}
	} */
</style>
