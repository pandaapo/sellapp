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
</style>