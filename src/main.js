// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import VueRouter from 'vue-router'
import VueResource from 'vue-resource'
import goods from './components/goods/goods'
import ratings from './components/ratings/ratings'
import seller from 'components/seller/seller'

import "common/stylus/index.styl"

Vue.config.productionTip = false

//安装vue-router插件，或者叫全局注册VueRouter
Vue.use(VueRouter)
Vue.use(VueResource)

//定义路由：每个路由应该映射一个组件。 其中"component" 可以是通过 Vue.extend() 创建的组件构造器，或者，只是一个组件配置对象。
const routes = [{
  path: '/goods',
  component: goods
},{
  path: '/ratings',
  component: ratings
},{
  path: '/seller',
  component: seller
}]

//创建vuerouter实例，然后传 `routes` 配置
const router = new VueRouter({
  routes, // (缩写) 相当于 routes: routes
  linkActiveClass: 'active'   //自定义<router-link>的激活class名
})

// 创建和挂载根实例。通过 router 配置参数注入路由
new Vue({
  router,
  //render是vue2.0新的特性：支持通过javascript方式来初始化一个模板，这里就不用写template；h => h(App)是es6的语法， h对应createElement函数，将App组件传入。
  // render: h => h(App)  //等价于下面两行代码
  components: { App },
  template: '<App/>'
}).$mount('#app')   //这个.$mount('#app')等价于在Vue({})里面些el: '#app'

// //默认访问该路径。不去掉这个默认路径，在seller组件的BScroll初始化会有问题，在？？？也有问题
// router.push("/goods")
