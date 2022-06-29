<template>
  <div class="">
    <van-button
      v-if="isFollowed"
      class="follow-btn"
      round
      size="small"
      @click="onFoolw"
      :loading="loading"
    >已关注</van-button>
    <van-button
      v-else
      class="follow-btn"
      type="info"
      color="#3296fa"
      round
      size="small"
      icon="plus"
      @click="onFoolw"
      :loading="loading"
    >关注</van-button>
  </div>
</template>

<script>
import { addFollow, deleteFollow } from '@/api/user'
export default {
  // 组件名称
  name: 'followUser',
  // 局部注册的组件
  components: {},
  // 组件参数 接收来自父组件的数据
  // 自定义 v-model的数据名称
  model: {
    prop: 'isFollowed', // 默认是value
    event: 'update-is_followed'// 默认是input
  },
  props: {
    isFollowed: {
      type: Boolean,
      requried: true
    },
    userId: {
      type: [Number, String, Object],
      required: true
    }
  },
  // 组件状态值
  data () {
    return {
      loading: false
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
    async onFoolw () {
      // 展示关注按钮的loading显示状态
      this.followLoading = true
      try {
        if (this.isFollowed) {
          await deleteFollow(this.userId)
          // this.article.is_followed = false
          this.$toast('取消关注成功')
        } else {
          await addFollow(this.userId)
          // this.article.is_followed = true
          this.$toast('关注成功')
        }
        // 更新视图状态
        // this.article.is_followed = !this.article.is_followed
        this.$emit('update-is_followed', !this.isFollowed)
      } catch (err) {
        let message = '操作失败,请重试'
        // console.log(err)
        if (err.response && err.response.status === 400) {
          message = '您自己不能关注您自己'
        }
        this.$toast(message)
      }
      // 展示关注按钮的loading显示状态
      // 无论成功还是失败都要关闭
      this.followLoading = false
    }
  }
}
</script>

<style scoped lang="less">
</style>
