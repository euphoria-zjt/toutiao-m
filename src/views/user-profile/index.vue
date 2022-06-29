<template>
  <div class="user-profile">
    <!-- 导航栏 -->
    <van-nav-bar
      title="个人信息"
      class="page-nav-bar"
      left-arrow
      @click-left="$router.back()"
    ></van-nav-bar>
    <!-- /导航栏 -->
    <input
      type="file"
      hidden
      ref="file"
      @change="onFileChange"
    >
    <!-- 个人信息 -->
    <van-cell
      title="头像"
      is-link
      center
      @click="$refs.file.click()"
    >
      <van-image
        class="avatar"
        fit="cover"
        round
        :src="user.photo"
      />
    </van-cell>
    <van-cell
      title="昵称"
      :value="user.name"
      is-link
      @click="isUpdateNameShow = true"
    />
    <van-cell
      title="性别"
      :value="user.gender=== 0 ? '男' : '女'"
      is-link
      @click="isUpdateGenderShow = true"
    />
    <van-cell
      title="生日"
      :value="user.birthday"
      is-link
      @click="isUpdateBirthdayShow = true"
    />
    <!-- /个人信息 -->

    <!--  编辑昵称-->
    <van-popup
      v-model="isUpdateNameShow"
      style="height:100%"
      position="bottom"
      class="van-popup"
    >
      <update-name
        @close="isUpdateNameShow = false"
        v-model="user.name"
        v-if="isUpdateNameShow"
      ></update-name>
    </van-popup>
    <!--  /编辑昵称-->

    <!-- 修改性别 -->
    <van-popup
      v-model="isUpdateGenderShow"
      position="bottom"
    >
      <update-gender
        @close="isUpdateGenderShow = false"
        v-model="user.gender"
        v-if="isUpdateGenderShow"
      />
    </van-popup>
    <!-- /修改性别 -->
    <!-- 编辑生日 -->
    <van-popup
      v-model="isUpdateBirthdayShow"
      position="bottom"
    >
      <update-birthday
        v-model="user.birthday"
        @close="isUpdateBirthdayShow = false"
        v-if="isUpdateBirthdayShow"
      ></update-birthday>
    </van-popup>
    <!-- /编辑生日 -->

    <!-- 编辑头像弹层 -->
    <van-popup
      v-model="isUpdatePhotoShow"
      style="height: 100%;"
      position="bottom"
    >
      <update-photo
        v-if="isUpdatePhotoShow"
        :img="img"
        @close="isUpdatePhotoShow = false "
        @update-photo="user.photo = $event"
      />
    </van-popup>
    <!-- 编辑头像弹层 -->
  </div>
</template>

<script>
import { getUserProfile } from '@/api/user'
import UpdateName from './components/update-name'
import UpdateGender from './components/update-gender'
import UpdateBirthday from './components/update-birthday'
import UpdatePhoto from './components/update-photo'

export default {
  // 组件名称
  name: 'UserProfile',
  // 局部注册的组件
  components: {
    UpdateName,
    UpdateGender,
    UpdateBirthday,
    UpdatePhoto
  },
  // 组件参数 接收来自父组件的数据
  props: {},
  // 组件状态值
  data () {
    return {
      user: {}, // 用户个人信息
      isUpdateNameShow: false, // 是否显示编辑昵称弹窗
      isUpdateGenderShow: false, // 是否显示编辑性别弹窗
      isUpdateBirthdayShow: false, // 是否显示编辑生日弹窗
      isUpdatePhotoShow: false, // 是否显示编辑头像弹窗
      img: null // 头像图片
    }
  },
  // 计算属性
  computed: {},
  // 侦听器
  watch: {},
  created () {
    this.loadUserProfile()
  },
  mounted () {

  },
  // 组件方法
  methods: {
    async loadUserProfile () {
      try {
        const { data } = await getUserProfile()
        // console.log(data)
        this.user = data.data
      } catch (err) {
        this.$toast('获取用户信息失败')
      }
    },
    onFileChange () {
      // 获取文件对象
      const file = this.$refs.file.files[0]
      // 基于文件对象获取blob数据
      this.img = window.URL.createObjectURL(file)
      // 展示预览弹出层
      this.isUpdatePhotoShow = true
      // file-input 如果选了同一个文件不会触发change事件
      // 解决办法就是每次使用完毕把他的value清空
      this.$refs.file.value = ''
    }
  }
}
</script>

<style scoped lang="less">
.user-profile {
  .avatar {
    width: 60px;
    height: 60px;
  }
  .van-popup {
    background: #f5f7f9;
  }
}
</style>
