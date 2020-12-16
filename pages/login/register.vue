<template>
	<!-- 注册 -->
	
	<view class="widthAuto">
		<ourLoading v-if="loading" active text="加载中..." />
		<view class="widthAutoInner">
			<view class="vip-lb">
				<view class="vip-lb-money">用户身份</view>
				<view class="vip-lb-da">
					<!-- <view class="status-select" v-bind:class="[selectIndex == 2 ? 'select-ok' : '']" @tap="select(2)">企业</view>
					<view class="status-select" v-bind:class="[selectIndex == 1 ? 'select-ok' : '']" @tap="select(1)">个人</view> -->
					
					
					
					
					<view class="status-select" v-bind:class="[selectIndex == 1 ? 'select-ok' : '']" @tap="select(1)">
						<img src="/static/img/selected@2x.png" alt="" class="check_choose" />
						个人</view>
					<view class="status-select" v-bind:class="[selectIndex == 0 ? 'select-ok' : '']" @tap="select(0)">
						<img src="/static/img/selected@2x.png" alt="" class="check_choose" />
						企业</view>
				</view>
			</view>
			
			<view class="vip-lb">
				<view class="vip-lb-money">用户名称</view>
				<view class="vip-lb-da"><input class="vip-lb-input" type="text" value="" @input="onKeyInput" v-model="inputValue" placeholder="输入用户名称" /></view>
			</view>
			
			<view class="vip-lb">
				<view class="vip-lb-money">所在行业</view>
				<view class="vip-lb-da">
					<picker @change="bindPickerChange" :value="index" :range="array" range-key="industryName">
						<view class="uni-input">{{ array[index].industryName }}</view>
						<image class="uni-right" src="/static/img/login/right.png"></image>
					</picker>
				</view>
			</view>
			
			<view class="vip-lb">
				<view class="vip-lb-money" style="width: 150upx;">所在地区</view>
				<view class="vip-lb-da" style="width: 450upx;">
					<pick-regions :defaultRegion="defaultRegionCode" @getRegion="handleGetRegion">
						<h2 style='padding-right: 32upx;'>{{ regionName }}</h2>
						<image class="uni-right" src="/static/img/login/right.png"></image>
					</pick-regions>
				</view>
			</view>
		</view>
		<view class="money-go-bug" @tap="butSave">保 存</view>
		<!-- <vew>{{resCon}}</vew> -->
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
			resCon:'',
			localLocation:{
				lat: '',
				lng: ''
			},
			array: ['帽子','服装','鞋子'],
			index: 0,
			selectIndex: 0, //0企业1个人
			inputValue: '',

			region: [],
			defaultRegion: ['', '', ''],
			defaultRegionCode: '110101'
		};
	},
	computed: {
		loading() {
			return this.$store.state.loadingShow
		},
		regionName() {
			
			if(!this.region[2]){
				return '请选择省市区'
			}
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
		}
	},
	onLoad(options) {
		console.log('onLoad-register')
	},
	onShow() {
		// this.searchOpt();
		this.getIndustryList()
		// this.getLocation()
	},
	onHide() {},
	methods: {
		onKeyInput: function(event) {
			this.inputValue = event.target.value;
		},
		//获取行业字典
		getIndustryList() {
			
			this.API.service.get(this.URL.industryDictionary).then(res => {
				if (res.code == 200) {
					this.array = res.data;
				}
			})
		},
		getLocation() {
			let _self = this;
			wx.getLocation({
				type: 'gcj02',
				success(res) {
					console.log('getLocation', res);
					const latitude = res.latitude
					const longitude = res.longitude
					_self.localLocation = {
						lat: latitude,
						lng: longitude
					}
					_self.goAdress(latitude, longitude);
				}
			})
		},
		goAdress(lat, lng) {
			let _self = this;
			wx.request({
				url: 'https://apis.map.qq.com/ws/geocoder/v1/',
				data: {
					location: `${lat},${lng}`,
					key: this.$config.mapKey,
					get_poi: "1"
				},
				method: 'GET',
				header: {
					'content-type': 'application/json' // 默认值
				},
				success(res) {
					console.log('map', res);
					// _self.city = res.data.result.address_component.city;
				},
				fail(error) {},
				complete: function(error) {}
			})
		},
		butSave(url) {
			const that = this;
			if (that.inputValue == '') {
				app.globalData.showToast('请输入用户名称');
				return false;
			}
			console.log(that.regionName);

			let params = {
				avatar: uni.getStorageSync('userInfo').avatarUrl||'',
				address: that.regionName,
				enterpriseName:this.inputValue,
				industry: that.array[that.index].industryName,
				nickname:uni.getStorageSync('userInfo').nickName,
				openId: uni.getStorageSync('openId'),
				phone: uni.getStorageSync('tel'),
				identity: that.selectIndex
			};
			
			this.API.service.post(this.URL.register,params).then( res =>{
				if(res.code == 200) {
					// uni.reLaunch({
					// 	url: '/pages/index/index'
					// })
					this.getTokenLogin()
				}
			})
			
			
		},
		// 注册完就登陆
		getTokenLogin() {
			let params = {
				openId:uni.getStorageSync('openId')
			}
			let url = this.URL.loginToken
			this.API.service.post(url, params).then( res => {
				if(res.code == 200) {
					uni.setStorageSync('token',res.token)
					 this.$store.commit('isLogin')
					 uni.setStorageSync('isLogin', true)
					
					
					// app.globalData.showToast('操作成功!');
					
					uni.reLaunch({
						url: '../my/my'
					})
				}
			})
		},
		
		// 获取选择的地区
		handleGetRegion(region) {
			this.region = region;
			// console.log(this.region)
		},
		select(e) {
			console.log(e);
			this.selectIndex = e;
		},
		bindPickerChange: function(e) {
			console.log('picker发送选择改变，携带值为', e.target.value);
			this.index = e.target.value;
			
		},
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

<style scoped>
.uni-input{
	padding-right: 30upx;
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
	width: 400upx;
	height: 85upx;
	line-height: 78upx;
	text-align: center;
	background: #ffc800;
	margin: 50upx auto;
	font-size: 32upx;
	font-weight: 600;
	color:#333333;
	
	border-radius: 15upx;
	border: 1px solid #ffaa83;
	
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
	min-height: 100%;
}
.widthAutoInner{
	padding: 0upx 30upx 0;
	background: #fff;
}
</style>
