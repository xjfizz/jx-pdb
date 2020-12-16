<!-- 
项目：图片上传插件
时间：2020.9.24
作者：poiuy
邮箱：935526558@qq.com
备注：接口的返回值是否符合插件缩写的code=0，如果不是请复制 upload 和 asyncUpload 查找该方法 在注释的地方修改。
-->
<template>
	<view class="w-100 imgupload">
		<view class="w-100 flex_wrap">
			<view class="imgs-view" v-for="(v,i) in imgArray" :key="i">
				<image @click="preview(v,i)" :src="v.url"></image>
				<view :class="conf.style?('del-btn-style-'+conf.style):'del-btn'" @click="delImg(i)">
					<image v-if="conf.delIcon" :src="conf.delIcon"></image>
					<text v-if="!conf.delIcon&&conf.style ==1" class="iconfont">&#xe785;</text>
					<text v-if="!conf.delIcon&&conf.style ==2" class="iconfont">&#xe785;</text>
				</view>
				<view class="uploading flex_xy_center" v-if="!v.upload&&loading&&startUpload">
					<view>
						<image v-if="conf.loadIcon" :src="conf.loadIcon"></image>
						<text v-if="!conf.loadIcon&&conf.style ==1" class="iconfont">&#xe6a0;</text>
						<text v-if="!conf.loadIcon&&conf.style ==2" class="iconfont">&#xe616;</text>
						<view class="upload-txt">{{conf.loadText||"上传中..."}}</view>
					</view>
				</view>
<!-- 				<view class="result" v-if="!conf.style&&conf.resultTip&&v.upload">
					<label class="success" v-if="v.result===true">上传成功</label>
					<label class="error" v-if="v.result===false">上传失败</label>
				</view>
				<view v-if="conf.style==1&&conf.resultTip&&v.upload" class="result-style" :class="'result-'+(v.result?1:2)">
					<view v-if="v.result==true"><text class="iconfont">&#xe666;</text>上传成功</view>
					<view v-if="v.result==false"><text class="iconfont">&#xe785;</text>上传失败</view>
				</view> -->
			</view>
			<view v-if="imgArray.length<imgCount" :style="conf.borderStyle" class="upload-img-view flex_xy_center" @click="upPhoto">
				<text v-if="conf.addStyle == '1'" class="iconfont">&#xe615;</text>
				<text v-if="conf.addStyle == '2'" class="iconfont add">&#xe606;</text>
			</view>
		</view>
		<!-- <view v-if="!closeTip&&!tipObj.prompt" class="imgupload__tip">* 最多上传{{imgCount}}张图片(<label> {{imgArray.length}}
			</label>/{{imgCount}})</view>
		<view class="imgupload__tip" :style="{color:tipObj.typeColor}" v-show="tipObj.prompt || tipObj.must">{{tipObj.prompt}}</view> -->
	</view>
</template>

