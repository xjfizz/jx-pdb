<template>
	<view class="page">
		<ourLoading v-if="loading" active text="加载中..." />
		<view class="main">
			<view class="main-content">
				<view class="content">
					当前测试页
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
				
			};
		},
		computed:{
			loading() {
				return this.$store.state.loadingShow
			},
		},
		methods:{

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
					padding: 25upx;
					width: 100%;


				}
				


				
			}
		}
		
	}
</style>