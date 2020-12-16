<template>
	<view class="page">
		<view class="main">
			<view class="main-content">
				<view class="content">
					<view class="item">
						<view class="item-title">联系人</view>
						<view class="item-input">
							<input class="uni-input" cursor-spacing = "10" v-model="form.userName" placeholder-style="color:#CCCCCC;text-align:left;font-size:22upx" placeholder="请输入联系人姓名" />
						</view>
					</view>

					<view class="item">
						<view class="item-title">联系电话</view>
						<view class="item-input">
							<input class="uni-input" cursor-spacing = "10" v-model="form.phone" placeholder-style="color:#CCCCCC;text-align:left;font-size:22upx" placeholder="请输入联系人电话号码" />
						</view>
					</view>

					<view class="item">
						<view class="item-title">所在地区</view>
						<view class="item-input">
							<!-- 	<input class="uni-input" placeholder-style="color:#CCCCCC;text-align:left;font-size:22upx" placeholder="请选择所在地区" /> -->
							<pick-regions :defaultRegion="defaultRegionCode" @getRegion="handleGetRegion">
								<!-- <view class="input-regions">
									{{regionName}}
								</view> -->
								
									<input disabled class="uni-input" v-model="regionName" placeholder-style="color:#CCCCCC;text-align:left;font-size:22upx" placeholder="请选择所在地区" />

							</pick-regions>
						</view>
					</view>

					<view class="item">
						<view class="item-title">详细地址</view>
						<view class="item-input">
							<input class="uni-input" cursor-spacing = "10" v-model="form.detailAddress" placeholder-style="color:#CCCCCC;text-align:left;font-size:22upx" placeholder="请输入详细的联系地址" />
						</view>
					</view>

				</view>

				<view v-if="isSubmit" class="sub-btn" @tap="submit">保存</view>
				<view v-else class="sub-btn sub-btn-no">保存</view>



			</view>
		</view>

	</view>
</template>

<script>
	import pickRegions from '@/components/pick-regions/pick-regions.vue';
	const app = getApp();

	export default {
		components:{
			pickRegions
		},
		data() {
			return {
				pkid:'',
				factory: require('@/utils/factory.js'),
				userPkid:uni.getStorageSync('userDetail').pkid,
				index: 1,
				btnFix: false,
				region: [],
				defaultRegion:[],
				defaultRegionCode:[],
				form:{
					userName:'',
					phone:'',
					province:'',
					city:'',
					region:'',
					detailAddress:''
				}
			};
		},
		computed: {
			isSubmit() {
				return this.regionName && this.form.userName && this.form.phone && this.form.detailAddress
			},
			regionName() {
				if (this.region.length > 0) {
					return this.region.map(item => item.name).join(' ');
				} else {
					return this.defaultRegion.join(' ');
				}
			},
		},
		onLoad(options) {
			console.log('onload',options)
			this.pkid = options.pkid
			this.getAddressDetail()
		},
		methods: {
			// 获取地址详情
			getAddressDetail(){
				let params = {
					pkid:this.pkid, 
				}
				this.API.service.getToken(`${this.URL.addressDetail}/${params.pkid}`).then(res => {
					if (res.code == 200) {
						this.form.userName = res.data.receiveName
						this.form.phone = res.data.receivePhoneNumber
						this.form.province = res.data.province
						this.form.city = res.data.city
						this.form.region = res.data.region
						this.region = [{name:res.data.province},{name:res.data.city},{name:res.data.region}]
						this.form.detailAddress = res.data.detailAddress
					}
				})
			} ,
			// 获取选择的地区 
			handleGetRegion(region) {
				this.region = region;
				if(this.region[0]) {
					this.form.province = this.region[0].name
				}
				if(this.region[1]) {
					this.form.city = this.region[1].name
				}
				if(this.region[2]) {
					this.form.region = this.region[2].name
				}
				console.log(this.region);
			},
			// 保存
			submit() {
				
				console.log('submit', this.factory.isPhone(this.form.phone))
				
				if(!this.factory.isPhone(this.form.phone)) {
					return app.globalData.showToast('手机号不正确!');
				}
				
				let params = {
					userPkid:this.userPkid,
					pkid:this.pkid,
					receiveName:this.form.userName,
					receivePhoneNumber:this.form.phone,
					province:this.form.province,
					city:this.form.city,
					region:this.form.region,
					detailAddress:this.form.detailAddress
				}
				this.API.service.putToken(this.URL.addressEdit, params).then(res => {
					if (res.code == 200) {
						
						 app.globalData.showToast('操作成功!');
						 setTimeout( () => {
								 uni.navigateBack() 
						 },500)
					}
				})
				
				
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
				display: flex;
				justify-content: center;
				align-items: center;
				flex-direction: column;

				.content {
					width: 100%;
					background-color: #FFFFFF;
					padding: 30upx;

					.item {
						margin-top: 20upx;

						.item-title {
							color: #333333;
							font-size: 28upx;
						}

						.item-input {
							margin-top: 15upx;

							input {
								background-color: #F7F7F7 !important;
								border-radius: 15upx;
								border: 1px solid #F7F7F7;
								height: 70upx;
								padding: 15upx;
							}
							.input-regions{
								background-color: #F7F7F7 !important;
								border-radius: 15upx;
								border: 1px solid #F7F7F7;
								height: 70upx;
								padding: 15upx;
							}
						}

					}

				}
				.sub-btn:active{
					opacity: 0.55;
				}
				.sub-btn {
					width: 80%;
					height: 70upx;
					border-radius: 15upx;
					display: flex;
					justify-content: center;
					align-items: center;
					margin-top: 30upx;
					background-color: #FFC800;
					color: #333333;
					font-size: 25upx;
				}
				.sub-btn-no{
					background-color: #FFEBA4;
					color: #FFFFFF;
				}
			}
		}

	}
</style>
