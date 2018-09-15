<template>
  <div class="header">
    <div class="content-wrapper">
      <div class="avatar">
        <!--这里直接写src会报错，因为seller是通过props接收的数据-->
        <img width="64" height="64" :src="seller.avatar">
      </div>
      <div class="content">
        <div class="title">
          <span class="brand"></span>
          <span class="name">{{seller.name}}</span>
        </div>
        <div class="description">
          {{seller.description}}/{{seller.deliveryTime}}分钟送达
        </div>
        <!--这里不写v-if会报错，因为开始seller其实是空的，而获取seller的方法是异步方法-->
        <div v-if="seller.supports" class="support">
          <span class="icon" :class="classMap[seller.supports[0].type]"></span>
          <span class="text">{{seller.supports[0].description}}</span>
        </div>
      </div>
      <div v-if="seller.supports" class="support-count">
        <span class="count">{{seller.supports.length}}个</span>
        <!--图标-->
        <i class="icon-keyboard_arrow_right"></i>
      </div>
    </div>
    <div class="bulletin-wrapper"></div>
  </div>
</template>

<script>
    export default {
      props: {
        seller: {
          type: Object,
        }
      },
      created() {
        this.classMap = ['decrease','discount','special','invoice','guarantee']
      }
    }
</script>

<style lang="stylus" rel="stylesheet/stylus" scoped>
  @import "../../common/stylus/mixin.styl"

  .header
    color: #fff
    background: #999
    .content-wrapper
      position : relative
      padding: 24px 12px 18px 24px
      //在avatar和content之间会由于空白字体产生空隙
      font-size : 0
      .avatar
        display: inline-block
        //使头像和左边的文字顶部对齐
        vertical-align : top
        img
          /*2像素的圆角*/
          border-radius : 2px
      .content
        display: inline-block
        margin-left : 16px
        /*如果不定义font-size，会继承父元素的font-size : 0*/
        /*font-size : 14px*/
        .title
          margin : 2px 0 8px 0
          .brand
            /*如果不设置inline-block，由于span是行列元素，靠内容撑的，所以宽高的设置就起不到作用*/
            display : inline-block
            //由于.brand和.name的元素不一样，所以也设置一下才能对齐
            vertical-align : top
            width : 30px
            height : 18px
            bg-image('brand')
            //规定背景图像的尺寸
            background-size : 30px 18px
            //设置是否及如何重复背景图像(repeat-y垂直平铺 repeat-x水平平铺 repeat全局平铺)
            background-repeat : no-repeat
          .name
            margin-left : 6px
            font-size : 16px
            line-height : 18px
            font-weight : bold
        .description
          margin-bottom : 10px
          line-height : 12px
          font-size : 12px
        .support
          .icon
            //是图片，所以要用inline-block
            display : inline-block
            vertical-align : top
            width : 12px
            height : 12px
            margin-right : 4px
            background-size : 12px
            background-repeat : no-repeat
            &.decrease
              bg-image('decrease_1')
            &.discount
              bg-image('discount_1')
            &.guarantee
              bg-image('guarantee_1')
            &.invoice
              bg-image('invoice_1')
            &.special
              bg-image('special_1')
          .text
            line-height : 12px
            //chrome上最小字体12像素，所以看不到font-size:10像素的效果
            font-size : 10px
      .support-count
        //有绝对定位就需要给父元素.content-wrapper相对定位，表示相对父元素做的绝对定位
        position: absolute
        right : 12px
        bottom : 18px
        padding : 0 8px
        height : 24px
        line-height : 24px
        border-radius : 14px
        //会继承父元素的颜色，所以这里只要设置透明度
        background : rgba(0,0,0,0.2)
        text-align : center
        .count
          //文字和图标字体不一样，所以要垂直居中

          font-size : 10px
        .icon-keyboard_arrow_right
          font-size : 10px
</style>
