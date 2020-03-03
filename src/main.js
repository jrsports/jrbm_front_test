import Vue from 'vue'
import App from './App.vue'
import router from './router/router'
import ElementUI from 'element-ui'
import axios from './interceptors/authInterceptor'
import 'element-ui/lib/theme-chalk/index.css'
import locale from 'element-ui/lib/locale/lang/zh-CN'
// main.js
import globalws from './global/globalWebsocket'





Vue.use(ElementUI,{locale});
Vue.config.productionTip = false;
// 将axios挂载到prototype上，在组件中可以直接使用this.axios访问
Vue.prototype.axios = axios;
Vue.prototype.globalws = globalws;

//登录校验（要写在vue实例创建前）
router.beforeEach(function(to, from, next) {
  //对于需要球队登录的界面，对userToken和teamToken进行检查
  if (to.meta.needLogin) {
    //禁止后退
    // Vue.prototype.allowBack=false;
    // history.pushState(null, null, location.href);
    if (localStorage.getItem("userToken") && sessionStorage.getItem("teamToken")) {
      next(); //表示已经登录
    } else {
      next({
        path: "/"
      });
    }
  } else {
    //对于无需球队登录的界面，必须将teamToken清空并让全局websocket下线
    sessionStorage.removeItem("teamToken");
    sessionStorage.removeItem("teamName");
    if(globalws.ws.url!==undefined){
      globalws.ws.close();
    }
    next(); //继续往后走
  }
});

new Vue({
  el:"#app",
  router,
  template:"<App/>",
  render: h => h(App),
});