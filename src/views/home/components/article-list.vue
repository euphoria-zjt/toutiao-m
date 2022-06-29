<template>
  <div class="article-list">
    <van-pull-refresh
      v-model="isreFreshLoading"
      @refresh="onRefresh"
      :success-text="refreshSuccessText"
      :success-duration="1500"
    >

      <van-list
        v-model="loading"
        :finished="finished"
        finished-text="没有更多了"
        :error.sync="error"
        error-text="请求失败，点击重新加载"
        @load="onLoad"
      >
        <!-- <van-cell
          v-for="(article, index) in list"
          :key="index"
          :title="article.title"
        /> -->
        <Article
          v-for="(article, index) in list"
          :key="index"
          :article="article "
        ></Article>
      </van-list>
    </van-pull-refresh>
  </div>
</template>

<script>
import { getArticles } from '@/api/article'
import Article from '@/components/article.item'
export default {
  // 组件名称
  name: 'ArticleList',
  // 局部注册的组件
  components: {
    Article
  },
  // 组件参数 接收来自父组件的数据
  props: {
    channel: {
      type: Object,
      required: true
    }
  },
  // 组件状态值
  data () {
    return {
      list: [], // 存储列表数据的数组
      loading: false, // 控制加载中loading的状态
      finished: false, // 控制数据加载结束的状态
      timestamp: null, // 请求获取下一页数据的时间戳
      error: false, // 控制加载失败时的显示状态
      isreFreshLoading: false, // 控制下拉刷新是loding的显示状态
      refreshSuccessText: '刷新成功'// 刷新成功时提示的文本
    }
  },
  // 计算属性
  computed: {},
  // 侦听器
  watch: {},
  // 生命周期钩子   注：没用到的钩子请自行删除
  /**
  * 组件实例创建完成，属性已绑定，但DOM还未生成，el属性还不存在
  */
  created () { },
  /**
  * el 被新创建的 vm.el 替换，并挂载到实例上去之后调用该钩子。
  * 如果 root 实例挂载了一个文档内元素，当 mounted 被调用时 vm.el 也在文档内。
  */
  mounted () { },
  // 组件方法
  methods: {
    async onLoad () {
      // 初始化或滚动到底部 会触发onLoad事件
      // 1.发起请求
      try {
        const { data } = await getArticles({
          channel_id: this.channel.id, // 频道id
          timestamp: this.timestamp || Date.now(), // 简单理解就是请求数据的页码
          with_top: 1// 是否包含置顶，进入页面第一次请求时要包涵置顶
        })
        // 模拟随机失败的情况
        // if (Math.random() > 0.5) {
        //   JSON.parse('dasdasdasdas')
        // }
        // 2.把请求结果放到list数组中
        const { results } = data.data
        // 数组展开运算符 它会把数据拿出来
        this.list.push(...results)
        // 3.本次加载数据结束之后要把加载状态设置为结束
        this.loading = false
        // 4.判断数据是否加载完毕
        if (results.length) {
          // 更新下一页的时间戳
          this.timestamp = data.data.pre_timestamp
        } else {
          // 没有数据将finished设置为true 不再load加载更多
          this.finished = true
        }
        // console.log(data)
      } catch (err) {
        // 展示错误提示
        this.error = true
        // 请求失败loding也需要关闭
        this.loading = false
      }
    },
    // 下拉会触发调用该函数
    async onRefresh () {
      // console.log('onRefresh')
      // 1.请求获取数据
      try {
        const { data } = await getArticles({
          channel_id: this.channel.id, // 频道id
          timestamp: Date.now(), // 下拉刷新每次请求获取最新数据，传递当前最新的时间戳
          with_top: 1// 是否包含置顶，进入页面第一次请求时要包涵置顶
        })
        // 2. 将数据追加到列表的顶部
        const { results } = data.data
        this.list.unshift(...results)
        // 3.关闭下拉刷新Loading的状态
        this.isreFreshLoading = false
        // 刷新成功提示的文本
        this.refreshSuccessText = `刷新成功更新了${results.length}条数据 `
      } catch (err) {
        this.refreshSuccessText = '刷新失败'
        this.isreFreshLoading = false
      }
    }
  }
}
</script>

<style scoped lang="less">
.article-list {
  // 视口（在移动端是布局视口）单位：vw 和 vh，不受父元素影响
  // 1vw = 视口宽度的百分之一
  // 1vh = 视口高度的百分之一
  height: 79vh;
  overflow-y: auto;
}
</style>