<script>
	export default {
		name: 'imgUpload',
		props: {
			imgArr: { //图片数组
				type: [Array],
			},
			uploadImgCount: { //一次上传图片数
				type: String,
				default: '100'
			},
			imgCount: { //可上传图片总数
				type: String,
				default: '100'
			},
			imgSize: { //图片大小 单位M
				type: Number,
				default: 2
			},
			formData: {
				type: Object,
				default: function() {
					return {}
				}
			},
			imgType: { //如果是小程序，这个值则没用作用
				type: [Array],
				default: function() {
					return ['jpeg', 'png', 'jpg']
				}
			},
			closeTip: {
				type: Boolean,
				default: false
			},
			loading: {
				type: Boolean,
				default: true
			},
			url: { //上传图片Url
				type: String,
			},
			async: {
				type: Boolean,
				default: false
			},
			header: {
				type: Array,
				default: function() {
					return []
				}
			},
			previewMany: { //多图预览
				type: Boolean,
				default: false
			},
			pressImg: { //压缩图片 H5暂不支持压缩api
				type: Number,
				default: -1
			},
			config: {
				type: Object,
				default: function() {
					return {}
				}
			}
		},
		data() {
			return {
				sysInfo: {},
				imgArray: [],
				canUpCount: '',
				startUpload: false,
				tipObj: {
					prompt: '',
					typeColor: '#009100',
					must: false, //必须要存在的时候
					success: '#009100', //成功-#009100; 可自定义修改
					warning: '#bb9300', // 警告 -#bb9300; 可自定义修改
					error: '#FF0000' // 失败--#FF0000; 可自定义修改
				},
				conf: {
					delIcon: '', //删除图片icon
					resultTip: true, //结果提示
					style: '1', //组件默认风格
					loadIcon: '', //加载时的图标
					loadText: '', //加载时的文字
					borderStyle: 'border:2px dotted #dadada',
					addStyle: '1' //添加风格 1 图片标 2 加号标
				},
				headers: {},
				curPlatform: '',
				currIndex: null,
			}
		},
		created() {
			this.getSysInfo();
			console.log('this.imgArr', this.imgArr)
			this.imgArray = this.imgArr || [];
			this.changeImgArr(true);
			this.canUpCount = Number(this.uploadImgCount);
			if (this.url) {
				this.tipObj.prompt = "";
			} else {
				this.tipObj.prompt = "你没有传入上传url,请检查传入参数";
				this.tipObj.typeColor = this.tipObj.error;
			}
			this.changeHeader(this.header);
			// 参数合并
			this.conf = Object.assign(this.conf, this.config);
		},
		watch: {
			imgArr(n, o) {
				this.imgArray = n || [];
				this.changeImgArr(true);
			},
			imgCount(n, o) {
				this.uploadImgCount = n;
				this.canUpCount = Number(this.uploadImgCount);
			},
			url(n, o) {
				if (n) {
					this.tipObj.prompt = "";
				} else {
					this.tipObj.prompt = "你没有传入上传url,请检查传入参数";
					this.tipObj.typeColor = this.tipObj.error;
				}
			},
			header(n, o) {
				this.changeHeader(n);
			},
			config(n, o) {
				this.conf = Object.assign(this.conf, this.config);
			}
		},
		methods: {
			upPhoto() {
				let that = this;
				if (!that.url) {
					that.tipObj.prompt = "你没有传入上传url,请检查！";
					that.tipObj.typeColor = that.tipObj.error;
					return;
				}
				if (Number(that.imgCount - that.imgArray.length) < Number(that.uploadImgCount)) {
					that.canUpCount = Number(that.imgCount - that.imgArray.length);
				}
				if (!that.tipObj.must) {
					that.tipObj.prompt = '';
				}
				that.tipObj.must = false;
				uni.showActionSheet({
					itemList: ['拍照上传', '从相册中选择'],
					success: function(res) {
						if (res.tapIndex == 0) {
							uni.chooseImage({
								count: Number(that.canUpCount),
								sizeType: ['original', 'compressed'], //可以指定是原图还是压缩图，默认二者都有
								sourceType: ['camera'], //从相册选择
								success: function(res) {
									if (res) {
										if (res.tempFiles) {
											for (let item of res.tempFiles) {
												if (item.size > (that.imgSize * 1024 * 1024)) {
													uni.showToast({
														title: `图片不能大于${that.imgSize}M`,
														icon: 'none'
													})
													return false;
												}
												if (item.type) {
													let r = that.imgType.some(v => {
														let type = item.type.split('/');
														if (type.length)
															return (v === type[1]);
													});
													if (!r) {
														uni.showToast({
															title: `只允许上传${that.imgType}的类型`,
															icon: 'none'
														})
														return false;
													}
												}
											}
										}
										that.currIndex = that.imgArray.length;
										that.imgArray = [...that.imgArray, ...res.tempFilePaths];
										that.changeImgArr(false);
										if (that.pressImg >= 0) {
											//存在图片压缩 开启图片压缩
											if (that.checkPlatform()) {
												// H5环境下不支持
												that.pressImages();
											}
										} else {
											//正常异步提交
											that.hasAysnc();
										}
									}
								}
							});
						} else if (res.tapIndex == 1) {
							uni.chooseImage({
								count: Number(that.canUpCount),
								sizeType: ['original', 'compressed'], //可以指定是原图还是压缩图，默认二者都有
								sourceType: ['album'], //从相册选择
								success: function(res) {
									if (res) {
										if (res.tempFiles) {
											for (let item of res.tempFiles) {
												if (item.size > (that.imgSize * 1024 * 1024)) {
													uni.showToast({
														title: `图片不能大于${that.imgSize}M`,
														icon: 'none'
													})
													return false;
												}
												if (item.type) {
													let r = that.imgType.some(v => {
														let type = item.type.split('/');
														if (type.length)
															return (v === type[1]);
													});
													if (!r) {
														uni.showToast({
															title: `只允许上传${that.imgType}的类型`,
															icon: 'none'
														})
														return false;
													}
												}
											}
										}
										that.currIndex = that.imgArray.length;
										that.imgArray = [...that.imgArray, ...res.tempFilePaths];
										that.changeImgArr(false);
										if (that.pressImg >= 0) {
											//存在图片压缩 开启图片压缩
											if (that.checkPlatform()) {
												// H5环境下不支持
												that.pressImages();
											}
										} else {
											//正常异步提交
											that.hasAysnc();
										}
									}
								}
							});
						}
					},
					fail: function(res) {
						console.log(res.errMsg);
					}
				});
			},
			preview(obj, index) {
				if (this.previewMany) {
					let urls = [];
					urls.push(obj.url)
					this.imgArray.map(item => {
						if (obj.id != item.id) {
							urls.push(item.url);
						}
					})
					uni.previewImage({
						urls: urls
					});
				} else {
					// 预览图片(单张)
					uni.previewImage({
						urls: [obj.url]
					});
				}
			},

			changeImgArr(type) {
				for (let index in this.imgArray) {
					let item = this.imgArray[index];
					if (!item.upload) {
						if (item.upload === false) {
							this.imgArray[index].url = item.url;
						} else {
							this.imgArray[index] = {
								id: index,
								upload: type,
								url: item,
								result: null,
							}
						}
					}
				}
			},

			pressImages() {
				const _this = this;
				let success = 0;
				let completeNum = 0;
				for (let item of _this.imgArray) {
					uni.compressImage({
						src: item.url,
						quality: _this.pressImg,
						success: res => {
							++success;
							item.pressUrl = res.tempFilePath;
						},
						error: res => {
							console.log(res);
						},
						complete: res => {
							++completeNum;
							//等待全部压缩完成
							if (completeNum === _this.imgArray.length) {
								console.log(success);
								if (success >= _this.imgArray.length) {
									_this.tipObj.prompt = "全部压缩成功！";
									_this.tipObj.typeColor = _this.tipObj.success;
								} else {
									let errorNum = _this.imgArray.length - success;
									_this.tipObj.prompt = `${errorNum}个文件压缩失败`;
									_this.tipObj.typeColor = _this.tipObj.warning;
								}
								console.log('res', _this.imgArray);
								if (_this.async) {
									//直接上传
									_this.asyncUpload();
								}
							}
						}
					});
				}
			},

			asyncUpload() {
				console.log('==', this.imgArray, this.headers)
				const _this = this;
				if (_this.imgArray.length) {
					_this.startUpload = true;
					_this.tipObj.prompt = "";
					for (let i = _this.currIndex; i < _this.imgArray.length; i++) {
						let item = _this.imgArray[i];
						let subUrl = _this.pressImg >= 0 ? item.pressUrl : item.url;
						uni.uploadFile({
							url: _this.url,
							filePath: subUrl,
							name: 'file',
							header: _this.headers,
							formData: {
								name:'test'
							},
							success: (uploadFileRes) => {
								if (uploadFileRes.statusCode == 200) {
									let res = JSON.parse(uploadFileRes.data);
									/*注意 如果返回的结果字段不一样，请在这里做修改[res.code]*/
									if (res.code === 200 || res.code === '200') {
										//成功情况下
										item.result = true;
										res.code = 200;
									} else {
										item.result = false;
										_this.tipObj.prompt = "上传失败，请检查！";
										_this.tipObj.typeColor = _this.tipObj.error;
									}
									_this.$emit("result", res);
								} else {
									item.result = false;
									_this.$emit("result", uploadFileRes);
								}
							},
							fail: (e) => {
								item.result = false;
								_this.tipObj.prompt = "上传失败，请检查！";
								_this.tipObj.typeColor = _this.tipObj.error;
								console.log(e);
							},
							complete: () => {
								item.upload = true;
								_this.startUpload = false;
								_this.$forceUpdate();
							}
						});
					}
				}
			},

			delImg(i) {
				const _this = this;
				console.log('_this.imgArray',i, this.imgArray)
				uni.showModal({
					title: '提示',
					content: '是否删除这张照片？',
					success: function(res) {
						if (res.confirm) {
							_this.imgArray.splice(i, 1);
							if (_this.async) {
								_this.$emit("delImg", i);
							}
						} else if (res.cancel) {}
					}
				});
			},

			upload(callback) {
					console.log('callback',callback)
				const _this = this;
				if (!_this.async) {
					_this.tipObj.prompt = "";
					if (_this.imgArray.length) {
						this.startUpload = true;
						let successNum = 0;
						let urlArr = [];
						for (let item of _this.imgArray) {
							_this.uploadImg(item, res => {
								/*注意 如果返回的结果字段不一样，请在这里做修改[res.code]*/
								if (res.code == 0) {
									successNum++;
									urlArr.push(res.fileVo); /*需要线上图片地址[res.fileVo]*/
									item.result = true;
								} else {
									urlArr.push(res);
									item.result = false;
								}
								item.upload = true;
								_this.$forceUpdate();
								_this.tipObj.prompt = "正在上传...(成功" + successNum + "张/" + urlArr.length + "张)";
								_this.tipObj.typeColor = _this.tipObj.success;
								if (urlArr.length == _this.imgArray.length) {
									_this.tipObj.prompt = "已全部上传完成！";
									_this.tipObj.typeColor = _this.tipObj.success;
									if (successNum > 0) {
										_this.startUpload = false;
										callback(_this.result(urlArr, successNum));
									} else {
										_this.startUpload = false;
										callback(urlArr); //错误的返回
									}

								}
							});
						}
					} else {
						_this.tipObj.prompt = '请先选择图片后上传！';
						_this.tipObj.typeColor = _this.tipObj.warning;
					}
				} else {
					_this.tipObj.prompt = '在异步模式下无法调用upload方法。';
					_this.tipObj.typeColor = _this.tipObj.warning;
				}
			},

			result(urlArr, successNum) {
				let result = {
					result: 'success',
					code: 0,
					urlArray: urlArr,
					success: successNum
				}
				return result;
			},

			uploadImg(item, callback) {
				console.log('item',item)
				const _this = this;
				let subUrl = _this.pressImg >= 0 ? item.pressUrl : item.url;
				uni.uploadFile({
					url: _this.url,
					filePath: subUrl,
					formData: _this.formData,
					header: _this.headers,
					name: 'file',
					success: (uploadFileRes) => {
						if (uploadFileRes) {
							let res = JSON.parse(uploadFileRes.data);
							res.resCode = 0;
							callback(res);
						}
					},
					fail: (e) => {
						callback({
							resCode: 500,
							msg: '图片上传失败',
							localUrl: item,
							reason: e
						});
					}
				});
			},

			changeHeader(header) {
				console.log('header', header)
				const _this = this;
				if (Array.isArray(header)) {
					for (let item of header) {
						for (let key in item) {
							_this.headers[key] = item[key];
						}
					}
				} else {
					_this.tipObj.prompt = '请使用数组格式的Header传参';
					_this.tipObj.typeColor = _this.tipObj.error;
				}
			},

			//是异步方法的提交
			hasAysnc() {
				const that = this;
				if (that.async) {
					let startIndex = that.imgArray.length;
					//直接上传
					that.asyncUpload(startIndex);
				} else {
					that.$emit("result", {
						code: 500,
						msg: '同步模式下,我不会被调用哦~'
					});
				}
			},

			checkPlatform() {
				const that = this;
				let canUse = true;
				//#ifdef H5
				that.tipObj.prompt = "该环境不支持图片压缩，图片压缩功能不会生效。";
				that.tipObj.must = true;
				that.tipObj.typeColor = that.tipObj.warning;
				canUse = false;
				that.hasAysnc();
				//#endif
				return canUse;
			},

			getSysInfo() {
				const that = this;
				try {
					const res = uni.getSystemInfoSync();
					that.sysInfo = {
						screenWidth: res.screenWidth,
						screenHeight: res.screenHeight
					}
				} catch (e) {
					// error
				}
			}
		}
	}
