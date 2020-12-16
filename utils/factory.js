// 时间转换 yy-mm-dd hh:mm:ss
let toDate = function(number) {
	var n = number - 0;
	var date = new Date(n);
	var Y = date.getFullYear() + '-';
	var M = (date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1) + '-';
	var D = (date.getDate() < 10 ? '0' + date.getDate() : date.getDate()) + ' ';
	var H = (date.getHours() < 10 ? '0' + date.getHours() : date.getHours()) + ':';
	var MI = (date.getMinutes() < 10 ? '0' + date.getMinutes() : date.getMinutes()) + ':';
	var S = (date.getSeconds() < 10 ? '0' + date.getSeconds() : date.getSeconds());
	return (Y + M + D + H + MI + S)
};
// 获取当前日期
let getNowFormatDate = function () {
        var date = new Date();
        var seperator1 = "-";
        var year = date.getFullYear();
        var month = date.getMonth() + 1;
        var strDate = date.getDate();
        if (month >= 1 && month <= 9) {
            month = "0" + month;
        }
        if (strDate >= 0 && strDate <= 9) {
            strDate = "0" + strDate;
        }
        var currentdate = year + seperator1 + month + seperator1 + strDate;
        return currentdate;
    }

// 时间转换 yy-mm-dd
let toDateNoTime = function(number) {
	var n = number - 0;
	var date = new Date(n);
	var Y = date.getFullYear() + '-';
	var M = (date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1) + '-';
	var D = (date.getDate() < 10 ? '0' + date.getDate() : date.getDate());
	return (Y + M + D)
};


// 校验是否授权
let isAuthorizationTrue = function(backDelta) {
	uni.getSetting({
		success: res => {
			if (!res.authSetting["scope.userInfo"]) {
				uni.navigateTo({
					url: `/pages/login/login?backDelta=${backDelta}`,
				})
			}
		}
	})
};

// 校验是否授权
let isLogin = function(backDelta) {
	let memberId = uni.getStorageSync('memberId') || ''
	if (!memberId) {
		uni.navigateTo({
			url: `/pages/login/login?backDelta=${backDelta}`,
		})
		return
	}
};


// 判断是否为整数
let isInteger = function(obj) {
	if (Math.round(obj) === obj) {
		return obj.toFixed(1);
	} else {
		return obj
	}
};

/***
 * 判断用户滑动
 * 左滑还是右滑
 */
let getTouchData = (endX, endY, startX, startY) => {
	let turn = "";
	if (endX - startX > 50 && Math.abs(endY - startY) < 50) { //右滑
		turn = "right";
	} else if (endX - startX < -50 && Math.abs(endY - startY) < 50) { //左滑
		turn = "left";
	}
	return turn;
};

// 格式化手机号
let formatTel = function(tel) {
	return tel.substring(0, 3) + '****' + tel.substring(7, 11);
};
let isPhone = function (tel) {
    var reg =/^0?1[3|4|5|6|7|8][0-9]\d{8}$/;
    return reg.test(tel);
};
// 格式化银行卡号
let formatBankNo = function(val) {
	return val.replace(/\s/g,'').replace(/(\d{4})\d+(\d{4})$/, "**** **** **** $2") // **** **** **** 6598

};

// 格式化用户名
let formatUserName = function desensitization(str, beginLen, endLen) {
	let len = str.length;
	let firstStr = str.substr(0, beginLen);
	let lastStr = str.substr(endLen);
	let middleStr = str.substring(beginLen, Math.abs(endLen)).replace(/[\s\S]/ig, '*');
	let tempStr = firstStr + middleStr + lastStr;
	return tempStr;
}
// 倒计时时间计算 
let formatTime = function(second) {
	if (parseFloat(second).toString() == "NaN") {
		return {
			second: "00",
			minute: "00"
		}
	}
	let secondTime = second % 60,
		minuteTime = Math.floor(second / 60);
	if (secondTime < 10) {
		secondTime = "0" + secondTime
	}

	if (minuteTime < 10) {
		minuteTime = '0' + minuteTime
	}

	return {
		second: secondTime,
		minute: minuteTime
	}
};

// 格式化data
let formatData = function(val) {
	let arr = [null, 'null', '' ,' ', undefined, 'undefined']
	if (arr.includes(val)) {
		val = ''
	};
	return val;
}

// 数据字典格式化
let getLabel = function(val, options) {
	let label;
	options.forEach(item => {
		if (item.value == val) {
			label = item.label;
		}
	})
	return label;
}


// 数组对象排序 data.sort(factory.arraySort('prop'))
let arraySort = function(prop) {
	return function(obj1, obj2) {
		var val1 = obj1[prop];
		var val2 = obj2[prop];
		if (!isNaN(Number(val1)) && !isNaN(Number(val2))) {
			val1 = Number(val1);
			val2 = Number(val2);
		}
		if (val1 < val2) {
			return -1;
		} else if (val1 > val2) {
			return 1;
		} else {
			return 0;
		}
	}
};

// 时间转化为时间戳
let getTimestamp = function(val) {
	let date = new Date(val)
	return date.getTime()
}

// 判断字符串是否含有某个字符
let isHaveStr = function(val1,val2) {
	if(String(val1).indexOf(val2) < 0) {
		return false
	} else {
		return true
	}
}
// 判断是否为正整数
let numberZzs = function(val) {
	console.log('numberZzs',val)
	if(!(/(^[1-9]\d*$)/.test(val))) {
		return 0
	} else {
		return val
	}
}

// 根据两点计算距离
let getDistance = function(val1,val2){
		
		let lat1 = val1.lat
		let lng1 = val1.lng
		let lat2 = val2.lat
		let lng2 = val2.lng
		
		
		
		
		var La1 = lat1 * Math.PI / 180.0;
		var La2 = lat2 * Math.PI / 180.0;
		var La3 = La1 - La2;
		var Lb3 = lng1 * Math.PI / 180.0 - lng2 * Math.PI / 180.0;
		var s = 2 * Math.asin(Math.sqrt(Math.pow(Math.sin(La3 / 2), 2) + Math.cos(La1) * Math.cos(La2) * Math.pow(Math.sin(Lb3 / 2), 2)));
		s = s * 6378.137;//地球半径
		s = (Math.round(s * 10000) / 10000).toFixed(2);

        return s;
    }

module.exports = {
	toDate: toDate,
	toDateNoTime: toDateNoTime,
	isAuthorizationTrue: isAuthorizationTrue,
	isInteger: isInteger,
	getTouchData: getTouchData,
	formatTel: formatTel,
	formatTime: formatTime,
	formatData: formatData,
	formatUserName: formatUserName,
	getLabel: getLabel,
	arraySort: arraySort,
	isLogin: isLogin,
	getTimestamp: getTimestamp,
	isHaveStr,
	getDistance,
	formatBankNo,
	numberZzs,
	isPhone,
	getNowFormatDate
}
