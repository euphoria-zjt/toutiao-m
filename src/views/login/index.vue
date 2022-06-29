<template>
  <div class="login-container">
    <!-- 导航栏 -->
    <van-nav-bar
      class="page-nav-bar"
      title="登录"
    >
      <van-icon
        @click="$router.back()"
        slot="left"
        name="cross"
      />

    </van-nav-bar>
    <!-- /导航栏 -->

    <!-- 登录表单 -->
    <!-- 表单验证 给van-field配置rules验证规则
    1.当表单提交时会自动触发表单验证
    2.如果验证失败就不会触发提交事件
    -->
    <!-- 给表单设置 类型为数值型 限制输入的位数 -->
    <van-form
      @submit="onSubmit"
      ref="loginForm"
    >
      <van-field
        name="mobile"
        placeholder="请输入手机号"
        :rules="userFormRules.mobile"
        v-model="user.mobile"
        type="number"
        maxlength="11"
      >
        <i
          slot="left-icon"
          class="toutiao toutiao-shouji"
        ></i>
      </van-field>
      <van-field
        name="code"
        placeholder="请输入验证码"
        :rules="userFormRules.code"
        v-model="user.code"
        type="number"
        maxlength="6"
      >
        <i
          slot="left-icon"
          class="toutiao toutiao-yanzhengma"
        ></i>
        <template #button>
          <!-- time=倒计时 时间 -->
          <van-count-down
            :time="1000 * 60"
            format="ss s"
            v-if="isCountDownShow"
            @finish="isCountDownShow = false"
          />
          <van-button
            class="send-sms-btn"
            round
            size="small"
            type="default"
            native-type="button"
            @click="onSendSms"
            v-else
          >发送验证码 </van-button>
        </template>
      </van-field>
      <div class="login-btn-wrop">
        <van-button
          class="login-btn"
          round
          block
          type="info"
          native-type="submit"
        >登录</van-button>
      </div>
    </van-form>
    <!-- /登录表单 -->
  </div>
</template>

<script>
import { login, sendSms } from '@/api/user'
export default {
  // 组件名称
  name: 'LoginIndex',
  // 局部注册的组件
  components: {},
  // 组件参数 接收来自父组件的数据
  props: {},
  // 组件状态值
  data () {
    return {
      user: {
        mobile: '', // 手机号
        code: ''// 验证码
      },
      userFormRules: {
        mobile: [
          {
            required: true, message: '手机号码不能为空'
          },
          {
            pattern: /^1[3|5|7|8|6]\d{9}$/,
            message: '手机格式错误'
          }
        ],
        code: [
          {
            required: true, message: '请填写验证码'
          },
          {
            pattern: /^\d{6}$/,
            message: '验证码格式错误'
          }
        ]
      },
      isCountDownShow: false

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
    async onSubmit () {
      //   1.获取表单数据
      const user = this.user
      //   2.表单验证
      // 在组件中必须通过this.$toast来调用Toast
      this.$toast.loading({
        message: '登录中...',
        forbidClick: true, // 禁用背景点击
        duration: 0// 持续时间默认两秒 改为0会一直持续
      })
      //   3.提交表单请求登录
      try {
        const { data } = await login(user)
        this.$store.commit('setUser', data.data)
        // console.log('登录成功', res)
        this.$toast.success('登录成功')
        // 登录成功跳转回原来页面  this.$router.back不严谨
        this.$router.back()
      } catch (err) {
        if (err.response.status === 400) {
          this.$toast.fail('手机号码或验证码错误')
        } else {
          this.$toast.fail('登录失败请稍后再试')
        }
      }
      //   4.根据请求相应结果处理后续操作
    },
    async onSendSms () {
      // 1. 校验手机号
      try {
        // 这里为啥添加await，是因为validate返回一个Promise
        // 参数是van-field的name
        await this.$refs.loginForm.validate('mobile') // 调用validate手动校验
        // console.log('验证成功')
      } catch (err) {
        return console.log('验证失败', err)// 这个写法其实就是在执行完log，然后结束代码执行，后续代码不执行
      }

      // 2. 验证通过，显示倒计时
      this.isCountDownShow = true
      // 3. 请求发送验证码
      try {
        await sendSms(this.user.mobile)
      } catch (err) {
        // 如果发送失败关闭倒计时
        this.isCountDownShow = false
        if (err.response.staus === 429) {
          this.$toast('验证码发送频繁请稍后再试')
        } else {
          this.$toast('发送失败')
        }
      }
    }
  }
}
</script>

<style scoped lang="less">
.login-container {
  .toutiao {
    font-size: 37px;
  }
}
.send-sms-btn {
  background-color: #ededed;
  // width: 152px;
  height: 46px;
  line-height: 46px;
  font-size: 22px;
  color: #666;
}
.login-btn-wrop {
  padding: 53px 33px;
}
.login-btn {
  background-color: #6db4fb;
  border: none;
}
</style>
