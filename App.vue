<script>
	export default {
		onLaunch: function() {
			console.log('App Launch');
			
			
			var self=this
			// 获取小程序更新机制兼容
			if (wx.canIUse('getUpdateManager')) {
			  const updateManager = wx.getUpdateManager()
			  //1. 检查小程序是否有新版本发布
			  updateManager.onCheckForUpdate(function (res) {
				  
				  // console.log(res);
			    // 请求完新版本信息的回调
			    if (res.hasUpdate) {
			      //2. 小程序有新版本，则静默下载新版本，做好更新准备
			      updateManager.onUpdateReady(function () {
			      //   console.log(new Date())
			        wx.showModal({
			          title: '更新提示',
			          content: '新版本已经准备好，是否重启应用？',
			          success: function (res) {
			            if (res.confirm) {
			              //3. 新的版本已经下载好，调用 applyUpdate 应用新版本并重启
			              updateManager.applyUpdate()
			            } else if (res.cancel) {
			              //如果需要强制更新，则给出二次弹窗，如果不需要，则这里的代码都可以删掉了
			              wx.showModal({
			                title: '温馨提示~',
			                content: '本次版本更新涉及到新的功能添加，旧版本无法正常访问的哦~',
			                success: function (res) { 
							  updateManager.applyUpdate();
			                }
			              })
			            }
			          }
			        })
			      })
			      updateManager.onUpdateFailed(function () {
			        // 新的版本下载失败
					wx.showModal({
					  title: '已经有新版本了哟~',
					  content: '新版本已经上线啦~,请您删除当前小程序，重新搜索打开哟~',
					})
			      })
			    }
			  })
			} else {
			  // 如果希望用户在最新版本的客户端上体验您的小程序，可以这样子提示
			  wx.showModal({
			    title: '提示',
			    content: '当前微信版本过低，无法使用该功能，请升级到最新微信版本后重试。'
			  })
			}
			
		},
		onShow: function() {
			console.log('App Show');
		},
		onHide: function() {
			console.log('App Hide');
		},

		globalData: {
			loadingShow: false,
			baseUrl: "https://lunger.xyz", //请求
			//baseUrl: "https://share.qingchuangweb.com",//线上请求
			//mapKey:'JW4BZ-GCLEU-4DDVZ-4S2BM-HUEP3-GYBDY',//腾讯地图解析key
			showToast: function(title, duration = 1000, icon = 'none') {
				uni.showToast({
					title: title,
					duration: duration,
					icon: icon
				})

			},
		}
	};
</script>

<style>
	@import "colorui/main.css";
	@import "colorui/icon.css";
	@import "colorui/iconfont.css";
	


	/* 解决头条小程序组件内引入字体不生效的问题 */
	/* #ifdef MP-TOUTIAO */
	@font-face {
		font-family: uniicons;
		src: url('/static/uni.ttf');
	}

	/* #endif */

	page {
		height: 100%;
		width: 100%;
	}


	.page {
		width: 100%;
		background-color: #F7F7F7!important;
		font-size: 28upx;
		min-height: 100%;
		display: flex;

	}

	.page-center {
		width: 100%;
		height: 100%;
		background-color: #F7F7F7;
		font-size: 28upx;
		min-height: 100%;
		display: flex;
		justify-content: center;
	}

	.m-bc-y {
		/*  主背景色橘红色 */
		background-color: #FFC800 !important;
		color: #ffffff;
	}

	.m-bc-y-n {
		/*  未选择主背景色橘红色 */
		background-color: #cccccc !important;
		color: #ffffff;
	}

	.m-tx-y {
		/*  主字体色橘红色 */
		color: #FF5400;
	}

	.m-borf-y {
		color: #FF5400 !important;
		border-color: #FF5400 !important;
	}

	.noData {
		color: #CCCCCC;
		font-size: 25upx;
	}

	.no-data-img {
		height: 160upx;
		width: 320upx;
	}
</style>
