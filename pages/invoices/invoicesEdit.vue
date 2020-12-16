<template>
	<view class="page">
		<ourLoading v-if="loading" active text="加载中..." />
		<view class="main">
			<view class="main-content">
				<view class="content">
					<view class="item">
						<view class="item-title">发票抬头</view>
						<view class="item-value">
							<input class="uni-input" v-model="form.title" placeholder-style="color:#CCCCCC;text-align:left;font-size:22upx" placeholder="请输入发票抬头" />
						</view>
					</view>
					<view class="item">
						<view class="item-title">发票税号</view>
						<view class="item-value">
							<input class="uni-input" v-model="form.taxNumber"   placeholder-style="color:#CCCCCC;text-align:left;font-size:22upx" placeholder="请输入发票税号" />
							
						</view>
					</view>
				</view>
				<view v-if="isSubmit" class="edit-btn" @tap="invoicesSave">保存</view>
				<view v-else class="edit-btn edit-btn-no">保存</view>

			
				
			</view>
		</view>

	</view>
</template>

<script>
	const app = getApp();
	
	export default {
		data() {
			return {
				form:{
					title:'',
					taxNumber:''
				}
				
			};
		},
		computed:{
			loading() {
				return this.$store.state.loadingShow
			},
			isSubmit() {
				return this.form.title && this.form.taxNumber
			}
		},
		methods:{
			// 保存
			invoicesSave() {
				// uni.navigateTo({
				// 	url:`invoices?current=2`
				// })
				uni.navigateBack()
			}
		},
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
					padding: 30upx;
					
					border-radius: 15upx;
					background-color: #FFFFFF;
				
					.item {
						padding: 20upx;
				
						.item-title {
							margin-top: 10upx;
							margin-bottom: 20upx;
							color: #333333;
							font-size: 25upx;
						}
				
						.item-value {
							margin-top: 20upx;
							margin-bottom: 10upx;
							color: #333333;
							font-size: 25upx;
							input {
								background-color: #F7F7F7 !important;
								border-radius: 15upx;
								border: 1px solid #F7F7F7;
								height: 70upx;
								padding: 15upx;
							}
						}
					}
				
					.item:last-child {
						border-top: 1px solid #E5E5E5;
				
					}
				}
				
				.edit-btn {
					margin: 30upx;
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
				.edit-btn-no{
					background-color: #FFEBA4;
					color: #FFFFFF;
				}
				


				
			}
		}
		
	}
</style>