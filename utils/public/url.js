const URL = {
	// 巨象派单小程序接口
	getWXOpendId:"/pdb-wechat-user-info/openid", // 获取微信openId
	getTel: "/pdb-wechat-user-info/decrypt", // 获取手机号
	registerCheck: "/pdb-wechat-user-info/check-register", // 检查用户是否注册
	register: "/pdb-wechat-user-info/user-register", // 注册
	industryList: "/commonData/industryList", // 获取行业列表
	wxUserSignUP: "/user/wxUserSignUP", // 注册
	loginToken: '/pdb-wechat-user/login', // 获取登陆token
	loginOut: '/pdb-wechat-user/logout', // 退出登陆
	getUser: '/pdb-wechat-user-info/get', // 获取用户信息
	updateUserInfo: '/pdb-wechat-user-info/update', // 更新用戶信息
	getCustomer: '/pdb-wechat-user-info/get-customer-service', // 获取客服电话
	getOrderClassM: '/pdb-wechat-user-order/list-main-classification', // 获取订单产品主分类
	getOrderClassS: '/pdb-wechat-user-order/list-sub-classification', // 获取订单产品子分类
	upload: '/obs-bucket-file/upload', // 上传图片
	payCharge: '/pay/charge', // 微信充值
	orderAdd: '/pdb-wechat-user-order/add', // 新增订单
	addressAdd: '/pdb-wechat-user/address/add', // 新增地址
	addressEdit: '/pdb-wechat-user/address/update', // 修改地址
	addressList: '/pdb-wechat-user/address/list', // 地址列表
	addressDel: '/pdb-wechat-user/address', // 删除地址
	addressDetail: '/pdb-wechat-user/address', // 地址详情
	addressSetDefault: '/pdb-wechat-user/address/set', // 地址详情
	orderList: '/pdb-wechat-user-order/list', // 订单列表
	orderUpdate: '/pdb-wechat-user-order/update', // 修改订单
	orderCancel: '/pdb-wechat-user-order/cancel-order', // 取消订单
	orderDetail: '/pdb-wechat-user-order/get', // 订单详情
	payDeposit: '/pdb-wechat-user-order/pay-deposit', // 支付定金
	returnDeposit: '/pdb-wechat-user-order/refund-pay-deposit', // 退还定金
	payBalance: '/pdb-wechat-user-order/pay-balance', // 支付尾款
	processList: '/pdb-wechat-user-order/list-report-progress', // 生产进度详情
	lastOrder: '/pdb-wechat-user-order/list-history', // 历史最新订单
	receiverOrder: '/pdb-wechat-user-order/confirm-receipt', // 收货
	pay: '/pdb-wechat-pay/pay-order', // 支付
	rechage: '/pdb-wechat-pay/wallet-recharge-unified-order', // 充值
	walletBalance: '/pdb-wechat-wallet/get-wallet-balance', // 我的余额
	walletDetails: '/pdb-wechat-wallet/list-wallet-details', // 余额明细
	payCancel: '/pdb-wechat-pay/wallet-recharge-cancel', // 充值取消回调
	payOrder: '/pdb-wechat-pay/order-pay-unified-order', // 订单支付-统一下单
	payOrderCancel: '/pdb-wechat-pay/pay-order-cancel', // 订单支付取消回调
	payOrderWallet: '/pdb-wechat-pay/order-wallet-pay', // 订单余额支付
	payRefundByBanlance: '/pdb-wechat-pay/wallet-pay-refund', // 余额-支付退款
	payRefundByWx: '/pdb-wechat-pay/wechat-pay-refund', // 微信-支付退款
	
	
	/* 字典-start */
	industryDictionary: '/pdb-wechat-user-info/list-industry', // 行业字典
	/* 字典-end */
	
}

export default URL