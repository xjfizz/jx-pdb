<template>
	<view class="page">
		<ourLoading v-if="loading" active text="加载中..." />
		<!-- <tab-bar :selected="2"></tab-bar> -->

		<view class="main">
			<view class="content">

				<view class="mid">

					<!-- <uni-calendar ref="calendar" :disable-before="true" :start-date="factory.getNowFormatDate()" :insert="false"
					 @confirm="confirm" /> -->

					<picker mode="date" :value="form.endTime" :start="startDate" @change="bindDateChange">
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

				<!-- <view class="mid">
					<view class="mid-left">
						<view class="left-top">期望交货时间</view>
						<view v-if="!form.endTime" class="left-bottom">请选择您期望的交货时间</view>
						<view v-else class="left-bottom">{{form.endTime}}</view>
					</view>
					<view class="mid-right">
						<image  src="../../static/img/right2.png"></image>
					</view>
				</view> -->

				<view class="tags">


					<view class="tag-head">
						<view class="tag-head-item">{{form.serverParentName}}</view>
						<picker class="item-value-input pick-text-sty" @change="demandSelect" :value="demandType" :range="typeList"
						 :range-key="'classificationName'">
							<image src="../../static/img/right2.png"></image>

						</picker>
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
								<input class="uni-input" @input="preMoneyInput" cursor-spacing="10" v-model="form.preMoney" placeholder-style="color:#CCCCCC;text-align:center"
								 type="digit" placeholder="请输入预算" /><text>元</text>
							</view>
						</view>
						<view class="bottom-item mar-top10">
							<view class="item-title">预付比例</view>
							<view class="item-input">
								<input class="uni-input" @input="prePayRateInput" cursor-spacing="10" v-model="form.prePayRate"
								 placeholder-style="color:#CCCCCC;text-align:center !important;font-size:20upx" type="digit" placeholder="请输入预付比例" /><text>%</text>
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
							<textarea maxlength="-1" class="uni-input" cursor-spacing="10" v-model="form.des" placeholder-style="color:#CCCCCC;"
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
					<text>确认修改</text>
				</view>
				<view v-else class="submit-btn submit-btn-no">
					<text>确认修改</text>
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
					serverParentName:'',
					serverClassificationId:'',
					productNum:'',
					preMoney:'',
					prePayRate:'',
					imgList:[],
					des:'',
					pkid:'',
					shippingAddressId:'',
					province:'',
					city:'',
					region:'',
					detailAddress:'',
					username:'',
					phone:''
					
				},
				order:{},
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
		onLoad(options) {
			console.log('options', this.loading)
			
			let order = JSON.parse(options.order)
			this.order = order
			this.getOrderMainType()
			this.getDetail()
			this.selectType(null,{classificationId:this.order.serverParentId})
		},
		onShow() {
		},
		computed:{
			isAbleSubmit() {
				console.log('form',this.form)
				return this.form.endTime && this.form.productNum && this.form.preMoney && this.form.prePayRate && this.form.province && this.form.serverParentId
			},
			loading() {
				return this.$store.state.loadingShow
			},
		},
		methods: {
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
			
			// 获取订单详情
			getDetail() {
				let params = {
					userPkid: this.userPkid,
					orderStatus:this.order.orderStatus,
				}
				
				  this.$nextTick(() => {
				        this.API.service.getToken(`${this.URL.orderDetail}/${this.order.pkid}`, params).then(res => {
				        	if (res.code == 200) {
				        		this.form.endTime = res.data.orderExpectTime
				        		this.form.pkid = res.data.pkid
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
				        		this.form.imgList = res.data.pdbWechatOrderItems.map(item => {
				        			return item.serverClassificationPic
				        		})
				        		 this.$forceUpdate(); // 强制更新dom
				        	}
				        })
				      });
				

			},
			// 选择产品类型
			selectType(index, item) {
				console.log(item, this.form)
				this.typeKey = index
				this.form.serverParentId = item.classificationId
				 console.log(this.form)
				this.getOrderSubType(item)
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
						// this.getOrderSubType(res.data[0])
					}
				})
			},
			// 产品分类
			demandSelect(e) {
				console.log('picker发送选择改变，携带值为', e, e.target.value)
				this.demandType = e.target.value
				this.form.serverParentId = this.typeList[e.target.value].classificationId
				this.form.serverParentName = this.typeList[e.target.value].classificationName
				this.selectType(this.demandType, this.typeList[e.target.value])
			},
			// 获取订单子类别
			getOrderSubType(item) {
				let params = {
					parentId :item.classificationId
				}
				this.API.service.getNoLoadToken(this.URL.getOrderClassS, params).then(res => {
					if (res.code == 200) {
						this.typeItemList = res.data
						this.form.serverClassificationId = res.data[0].classificationId
					}
				})
			},
			// 提交订单
			submit() {
				console.log('submit', this.form,  uni.getStorageSync('unserDetail'))
				// uni.navigateTo({
				// 	url:'publish-success'
				// })
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
					 // shippingAddressId:this.form.shippingAddressId || undefined,,
					  userPkid: this.userPkid,
					  pkid:this.form.pkid,
				}
				if(this.form.shippingAddressId) {
					params.shippingAddressId = this.form.shippingAddressId
				}
				this.API.service.postToken(this.URL.orderUpdate, params).then(res => {
					if (res.code == 200) {
						app.globalData.showToast('修改成功!');
						setTimeout(() => {
							uni.navigateTo({
								url:'../index/index'
							})
						},500)
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
				display: flex;
				//justify-content: space-between;
				//align-items: center;
				//margin-top: 10upx;
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
					padding-left: 20upx;
					padding-right: 20upx;
					display: flex;
					justify-content: space-between;
					align-items: center;
					background-color: #FFFFFF !important;
					border-radius: 10upx;
					
					.tag-head-item {
						
						height: 100%;
					
						display: flex;
						align-items: center;
						justify-content: center;
						padding-top: 20upx;
						padding-bottom: 20upx;
						border-radius: 10upx;
					}
					image {
						width: 48upx;
						height: 48upx;
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
					border: none;
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
