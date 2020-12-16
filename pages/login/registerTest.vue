<template>
	<!-- 注册 -->
	<view class="widthAuto">
		sssssssssss
		<view class="widthAutoInner">
			<view class="vip-lb">
				<view class="vip-lb-money">选择身份</view>
				<view class="vip-lb-da">
					<!-- <view class="status-select" v-bind:class="[selectIndex == 2 ? 'select-ok' : '']" @tap="select(2)">企业</view>
					<view class="status-select" v-bind:class="[selectIndex == 1 ? 'select-ok' : '']" @tap="select(1)">个人</view> -->
					
					
					
					
					<view class="status-select" v-bind:class="[selectIndex == 1 ? 'select-ok' : '']" @tap="select(1)">
						<img src="/static/img/choosed_img.png" alt="" class="check_choose" />
						个人</view>
					<view class="status-select" v-bind:class="[selectIndex == 2 ? 'select-ok' : '']" @tap="select(2)">
						<img src="/static/img/choosed_img.png" alt="" class="check_choose" />
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
					<picker @change="bindPickerChange" :value="index" :range="array">
						<view class="uni-input">{{ array[index] }}</view>
						<image class="uni-right" src="/static/img/right.png"></image>
					</picker>
				</view>
			</view>
			
			<view class="vip-lb">
				<view class="vip-lb-money">所在地区</view>
				<view class="vip-lb-da">
					<pick-regions :defaultRegion="defaultRegionCode" @getRegion="handleGetRegion">
						<h2 style='padding-right: 32upx;'>{{ regionName }}</h2>
						<image class="uni-right" src="/static/img/login/right.png"></image>
					</pick-regions>
				</view>
			</view>
		</view>
		<view class="money-go-bug" @tap="butSave">提 交</view>
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
			
			array: [],
			index: 0,
			selectIndex: 2, //2企业1个人
			inputValue: '',

			region: [],
			defaultRegion: ['', '', ''],
			defaultRegionCode: '110101'
		};
	},
	computed: {
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
		this.searchOpt();
	},
	onHide() {},
	methods: {
		onKeyInput: function(event) {
			this.inputValue = event.target.value;
		},
		butSave(url) {
			const that = this;
			if (that.inputValue == '') {
				app.globalData.showToast('请输入用户名称');
				return false;
			}
			console.log(that.regionName);

			let params = {
				headImg: uni.getStorageSync('memberImg')||'',
				addr: that.regionName,
				industry: that.array[that.index],
				name: that.inputValue,
				username: uni.getStorageSync('openId'),
				password: uni.getStorageSync('openId'),
				phone: uni.getStorageSync('tel'),
				workType: that.selectIndex
			};
			let success = res => {
				const { status, data, message } = res.data;
				console.log(data);

				// if (status == 0) {
				// //todo
				// that.resCon = JSON.stringify(res);
				// setTimeout(function() {
					uni.switchTab({
						url: '/pages/index/index'
					});
				// }, 5000);

				// } else {
				// 	uni.showToast({
				// 		title: message,
				// 		icon: 'none',
				// 		success: () => {
				// 			that.wxLogin()
				// 		}
				// 	})
				// }
			};
			that.$request.doPostDefaultByJson(app.globalData.urlConfig.wxUserSignUP, success, params);
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
		// aNav(){
		// 	uni.navigateTo({
		// 	    url: '/pages/user/vipContInfo?supplierid='+this.supplierid
		// 	});
		// },
		searchOpt() {
			this.API.service.get(this.URL.industryList).then( res =>{
				if(res.code == 10000) {
					this.array = res.data.data;
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
	width: 320upx;
	height: 80upx;
	line-height: 78upx;
	text-align: center;
	background: #FF5400;
	margin: 50upx auto;
	font-size: 32upx;
	color:#fff;
	
	border-radius: 40upx;
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
}
.widthAutoInner{
	padding: 0upx 30upx 0;
	background: #fff;
}
</style>
