<template>
    <div>
        <div class="shopcart">
            <!-- 绑定toggleList事件，用于控制购物车详情页的折叠和展开 -->
            <div class="content" @click="toggleList">
                <div class="content-left">
                    <div class="logo-wrapper">
                        <!-- 当totalCount>0时，加一个样式。 样式的属性值是个对象-->
                        <div class="logo" :class="{'highlight':totalCount>0}">
                            <span class="icon-shopping_cart" :class="{'highlight':totalCount>0}"></span>
                        </div>
                        <!-- v-show支持表达式 -->
                        <div class="num" v-show="totalCount>0">{{totalCount}}</div>
                    </div>
                    <div class="price" :class="{'highlight':totalPrice>0}">￥{{totalPrice}}</div>
                    <div class="desc">另需配送费￥{{deliveryPrice}}</div>
                </div>
                <!-- .stop.prevent是vue提供的方法阻止事件冒泡：防止点击去结算的时候弹出购物车详情页面 -->
                <!-- ？？？疑问：什么是事件冒泡 -->
                <div class="content-right" @click.stop.prevent="pay">
                    <!-- vue可以对class绑定一个变量，例如这里的payClass，一个计算属性 -->
                    <div class="pay" :class="payClass">
                        <!-- 绑定动态的变量 -->
                        {{payDesc}}
                    </div>
                </div>
            </div>
            <!-- ？？？疑问：要放若干个小球。 -->
            <div class="ball-container">
                <!-- ？？？疑问：这里transition的使用为什么就突出要求和v-show配合使用 -->
                <div v-for="ball in balls">
                    <!-- 给transition绑定三个事件 -->
                    <transition name="drop" v-on:before-enter="beforeDrop" v-on:enter="dropping" v-on:after-enter="afterDrop">
                        <!-- 因为小球有两个方向的改变，所以需要两个div。仅用于js选择的样式加上xxx-hook。 -->
                        <div v-show="ball.show" class="ball">
                            <div class="inner inner-hook"></div>
                        </div>
                    </transition>
                </div>
            </div>
            <!-- 购物车详情页，通过listShow变量来控制显示或隐藏 -->
            <!-- 折叠和展开时加上缓动的动画 -->
            <transition name="fold">
                <div class="shopcart-list" v-show="listShow">
                    <div class="list-header">
                        <div class="title">购物车</div>
                        <!-- 绑定click事件，方法在methods中定义 -->
                        <div class="empty" @click="empty">清空</div>
                    </div>
                    <div class="list-content" ref="listContent">
                        <ul>
                            <li class="food" v-for="food in selectFoods">
                                <span class="name">{{food.name}}</span>
                                <div class="price">
                                    <span>￥{{food.price*food.count}}</span>
                                </div>
                                <div class="cartcontrol-wrapper">
                                    <cartcontrol :food="food" v-on:cart-add="drop"></cartcontrol>
                                </div>
                            </li>
                        </ul>
                    </div>
                </div>
            </transition>
        </div>
        <!-- 因为半透明背景是相对整个屏幕定位，所以与shopcart平级 -->
        <transition name="fade">
            <!-- 绑定事件，实现点击半透明区域，收起购物车详情页 -->
            <div class="list-mask" v-show="listShow" @click="hideList"></div>
        </transition>
    </div>
</template>

