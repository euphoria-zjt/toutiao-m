<template>
  <div class="comment-reply">
    <van-nav-bar
      :title="comment.reply_count > 0 ? `${comment.reply_count}条回复 ` : ' 暂无回复'"
    >
      <van-icon
        slot="left"
        name="cross"
        @click="$emit('close')"
      />
    </van-nav-bar>
    <div class="scroll-wrap">
      <!-- 当前评论项 -->
      <comment-item :comment="comment" />
      <!-- /当前评论项 -->
      <!-- 评论的回复列表 -->
      <van-cell title="全部评论" />
      <comment-list
        :source="comment.com_id"
        type="c"
        :list="commentList"
      />
    </div>
    <!-- /评论的回复列表 -->

    <!-- 发布评论 -->
    <div class="post-wrap">
      <van-button
        size="small"
        round
        class="post-btn"
        @click="isPostShow=true"
      >
        发布评论
      </van-button>
    </div>
    <!-- /发布评论 -->
    <!-- 发布评论的弹层 -->
    <van-popup
      v-model="isPostShow"
      position="bottom"
    >
      <comment-post
        :target="comment.com_id"
        @post-success="onPostSuccess"
      />
    </van-popup>
    <!-- /发布评论的弹层 -->
  </div>
</template>

<script>
import CommentItem from './comment-item.vue'
import CommentList from './comment-list.vue'
import CommentPost from './comment-post.vue'
export default {
  // 组件名称
  name: 'CommentReply',
  // 局部注册的组件
  components: {
    CommentItem,
    CommentList,
    CommentPost
  },
  props: {
    comment: {
      type: Object,
      required: true
    }
  },
  data () {
    return {
      isPostShow: false,
      commentList: []
    }
  },
  computed: {},
  watch: {},
  created () { },
  mounted () { },
  methods: {
    onPostSuccess (data) {
      // 更新回复的数量
      this.comment.reply_count++
      // 关闭弹出层
      this.isPostShow = false
      // 将新的评论添加到列表的顶部中
      this.commentList.unshift(data.new_obj)
    }
  }
}
</script>

<style scoped lang="less">
.post-wrap {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  display: flex;
  height: 88px;
  justify-content: center;
  align-items: center;
  background: #fff;
  border-top: 1px solid #d8d8d8;
  .post-btn {
    width: 60%;
  }
  .scroll-wrap {
    position: fixed;
    top: 92px;
    left: 0;
    right: 0;
    bottom: 88px;
    overflow-y: auto;
  }
  .reply-btn {
    // width: 135px;
    height: 48px;
    line-height: 48px;
    font-size: 21px;
    color: #222;
  }
}
</style>
