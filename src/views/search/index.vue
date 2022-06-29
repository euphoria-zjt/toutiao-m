<template>
  <div class="search-container">
    <!-- 顶部搜索栏 -->
    <form
      action="/"
      class="search-form"
    >
      <van-search
        v-model="seachText"
        show-action
        placeholder="请输入搜索关键词"
        @search="onSearch"
        @cancel="onCancel"
        background="#3296fa"
        @focus="isResultShow = false"
      />
    </form>
    <!-- /顶部搜索栏 -->
    <!-- 搜索结果 -->
    <search-result
      v-if="isResultShow"
      :seachText="seachText"
    > </search-result>
    <!-- /搜索结果 -->

    <!-- 联想建议 -->
    <search-suggestion
      v-else-if="seachText"
      :seachText="seachText"
      @search="onSearch"
    ></search-suggestion>
    <!-- /联想建议 -->

    <!-- 搜索历史记录 -->
    <search-history
      v-else
      :searchHistories="searchHistories"
      @clear-search-history="searchHistories = []"
      @Search="onSearch"
    >

    </search-history>
    <!-- /搜索历史记录 -->

  </div>
</template>

<script>
import SearchSuggestion from './components/search-suggestion'
import SearchHistory from './components/search-history'
import SearchResult from './components/search-result'
import { setItem, getItem } from '@/utils/storage'
export default {
  // 组件名称
  name: 'SearchIndex',
  // 局部注册的组件
  components: {
    SearchSuggestion,
    SearchHistory,
    SearchResult
  },
  // 组件参数 接收来自父组件的数据
  props: {},
  // 组件状态值
  data () {
    return {
      seachText: '',
      isResultShow: false,
      searchHistories: getItem('TOUTIAO_SEARCH_HISTORIES') || []
    }
  },
  // 计算属性
  computed: {},
  // 侦听器
  watch: {
    searchHistories (value) {
      setItem('TOUTIAO_SEARCH_HISTORIES', value)
    }
  },
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
    onSearch (val) {
      // 更新搜索框的值
      this.seachText = val
      // 存储搜索记录
      // 要求：不要有重复历史记录
      const index = this.searchHistories.indexOf(val)
      if (index !== -1) {
        this.searchHistories.splice(index, 1)
      }
      this.searchHistories.unshift(val)
      // 渲染搜索结果
      this.isResultShow = true
    },
    onCancel () {
      this.$router.back()
    }
  }
}
</script>

<style scoped lang="less">
.search-container {
  padding-top: 108px;
  .van-search__action {
    color: #fff;
  }
  .search-form {
    position: fixed;
    left: 0;
    top: 0;
    right: 0;
    z-index: 1;
  }
}
</style>
