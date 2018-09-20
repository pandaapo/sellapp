<template>
  <div class="goods">
    <!-- v-el:food-wrapper 获取这个DOM对象 -->
    <div class="menu-wrapper" ref="menuWrapper">
      <ul>
        <!-- currentIndex === index，给这个li一个高亮样式current -->
        <li v-for="(item, index) in goods" class="menu-item" :class="{'current': currentIndex === index}" @click="selectMenu(index, $event)">
          <span class="text border-1px">
            <!-- 如果item.type>0，展示出对应.icon的span -->
            <span v-show="item.type>0" class="icon" :class="classMap[item.type]"></span>{{item.name}}
          </span>
        </li>
      </ul>
    </div>
    <div class="foods-wrapper" ref="foodsWrapper">
      <ul>
        <!-- food-list-hook是一个编程习惯，表示food-list对应元素会被js选择，并无实际效果 -->
        <li v-for="item in goods" class="food-list food-list-hook">
          <h1 class="title">{{item.name}}</h1>
          <ul>
            <li v-for="food in item.foods" class="food-item border-1px">
              <div class="icon">
                <!-- ？？？疑问：:src 是什么用法？ -->
                <img width="57" height="57" :src="food.icon">
              </div>
              <div class="content">
                <h2 class="name">{{food.name}}</h2>
                <p class="desc">{{food.description}}</p>
                <div class="extra">
                   <span class="count">月售{{food.sellCount}}份</span><span>好评率{{food.rating}}</span> 
                </div>
                <div class="price">
                  <span class="now">￥{{food.price}}</span><span class="old" v-show="food.oldPrice">￥{{food.oldPrice}}</span>
                </div>
              </div>
              <div></div>
            </li>
          </ul>
        </li>
      </ul>
    </div>
    <shopcart :delivery-price="seller.deliveryPrice" :min-price="seller.minPrice"></shopcart>
  </div>
</template>

<script type="text/ecmascript-6">
  import BScroll from "better-scroll";
  import shopcart from "components/shopcart/shopcart"

  const ERR_OK = 0;
  export default {
    // 接受通过vue-router传入的数据
    props: {
      seller: {
        type: Object
      }
    },
    data() {
      return {
        // 一开始goods是空，当组件被调用时，通过下面的$http.get('/api/goods')去后端获取数据
        goods: [],
        listHeight: [],
        scrollY: 0
      }
    },
    computed: {
      // 当scrollY发生变化，vue的computed会重新计算
      currentIndex() {
        for(let i=0; i<this.listHeight.length; i++){
          let height1 = this.listHeight[i];
          let height2 = this.listHeight[i + 1];
          if(!height2 || (this.scrollY >= height1 && this.scrollY < height2)) {
            return i;
          }
        }
        return 0;
      }
    },
    created() {
      // 获取数据
      this.$http.get('/api/goods').then((response) => {
        response = response.body;
        if(response.errno === ERR_OK){
          this.goods = response.data;
          // 获取到数据以后，vue的DOM会映射，但这个映射是异步的，DOM还没有初始化出来，所以马上调用_initScroll()没有效果
          this.$nextTick(() => {
            this._initScroll();
            this._caculateHeight();
          });
        };
        // 练习：下面这个数组可以作为一个单独的组件
        this.classMap = ['decrease','discount','special','invoice','guarantee']

      })
    },
    methods: {
      selectMenu(index, event) {
        //教程：点击事件event，better-scroll派发的点击事件这属性是true；浏览器原生点击事件没有这个属性。实际：两种都是true
        if(!event._constructed){  //解决浏览器点击时触发两次的问题
          return;
        }
        let foodList = this.$refs.foodsWrapper.getElementsByClassName("food-list-hook");
        let el = foodList[index]
        //？？？疑问：这里的betterScroll的.scrollToElement方法没有自动提示。 
        this.foodsScroll.scrollToElement(el, 300);
      },
      _initScroll() {
        // 实例化BScroll时，需要接收一个DOM对象，一个option；this.$els.meuWrapper获取上面标记的v-el:menu-wrapper DOM对象，一个驼峰格式一个中划线格式
        this.menuScroll = new BScroll(this.$refs.menuWrapper, {
          // 教程说：不设置该属性时，左边栏无法点击。但是实际上：没设置该属性也可点击。
          click: true
        });
        this.foodsScroll = new BScroll(this.$refs.foodsWrapper, {
          //  当滚动时，能够实时地检测到滚动的位置
          probeType: 3
        });
        // 让foodsScroll对象监听scroll事件
        this.foodsScroll.on('scroll',((post) => {
          this.scrollY = Math.abs(Math.round(post.y));
        }))
      },
      _caculateHeight() {
        let foodList = this.$refs.foodsWrapper.getElementsByClassName("food-list-hook");
        let height = 0;
        this.listHeight.push(height);
        for(let i =0; i<foodList.length; i++){
          let item = foodList[i];
          // DOM原生的方法获取item区块的高度
          height += item.clientHeight;
          this.listHeight.push(height);
        }
      }
    },
    components: {
      // import组件后，注册该组件
      shopcart
    }
  }
