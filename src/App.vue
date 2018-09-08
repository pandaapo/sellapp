<template>
  <div id="app">
    <v-header></v-header>
    <div class="tab">
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
    <router-view></router-view>
  </div>
</template>

<script>
  import header from "./components/header/header"

  export default {
    components: {
      'v-header': header
    }
  }
</script>

<style lang="stylus" ref="stylesheet/stylus">
#app
  .tab
    display : flex
    width : 100%
    height : 40px
    line-height : 40px
    .tab-item
      flex : 1
      text-align :center
</style>
