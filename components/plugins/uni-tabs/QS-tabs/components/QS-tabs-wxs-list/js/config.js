const levels = {	//机型等级
	higher: 'higher',
	medium: 'medium',
	lower: 'lower'
}
const models = [	//已配置机型
	{
		model: 'Mi 10',
		level: levels.higher
	}
]

function getModel(model) {	//返回对应机型数据
	return models.find(item=>item.model === model) || {};
}

function checkContentMode(Sys) {	//安卓平台下 判断 是否开启swiper模式; 建议: 性能好的手机 return swiper；性能不太好的 return vShow
	try{
		let contentMode = 'vShow';
		const obj = getModel(Sys.model);
		switch (obj.level){
			case levels.higher:
				contentMode = 'swiper';
				break;
			default:
				contentMode = 'vShow';
				break;
		}
		return contentMode;
	}catch(e){
		//TODO handle the exception
		return 'vShow';
	}
}

function checkvShowDuration(Sys) {	//安卓平台下 vShow模式 判断 默认的下拉刷新动画时长; 建议: 性能很好的手机 return 0；性能不太好的 return 300
	try{
		let dur;
		const obj = getModel(Sys.model);
		switch (obj.level){
			case levels.higher:
				dur = 0;
				break;
			default:
				dur = 300;
				break;
		}
		return dur;
	}catch(e){
		//TODO handle the exception
		return 300;
	}
}

function log(t) {
	// return console.log(t);
}

module.exports = {
	log,
	checkContentMode,
	checkvShowDuration
}