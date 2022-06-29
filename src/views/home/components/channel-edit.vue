<template>
  <div class="channel-edit">
    <van-cell :border="false">
      <div
        slot="title"
        class="title-text"
      >我的频道</div>
      <van-button
        type="danger"
        plain
        hairline
        round
        size="mini"
        class="edit-btn"
        @click="isEdit=!isEdit"
      >{{ isEdit ? '完成' :'编辑'}}</van-button>
    </van-cell>
    <van-grid
      :gutter="10"
      class='my-grid'
    >
      <van-grid-item
        class="grid-item"
        v-for="(channel,index) in myChannels"
        :key="index"
        :text="channel.name"
        @click="onMyChannelClick(channel,index)"
      >
        <van-icon
          slot="icon"
          name="clear"
          v-show="isEdit && !fiexdChannels.includes(channel.id)"
        ></van-icon>
        <span
          class="text"
          :class="{active:index === active}"
          slot="text"
        >{{channel.name}}</span>
      </van-grid-item>
    </van-grid>
    <!-- 频道推荐 -->
    <van-cell :border="false">
      <div
        slot="title"
        class="title-text"
      >推荐频道</div>
    </van-cell>
    <van-grid
      :gutter="10"
      class='recommend-grid'
    >
      <van-grid-item
        class="grid-item"
        v-for="(channel,index) in recommendChannels"
        :key="index"
        icon="plus"
        :text="channel.name"
        @click="onAddChannel(channel)"
      />
    </van-grid>
    <!-- /频道推荐 -->
  </div>

</template>

<script>
import { getAllChannels, addUserChannel, deleteUserChannel } from '@/api/channel'
import { mapState } from 'vuex'
import { setItem } from '@/utils/storage'
export default {
  // 组件名称
  name: 'ChannelEdit',
  // 局部注册的组件
  components: {},
  // 组件参数 接收来自父组件的数据
  props: {
    myChannels: {
      type: Array,
      required: true
    },
    active: {
      type: Number,
      requried: true
    }
  },
  // 组件状态值
  data () {
    return {
      allChannels: [], // 所有频道
      isEdit: false, // 控制编辑状态的显示
      fiexdChannels: [0]// 固定频道的id 不允许删除
    }
  },
  // 计算属性
  computed: {
    ...mapState(['user']),
    // 计算属性会观测内部依赖数据变化
    // 如果依赖数据发生变化 计算属性会重新执行
    recommendChannels () {
      return this.allChannels.filter(channel => {
        return !this.myChannels.find(myChannel => {
          return myChannel.id === channel.id
        })
      })
      // const channels = []
      // this.allChannels.forEach(channel => {
      //   const ret = this.myChannels.find(myChannel => {
      //     return myChannel.id === channel.id
      //   })
      //   if (!ret) {
      //     channels.push(channel)
      //   }
      // })
      // return channels
    }
  },
  // 侦听器
  watch: {},
  // 生命周期钩子   注：没用到的钩子请自行删除
  /**
  * 组件实例创建完成，属性已绑定，但DOM还未生成，el属性还不存在
  */
  created () {
    this.loadAllChannels()
  },
  /**
  * el 被新创建的 vm.el 替换，并挂载到实例上去之后调用该钩子。
  * 如果 root 实例挂载了一个文档内元素，当 mounted 被调用时 vm.el 也在文档内。
  */
  mounted () {

  },
  // 组件方法
  methods: {
    async loadAllChannels () {
      try {
        const { data } = await getAllChannels()
        // console.log(data)
        this.allChannels = data.data.channels
      } catch (err) {
        this.$toast('获取频道列表数据失败')
      }
    },
    async onAddChannel (channel) {
      this.myChannels.push(channel)
      // 数据持久化处理
      if (this.user) {
        try {
          await addUserChannel({
            id: channel.id, // 频道的id
            seq: this.myChannels.length// 序号
          })
          this.$toast('添加成功')
        } catch (err) {
          this.$toast('添加失败,请稍后重试')
        }
        // 已登录，把数据请求接口放在线上
      } else {
        // 未登录把数据存储到本地
        setItem('TOUTIAO_CHANNELS', this.myChannels)
      }
    },
    onMyChannelClick (channel, index) {
      if (this.isEdit) {
        // 1.如果是固定频道则不删除
        if (this.fiexdChannels.includes(channel.id)) {
          return
        }

        // 编辑状态执行删除频道
        // 参数1 ：要删除的元素的开始索引
        // 参数2 ：要删除的个数，如果不指定侧从1删到最后
        // 3. 如果删除的是激活频道之前的频道,则更新激活的频道项
        if (index <= this.active) {
          this.$emit('update-active', this.active - 1, true)
        }
        // 2.删除频道项
        this.myChannels.splice(index, 1)
        // 4.处理持久化
        this.deleteChannel(channel)
      } else {
        // 非编辑状态执行切换频道
        this.$emit('update-active', index, false)
      }
    },
    async deleteChannel (channel) {
      try {
        if (this.user) {
          // 已登录将数据存到线上
          await deleteUserChannel(channel.id)
        } else {
          // 未登录将数据存到本地存储
          setItem('TOUTIAO_CHANNELS', this.myChannels)
        }
      } catch (err) {
        this.$toast('操作失败')
      }
    }
  }
}
</script>

<style scoped lang="less">
.channel-edit {
  padding: 85px 0;
  .title-text {
    font-size: 32px;
    color: #333333;
  }

  .edit-btn {
    width: 104px;
    height: 48px;
    font-size: 26px;
    color: #f85959;
    border: 1px solid #f85959;
  }
  /deep/ .grid-item {
    width: 160px;
    height: 86px;
    .van-grid-item__content {
      white-space: nowrap;
      background-color: #f4f5f6;
      .van-grid-item__text,
      .text {
        font-size: 28px;
        color: #222;
        margin-top: 0;
      }
      .active {
        color: red;
      }
      .van-grid-item__icon-wrapper {
        position: unset;
      }
    }
  }

  /deep/ .recommend-grid {
    .grid-item {
      .van-grid-item__content {
        flex-direction: row;
        .van-icon-plus {
          font-size: 28px;
          margin-right: 6px;
        }
      }
    }
  }
  /deep/ .my-grid {
    .grid-item {
      .van-icon-clear {
        position: absolute;
        right: -10px;
        top: -10px;
        font-size: 30px;
        color: #cacaca;
        z-index: 2;
      }
    }
  }
}
</style>