<script type="text/ecmascript-6">
    import cartcontrol from 'components/cartcontrol/cartcontrol';
    import BScroll from "better-scroll"

    export default {
        // 几个计算属性全都依赖于传入的参数selectFoods
        // vue的编程风格：props接收数据时，一定要指定数据类型，还可以附上默认值
        props:{
            selectFoods: {
                type: Array,
                // 在vue中，props的变量的类型是Array或Object时，默认值得是函数
                default() {
                    return [{
                        price: 10,
                        count: 1
                    }];
                }
            },
            // 接收父组件传入的变量数据
            deliveryPrice: {
                type: Number,
                default: 0
            },
            minPrice: {
                type: Number,
                default: 0
            }
        },
        data() {
            return {
                //维护当前小球的状态，5个差不多够了
                balls: [
                    {
                        show: false
                    },
                    {
                        show: false
                    },
                    {
                        show: false
                    },
                    {
                        show: false
                    },
                    {
                        show: false
                    }
                ],
                dropBalls: [],
                // 该变量用于控制购物车详情页是折叠还是展开
                fold: true
            }
        },
        computed: {
            // 计算总额
            totalPrice() {
                // 临时变量
                let total = 0;
                this.selectFoods.forEach(food => {
                    total += food.price * food.count
                });
                return total;
            },
            // 计算总数
            totalCount() {
                let count = 0;
                this.selectFoods.forEach(food => {
                    count += food.count
                });
                return count;
            },
            payDesc() {
                // js中尽量用===，因为==在两边类型不一致时会有个隐式转换
                if(this.totalPrice === 0){
                    // es6：通过反引号``可以通过${}将数据传进去，而不用拼接字符串
                    return `￥${this.minPrice}起送`;
                } else if (this.totalPrice < this.minPrice) {
                    let diff = this.minPrice - this.totalPrice;
                    return `还差￥${diff}元起送`;
                } else {
                    return '去结算';
                }
            },
            payClass() {
                if(this.totalPrice<this.minPrice){
                    return 'not-enough';
                } else {
                    return 'enough';
                }
            },
            listShow() {
                if(!this.totalCount){
                    this.fold = true;
                    return false;
                }
                let show = !this.fold;
                if(show){
                    // 对购物车详情列表做初始化。数据变化以后再更新DOM
                    this.$nextTick(() => {
                        if(!this.scroll){
                            // 需要把list-content的DOM传入
                            this.scroll = new BScroll(this.$refs.listContent, {
                                click: true
                            });
                        } else {
                            this.scroll.refresh();
                        }
                    });
                }
                return show;
            }
        },
        methods: {
            // el是通过父组件goods.vue拿到cartcontrol组件的DOM元素
            drop(el){
                // 找一个隐藏的小球，添加到dropBalls中
                for(let i=0; i<this.balls.length; i++){
                    let ball = this.balls[i];
                    if(!ball.show){
                        ball.show = true;
                        //定义一个el属性保存传入的el
                        ball.el = el;
                        this.dropBalls.push(ball);
                        return;
                    }
                }
            },
            // el是当前执行动画的DOM对象
            // 获取到所有为true小球
            beforeDrop(el) {
                let count = this.balls.length;
                while(count--) {
                    let ball = this.balls[count];
                    if(ball.show){
                        // 浏览器提供的接口，获取ball中保存的小球的位置
                        let rect = ball.el.getBoundingClientRect();
                        let x = rect.left - 32;
                        let y = -(window.innerHeight - rect.top - 22);
                        // ？？？疑问：ball不已经是true了吗，为什么还要设置显示
                        el.style.display = '';
                        el.style.webkitTransform = `translate3d(0, ${y}px, 0)`;
                        el.style.transform = `translate3d(0, ${y}px, 0)`;
                        // 横向的动画
                        let inner = el.getElementsByClassName('inner-hook')[0];
                        inner.style.webkitTransform = `translate3d(${x}px, 0, 0)`;
                        inner.style.transform = `translate3d(${x}px, 0, 0)`;
                    }
                }
            },
            dropping(el, done) {
                //让eslint跳过对rf变量未使用的验证
                /* eslint-disable no-unused-vars */
                //主动进行浏览器重绘
                let rf = el.offsetHeight;
                // 让动画在下一帧进行如下操作
                this.$nextTick(() => {
                    el.style.webkitTransform = 'translate3d(0, 0, 0)';
                    el.style.transform = 'translate3d(0, 0, 0)';
                    let inner = el.getElementsByClassName('inner-hook')[0];
                    inner.style.webkitTransform = 'translate3d(0, 0, 0)';
                    inner.style.transform = 'translate3d(0, 0, 0)';
                    //done 是告诉vue该动画结束，然后跳到下一个钩子函数afterDrop()。transition动画结束以后，会有一个css事件（transitionend事件）的派发。在该事件执行的时候，调用done
                    el.addEventListener('transitionend', done);
                });
            },
            afterDrop(el) {
                // 动画结束以后，将ball置为false。让这个ball可以继续被使用
                //？？？疑问：shift()取dropBalls的是哪个？
                let ball = this.dropBalls.shift();
                if(ball){
                    ball.show = false;
                    el.style.display = 'none';
                }
            },
            toggleList() {
                if(!this.totalCount){
                    return;
                }
                this.fold = !this.fold;
            },
            hideList() {
                // this.fold会触发依赖于此的listShow的重新计算
                this.fold = true;
            },
            empty() {
                this.selectFoods.forEach((food) => {
                    food.count = 0;
                });
            },
            // 去结算
            pay() {
                if(this.totalPrice<this.minPrice){
                    return;
                }
                window.alert(`支付￥${this.totalPrice}`)
            }
        },
        components: {
            cartcontrol
        }
    }
