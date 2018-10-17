<template>
  <div id="app">
    <v-header :seller="seller"></v-header>
    <div class="tab border-1px">
      <!-- 使用 router-link 组件来导航. -->
      <!-- 通过传入 `to` 属性指定链接. -->
      <!-- <router-link> 默认会被渲染成一个 `<a>` 标签 -->
      <div class="tab-item">
        <router-link to="/goods">商品</router-link>
      </div>
      <div class="tab-item">
        <router-link to="/ratings">评论</router-link>
      </div>
      <div class="tab-item">
        <router-link to="/seller">商家</router-link>
      </div>
    </div>
    <!-- 路由匹配到的组件将渲染在这里 -->
    <!-- 向子组件通过props传数据 -->
    <!-- keep-alive 优化组件的加载 -->
    <keep-alive>
      <router-view :seller="seller"></router-view>
    </keep-alive>
  </div>
</template>

<script>
  import header from "./components/header/header"
  import {urlParse} from 'common/js/util.js'

  //状态码。增加代码的语义和可维护性
  const ERR_OK = 0;

  export default {
    data() {
      return {
        seller: {
          // 立即执行函数，获取url中id参数值
          id: (() => {
            let quertParam = urlParse();
            return quertParam.id;
          })()
        }
      }
    },
    created() {
      this.$http.get('/api/seller?id=' + this.seller.id).then((response) => {
        response = response.body;
        if(response.errno === ERR_OK){
          // vue官方推荐扩展属性的方法，第一个参数：最终返回结果，第二个参数{id：**}，第三个参数response.data
          this.seller = Object.assign({}, this.seller, response.data);
        }
      })
    },
    components: {
      'v-header': header
    }
  }
</script>

<style lang="stylus" ref="stylesheet/stylus">
  @import "./common/stylus/mixin.styl"

#app
  .tab
    display : flex
    width : 100%
    height : 40px
    line-height : 40px
    // border-bottom : 1px solid rgba(7， 17， 27， 0.1)
    border-1px(rgba(7, 17, 27, 0.1))    //通过mixin.styl文件中定义，使该方法更通用。相当于把该方法中代码写在了这里。
    .tab-item
      flex : 1
      text-align :center
      //  &表示父元素，此处即tab-item。>表示选择器
      & > a
        display: block  //a元素自动撑满父元素
        font-size : 14px
        color: rgb(77, 85, 93)
        &.active    //&表示父元素，即class名为active的a
          color: rgb(240, 20, 20)
</style>
