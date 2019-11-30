import Vue from 'vue' //引入vue
import App from './App.vue'//主输出vue引入
import router from './router'//vue路由引入
import store from './store'
import ElementUI from 'element-ui'; //引入elementui
import 'element-ui/lib/theme-chalk/index.css';//引入elementui的样式文件

import '@/css/base.css' //项目基础样式引入
import '@/assets/theme/index.css'//elementui的自定义样式主题引入
Vue.use(ElementUI);//把elementui加入到vue的对象里

//函数服务全局
import * as fun from '@/util.js';
Vue.prototype.$U =fun;

Vue.config.productionTip = false //运行开发模式时，设置显示的tip

//vue的注入
new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
