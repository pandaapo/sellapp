<template>
  <div class="star" :class="starType">
      <!-- 这里绑定的itemClass变量，对应着动态样式 -->
      <span class="star-item" v-for="itemClass in itemClasses" :class="itemClass">
      </span>
  </div>
</template>

<script type="text/ecmascript-6">
const LENGTH = 5;
const CLS_ON = 'on';
const CLS_HALF = 'half';
const CLS_OFF = 'off';

export default {
  components:{},
//  接收从外面传入的参数，这里的参数也会有getter setter
  props:{
    // 星星尺寸，Number表示数据类型
      size: {
          type: Number
      },
      // 决定星星个数的得分
      score: {
          type: Number
      }
  },
  computed:{
      starType() {
          return 'star-' + this.size;
      },
      itemClasses() {
        // ？？？疑问：let var const有什么区别？
        // 星号数量
        let result = [];
        // 向下取0.5倍数的值
        let score = Math.floor(this.score * 2) / 2
        // 判断有无.5的小数
        let hasDecimal = score % 1 !== 0;
        let integer = Math.floor(score);
        for(let i= 0; i < integer; i++){
            result.push(CLS_ON);
        }
        if(hasDecimal){
            result.push(CLS_HALF);
        }
        while(result.length < LENGTH){
            result.push(CLS_OFF);
        }
        return result;
      }
  }
}
</script>
<style lang="stylus" rel="stylesheet/stylus" scoped>
    @import "../../common/stylus/mixin.styl"

    .star
        font-size : 0
        // 各span基础的通用样式
        .star-item
            // 几个星星都是横向排列
            display : inline-block
            background-repeat : no-repeat
        &.star-48
            // 具体样式。？？？这个.star-item和前面.star-item，是什么写法
            .star-item
                width : 20px
                height : 20px
                margin-right : 22px
                background-size : 20px 20px
                // 用:last-child选择器，将最后一个星右边的margin-right设为0
                &:last-child
                    margin-right : 0
                &.on
                    bg-image('star48_on')
                &.half
                    bg-image('star48_half')
                &.off
                    bg-image('star48_off')
        &.star-36
            .star-item
                width : 15px
                height : 15px
                margin-right : 16px
                background-size : 15px 15px
                // 用:last-child选择器，将最后一个星右边的margin-right设为0
                &:last-child
                    margin-right : 0
                &.on
                    bg-image('star36_on')
                &.half
                    bg-image('star36_half')
                &.off
                    bg-image('star36_off')
        &.star-24
            .star-item
                width : 10px
                height : 10px
                margin-right : 3px
                background-size : 10px 1510px
                // 用:last-child选择器，将最后一个星右边的margin-right设为0
                &:last-child
                    margin-right : 0
                &.on
                    bg-image('star24_on')
                &.half
                    bg-image('star24_half')
                &.off
                    bg-image('star24_off')
        
</style>