</script>

<style lang="stylus" ref="stylesheet/stylus" scoped>
  // ？？？疑问：这里写路径时没有自动提示。
  @import "../../common/stylus/mixin.styl";

  .goods
    display : flex
    // 因为设计图中是没有滚动条的，所以高度就是视窗高度
    position : absolute
    // 距离顶部174
    top: 174px
    // 距离底部46
    bottom 46px
    width : 100%
    // 超出部分要隐藏
    overflow: hidden
    .menu-wrapper
      // 三个参数，第一个是否等分，第二个根据空间缩放比例，第三个尺寸
      flex: 0 0 80px
      // 还写个width是为解决安卓的兼容性问题
      width : 80px
      background : #f3f5f7
      .menu-item
        // table：在数据占了多行时也可以垂直居中
        display : table
        height: 54px
        width: 56px
        padding : 0 12px
        line-height : 14px
        &.current
          position: relative
          z-index : 10
          margin-top : -1px
          background : #fff
          // 字体变粗
          font-weight : 700
          .text
            border-none()
        .icon
          //！！！练习：这段.icon是从header组件复制过来，也可以做成单独组件
          display : inline-block
          vertical-align : top
          width : 12px
          height : 12px
          margin-right : 2px
          background-size : 12px
          background-repeat : no-repeat
          &.decrease
            bg-image('decrease_3')
          &.discount
            bg-image('discount_3')
          &.guarantee
            bg-image('guarantee_3')
          &.invoice
            bg-image('invoice_3')
          &.special
            bg-image('special_3')
        .text
          // table中的一个单元格
          display : table-cell
          width : 56px
          vertical-align : middle
          // 1像素的border
          border-1px(rgba(7,17,27, 0.1))
          font-size : 12px
    .foods-wrapper
      flex: 1
      .title
        padding-left: 14px
        height : 26px
        line-height : 26px
        border-left : 2px solid #d9dde1
        font-size: 12px
        color: rgb(147, 153, 159)
        background: #f3f5f7
      .food-item
        display : flex
        margin: 18px
        // 因为上下margin会重叠，导致底线会紧贴在food-item下面，所以搞个padding
        padding : 0 0 18px 0
        // 1像素的border
        border-1px(rgba(7,17,27, 0.1))
        // 食品列表最后一个下面没有1像素的底线
        &:last-child
          border-none()
          //？？？疑问：没明白
          margin-bottom : 0
        .icon
          flex: 0 0 57px
          margin-right : 10px
        .content
          flex: 1
          .name
            margin: 2px 0 8px 0
            height: 14px
            line-height : 14px
            font-size: 14px
            color : rgb(7, 17, 27)
          // 共有的样式可以这样写在一起
          .desc, .extra
            line-height : 10px
            font-size: 10px
            color: rgb(147, 153, 159)
          .desc
            margin-bottom : 8px
            // 占多行的时候10px，上下行会紧挨着
            line-height : 12px
          .extra
            .count
              margin-right : 12px
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
</style>
