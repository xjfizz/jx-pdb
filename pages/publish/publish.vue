<template>
	<view class="page">
		<ourLoading v-if="loading" active text="加载中..." />
		<tab-bar :selected="2"></tab-bar>

		<view class="main">
			<view class="content">
				<view class="head">
					<!-- 轮播图 -->

					<swiper class="head-swiper" autoplay indicator-active-color='#FF5400' :circular="true" :interval="4000" :duration="500">
						<swiper-item v-for="(item, index) in topImg" :key="index">
							<image :src="item.img" mode="scaleToFill"></image>
							<!-- <image  src="../../static/img/order-swiper.png" mode="scaleToFill" ></image> -->

						</swiper-item>

					</swiper>

					<!-- <text>新用户下单有礼</text> -->
				</view>
				<view v-if="historyBtnShow" class="head-down" @tap="historyOrder">
					<text>可使用历史发单，快捷发布</text>
				</view>
				<view class="mid">

					<!-- <uni-calendar ref="calendar" :disable-before="true" :start-date="factory.getNowFormatDate()" :insert="false"
					 @confirm="confirm" /> -->

					<picker mode="date" :value="form.endTime" :start="startDate"  @change="bindDateChange">
						<view class="pick-main">
							<view class="mid-left">
								<view class="left-top">期望交货时间</view>
								<view v-if="!form.endTime" class="left-bottom">请选择您期望的交货时间</view>
								<view v-else class="left-bottom">{{form.endTime}}</view>
							</view>
							<view class="mid-right">
								<image src="../../static/img/right2.png"></image>
							</view>
						</view>
					</picker>
				</view>

				<view class="tags">
					<view class="tag-head">
						<view :class="form.serverParentId == item.classificationId ? 'tag-head-sty' : ''" class="tag-head-item" v-for="(item,index) in typeList"
						 :key="index" @tap="selectType(index,item)">{{item.classificationName}}</view>
					</view>
					<view class="tag-content">
						<view :class="form.serverClassificationId == item.classificationId ? 'tag-headItem-sty' : ''" class="tag-content-item"
						 v-for="(item,index) in typeItemList" :key="index" @tap="selectItemType(item,index)">{{item.classificationName}}</view>
					</view>
					<view class="tag-bottom">
						<view class="bottom-item">
							<view class="item-title">数量</view>
							<view class="item-input">
								<lxc-count @handleCount="handleCountClick" :index="jxq.index" :value="jxq.num" :max="jxq.max" :delayed="100">
								</lxc-count>
							</view>
						</view>
						<view class="bottom-item mar-top10">
							<view class="item-title">您的预算</view>
							<view class="item-input">
								<input class="uni-input" @input="preMoneyInput" cursor-spacing="30" v-model="form.preMoney" placeholder-style="color:#CCCCCC;text-align:left"
								 type="digit" placeholder="请输入预算" /><text>元</text>
							</view>
						</view>
						<view class="bottom-item mar-top10">
							<view class="item-title">预付比例</view>
							<view class="item-input">
								<input class="uni-input" @input="prePayRateInput" cursor-spacing="30" v-model="form.prePayRate"
								 placeholder-style="color:#CCCCCC;text-align:left !important;font-size:20upx" type="digit" placeholder="请输入预付比例" /><text>%</text>
							</view>
						</view>
					</view>
				</view>

				<view class="img-uplod">
					<view class="img-uplod-item">
						<view class="upload-title">上传附件</view>
						<view class="img">

							<imgUpload :header="header" :config="config" previewMany :imgArr="form.imgList" loading async :url="url" @result="resultUrl"
							 @delImg="delImg"></imgUpload>

						</view>
					</view>

					<view class="img-des-item">
						<view class="des-title">需求描述</view>
						<view class="des">
							<textarea class="uni-input" cursor-spacing="60" maxlength="-1" v-model="form.des" placeholder-style="color:#CCCCCC;"
							 placeholder="请详细描述您的需求" />
							</view>
					</view>

				</view>

			<view class="bottom"  @tap="goAddress">
				<view class="bottom-left">
					<view v-if="!form.username" class="left-address">收货地址</view>
					<view v-else class="left-address">
						{{form.username}} {{form.phone}}
					</view>
					<view v-if="!form.province" class="detail-address">您的详细收货信息</view>
					<view v-else class="detail-address">{{form.province}}{{form.city}}{{form.region}}{{form.detailAddress}}</view>
				</view>
				<view class="bottom-right">
					<image src="../../static/img/right2.png"></image>
				</view>
			</view>	
			
			<view class="bottom-btn">
				<view v-if="isAbleSubmit" class="submit-btn" @tap="submit">
					<text>提交</text>
				</view>
				<view v-else class="submit-btn submit-btn-no">
					<text>提交</text>
				</view>
			</view>

				
			</view>

		</view>

	</view>
