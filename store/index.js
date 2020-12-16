import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

const store = new Vuex.Store({
    state: {
        /* 
			仓库数据
		*/
	   user:{
		   name:'徐俊',
		   address:'苏州吴中'
	   },
	   loginState:false,
	   loadingShow:false,
    },
    mutations: {
        login(state, userInfo) {
            uni.setStorageSync('userInfo',userInfo)
            state.loginState = true;
        },
		isLogin(state, userInfo) {
		    state.loginState = true;
		},
        logout(state) {
            uni.clearStorage()
            state.loginState = false;
        },
		SET_USER(state,data) {
			state.user.name = data.name
			state.user.address = data.address
		},
		SET_LOADING_OPEN(state,data) {
			console.log('SET_LOADING_OPEN')
			state.loadingShow = true
		},
		SET_LOADING_CLOSE(state,data) {
			console.log('SET_LOADING_CLOSE')
			state.loadingShow = false
		},
    },
	actions:{
		SET_USER({commit},status) {
			 return new Promise((resolve, reject) => {
			      setTimeout(() => {
			        commit('SET_USER', status)
			        resolve({ status: status })
			      }, 100)
			    })
		},
	}
})

export default store