</script>


<style scoped>
	@font-face {
		font-family: 'iconfont';
		/* project id 2170343 */
		src: url('//at.alicdn.com/t/font_2170343_nij8dm8i18.eot');
		src: url('//at.alicdn.com/t/font_2170343_nij8dm8i18.eot?#iefix') format('embedded-opentype'),
			url('//at.alicdn.com/t/font_2170343_nij8dm8i18.woff2') format('woff2'),
			url('//at.alicdn.com/t/font_2170343_nij8dm8i18.woff') format('woff'),
			url('//at.alicdn.com/t/font_2170343_nij8dm8i18.ttf') format('truetype'),
			url('//at.alicdn.com/t/font_2170343_nij8dm8i18.svg#iconfont') format('svg');
	}

	.iconfont {
		font-family: "iconfont" !important;
		font-size: 30rpx;
		font-style: normal;
		-webkit-font-smoothing: antialiased;
		-webkit-text-stroke-width: 0.2px;
		-moz-osx-font-smoothing: grayscale;
	}


	.w-100 {
		width: 100%;
	}

	.flex {
		/* 转为弹性盒模型*/
		display: flex;
	}

	.flex_bet {
		/* 两端左右*/
		display: flex;
		justify-content: space-between;
	}

	.flex_wrap {
		/* 转为弹性盒模型并自动换行*/
		display: flex;
		flex-wrap: wrap;
	}

	.flex_xy_center {
		display: flex;
		justify-content: center;
		align-items: center;
	}

	.upload-img-view {
		/* height: 165rpx;
		width: 23%; */
		height: 150rpx;
		width: 150rpx;
		border-radius: 10rpx;
		border: 4rpx dotted #F1F1F1;
		/* background-color: #F1F1F1; */
	}

	.upload-img-view>text {
		font-size: 70rpx;
		color: #949494;
	}

	.upload-img-view .add {
		font-size: 55rpx;
	}

	.upload-txt {
		font-size: 24rpx;
		color: #FFFFFF;
	}

	.imgs-view {
		/* height: 165rpx;
		width: 22.5%; */
		height: 150rpx;
		width: 150rpx;
		border-radius: 10rpx;
		margin-right: 1.8%;
		margin-bottom: 16rpx;
		border: 1rpx solid #F1F1F1;
		box-sizing: border-box;
		position: relative;
	}

	.result {
		position: absolute;
		bottom: 0;
		width: 100%;
		height: 45rpx;
		font-size: 26rpx;
		left: 0;
		background-color: rgba(0, 0, 0, .6);
		text-align: center;
		line-height: 45rpx;
		border-bottom-left-radius: 10rpx;
		border-bottom-right-radius: 10rpx;
	}

	.result>.success {
		color: #00b900;
	}

	.result>.error {
		color: #b52e25;
	}

	.uploading {
		position: absolute;
		background-color: rgba(0, 0, 0, .5);
		left: 0;
		top: 0;
		width: 100%;
		height: 100%;
		text-align: center;
		line-height: 100%;
		z-index: 999;
	}

	.uploading image {
		width: 60rpx;
		height: 60rpx;
		z-index: 1000;
		animation: rotation 1s linear infinite;
		-moz-animation: rotation 1s linear infinite;
		-webkit-animation: rotation 1s linear infinite;
		-o-animation: rotation 1s linear infinite;
	}

	.uploading text {
		display: inline-block;
		font-size: 50rpx;
		color: #FFFDEF;
		z-index: 1000;
		animation: rotation 1s linear infinite;
		-moz-animation: rotation 1s linear infinite;
		-webkit-animation: rotation 1s linear infinite;
		-o-animation: rotation 1s linear infinite;
	}


	@keyframes rotation {
		from {
			-webkit-transform: rotate(0deg);
			transform: rotate(0deg);
			-moz-transform: rotate(0deg);
			-o-transform: rotate(0deg);
		}

		to {
			-webkit-transform: rotate(360deg);
			transform: rotate(360deg);
			-moz-transform: rotate(360deg);
			-o-transform: rotate(360deg);
		}
	}

	.imgs-view>image {
		width: 100%;
		height: 100%;
		border-radius: 10rpx;
	}

	.imgupload__tip {
		font-size: 24rpx;
		color: #FF0000;
		margin: 10rpx auto;
	}

	.imgupload__tip>label {
		color: #009100;
	}

	.del-btn {
		position: absolute;
		top: 0;
		right: 0;
		width: 32rpx;
		height: 32rpx;
		z-index: 999;
	}

	.del-btn>image {
		width: 100%;
		height: 100%;
		display: flex;
	}

	.del-btn-style-2 {
		position: absolute;
		top: 0;
		right: 0;
		width: 32rpx;
		height: 32rpx;
		z-index: 999;
	}

	.del-btn-style-1 {
		position: absolute;
		top: 0;
		right: 0;
		width: 44rpx;
		height: 44rpx;
		/* z-index: 999; */
		background: rgba(0, 0, 0, .3);
		color: #ececec;
		border-bottom-left-radius: 30rpx;
		display: flex;
		justify-content: center;
		align-items: center;
		font-size: 15rpx;
	}

	.result-style {
		position: absolute;
		bottom: 0;
		left: 0;
		width: 75%;
		height: 44rpx;
		border-top-right-radius: 50rpx;
		display: flex;
		justify-content: center;
		align-items: center;
		transition: all .5s ease;
		transform: translateX(-100%);
		opacity: 0.4;
	}

	.result-1 {
		background: rgba(7, 169, 19, .75);
		color: white;
		transform: translateX(100%);
		font-size: 15rpx;
		opacity: 1;
	}

	.result-2 {
		background: rgba(239, 0, 5, 0.7);
		color: #dadada;
		font-size: 15rpx;
		transform: translateX(0%);
		opacity: 1;
		
	}
</style>
