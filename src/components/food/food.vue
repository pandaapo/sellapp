<template>
  <transition name="move">
      <!-- ref="food"是作为BScroll要用的参数，让能被访问到 -->
    <div v-show="showFlag" class="food" ref="food">
        <div class="food-content">
            <div class="image-header">
                <!-- food.image是只data.json中的数据 -->
                <img :src="food.image">
                <!-- 给返回按钮定位 -->
                <div class="back" @click="hide">
                    <i class="icon-arrow_lift"></i>
                </div>
            </div>
            <div class="content">
                <h1 class="title">{{food.name}}</h1>
                <div class="detail">
                    <span class="sell-count">月售{{food.sellCount}}</span>
                    <span class="rating">好评率{{food.rating}}</span>
                </div>
                <div class="price">
                    <span class="now">￥{{food.price}}</span><span class="old" v-show="food.oldPrice">￥{{food.oldPrice}}</span>
                </div>
                <div class="cartcontrol-wrapper">
                    <!-- 传入props中food参数 -->
                    <cartcontrol :food="food" v-on:cart-add="foodCartAdd"></cartcontrol>
                </div>
                <!-- 给“加入购物车”渐隐的动画，以解决直接隐藏导致小球动画的起点位置获取不到的问题 -->
                <transition name="fade">
                    <div @click.stop.prevent="addFirst" class="buy" v-show="!food.count || food.count===0">加入购物车</div>
                </transition>
            </div>
            <split v-show="food.info"></split>
            <div class="info" v-show="food.info">
                <h1 class="title">商品信息</h1>
                <p class="text">{{food.info}}</p>
            </div>
            <split></split>
            <div class="rating">
                <h1 class="title">商品评价</h1>
                <!-- 这里必须使用驼峰转中划线 -->
                <ratingselect v-bind:select-type="selectType" v-bind:only-content="onlyContent" v-bind:desc="desc" v-bind:ratings="food.ratings"></ratingselect>
            </div>
        </div>
    </div>
  </transition>
</template>

<script type="text/ecmascript-6">
//   选择绑定BScroll的层，该层有固定高度，该层内层可能超过固定高度
  import BScroll from 'better-scroll';
  import cartcontrol from 'components/cartcontrol/cartcontrol'
  import Vue from 'vue'
  import split from 'components/split/split';
  import ratingselect from 'components/ratingselect/ratingselect'

  const POSITIVE = 0;
  const NEGATIVE = 1;
  const ALL = 2;

  export default {
    props:{
        // 因为该组件要维护的是goods组件中的food，所以food应该是传入进入参数
        food: {
            type: Object
        }
    },
    data() {
        return {
            showFlag: false,
            // 跟踪了一些传给子组件的变量
            selectType: ALL,
            onlyContent: true,
            desc: {
                all: '全部',
                positive: '推荐',
                negative: '吐槽'
            }
        }
    },
    methods: {
        // 编程习惯：不可能被父组件调用的方法名前面加上下划线
        show() {
            this.showFlag = true;
            // show()的时候再初始化一遍：因为该组件可能被多个组件引用。？？？疑问：没明白。
            this.selectType = ALL;
            this.onlyContent = true;
            // $nextTick以后才能保证DOM已经渲染，高度计算才能正确
            this.$nextTick(() => {
                if(!this.scroll) {
                    this.scroll = new BScroll(this.$refs.food, {
                        click: true
                    });
                } else {
                    this.scroll.refresh();
                }
            })
        },
        hide() {
            this.showFlag = false;
        },
        // 默认不传参数的时候，是event
        addFirst(event) {
            if(!event._constructed){
                return;
            }
            console.info("food.vue的<加入购物车>向父组件派发cart-add事件--->");
            //提交名为'cart-add'的事件给父组件，实现<添加购物车>图标的DOM元素传给父组件，实现抛物线小球动画
            this.$emit('cart-add', event.target);
            // 第一次点击的时候，将this.food的count置为1
            Vue.set(this.food, 'count', 1)
        },
        foodCartAdd(el){
            console.info("food.vue监听到cart-add事件，调用foodCartAdd()方法--->");
            console.info("food.vue的cartcontrol向父组件派发cart-add事件--->");
            this.$emit('cart-add', el);
        }
    },
    components: {
        cartcontrol,
        split,
        ratingselect
    }
  }
</script>
<style lang="stylus" rel="stylesheet/stylus" scoped>
    .food
        // 相对于屏幕定位：占满了整个屏幕
        position : fixed
        left : 0
        top : 0
        // 因为底部有个购物车
        bottom : 48px
        // 该层小于底部的购物车，以及点击购物车的弹出层
        z-index : 30
        width : 100%
        background : #fff
        //缓动：线性移动
        transition : all 0.2s linear
        // 最终状态(0, 0, 0)
        transform : translate3d(0, 0, 0)
        // 以下是教程中写法，不行
        // &.move-transition
        //     transition : all 0.2s linear
        //     transform : translate3d(0, 0, 0)
        &.move-enter, &.move-leave-active
            //相对自身宽度平移了100%
            transform : translate3d(100%, 0, 0)
        .image-header
            position: relative
            width : 100%
            // 解决图片异步加载带来的页面“抖动”：一开始将图片高度定好
            height : 0
            // 使和所在“盒子”是个宽高相等的容器
            padding-top : 100%
            img
                position : absolute
                top : 0
                left : 0
                width : 100%
                height : 100%
            .back
                position : absolute
                top: 10px
                left : 0
                .icon-arrow_lift
                    display : block
                    // 让按钮点击区域变大
                    padding : 10px
                    font-size: 20px
                    color: #fff
        .content
            position : relative
            padding: 18px
            .title
                line-height : 14px
                margin-bottom : 8px
                font-size: 14px
                font-weight : 700
                color: rgb(7, 17, 27)
            .detail
                margin-bottom : 18px
                line-height : 10px
                height : 10px
                font-size : 0
                .sell-count, .rating
                    font-size: 10px
                    color: rgb(147, 153, 159)
                .sell-count
                    margin-right : 12px
            // 其实可以细化一下将.price抽象成一个组件：因为布局和样式通用
            .price
                font-weight : 700
                line-height: 14px
                .now
                    margin-right: 8px
                    font-size: 14px
                    color: rgb(240, 20, 20)
                .old
                    text-decoration : line-through
                    font-size: 10px
                    color: rgb(147, 153, 159)
            .cartcontrol-wrapper
                position : absolute
                right : 12px
                bottom : 12px
            .buy
                position : absolute
                right : 18px
                bottom : 18px
                // 盖住cartcontrol组件
                z-index : 10
                height : 24px
                line-height : 24px
                padding : 0 12px
                box-sizing : border-box
                border-radius : 10px
                font-size : 10px
                color: #fff
                background-color : rgb(0, 160, 220)
                transition : all 0.2s
                opacity : 1
                &.fade-enter, &.fade-leave-active
                    opacity : 0
        .info
            padding: 18px
            .title
                line-height : 14px
                margin-bottom : 6px
                font-size : 14px
                color: rgb(7, 17, 27)
            .text
                line-height : 24px
                padding : 0 8px
                font-size : 12px
                color: rgb(77, 85, 93)
        .rating
            padding-top : 18px
            .title
                line-height : 14px
                margin-left : 18px
                font-size : 14px
                color: rgb(7, 17,27)
</style>