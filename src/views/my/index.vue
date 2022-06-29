<template>
  <div class="my-container">
    <!-- 已登录头部 -->
    <div
      class="header user-info"
      v-if="user"
    >
      <div class="base-info">
        <div class="left">
          <van-image
            class="avatar"
            round
            fit="cover"
            :src="userInfo.photo"
          />
          <span class="name">{{userInfo.name}}</span>
        </div>
        <div class="right">
          <van-button
            size="mini"
            round
            to="/user/profile"
          >编辑资料</van-button>
        </div>
      </div>
      <div class="data-stats">
        <div class="data-item">
          <span class="count">10</span>
          <span class="text">头条</span>
        </div>
        <div class="data-item">
          <span class="count">6</span>
          <span class="text">关注</span>
        </div>
        <div class="data-item">
          <span class="count">988888</span>
          <span class="text">粉丝</span>
        </div>
        <div class="data-item">
          <span class="count">1亿+</span>
          <span class="text">获赞</span>
        </div>

      </div>
    </div>
    <!--/  已登录头部 -->
    <!-- 未登录头部 -->
    <div
      class="header not-login"
      v-else
    >
      <div
        class="login-btn"
        @click="$router.push('/login')"
      >
        <img
          class="mobile-img"
          src="~@/assets/mobile.png"
        />
        <span class="text">登录/注册</span>
      </div>
    </div>
    <!-- /未登录头部 -->

    <!-- 导航 -->
    <van-grid
      :column-num="2"
      class="grid-nav"
      clickable
    >
      <van-grid-item class="grid-item">
        <i
          slot="icon"
          class="toutiao toutiao-shoucang"
        ></i>
        <span
          slot="text"
          class="text"
        >收藏</span>
      </van-grid-item>
      <van-grid-item class="grid-item">
        <i
          slot="icon"
          class="toutiao toutiao-lishi"
        ></i>
        <span
          slot="text"
          class="text"
        >历史</span>
      </van-grid-item>
    </van-grid>
    <!-- /导航 -->
    <van-cell
      title="消息通知"
      is-link
    />
    <van-cell
      class="mb-9"
      title="Anthony"
      is-link
    />
    <van-cell
      v-if="user"
      class="logout-cell"
      clickable
      title="退出登录"
      @click="onLogout"
    />
  </div>
</template>

<script>
import { mapState } from 'vuex'
import { getUserinfo } from '@/api/user.js'
export default {
  // 组件名称
  name: 'MyIndex',
  // 局部注册的组件
  components: {},
  // 组件参数 接收来自父组件的数据
  props: {},
  // 组件状态值
  data () {
    return {
      userInfo: {} // 用户信息
    }
  },
  // 计算属性
  computed: {
    ...mapState(['user'])
  },
  // 侦听器
  watch: {},
  // 生命周期钩子   注：没用到的钩子请自行删除
  /**
  * 组件实例创建完成，属性已绑定，但DOM还未生成，el属性还不存在
  */
  created () {
    if (this.user) {
      this.loadUserInfo()
    }
  },
  /**
  * el 被新创建的 vm.el 替换，并挂载到实例上去之后调用该钩子。
  * 如果 root 实例挂载了一个文档内元素，当 mounted 被调用时 vm.el 也在文档内。
  */
  mounted () { },
  // 组件方法
  methods: {
    onLogout () {
      // 退出提示
      // 在组件中要使用this.$dialog来调用Dialog
      this.$dialog.confirm({
        title: '确认退出？'
      })
        .then(() => {
          // console.log('确认退出执行这里')
          // this.$store.commit('setUser', null)
          this.$store.commit('setUser', null)
        })
        .catch(() => {
          console.log('取消')
        })
      // 确认退出 清除登录状态 清空本地存储和容器里面的token
    },
    async loadUserInfo () {
      try {
        const { data } = await getUserinfo()
        // console.log(data)
        this.userInfo = data.data
      } catch (err) {
        this.$toast('获取用户信息失败')
      }
    }
  }
}
</script>

<style scoped lang="less">
.my-container {
  .header {
    height: 361px;
    background: url(~@/assets/335.jpg);
    background-size: cover;
  }
  .not-login {
    display: flex;
    justify-content: center;
    align-items: center;
    .login-btn {
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
    }
    .mobile-img {
      width: 132px;
      height: 132px;
      margin-bottom: 15px;
    }
    .text {
      font-size: 28px;
      color: #fff;
    }
  }
  .user-info {
    .base-info {
      height: 231px;
      // background-color: pink;
      padding: 76px 32px 23px;
      box-sizing: border-box;
      display: flex;
      justify-content: space-between;
      align-items: center;
      .left {
        display: flex;
        align-items: center;
        // font-size: 50px;
        .avatar {
          height: 132px;
          width: 132px;
          margin-right: 23px;
          border: 4px solid #fff;
        }
        .name {
          font-size: 30px;
          color: #fff;
        }
      }
    }
  }

  .data-stats {
    display: flex;
    .data-item {
      height: 130px;
      flex: 1;
      display: flex;
      justify-content: center;
      align-items: center;
      flex-direction: column;
      color: #fff;
      .count {
        font-size: 36px;
      }
      .text {
        font-size: 23px;
      }
    }
  }
  .grid-nav {
    .grid-item {
      height: 141px;
      i.toutiao {
        font-size: 45px;
      }
      .toutiao-shoucang {
        color: #eb5253;
      }
      .toutiao-lishi {
        color: #ff9d1d;
      }
      span.text {
        font-size: 28px;
      }
    }
  }
  .logout-cell {
    text-align: center;
    color: #d86262;
  }

  .mb-9 {
    margin-bottom: 9px;
  }
}
</style>
