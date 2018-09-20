<template>
  <div class="shopcart">
    <div class="content">
        <div class="content-left">
            <div class="logo-wrapper">
                <div class="logo">
                    <span class="icon-shopping_cart"></span>
                </div>
            </div>
            <div class="price">￥0</div>
            <div class="desc">另需配送费￥{{deliveryPrice}}</div>
        </div>
        <div class="content-right"></div>
    </div>   
  </div>
</template>

<script type="text/ecmascript-6">
    export default {
        // vue的编程习惯，props接收数据时，指定数据类型，还可以附上默认值
        props:{
            deliveryPrice: {
                type: Number,
                default: 0
            },
            minPrice: {
                type: Number,
                default: 0
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
                        .icon-shopping_cart
                            // 居中:设为父元素高度，然后父元素text-align : center
                            line-height :44px
                            font-size : 24px
                            color: #80858a
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
                    color: rgba(255, 255, 255, 0.4)
                .desc
                    display : inline-block
                    vertical-align : top
                    margin : 12px 0 0 12px
                    line-height : 24px
                    font-size : 10px
                    color: rgba(255, 255, 255, 0.4)
            .content-right
                flex: 0 0 105px
                width : 105px
</style>