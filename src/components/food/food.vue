<template>
  <div v-show="showFlag" class="food"></div>
</template>

<script type="text/ecmascript-6">
  export default {
    props:{
        // 因为该组件要维护的是goods组件中的food，所以food应该是传入进入参数
        food: {
            type: Object
        }
    }
  }
</script>
<style lang="stylus" rel="stylesheet/stylus" scoped>
    .food {
        // 相对于屏幕定位：占满了整个屏幕
        position : fixed
        left : 0
        top : 0
        bottom : 48px
        // 该层小于底部的购物车，以及点击购物车的弹出层
        z-index : 30
        width : 100%
        background : #fff
    }
</style>