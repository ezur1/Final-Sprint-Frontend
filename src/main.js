import Vue from 'vue'
import './plugins/fontawesome'
import App from './App.vue'
import './registerServiceWorker'
import router from './router'
import store from './store/index'
import Vue2TouchEvents from 'vue2-touch-events'
import './styles/global.scss'
Vue.use(require('vue-moment'));
Vue.use(Vue2TouchEvents)

Vue.config.productionTip = false
export const eventBus = new Vue();
new Vue({
    router,
    store,
    render: h => h(App)
}).$mount('#app')