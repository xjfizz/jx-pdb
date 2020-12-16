<template>
	<view>
		<view class="content">
			<view class="top">
				<image class="top-img" src="../../static/img/kefu-bac.png"></image>
			</view>
			<view class="bottom">
				<view class="bottom-title">联系平台</view>
				<view class="bottom-phone">{{phone}}</view>
				<view class="bottom-phone-btn" @click="call(phone)">立即拨打</view>
				<view class="bottom-cancel" @click="close">取消</view>
			</view>
		</view>

	</view>
</template>

<script>
	/**
	 * PopUp 弹出层-消息提示
	 * @description 弹出层-消息提示
	 * @tutorial https://ext.dcloud.net.cn/plugin?id=329
	 * @property {String} type = [success|warning|info|error] 主题样式
	 *  @value success 成功
	 * 	@value warning 提示
	 * 	@value info 消息
	 * 	@value error 错误
	 * @property {String} message 消息提示文字
	 * @property {String} duration 显示时间，设置为 0 则不会自动关闭
	 */

	export default {
		name: 'keFuPopup',
		props: {
			phone:{
				type:String,
				default: ''
			}
		},
		inject: ['popup'],
		data() {
			return {}
		},
		created() {
		},
		methods: {
			/**
			 * call拨打电话
			 */
			call(phone) {
				this.$emit('call',phone, () => {
					this.popup.close()
				})
			},
			/**
			 * 关闭窗口
			 */
			close() {
				this.popup.close()
			}
		}
	}
</script>
<style scoped lang="less">
	.content{
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
	}
	.top{
		.top-img{
			width:472upx ;
			height: 212upx;
		}
	}
	.bottom{
		margin-top: -10upx;
		z-index: 10000;
		width:520upx ;
		background-color: #FFFFFF;
		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: center;
		padding: 20upx;
		border-radius: 15upx;
		.bottom-title{
			color:#999999 ;
			font-size: 25upx;
			padding: 10upx;
		}
		.bottom-phone{
			color:#333333 ;
			font-size: 40upx;
			padding: 10upx;
			margin-top: 10upx;
			font-weight: 600;
		}
		.bottom-phone-btn{
			color:#333333 ;
			font-size: 35upx;
			background-color:#ffc800;
			width: 400upx;
			height: 80upx;
			display: flex;
			justify-content: center;
			align-items: center;
			padding: 10upx;
			border-radius: 15upx;
			margin-top: 30upx;
			font-weight: 600;
		}
		.bottom-cancel{
			color:#FFC800 ;
			font-size: 26upx;
			padding: 10upx;
			margin-top: 20upx;
		}
	}
</style>