</template>

<script>
	// import API from '../../api/index.js'
	import factory from '@/utils/factory';

	const app = getApp();
	export default {
		data() {
			return {
				historyBtnShow:false,
				factory: require('@/utils/factory.js'),
				userPkid:uni.getStorageSync('userDetail').pkid,
				topImg:[
					{img:'../../static/img/order-swiper.png'}
				],
				localDate:  this.getDate({format: true}),
				startDate:this.getDate({format: true}),
				form: {
					endTime:'',
					productName:'',
					serverParentId:'',
					serverClassificationId:'',
					productNum:'',
					preMoney:'',
					prePayRate:'',
					imgList:[],
					des:'',
					shippingAddressId:'',
					province:'',
					city:'',
					region:'',
					detailAddress:'',
					username:'',
					phone:''
					
				},
				typeList: [],
				typeItemList: [],
				typeKey: 0, // 产品类型
				typeItemKey: 0, // 产品名称
				jxq: {
					index: 1,
					num: 0,
					max: 100000000
				},
				imgArray: [],
				config: {
					delIcon: '', //删除图片icon
					resultTip: true, //结果提示
					resultType: '1', //结果展示类型
					loadIcon: '', //加载时的图标
					loadText: '' //加载时的文字
				},
				header:[{'Authorization-pdb':('Bearer ' + uni.getStorageSync('token'))},{'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8'}],
				url: this.$config.HOST + this.URL.upload ,
				getGoodsTime:''
			}
		},
		onLoad() {
			this.getUserInfo()
			this.getOrderMainType()
			this.isDefaultAddress()
		},
		onShow() {
			if(uni.getStorageSync('userDetail') != '' && uni.getStorageSync('userDetail').verifyStatus != 2) {
				 app.globalData.showToast('请等待后台管理员审核!');
				setTimeout(() => {
					uni.reLaunch({
						url:'../my/my'
					})
				},500)
			}
			this.historyBtn()
		},
		computed:{
			loading() {
				return this.$store.state.loadingShow
			},
			isAbleSubmit() {
				console.log('form',this.form)
				return this.form.endTime && this.form.productNum && this.form.preMoney && this.form.prePayRate && this.form.province && this.form.serverParentId
			}
		},
		methods: {
			// 获取用户信息
			getUserInfo() {
				let params = {
					openId:uni.getStorageSync('openId'),
					phoneNumber:uni.getStorageSync('tel')
				}
				this.API.service.getToken(this.URL.getUser,params).then(res => {
					if (res.code == 200) {
						if(!res.data) {
							app.globalData.showToast('用户信息不存在!');
							setTimeout( () => {
									uni.reLaunch({
										url:'../login/login'
									})
							},500)
						}
						uni.setStorageSync('userDetail', res.data)
					}
				})
			},
			// 获取日期
			 getDate(type) {
			            const date = new Date();
			            let year = date.getFullYear();
			            let month = date.getMonth() + 1;
			            let day = date.getDate();
			
			            if (type === 'start') {
			                year = year - 60;
			            } else if (type === 'end') {
			                year = year + 2;
			            }
			            month = month > 9 ? month : '0' + month;;
			            day = day > 9 ? day : '0' + day;
			            return `${year}-${month}-${day}`;
			},
			// 预付金额比例
			prePayRateInput() {
				console.log(!isNaN(this.form.prePayRate))
				if(this.form.prePayRate == null || this.form.prePayRate == '' || isNaN(this.form.prePayRate) || this.form.prePayRate < 0 || this.form.prePayRate > 100  ) {
					this.$nextTick(() =>{
						this.form.prePayRate = ''
					})
					return app.globalData.showToast('必须为0-100之间的数字')
				} else {
					//正则2位小数
					let value = (this.form.prePayRate.match(/^\d*(\.?\d{0,2})/g)[0]) || null
					console.log('===', this.form.prePayRate)
					this.$nextTick(() =>{
						this.form.prePayRate =value
					})
				}
			},
			// 预付金额
			preMoneyInput() {
				console.log(!isNaN(this.form.preMoney))
				if(this.form.preMoney == null || this.form.preMoney == '' || isNaN(this.form.preMoney) || this.form.prePayRate < 0) {
					this.$nextTick(() =>{
						this.form.preMoney = ''
					})
					return app.globalData.showToast('必须为大于0的数字')
				} else {
					//正则2位小数
					let value = (this.form.preMoney.match(/^\d*(\.?\d{0,2})/g)[0]) || null
					console.log('===', this.form.preMoney)
					this.$nextTick(() =>{
						this.form.preMoney = value
					})
				}
			},
			// 选择产品类型
			selectType(index, item,history) {
				if(!history) {
					this.form.serverClassificationId = ''
				}
				console.log(item, this.form)
				this.typeKey = index
				this.form.serverParentId = item.classificationId
				 console.log(this.form)
				this.getOrderSubType(item,history)
			},
			
			// 选择具体产品类型
			selectItemType(item,index) {
				console.log(item)
				this.typeItemKey = index
				this.form.serverClassificationId = item.classificationId
			},
			// 计数器
			handleCountClick(val) {
				console.log(val, this.jxq)
				// this.jxq.num = val
				this.form.productNum = val

			},
			// 图片上传
			resultUrl(e) {
				console.log(e, this.form);
				//成功默认为0
				if (e.response == 'success') {
					this.form.imgList.push(e.name);
				}
			},
			// 删除图片回调
			delImg(e) {
				this.form.imgList.splice(e, 1) //为删除图片数组的下标
				console.log('this.form', this.form)
			},
			//打开日历
			 open(){
			      this.$refs.calendar.open();
			        },
			// 选择时间
			confirm(e) {
				console.log(e);
				this.form.endTime = e.fulldate
			},
			// 选择时间
			 bindDateChange(e) {
			    this.form.endTime = e.target.value
			},
			// 跳转地址页
			goAddress() {
				uni.navigateTo({
					url:'../address/address'
				})
			},
			// 获取订单主类别
			getOrderMainType() {
				
				this.API.service.getNoLoadToken(this.URL.getOrderClassM).then(res => {
					if (res.code == 200) {
						this.typeList = res.data
						 this.form.serverParentId = res.data[0].classificationId
						this.getOrderSubType(res.data[0])
					} else {
						uni.reLaunch({
							url:'../login/login'
						})
					}
				})
			},
			// 获取订单子类别
			getOrderSubType(item,history) {
				let params = {
					parentId :item.classificationId
				}
				this.API.service.getNoLoadToken(this.URL.getOrderClassS, params).then(res => {
					if (res.code == 200) {
						this.typeItemList = res.data
						console.log('获取订单子类别', this.form.serverClassificationId, !this.form.serverClassificationId )
						if(!history) {
							this.form.serverClassificationId = res.data[0].classificationId
						}
					}
				})
			},
			//是否有默认地址
			isDefaultAddress() {
				
				let params = {
					userPkid:this.userPkid,
					pageNum:1,
					pageSize:10,
					orderByColumn: 'default_status',
					isAsc: 'asc'
				}
				this.API.service.getToken(this.URL.addressList, params).then(res => {
					if (res.code == 200) {
						if(res.rows && res.rows .length > 0 && res.rows[0].defaultStatus == '0')  {
							this.form.shippingAddressId = res.rows[0].pkid;
							this.form.province = res.rows[0].province;
							this.form.city = res.rows[0].city;
							this.form.region = res.rows[0].region;
							this.form.detailAddress = res.rows[0].detailAddress;
							this.form.username = res.rows[0].receiveName;
							this.form.phone = res.rows[0].receivePhoneNumber;
						}
					}
				})
				
			},
			// 是否显示历史订单按钮
			historyBtn() {
				let params = {
					userPkid: this.userPkid,
				}
				this.$nextTick(() => {
					
					this.API.service.getToken(this.URL.lastOrder, params).then(res => {
						if (res.code == 200) {
							this.historyBtnShow = true
						} else {
							this.historyBtnShow = false
						}
					})
					
				})
			},
			// 历史订单
			historyOrder() {
				let params = {
					userPkid: this.userPkid,
				}
				this.$nextTick(() => {
					
					this.API.service.getToken(this.URL.lastOrder, params).then(res => {
						if (res.code == 200) {
							app.globalData.showToast(res.msg);
							// let data = res.data || {}
							
							this.form.endTime = res.data.orderExpectTime
							this.form.serverParentName = res.data.parentName
							this.form.serverParentId = res.data.serverParentId
							this.form.serverClassificationId = res.data.serverClassificationId
							this.form.productNum = res.data.orderTotalQuantity
							this.jxq.num = this.form.productNum
							this.form.preMoney = res.data.orderBudgetAmount
							this.form.prePayRate = res.data.orderBudgetProportion
							this.form.des = res.data.orderNote
							this.form.username = res.data.receiverName
							this.form.phone = res.data.receiverPhone
							this.form.province = res.data.receiverProvince
							this.form.city = res.data.receiverCity
							this.form.region = res.data.receiverRegion
							this.form.detailAddress = res.data.receiverDetailAddress
							this.form.shippingAddressId = res.data.receiverPkid
							this.form.imgList = res.data.pdbWechatOrderItems.map(item => {
								return item.serverClassificationPic
							})
							this.selectType(null,{classificationId:this.form.serverParentId},true)
							 this.$forceUpdate(); // 强制更新dom
						} else {
							app.globalData.showToast('您还未发布过订单');
						}
					})
					
				})
				
			},
			// 提交订单
			submit() {
				console.log('submit', this.form,  uni.getStorageSync('unserDetail'))
				
				/* 校验-start */
				if(this.form.prePayRate < 0 || this.form.prePayRate > 100 ) {
					return app.globalData.showToast('预付比例不得低于0或大于100%')
				}
				/* 校验-end */
				
				let imgList = this.form.imgList.map(res => {
					return {imgUrl: res}
				})
				
				
				let params = {
					  imgUrls:imgList,
					  orderBudgetAmount: this.form.preMoney,
					  orderBudgetProportion: this.form.prePayRate,
					  orderExpectTime: this.form.endTime,
					  orderNote: this.form.des,
					  orderTotalQuantity: this.form.productNum,
					  serverClassificationId: this.form.serverClassificationId,
					  serverParentId: this.form.serverParentId,
					  shippingAddressId:this.form.shippingAddressId,
					  userPkid: this.userPkid
				}
				this.API.service.postToken(this.URL.orderAdd, params).then(res => {
					if (res.code == 200) {
						app.globalData.showToast('提交成功,等待处理!');
						setTimeout(() => {
							// uni.reLaunch({
							// 	url:'../index/index'
							// })
							
							let order = JSON.stringify(res.data)
							uni.navigateTo({
								url: `../order/orderDetail?order=${order}`
							})
							
						},500)
					} else {
						app.globalData.showToast(res.msg);
					}
				})
			}

		}
	}
