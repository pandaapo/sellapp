<template>
  <div class="cartcontrol">
      <transition name="move">
        <div class="cart-decrease" v-show="food.count>0" @click="decreaseCart" transition="move">
          <!-- 实现平移 -->
          <span class="inner icon-remove_circle_outline"></span>
          <!-- 实现滚动 -->
        </div>
      </transition>
      <div class="cart-count" v-show="food.count>0">{{food.count}}</div>
      <div class="cart-add icon-add_circle" @click="addCart"></div>
  </div>
</template>

<script type="text/ecmascript-6">
  import Vue from 'vue'

  export default {
    props: {
        food:{
            type: Object
        }
    },
    methods: {
      // 写好样式后写点击的逻辑和功能。
      // 教程说：由于该组件是在引用了better-scroll的区块中，要使点击有效必须在foodsScroll初始化时设置click为true。但是实际上：没设置该属性pc端可点击，手机端点击不了。
      addCart(event) {
        // 教程说：!event._constructed 这是为了解决pc端点击出现两次click的问题，判断是否为原生点击。但是实际上：设置了以后，pc端点击就没效果了
        // if(!event._constructed){
        //   return;
        // }
        if(!this.food.count){
          // 直接写this.food.count = 1; 不起作用。因为count属性是这里新增的，直接这样写vue检测不到
          Vue.set(this.food, 'count', 1);
        } else {
          this.food.count++;
        }
      },
      decreaseCart() {
        if(this.food.count){
          this.food.count--;
        }
      }
    }
  }
</script>

<style lang="stylus" rel="stylesheet/stylus" scoped>
  .cartcontrol
    font-size : 0
    .cart-decrease
      display : inline-block
      // 让点击区域变大，但图标仍然保持小巧的美观，所以加个padding
      padding : 6px
      // ？？？疑问：transition的属性值实现什么效果
      transition : all 0.4s linear
      // 动画完成时，vue会给动画加上move-transition的样式
      &.move-transition
        opacity : 1
        // 通过translate3d css实现硬件加速，让动画更流畅一些。
        transform : translate3d(0,0,0)
      .inner
        line-height : 24px
        font-size : 24px
        color : rgb(0, 160, 220)
      // 外层，动画开始和结束时候的样式
      &.move-enter,&.move-leave
        opacity : 0
        // ？？？疑问：滚动到右侧？
        transform : translate3d(24px, 0, 0)
    .cart-count
      display : inline-block
      vertical-align : top
      width : 12px
      padding-top: 6px
      line-height : 24px
      text-align : center
      font-size : 10px
      color: rgb(147, 153, 159)
    .cart-add
      display : inline-block
      // 让点击区域变大，但图标仍然保持小巧的美观，所以加个padding
      padding : 6px
      line-height : 24px
      font-size : 24px
      color : rgb(0, 160, 220)
</style>