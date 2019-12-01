import Vue from 'vue'
import './plugins/fontawesome'
import App from './App.vue'
import './registerServiceWorker'
import router from './router'
import store from './store/index'
import './styles/global.scss'

Vue.config.productionTip = false
export const eventBus = new Vue();
new Vue({
    router,
    store,
    render: h => h(App)
}).$mount('#app')