<template>
  <div class="ratings" ref="ratings">
    <!-- 这个区块高度会超过外面div区块的高度，BScorll会起作用 -->
    <div class="ratings-content">
      <div class="overview">
        <div class="overview-left">
          <h1 class="score">{{seller.score}}</h1>
          <div class="title">综合评分</div>
          <div class="rank">高于周边商家{{seller.rankRate}}%</div>
        </div>
        <div class="overview-right">
          <div class="score-wrapper">
            <!-- 行内排列，用span -->
            <span class="title">服务态度</span>
            <!-- :size和:score传入参数 -->
            <star :size="36" :score="seller.serviceScore"></star>
            <span class="score">{{seller.serviceScore}}</span>
          </div>
          <div class="score-wrapper">
            <!-- 行内排列，用span -->
            <span class="title">商品评分</span>
            <!-- :size和:score传入参数 -->
            <star :size="36" :score="seller.foodScore"></star>
            <span class="score">{{seller.foodScore}}</span>
          </div>
          <div class="delivery-wrapper">
            <!-- 这两个span都是文字，默认对齐，所以不需要像上面的几个span要display : inline-block, vertical-align: top -->
            <span class="title">送达时间</span>
            <span class="delivery">{{seller.deliveryTime}}分钟</span>
          </div>
        </div>
      </div>
      <split></split>
      <ratingselect @selectEvent="selectRating" @toggleEvent="toggleContent" v-bind:select-type="selectType" v-bind:only-content="onlyContent" v-bind:ratings="ratings"></ratingselect>
      <div class="rating-wrapper">
        <ul>
          <li v-for="rating in ratings" v-show="needShow(rating.rateType, rating.text)" class="rating-item">
            <div class="avatar">
              <img width="28" height="28" :src="rating.avatar">
            </div>
            <div class="content">
              <h1 class="name">{{rating.username}}</h1>
              <div class="star-wrapper">
                <star :size="24" :score="rating.score"></star>
                <span class="delivery" v-show="rating.deliveryTime">{{rating.deliveryTime}}</span>
              </div>
              <p class="text">{{rating.text}}</p>
              <div class="recommend" v-show="rating.recommend.length">
                <span class="icon-thumb_up"></span>
                <span class="item" v-for="item in rating.recommend">{{item}}</span>
              </div>
              <div class="time">
                {{rating.rateTime | formatDate}}
              </div>
            </div>
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>

<script type="text/ecmascript-6">
  import star from 'components/star/star';
  import split from 'components/split/split';
  import ratingselect from 'components/ratingselect/ratingselect';
  //   带花括号，是export function()
  import {formatDate} from 'common/js/date'
  import BScroll from 'better-scroll';

  const ALL = 2;
  const ERR_OK = 0;

  export default {
    props: {
      // 来自App.vue组件中<router-view>的seller
      seller: {
        type: Object
      }
    },
    data() {
      return {
        // ratings从后端获取，所以加载该组件时，先从后端获取数据，即create(){}
        ratings: [],
        selectType: ALL,
        onlyContent: true
      }
    },
    created() {
      this.$http.get('/api/ratings').then((response) => {
        response = response.body;
        if(response.error === ERR_OK){
          this.ratings = response.data;
          //拿到ratings以后，更新DOM，初始化BScroll
          this.$nextTick(() => {
            this.scroll = new BScroll(this.$refs.ratings, {
                click: true
            });
          });
        }
      })
    },
    components: {
      star,
      split,
      ratingselect
    },
    filters: {
        formatDate(time) {
            // 将时间戳转化成Date类型的对象
            let date = new Date(time);
            return formatDate(date, "yyyy-MM-dd HH:mm");
        }
    },
    methods: {
      needShow(type, text) {
            if(this.onlyContent && !text){
                return false;
            }
            if(this.selectType === ALL){
                return true;
            } else {
                return type === this.selectType;
            }
        },
        selectRating(type) {
            this.selectType = type;
            this.$nextTick(() => {
                this.scroll.refresh();
            });
        },
        toggleContent() {
            this.onlyContent = !this.onlyContent;
            this.$nextTick(() => {
                this.scroll.refresh();
            });
        }
    }
  }
</script>

<style lang="stylus" ref="stylesheet/stylus" scoped>
  @import "../../common/stylus/mixin.styl"

  .ratings
    // 固定视口高度
    position : absolute
    top: 174px
    bottom : 0
    left : 0
    width : 100%
    overflow: hidden
    .overview
      display : flex
      padding : 18px 0
      .overview-left
        flex: 0 0 137px
        padding : 6px 0
        width : 137px
        border-right : 1px solid rgba(7, 17, 27, 0.1)
        // 垂直水平居中
        text-align : center
        // 处理在小屏幕下的这行问题
        @media only screen and (max-width : 320px)
          flex: 0 0 120px
          width : 120px
        .score
          margin-bottom : 6px
          line-height : 28px
          font-size: 24px
          color: rgb(255, 153, 0)
        .title
          margin-bottom : 8px
          line-height : 12px
          font-size: 12px
          color: rgb(7, 17, 27)
        .rank
          line-height : 10px
          font-size : 10px
          color: rgb(147, 153, 159)
      .overview-right
        flex: 1
        padding : 6px 0 6px 24px
        @media only screen and (max-width : 320px)
          padding-left : 6px
        .score-wrapper
          margin-bottom : 8px
          // 去掉横向排列的间隙
          font-size : 0
          .title
            // title star score垂直方向对齐
            display : inline-block
            // ？？？疑问：为什么line-height要从.score-wrapper移到.title和.score样式才对？
            line-height : 18px
            vertical-align: top
            font-size : 12px
            color: rgb(7, 17, 27)
          // star组件最终是class="star"的div
          .star
            display : inline-block
            margin : 0 12px
            vertical-align: top
          .score
            display : inline-block
            line-height : 18px
            vertical-align: top
            font-size : 12px
            color: rgb(255, 153, 0)
        .delivery-wrapper
          font-size : 0
          .title
            line-height : 18px
            font-size : 12px
            color: rgb(7, 17, 27)
          .delivery
            margin-left : 12px
            font-size: 12px
            color: rgb(147, 153, 159)
    .rating-wrapper
      padding:0 18px
      .rating-item
        display: flex
        padding: 18px 0
        border-1px(rgba(7, 17, 27, 0.1))
        .avatar
          flex: 0 0 28px
          width : 28px
          margin-right : 12px
          img
            border-radius : 50%
        .content
          position: relative
          flex: 1
          .name
            margin-bottom : 4px
            line-height : 12px
            font-size : 10px
            color: rgb(7, 17, 27)
          .star-wrapper
            margin-bottom : 6px
            font-size : 0
            .star
              display: inline-block
              margin-right : 6px
              vertical-align : top
            .delivery
              display : inline-block
              margin-right : 6px
              vertical-align : top
              line-height : 12px
              font-size : 10px
              color: rgb(147, 153, 159)
          .text
            margin-bottom : 8px
            line-height : 18px
            color: rgb(7, 17, 27)
            font-size : 12px
          .recommend
            line-height : 16px
            font-size : 0
            .icon-thumb_up, .item
              display : inline-block
              margin : 0 8px 4px 0
              font-size : 9px
            .icon-thumb_up
              color: rgb(0, 160, 220)
            .item
              padding : 0 6px
              border: 1px solid rgba(7, 17, 27, 0.1)
              border-radius : 1px
              color: rgb(147, 153, 159)
              background : #fff
          .time
            position : absolute
            top: 0
            right : 0
            line-height : 12px
            font-size: 10px
            color: rgb(147, 153, 159)
</style>
