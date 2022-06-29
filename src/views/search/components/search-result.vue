<template>
  <div class="search-result">
    <van-list
      v-model="loading"
      :finished="finished"
      :error.sync="error"
      error-text="请求失败，点击重新加载"
      finished-text="没有更多了"
      @load="onLoad"
    >
      <van-cell
        v-for="(active,index) in list "
        :key="index"
        :title="active.title"
      />
    </van-list>
  </div>
</template>

<script>
import { getSearchResult } from '@/api/search'
export default {
  // 组件名称
  name: 'SearchResult',
  // 局部注册的组件
  components: {},
  // 组件参数 接收来自父组件的数据
  props: {
    seachText: {
      type: String,
      required: true
    }
  },
  // 组件状态值
  data () {
    return {
      list: [],
      loading: false,
      finished: false,
      page: 1,
      per_page: 20,
      error: false
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
      // 1.请求获取数据
      try {
        // 请求获取数据
        const { data } = await getSearchResult({
          page: this.page, // 页码
          per_page: this.per_page, // 每页数据数量
          q: this.seachText// 搜索关键词
        })
        // console.log(data)
        // 2.将本次数据添加到数组列表中
        const { results } = data.data
        this.list.push(...results)
        // 3.将本次加载中的loading 关闭
        this.loading = false
        // / 4.判断是否还有数据
        if (results.length) {
          //  如果有 则更新获取下个数据的页码
          this.page++
        } else {
          // 如果没有则将加载状态 finished设置为结束
          this.finished = true
        }
      } catch (err) {
        this.error = true
        this.loading = false
        this.$toast('数据获取失败请稍后重试')
      }
    }
  }
}
</script>

<style scoped lang="less">
</style>
