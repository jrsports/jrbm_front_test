import Vue from 'vue'
import App from './App.vue'
import router from './router/router'
import ElementUI from 'element-ui'
import axios from './interceptors/authInterceptor'
import 'element-ui/lib/theme-chalk/index.css'
import locale from 'element-ui/lib/locale/lang/zh-CN'
// main.js
import globalws from './global/globalWebsocket'

Vue.prototype.globalws = globalws;



Vue.use(ElementUI,{locale});
Vue.config.productionTip = false;
// 将axios挂载到prototype上，在组件中可以直接使用this.axios访问
Vue.prototype.axios = axios;


//登录校验（要写在vue实例创建前）
router.beforeEach(function(to, from, next) {
  console.log(to.meta.needLogin);
  if (to.meta.needLogin) {
    if (localStorage.getItem("userToken")) {
      //本地存储中是否有token(uid)数据
      next(); //表示已经登录
    } else {
      //没登录的话，跳转到主界面
      next({
        path: "/"
      });
    }
  } else {
    //表示不需要登录
    next(); //继续往后走
  }
});

new Vue({
  el:"#app",
  router,
  template:"<App/>",
  render: h => h(App),
});