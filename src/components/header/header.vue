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
      <div v-if="seller.supports" class="support-count" @click="showDetail">
        <span class="count">{{seller.supports.length}}个</span>
        <!--图标-->
        <i class="icon-keyboard_arrow_right"></i>
      </div>
    </div>
    <div class="bulletin-wrapper" @click="showDetail">
      <span class="bulletin-title"></span><span class="bulletin-text">{{seller.bulletin}}</span>
      <i class="icon-keyboard_arrow_right"></i>
    </div>
    <!-- 背景图片 -->
    <div class="background">
      <img :src="seller.avatar" width="100%" height="100%">
    </div>
    <!-- 详情弹层页 -->
    <div v-show="detailShow" class="detail">
      <!-- 实现sticky footers布局 -->
      <!-- clearfix用来清除浮动的，比较通用，写到base.styl中 -->
      <div class="detail-wrapper clearfix">
        <div class="detail-main">
          <h1 class="name">{{seller.name}}</h1>
          <div class="star-wrapper">
            <star :size="48" :score="seller.score"></star>
          </div>
          <div class="title">
            <div class="line"></div>
            <div class="text">优惠信息</div>
            <div class="line"></div>
          </div>
          <ul v-if="seller.supports" class="supports">
            <li class="support-item" v-for="item in seller.supports">
              <span class="icon" :class="classMap[seller.supports[0].type]"></span>
              <span class="text">{{seller.supports[0].description}}</span>
            </li>
          </ul>
        </div>
      </div>
      <div class="detail-close">
        <i class="icon-close"></i>
      </div>
    </div>
  </div>
</template>

<script>
  // 相当于star.vue中export的对象
  import star from "components/star/star.vue"

  export default {
    props: {
      seller: {
        type: Object,
      }
    },
    data () {
      return {
        // 定义需要跟踪的变量，在new 这个 vue时候，会对这里变量进行遍历，自动添加getter和setter，当变量发生变化的时候能及时获取到
        detailShow : false
      }
    },
    methods: {
      showDetail() {
        this.detailShow = true
      }
    },
    created() {
      this.classMap = ['decrease','discount','special','invoice','guarantee']
    },
    // 引入star以后，需要注册，将star作为本组件的子组件
    components: {
      star
    }
  }
</script>

<style lang="stylus" rel="stylesheet/stylus" scoped>
  @import "../../common/stylus/mixin.styl"

  .header
    // 配合背景图片做定位
    position : relative
    // 去掉背景图片下的一点阴影
    overflow : hidden
    color: #fff
    // 背景图片上面有个颜色
    background : rgba(7, 17, 27, 0.5)
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
          // 文字和图标字体不一样，所以要垂直居中就先设置一下顶部对齐。
          vertical-align : top
          font-size : 10px
        .icon-keyboard_arrow_right
          margin-left : 2px
          // 由于默认的linehight是1，所以导致上面设置顶部对齐以后没有达到垂直居中的效果，所以设置一下撑满的line-height
          line-height : 24px
          font-size : 10px
    .bulletin-wrapper
      // 与最右的图标字体.icon-keyboard_arrow_right配合做定位
      position : relative
      height : 28px
      // 为垂直居中准备
      line-height : 28px
      padding : 0 22px 0 12px
      // 不折行
      white-space : nowrap
      // 超出的部分隐藏
      overflow : hidden
      text-overflow: ellipsis
      //两个span挨着的时候，会有个空白像素，需要去掉。但是影响了.bulletin-text的省略号样式。在html中将两个span标签挨在一起写
      // font-size : 0
      .bulletin-title
        // 为了能给图片设置宽高
        display : inline-block
        // 因为没有lineheight，所以和.bulletin-text的vertical-align配合，来垂直居中
        vertical-align : top
        margin-top : 8px
        width : 22px
        height : 12px
        bg-image('bulletin')
        background-size : 22px 12px
        background-repeat : no-repeat
      .bulletin-text
        vertical-align : top
        margin : 0 4px 0 4px
        font-size : 10px
      .icon-keyboard_arrow_right
        position : absolute
        font-size : 10px
        right : 12px
        top : 8px
    .background
      position : absolute
      top : 0
      left : 0
      width : 100%
      height : 100%
      // 最下方
      z-index : -1
      // 滤镜：模糊效果
      filter : blur(10px)
    .detail
      position : fixed
      z-index : 100
      // 不设置top的话，样式仅在header以下
      top: 0
      left : 0
      width : 100%
      height : 100%
      overflow : auto
      background : rgba(7, 17, 27, 0.8)
      // 包装层是为了最小高度和视窗一样高，让关闭按钮定在顶部
      .detail-wrapper
        //最小高度和视窗一样高
        min-height : 100%
        // 否则就会由内容支撑这个宽度
        width : 100%
        .detail-main
          //？？？疑问：为什么一个用margin，一个用padding，两者分别什么时候使用？
          margin-top : 64px
          // 这样就可以实现关闭按钮不遮挡内容
          padding-bottom : 64px
          .name
            line-height : 16px
            text-align : center
            font-size: 16px
            font-weight : 700
          .star-wrapper
            margin-top : 18px
            padding: 2px 0
            text-align :center
          .title
            // vueloader在编译vue文件会用Postcss生成一些兼容性代码
            display : flex
            width : 80%
            margin : 28px auto 24px auto 
            .line
              // 表示等分。？？？疑问：为啥是等分？
              flex: 1
              position: relative
              top: -6px
              border-bottom : 1px solid rgba(255, 255, 255, 0.2)
            .text
              padding : 0 12px
              font-size: 14px
              font-weight : 700
          .supports
            width : 80%
            // 水平居中
            margin : 0 auto
            .support-item
              padding: 0 12px
              margin-bottom : 12px
              font-size : 0
              &:last-child
                margin-bottom : 0
              .icon
                display : inline-block
                width : 16px
                height : 16px
                vertical-align : top
                margin-right : 6px
                background-size : 16px 16px
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
                font-size : 12px
      .detail-close
        position : relative
        width : 32px
        height : 32px
        //因为detail-wrapper是撑满视窗的，所有是负值
        margin : -64px auto 0 auto
        clear : both
        font-size : 32px
</style>
