<template>
  <div class="update-name">
    <!-- 导航栏 -->
    <van-nav-bar
      title="修改昵称"
      left-text="取消"
      right-text="完成"
      @click-left="$emit('close')"
      @click-right="onConfirm"
    ></van-nav-bar>
    <!-- /导航栏 -->

    <!-- 输入框 -->
    <div class="field-wrap">
      <van-field
        v-model.trim="localName"
        rows="2"
        autosize
        type="textarea"
        maxlength="7"
        placeholder="请输入新昵称"
        show-word-limit
      />
    </div>
    <!-- /输入框 -->
  </div>
</template>

<script>
import { updateUserProfile } from '@/api/user'
export default {
  // 组件名称
  name: 'UpdateName',
  // 局部注册的组件
  components: {},
  // 组件参数 接收来自父组件的数据
  props: {
    value: {
      type: String,
      require: true

    }
  },
  // 组件状态值
  data () {
    return {
      localName: this.value
    }
  },
  // 计算属性
  computed: {},
  // 侦听器
  watch: {},
  created () { },
  mounted () { },
  // 组件方法
  methods: {
    async onConfirm () {
      this.$toast.loading({
        message: '修改中...',
        forbidClick: true, // 禁止背景点击
        duration: 0// 持续展示
      })

      try {
        const localName = this.localName
        if (!localName.length) {
          this.$toast('内容不能为空')
          return
        }
        await updateUserProfile({
          name: localName
        })
        // 更新视图
        this.$emit('input', localName)
        // 关闭弹窗
        this.$emit('close')
        // 提示成功
        this.$toast.success('修改成功')
        // console.log(data)
      } catch (err) {
        this.$taost('修改失败')
      }
    }
  }
}
</script>

<style scoped lang="less">
.field-wrap {
  padding: 20px;
}
</style>
