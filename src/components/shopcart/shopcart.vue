<template>
  <div class="shopcart">
    <div class="content">
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
        <div class="content-right">
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
            <transition name="drop" v-on:before-enter="beforeDrop" v-on:enter="dropping" v-on:after-enter="afterDrop">
                <!-- 因为小球有两个方向的改变，所以需要两个div。仅用于js选择的样式加上xxx-hook。 -->
                <div v-show="ball.show" class="ball">
                    <div class="inner inner-hook"></div>
                </div>
            </transition>
        </div>
    </div>
  </div>
</template>

<script type="text/ecmascript-6">
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
                dropBalls: []
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
            beforeDrop(el) {
                let count = this.balls.length;
                while(count--) {
                    let ball = this.balls[count];
                    if(ball.show){
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
                //重绘
                let rf = el.offsetHeight;
                this.$nextTick(() => {
                    el.style.webkitTransform = 'translate3d(0, 0, 0)';
                    el.style.transform = 'translate3d(0, 0, 0)';
                    let inner = el.getElementsByClassName('inner-hook')[0];
                    inner.style.webkitTransform = 'translate3d(0, 0, 0)';
                    inner.style.transform = 'translate3d(0, 0, 0)';
                    //done 是告诉vue该动画结束。transition动画结束以后，会有一个transitionend事件的派发
                    el.addEventListener('transitionend', done);
                });
            },
            afterDrop(el) {
                let ball = this.dropBalls.shift();
                if(ball){
                    ball.show = false;
                    el.style.display = 'none';
                }
            }
        }
    }
</script>
<style lang="stylus" rel="stylesheet/stylus" scoped>
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
                &.drop-transition
                    transition : all 0.4s
                    // 小球
                    .inner
                        width : 16px
                        height : 16px
                        // 圆
                        border-radius : 50%
                        background : rgb(0, 160, 220)
                        transition : all 0.4s
</style>