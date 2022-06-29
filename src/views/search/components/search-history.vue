<template>
  <div class="search-history">
    <van-cell title="搜索历史">
      <div v-if="isDeleteShow">
        <span @click="$emit('clear-search-history')">全部删除</span>
        &nbsp; &nbsp;
        <span @click="isDeleteShow=false"> 完成</span>
      </div>
      <van-icon
        name="delete"
        v-else
        @click="isDeleteShow=true"
      ></van-icon>

    </van-cell>
    <van-cell
      :title="item"
      v-for="(item,index) in searchHistories"
      :key="index"
      @click="onSearchItemClick(item,index)"
    >
      <van-icon
        name="close"
        v-if="isDeleteShow"
      />
    </van-cell>
  </div>
</template>

<script>
export default {
  // 组件名称
  name: 'SearchHistory',
  // 局部注册的组件
  components: {},
  // 组件参数 接收来自父组件的数据
  props: {
    // Prop 数据
    // Prop 是受父组件数据影响的
    // 如果是普通数据（数字，字符串，布尔值） 绝对不能修改
    // 即使改了 也不会传到父组件
    // 引用类型可以修改 如 数组 [].push() 对象.xxx=xxx
    // 不能重新赋值，xxx=[]
    searchHistories: {
      type: Array,
      required: true
    }
  },
  // 组件状态值
  data () {
    return {
      // 定义当前是否删除的状态
      isDeleteShow: false
    }
  },
  // 计算属性
  computed: {},
  // 侦听器
  watch: {
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
  mounted () {
  },
  // 组件方法
  methods: {
    onSearchItemClick (item, index) {
      if (this.isDeleteShow) {
        // 如果是删除状态则执行删除操作
        this.searchHistories.splice(index, 1)
      } else {
        // 如果非删除状态 则直接进入搜索
        this.$emit('Search', item)
      }
    }
  }
}
</script>

<style scoped lang="less">
</style>
