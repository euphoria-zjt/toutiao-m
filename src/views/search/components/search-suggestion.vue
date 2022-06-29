<template>
  <div class="search-suggestion">
    <van-cell
      icon="search"
      v-for="(text,index) in suggestions"
      :key="index"
      @click="$emit('search',text)"
    >
      <div
        slot="title"
        v-html="highlight(text)"
      ></div>
    </van-cell>
  </div>
</template>

<script>
import { getSearchSuggestions } from '@/api/search'
// 按需加载的好处 只把用到的成员打包的到结果中
import { debounce } from 'lodash'
export default {
  // 组件名称
  name: 'SearchSuggestion',
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
      suggestions: [] // 联想建议数据列表
    }
  },
  // 计算属性
  computed: {},
  // 侦听器
  watch: {
    seachText: {
      // 被监听者发生改变会立即触发handler事件
      // handler (value) {
      //   this.loadSearchSuggestions(value)
      // },
      // debounce工具函数解决防抖
      // 参数1：一个函数
      // 参数2：延迟的时间单位毫秒
      handler: debounce(function (value) {
        this.loadSearchSuggestions(value)
      }, 200),
      immediate: true//
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
    async loadSearchSuggestions (q) {
      try {
        const { data } = await getSearchSuggestions(q)
        // console.log(data)
        this.suggestions = data.data.options
      } catch (err) {
        this.$toast('获取数据失败,请稍后再试')
      }
    },
    highlight (text) {
      const highlightStr = `<span class='active'>${this.seachText}</span>`
      // 正则表达式 //中间的内容会当做字符串来匹配 而不是变量
      // 如果需要根据数据变量动态的创建正则表达式 则需要手动new RegExp
      // RegExp正则表达式构造函数
      // 参数1：匹配模式字符串，它会根据这个字符串创建正则对象
      // 参数2：匹配模式要写到字符串中
      const reg = new RegExp(this.seachText, 'gi')
      // return text.replace(reg, highlightStr)
      return text.replace(reg, highlightStr)
    }
  }
}
</script>

<style scoped lang="less">
.search-suggestion {
  /deep/ span.active {
    color: #3296fa;
  }
}
</style>
