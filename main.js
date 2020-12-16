import Vue from 'vue'
import App from './App'
import apiReq from './utils/request.js'

import API from './api/index.js'
import URL from './utils/public/url.js'
import config from './utils/public/config.js'
import share from './utils/mixins/share.js'


import store from './store'

import customTarbar from '@/components/custom-tarbar/custom-tarbar.vue'; // 全局tabBar
import ourLoading from '@/components/plugins/our-loading/our-loading.vue'

import uniPopup from '@/components/uni-popup/uni-popup.vue' // 弹出层
import uniPopupMessage from '@/components/uni-popup/uni-popup-message.vue' // 弹出层
import uniPopupShare from '@/components/uni-popup/uni-popup-share.vue' // 弹出层
import uniPopupDialog from '@/components/uni-popup/uni-popup-dialog.vue' // 弹出层
// import mingPop from '@/components/custom-components/ming-pop/ming-pop.vue' // 弹出层
import keFuPop from '@/components/uni-popup/kefu-popup.vue' // 弹出层
import lxcCount from '@/components/plugins/lxc-count/lxc-count.vue' // 计数器
import imgUpload from '@/components/plugins/imgUpload/imgUpload.vue' // 上传图片
import uniCalendar from '@/components/uni-calendar/uni-calendar.vue' // 日历组件
import TabPane from '@/components/plugins/uni-tabs/wiszx-tabs/tabPane.vue' // tabs组件
import Tabs from '@/components/plugins/uni-tabs/wiszx-tabs/tabs.vue' // tabs组件
import SmTabs from '@/components/plugins/uni-tabs/sm-tabs.vue' // tabs组件
import QsTabs from '@/components/plugins/uni-tabs/QS-tabs/components/QS-tabs-wxs-list/QS-tabs-wxs-list.vue' // tabs组件
import tabSwiper from '@/components/custom-components/tab-swiper.vue' // tabs滑动组件

Vue.mixin(share)
Vue.component('tab-bar', customTarbar)
Vue.component('ourLoading', ourLoading)
Vue.component('uniPopup', uniPopup)
Vue.component('uniPopupMessage', uniPopupMessage)
Vue.component('uniPopupShare', uniPopupShare)
Vue.component('uniPopupDialog', uniPopupDialog)
// Vue.component('mingPop', mingPop)
Vue.component('keFuPop', keFuPop)
Vue.component('lxcCount', lxcCount)
Vue.component('imgUpload', imgUpload)
Vue.component('uniCalendar', uniCalendar)
Vue.component('TabPane', TabPane)
Vue.component('Tabs', Tabs)
Vue.component('QsTabs', QsTabs)
Vue.component('tabSwiper', tabSwiper)
Vue.component('SmTabs', SmTabs)

Vue.prototype.$store = store

Vue.prototype.$apiReq = apiReq

Vue.prototype.API = API
Vue.prototype.URL = URL
Vue.prototype.$config = config

Vue.config.productionTip = false

App.mpType = 'app'

const app = new Vue({
	...App
})
app.$mount()