</script>
<style lang="stylus" rel="stylesheet/stylus" scoped>
    @import "../../common/stylus/mixin";

    .shopcart
        // 自适应
        position : fixed
        left: 0
        bottom : 0
        // 有一点多出的区块盖住别的区块
        z-index : 50
        width : 100%
        height : 48px
        .content
            display : flex
            background : #141d27
            font-size: 0
            //子元素用该颜色的多
            color: rgba(255, 255, 255, 0.4)
            .content-left
                // 自适应
                flex: 1
                // 因为下三个样式是横向排列，所以inline-block。因为是inline-block所以上面要设置下font-size: 0
                .logo-wrapper
                    display : inline-block
                    // 因为display : inline-block，所以设置一下顶部对齐
                    vertical-align : top
                    position : relative
                    top : -10px
                    margin : 0 12px
                    padding : 6px
                    // ie盒模型，包括padding，所以是44+12
                    width : 56px
                    height : 56px
                    box-sizing : border-box
                    // 圆角
                    border-radius : 50%
                    background : #141d27
                    .logo
                        width : 100%
                        height : 100%
                        border-radius : 50%
                        text-align : center
                        background : #2b343c
                        &.highlight
                            background : rgb(0, 160, 220)
                        .icon-shopping_cart
                            // 居中:设为父元素高度，然后父元素text-align : center
                            line-height :44px
                            font-size : 24px
                            color: #80858a
                            &.highlight
                                color: #fff
                    // 统计总数的红点样式
                    .num
                        position : absolute
                        top: 0
                        right : 0
                        // ？？？疑问：因为是绝对定位所以要指定宽高
                        width : 24px
                        height : 16px
                        line-height : 16px
                        // 水平居中
                        text-align : center
                        border-radius : 16px
                        font-size : 9px
                        font-weight : 700
                        color: #fff
                        background : rgb(240, 20 ,20)
                        box-shadow 0 4px 8px 0 rgba(0, 0, 0, 0.4)
                .price
                    display : inline-block
                    vertical-align : top
                    // 这里垂直居中之所以不用line-height:48来居中，因为后面有个border-right，如果line-height:48，竖线也会撑满
                    margin-top : 12px
                    line-height: 24px
                    padding-right : 12px
                    box-sizing : border-box
                    border-right : 1px solid rgba(255, 255, 255, 0.1)
                    font-size : 16px
                    font-weight : 700
                    // color: rgba(255, 255, 255, 0.4)
                    &.highlight
                        color: #fff
                .desc
                    display : inline-block
                    vertical-align : top
                    margin : 12px 0 0 12px
                    line-height : 24px
                    font-size : 10px
                    // color: rgba(255, 255, 255, 0.4)
            .content-right
                flex: 0 0 105px
                width : 105px
                .pay
                    // 通过height与line-height高度一样，来实现垂直居中
                    height : 48px
                    line-height : 48px
                    text-align : center
                    font-size : 12px
                    // color: rgba(255, 255, 255, 0.4)
                    font-weight : 700
                    background : #2b333b
                    &.not-enough
                        background : #2b333b
                    &.enough
                        // 背景色
                        background : #00b43c
                        // 前景色
                        color: #fff
        .ball-container
            .ball
                //因为是相对于视窗做的动画，所以是fixed
                position: fixed
                left: 32px
                bottom : 22px
                z-index: 200
                // 教程中的“&.drop-transition”会导致动画失效
                //y轴沿着该抛物线轨迹缓动
                transition : all 0.4s cubic-bezier(0.49, -0.29, 0.75, 0.41)
                // 小球
                .inner
                    width : 16px
                    height : 16px
                    // 圆
                    border-radius : 50%
                    background : rgb(0, 160, 220)
                    // x轴线性缓动
                    transition : all 0.4s linear
        // 购物车详情页样式
        .shopcart-list
            position : absolute
            // 相对shopcart的定位
            left: 0
            top: 0
            z-index : -1
            width: 100%
            transition: all 0.5s
            // ？？？疑问：让不定高的整个高度展开：y轴-100%。
            transform: translate3d(0, -100%, 0)
            &.fold-enter, &.fold-leave-active
                transform : translate3d(0, 0, 0)
            .list-header
                height : 40px
                // 垂直居中对齐line-height=height
                line-height : 40px
                padding: 0 18px
                background : #f3f5f7
                border-bottom : 1px solid rgba(7, 17, 27, 0.1)
                .title
                    float : left
                    font-size : 14px
                    color: rgb(7, 17, 27)
                .empty
                    float : right
                    font-size : 12px
                    color: rgb(0, 160, 220)
            .list-content
                padding : 0 18px
                max-height : 217px
                // 超过最大高度时隐藏
                overflow : hidden
                background : #fff
                .food
                    position : relative
                    padding: 12px 0
                    box-sizing : border-box
                    border-1px(rgba(7, 17, 27, 0.1))
                    .name
                        line-height : 24px
                        font-size : 14px
                        color: rgb(7, 17, 27)
                    .price
                        position : absolute
                        right : 90px
                        bottom : 12px
                        line-height : 24px
                        font-size : 14px
                        font-weight : 700
                        color: rgb(240, 20, 20)
                    .cartcontrol-wrapper
                        position : absolute
                        right : 0
                        bottom : 6px
    // 半透明的背景样式
    .list-mask
        // 相对窗口定位
        position: fixed
        top: 0
        left: 0
        width : 100%
        height : 100%
        // 要小于.shopcart的z-index
        z-index : 40
        // iPhone手机下能看到模糊的效果
        backdrop-filter: blur(10px)
        // 缓动
        transition: all 0.5s
        opacity : 1
        background : rgba(7, 17, 27, 0.6)
        &.fade-enter, &.fade-leave-active
            opacity : 0
            background : rgba(7, 17, 27, 0)
</style>