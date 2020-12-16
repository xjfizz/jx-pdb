<template>
	<view class="widthAuto">
		<ourLoading v-if="loading" active text="加载中..." />
		<view class="widthAutoInner">
			<view class="vip-lb" >
				<view class="vip-lb-money" style="line-height: 132upx;width: 100%;">
					头像
					<img :src="memberImg" alt="" class="user-img" />
				</view>
			</view>
			<view class="vip-lb">
				<view class="vip-lb-money">手机号码</view>
				<view class="vip-lb-da">
					<view class="uni-input">{{ retUser.phone }}</view>
					
				</view>
			</view>
			<view class="vip-lb">
				<view class="vip-lb-money">身份</view>
				<view class="vip-lb-da">
					<view class="uni-input">{{ retUser.workType==1?'个人':'企业' }}</view>
				</view>
			</view>
			<view class="vip-lb">
				<view class="vip-lb-money">用户名称</view>
				<view class="vip-lb-da">
					<view class="uni-input">{{ retUser.whatCall }}</view>
					
				</view>
			</view>
			<view class="vip-lb">
				<view class="vip-lb-money">所在行业</view>
				<view class="vip-lb-da">
					<view class="uni-input">{{ retUser.industry }}</view>
					
				</view>
			</view>
			<view class="vip-lb">
				<view class="vip-lb-money" style="width: 150upx;">所在地区</view>
				<view class="vip-lb-da" style="width: 450upx;">
					<h2 class="uni-input">{{ retUser.addrLocation }}</h2>	
				</view>
			</view>
		</view>
		
		<view class="money-go-bug" @tap="butSave">编 辑</view>
	</view>
</template>

<script>
import pickRegions from '@/components/pick-regions/pick-regions.vue';
import factory from '@/utils/factory';
const app = getApp();
export default {
	components: { pickRegions },
	data() {
		return {
			memberImg:
				uni.getStorageSync('memberImg') ||
				'https://timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1584512953238&di=dcb73144acdce77b3581ba0c2461ce98&imgtype=jpg&src=http%3A%2F%2Fimg2.imgtn.bdimg.com%2Fit%2Fu%3D3291027462%2C3305585263%26fm%3D214%26gp%3D0.jpg',
			retUser: '',
			retUserWhatCall: '', //用户名称
			retUserPhone: '', //手机号码

			array: [],
			index: 0,
			selectIndex: 2,

			region: [],
			defaultRegion: [],
			defaultRegionCode: '',
			phone: uni.getStorageSync('tel') || '',
			openId:uni.getStorageSync('openId') || '',
		};
	},
	computed: {
		regionName() {
			if (this.region.length > 0) {
				return this.region.map(item => item.name).join(' ');
			} else {
				return this.defaultRegion.join(' ');
			}
		},
		regionCode() {
			if (this.region.length > 0) {
				return this.region.map(item => item.code).join(' ');
			} else {
				return this.defaultRegion.join(' ');
			}
		},
		loading() {
			return this.$store.state.loadingShow
		},
		
	},
	onLoad(options) {},
	onShow() {
		this.searchOpt();
		this.getUserData();
	},
	onHide() {},
	methods: {
		comNameInput: function(event) {
			this.retUserWhatCall = event.target.value;
		},
		phoneInput: function(event) {
			this.retUserPhone = event.target.value;
		},

		// 获取用户信息
		getUserData() {
			let params = {
				openId:this.openId,
				phoneNumber:this.phone
			}
			this.API.service.getToken(this.URL.getUser,params).then(res => {
				if(res.code == 200) {
					this.retUser = res.data;
					this.memberImg = this.retUser.headImg
					this.retUserWhatCall = this.retUser.whatCall;
					this.retUserPhone = this.retUser.phone;
					this.selectIndex = this.retUser.workType;
				}
			})
			
		},

		butSave(url) {
			const that = this;
			uni.navigateTo({
				url: '/pages/my/userEdit'
			});
		},
		// 获取选择的地区
		handleGetRegion(region) {
			this.region = region;
			console.log(this.region);
		},
		select(e) {
			console.log(e);
			this.selectIndex = e;
		},
		bindPickerChange: function(e) {
			console.log('picker发送选择改变，携带值为', e.target.value);
			this.index = e.target.value;
		},
		// aNav(){
		// 	uni.navigateTo({
		// 	    url: '/pages/user/vipContInfo?supplierid='+this.supplierid
		// 	});
		// },
		searchOpt() {
			this.API.service.get(this.URL.industryList).then( res =>{
				console.log(res)
				if(res.code == 10000) {
					this.array = res.data;
				}
			})
		}
	}
};
</script>

<style>
	/* page{
		background: red !important;
	} */
</style>
<style scoped>

.uni-input{
	/* padding-right: 30upx; */
}
.uni-right {
	position: absolute;
	right: -10upx;
	top: 5upx;
	width: 34upx;
	height: 34upx;
	z-index: 99;
}
.vip-lb-da .select-ok {
	/* ackground: #0074ca;
	color: #fff; */
}
.status-select {
	text-align: center;
	color: #333;
	margin-left: 30upx;
	float: right;
	padding-left: 46upx;
	position: relative;
}
.status-select:before{
	position: absolute;
	width: 30upx;
	height: 30upx;
	top: 0;
	left: 0;
	bottom: 0;
	margin: auto;
	border-radius: 50%;
	/* background: ; */
	content: '';
	border: 1px solid #E5E5E5;
}
.status-select img{
	display: none;
	position: absolute;
	width: 34upx;
	height: 34upx;
	top: 0;
	left: 0;
	bottom: 0;
	margin: auto;
	border-radius: 50%;
	/* background: ; */
	content: '';
}

.vip-lb-da .select-ok:before {
	display: none;
}
.vip-lb-da .select-ok img {
	display: block;
}






.vip-lb-da {
	position: relative;
	float: right;
	width: 300upx;
	text-align: right;
}
.user-img {
	float: right;
	width: 132upx;
	height: 132upx;
	border-radius: 50%;
	margin: 0 0;
}
.vip-lb-input {
	width: 100%;
	/* height: 50upx;
	line-height: 50upx; */
	text-align: right;
	color: #333333;
}
.money-go-bug {
	width: 320upx;
	height: 80upx;
	line-height: 78upx;
	text-align: center;
	background: #ff5400;
	margin: 50upx auto;
	font-size: 32upx;
	color:#fff;
	
	border-radius: 40upx;
	border: 1px solid #ffafa7;
	
}

.money-go-bug:active{
	opacity: 0.55;
}
.vip-name-num {
	font-size: 34upx;
	color: #444;
	padding-top: 10upx;
	padding-left: 30upx;
}
.vip-name-title {
	font-size: 24upx;
	color: #999;
}
.vip-lb-te {
	width: 508upx;
	font-size: 30upx;
	color: #333;
}
.vip-lb-money {
	font-size: 28upx;
	color: #999;
	overflow: hidden;
	float: left;
	width: 300upx;
}
.vip-lb-title {
	font-size: 30upx;
	color: #666;
	width: 170upx;
}
.vip-lb-icon {
	width: 14upx;
	height: 14upx;
	margin-right: 10upx;
	margin-top: 14upx;
}
.vip-lb {
	overflow: hidden;
	padding: 30upx 0;
	border-bottom: 1px solid #E5E5E5;
}
.vip-lb:nth-last-child(1){
	border-bottom: none;
}
.vip-name {
	padding: 40upx 30upx;
	background: #f1f1f1;
}
.widthAuto {
	background: #F7F7F7;
}
.widthAutoInner{
	padding: 0upx 30upx 0;
	background: #fff;
}
</style>
