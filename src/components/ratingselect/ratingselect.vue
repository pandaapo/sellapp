<template>
  <div class="ratingselect">
      <div class="rating-type">
          <span>{{desc.all}}</span>
          <span>{{desc.positive}}</span>
          <span>{{desc.negative}}</span>
      </div>
      <div class="switch">
          <span class="icon-check_circle"></span>
          <span class="text">只看有内容的评价</span>
      </div>
  </div>
</template>

<script type="text/ecmascript-6">
    const POSITIVE = 0;
    const NEGATIVE = 1;
    const ALL = 2;

  export default {
    props: {
        // 因为各面板的标题在不同情形下不一样，需要从外部传入
        ratings: {
            type: Array,
            // 数组的对象需要返回函数，和其他变量有点区别
            default() {
                return [];
            }
        },
        selectType: {
            type: Number,
            default: ALL
        },
        onlyContent: {
            type: Boolean,
            default: false
        },
        desc: {
            type: Object,
            default() {
                return {
                    all: '全部',
                    positive: '满意',
                    negative: '不满意'
                }
            }
        }
    }
  }
</script>
<style lang="stylus" rel="stylesheet/stylus" scoped>
</style>