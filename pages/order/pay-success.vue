<template>
	<view class="page">
		<view class="main-no">
			
			<view class="no-image">
				<image src="../../static/img/money/rcharge-success.png"></image>
			</view>
			<view class="no-title">支付成功</view>
			<view class="no-tips">恭喜您, 已成功完成支付~</view>
			<view class="publish-btn" @tap="back">查看订单</view>
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
				imgHost: '../../static/img/text.png'
			};
		},
		onShow() {
			 uni.hideHomeButton()
		},
		methods:{
			back() {
				uni.reLaunch({
					url:'../index/index'
				})
			}
		}
	}
</script>

<style lang="less">
	.page {
		width: 100%;
	}
	.main-no{
		width: 100%;
		display: flex;
		// justify-content: center;
		margin-top: 40%;
		align-items: center;
		flex-direction: column;
		.no-image{
			image{
				width: 243upx;
				height: 130upx;
				
			}
		}
		.no-title{
			color: #333333;
			font-size: 33upx;
			font-weight: 600;
		}
		.no-tips{
			color: #999999;
			font-size: 25upx;
			margin-top: 20upx;
		}
		.publish-btn{
			width: 400upx;
			height: 80upx;
			background-color: #FFC800;
			display: flex;
			justify-content: center;
			align-items: center;
			border-radius: 15upx;
			margin-top: 55upx;
			color: #333333;
			font-size: 32
			upx;
		}
	}
</style>