</script>

<style scoped lang="less">
	.page {
		width: 100%;
		height: 100%;
		
	}

	.main {
		width: 100%;
		height: 100%;
	

		.content {
			width: 100%;
			min-height: 100%;
			padding: 20upx;
			padding-bottom: 150upx;
			background-color:#F7F7F7!important ;

			.head {
				// background-color: #FFC762;
				background-color: #ffffff;
				height: 250upx;
				border-radius: 20upx;
				display: flex;
				justify-content: center;
				align-items: center;
				color: #FFFFFF;
				font-size: 80upx;
				font-weight: 700;
				.head-swiper{
					border-radius: 20upx;
					width: 100%;
					height: 100%;
				}
				image{
					border-radius: 20upx;
					width: 100%;
					height: 100%;
				}
			}

			.head-down {
				margin-top: 10upx;
				background-color: #FFEFD2;
				display: flex;
				justify-content: center;
				align-items: center;
				color: #FFAB00;
				font-size: 25upx;
				border-radius: 10upx;
				padding: 10upx;
			}

			.mid {
				background-color: #FFFFFF;
				padding: 20upx;
				border-radius: 10upx;
				width: 100%;
				margin-top: 20upx;
				picker{
				width: 100%;
				
				}
				.pick-main{
					width: 100%;
					display: flex;
					justify-content: space-between;
					align-items: center;	
				}
				.mid-left {
					width: 50%;
					.left-top {
						font-size: 30upx;
						color: #333333;
						font-weight: 600;
						padding-top: 8upx;
						padding-bottom: 8upx;
					}

					.left-bottom {
						font-size: 30upx;
						color: #999999;
						padding-top: 8upx;
						padding-bottom: 8upx;
					}

				}

				.mid-right {
					width: 50%;
					text-align: right;
					image {
						width: 48upx;
						height: 48upx;
					}
				}
			}

			.tags {

				margin-top: 10upx;
				border-radius: 10upx;

				.tag-head {
					padding-top: 10upx;
					display: flex;
					overflow-x: scroll;
					display: -webkit-box;
					overflow-x: scroll;
					-webkit-overflow-scrolling:touch;

					.tag-head-item {
						width: 25%;
						height: 100%;

						display: flex;
						align-items: center;
						justify-content: center;
						padding-top: 20upx;
						padding-bottom: 20upx;
						border-radius: 10upx;
					}

					.tag-head-sty {
						background-color: #FFFFFF !important;
					}


				}

				.tag-content {
					padding-top: 20upx;
					padding-bottom: 20upx;
					display: flex;
					align-content: flex-start;
					// justify-content: space-between;
					flex-flow: row wrap;
					background-color: #FFFFFF;
					border-radius: 10upx;

				}

				.tag-content-item {
					flex: 0 0 30%;
					border: 1px solid #E5E5E5;
					display: flex;
					justify-content: center;
					align-items: center;
					padding-top: 15upx;
					padding-bottom: 15upx;
					margin-left: 15upx;
					margin-bottom: 10upx;
					margin-top: 10upx;
					color: #333333;
					border-radius: 10upx;
				}

				.tag-headItem-sty {
					background-color: #FFC800 !important;
					border: none !important;
					color: #FFFFFF;
				}

				.tag-bottom {
					// padding-top: 10upx;
					padding-left: 30upx;
					padding-right: 30upx;
					padding-bottom: 30upx;
					background-color: #FFFFFF;
					border-radius: 10upx;

					.bottom-item {
						display: flex;
						justify-content: space-between;
						align-items: center;
						height: 80upx;
						padding-top: 10upx;
						padding-bottom: 10upx;

						// margin-top: 10upx;
						.item-title {
							font-size: 30upx;
							color: #333333;
							width: 55%;
						
						}

						.item-input {
							display: flex;
							align-items: center;
							justify-content: space-between;
							width: 45%;
							lxc-count{
								width: 100%;
							}
							input {
								border: 1px solid #E5E5E5;
								border-radius: 10upx;
								height: 70upx;
								width: 90%;
								padding: 15upx;
								line-height:normal;
								text-align:center;
							}

						}
					}
				}

			}

			.img-uplod {
				background-color: #FFFFFF;
				margin-top: 20upx;
				padding-top: 10upx;
				padding-left: 30upx;
				padding-right: 30upx;
				padding-bottom: 30upx;
				border-radius: 10upx;
				.img-uplod-item{
					.upload-title{
						font-size: 30upx;
						color: #333333;
					
					}
					.img{
						margin-top: 10upx;
					}
				}
				.img-des-item{
					margin-top: 20upx;
					.des-title{
						font-size: 30upx;
						color: #333333;
			
					}
					.des{
						margin-top: 20upx;
						textarea{
							background-color: #F7F7F7;
							padding: 15upx;
							width: 100%;
							height: 200upx;
							border-radius: 10upx;
						}
					}
				}
				
				
			}
			.bottom{
				background-color: #FFFFFF;
				display: flex;
				justify-content: space-between;
				align-items: center;
				height: 120upx;
				margin-top: 20upx;
				padding-top: 30upx;
				padding-left: 30upx;
				padding-right: 30upx;
				padding-bottom: 30upx;
				border-radius: 10upx;
				.bottom-left{
					.left-address{
						font-size: 30upx;
						padding-top: 5upx;
						padding-bottom: 5upx;
						color: #333333;
					}
					.detail-address{
						padding-top: 5upx;
						padding-bottom: 5upx;
						font-size: 26upx;
						color: #999999;
					}
				}
				.bottom-right{
					image {
							width: 48upx;
							height: 48upx;
						}
					
				}
			}
			
			.bottom-btn{
				display: flex;
				justify-content: center;
				align-items: center;
				margin-top: 15upx;
				.submit-btn:active{
					opacity: 0.55;
				}
				.submit-btn{
					height: 73upx;
					width: 100%;
					background-color: #FFC800;
					color:#333333;
					display: flex;
					justify-content: center;
					align-items: center;
					border-radius: 15upx;
					font-size: 30upx;
				}
				.submit-btn-no{
					background-color: #FFEBA4;
					color: #FFFFFF;
				}
			}
		}
	}

	.mar-top10 {
		margin-top: 10upx;
	}
</style>
