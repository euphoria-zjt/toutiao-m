<template>
  <div class="article-container">
    <!-- 导航栏 -->
    <van-nav-bar
      class="page-nav-bar"
      left-arrow
      @click-left="$router.back()"
      title="黑马头条"
    ></van-nav-bar>
    <!-- /导航栏 -->

    <div class="main-wrap">

      <!-- 加载中 -->
      <div
        class="loading-wrap"
        v-if="loading"
      >
        <van-loading
          color="#3296fa"
          vertical
        >加载中</van-loading>
      </div>
      <!-- /加载中 -->

      <!-- 加载完成-文章详情 -->
      <div
        class="article-detail"
        v-else-if="article.title"
      >
        <!-- 文章标题 -->
        <h1 class="article-title">{{article.title}}</h1>
        <!-- /文章标题 -->

        <!-- 用户信息 -->
        <van-cell
          class="user-info"
          center
          :border="false"
        >
          <van-image
            class="avatar"
            slot="icon"
            round
            fit="cover"
            :src="article.aut_photo"
          />
          <div
            slot="title"
            class="user-name"
          >{{article.aut_name}}</div>
          <div
            slot="label"
            class="publish-date"
          >{{article.pubdate | relativeTime}}</div>

          <!-- <followUser :is-followed="article.is_followed"></followUser> -->
          <!-- 模板中的 $event 是事件参数
          当我们传递给子组件的数据既要修改还要使用
          传递：props
          :is-followed="article.is_followed"
          修改：自定义事件
           @update-is_followed="article.is_followed= $event"
           简写方式：在组件上使用 v-model
           value="article.is_followed"
           @input="article.is_followed = $event"

           如果想要修改 v-model的规则名称，可以在子组件内部添加 model配置项 使得绑定的属性和监听的事件更具有语义。
          -->

          <FollowUser
            class="follow-btn"
            :user-id="article.aut_id"
            v-model="article.is_followed"
          />
          <!-- <van-button
            v-if="
            article.is_followed"
            class="follow-btn"
            round
            size="small"
            @click="onFoolw"
            :loading="followLoading"
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
              :loading="followLoading"
            >关注</van-button> -->
          <!-- <van-button
            class="follow-btn"
            round
            size="small"
          >已关注</van-button> -->
        </van-cell>
        <!-- /用户信息 -->

        <!-- 文章内容 -->
        <div
          class="article-content markdown-body"
          v-html="article.content"
          ref="article-content"
        ></div>
        <van-divider>正文结束</van-divider>
        <!-- 文章列表 -->
        <CommentList
          :source="article.art_id"
          @onload-success="totalCommentCount = $event.total_count"
          :list="commentList"
          @reply-click="onReplyShow"
        ></CommentList>
        <!-- /文章列表 -->
        <!-- 底部区域 -->
        <div class="article-bottom">
          <van-button
            class="comment-btn"
            type="default"
            round
            size="small"
            @click="isPostShow = true"
          >写评论
          </van-button>
          <van-icon
            class="comment-icon"
            name="comment-o"
            :info="totalCommentCount"
          />
          <CollectArticle
            class="btn-item"
            v-model="article.is_collected"
            :article-id="article.art_id"
          ></CollectArticle>

          <LikeArticle
            class="btn-item"
            v-model="article.attitude"
            :article-id="article.art_id"
          > </LikeArticle>
          <van-icon
            name="share"
            color="#777777"
          ></van-icon>
        </div>
        <!-- /底部区域 -->
        <van-popup
          v-model="isPostShow"
          position="bottom"
        >
          <comment-post
            :target="article.art_id"
            @post-success="onPostSuccess"
          ></comment-post>
        </van-popup>
      </div>
      <!-- /加载完成-文章详情 -->

      <!-- 加载失败：404 -->
      <div
        class="error-wrap"
        v-else-if="errStatus === 404"
      >
        <van-icon name="failure" />
        <p class="text">该资源不存在或已删除！</p>
      </div>
      <!-- /加载失败：404 -->

      <!-- 加载失败：其它未知错误（例如网络原因或服务端异常） -->
      <div
        class="error-wrap"
        v-else
      >
        <van-icon name="failure" />
        <p class="text">内容加载失败！</p>
        <van-button
          class="retry-btn"
          @click="loadArticle"
        >点击重试</van-button>
      </div>
      <!-- /加载失败：其它未知错误（例如网络原因或服务端异常） -->
    </div>
    <!-- 评论回复 -->
    <!-- 弹出是懒加载的：只有在第一次展示的时候会渲染里面的内容 -->
    <van-popup
      v-model="isReplyShow"
      position="bottom"
      style="height: 60%"
      v-if="isReplyShow"
    >
      <comment-reply
        :comment="currentComment"
        @close="isReplyShow = false"
      ></comment-reply>
    </van-popup>
    <!-- /评论回复 -->

  </div>
</template>

<script>
import { getArticlesId } from '@/api/article'
import './github-markdown.css'
import { ImagePreview } from 'vant'
import FollowUser from '@/components/follow-user'
import CollectArticle from '@/components/collect-article'
import LikeArticle from '@/components/like-article'
import CommentList from './components/comment-list'
import CommentPost from './components/comment-post'
import CommentReply from './components/comment-reply'

export default {
  name: 'ArticleIndex',
  components: {
    FollowUser,
    CollectArticle,
    LikeArticle,
    CommentList,
    CommentPost,
    CommentReply
  },
  // 给所有的后代提供数据
  provide: function () {
    return {
      articleId: this.articleId
    }
  },
  props: {
    articleId: {
      type: [Number, String, Object],
      required: true
    }
  },
  data () {
    return {
      article: {}, // 文章详情
      loading: true, // 加载中loading状态
      errStatus: 0, // 失败的状态码
      followLoading: false, // 关注loading状态
      totalCommentCount: 0,
      isPostShow: false, // 是否显示评论弹窗
      commentList: [], // 评论列表
      isReplyShow: false, // 是否显示回复弹窗
      currentComment: {}// 当前评论
    }
  },
  computed: {},
  watch: {},
  created () {
    this.loadArticle()
  },
  mounted () { },
  methods: {
    async loadArticle () {
      // 展示loading加载中
      this.loading = true
      try {
        const { data } = await getArticlesId(this.articleId)
        // console.log(data)
        // if (Math.random() > 0.5) {
        //   JSON.parse('dasdasdasdasdsa')
        // }
        // 数据驱动视图不是立即的，
        this.article = data.data
        // console.log(this.$refs['article.content'])
        setTimeout(() => {
          this.previewImage()
        }, 0)
        // this.loading = false// 请求成功关闭loading
      } catch (err) {
        if (err.response && err.response.status === 404) {
          this.errStatus = 404
        }
        // this.$toast('文章详情获取失败')
      }
      // 无论成功还是失败都要关闭loading
      this.loading = false
    },
    previewImage () {
      // 得到所有img节点
      const articleContent = this.$refs['article-content']
      const imgs = articleContent.querySelectorAll('img')
      // 获取所有图片的地址
      const images = []
      imgs.forEach((img, index) => {
        images.push(img.src)
        // 给每个函数注册点击事件 调用预览图片功能
        img.onclick = () => {
          ImagePreview({
            // 预览的图片地址数组
            images,
            // 起始位置
            startPosition: index
          })
        }
      })
    },
    onPostSuccess (data) {
      // 关闭评论弹出层
      this.isPostShow = false
      // 添加评论到列表顶部
      this.commentList.unshift(data.new_obj)
    },
    onReplyShow (comment) {
      // 显示回复弹出层
      this.isReplyShow = true
      console.log(comment)
      // 将子组件传给我评论对象保存到当前组件
      this.currentComment = comment
    }

  }
}
</script>

<style scoped lang="less">
.article-container {
  .main-wrap {
    position: fixed;
    left: 0;
    right: 0;
    top: 0;
    bottom: 0;
    background-color: #fff;
  }
  .article-detail {
    position: fixed;
    left: 0;
    right: 0;
    top: 92px;
    bottom: 88px;
    overflow-y: scroll;
    background-color: #fff;
    .article-title {
      font-size: 40px;
      padding: 50px 32px;
      margin: 0;
      color: #3a3a3a;
    }

    .user-info {
      padding: 0 32px;
      .avatar {
        width: 70px;
        height: 70px;
        margin-right: 17px;
      }
      .van-cell__label {
        margin-top: 0;
      }
      .user-name {
        font-size: 24px;
        color: #3a3a3a;
      }
      .publish-date {
        font-size: 23px;
        color: #b7b7b7;
      }
      .follow-btn {
        width: 170px;
        height: 58px;
      }
    }

    .article-content {
      padding: 55px 32px;
      /deep/ p {
        text-align: justify;
      }
    }
  }

  .loading-wrap {
    padding: 200px 32px;
    display: flex;
    align-items: center;
    justify-content: center;
    background-color: #fff;
  }

  .error-wrap {
    padding: 200px 32px;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    background-color: #fff;
    .van-icon {
      font-size: 122px;
      color: #b4b4b4;
    }
    .text {
      font-size: 30px;
      color: #666666;
      margin: 33px 0 46px;
    }
    .retry-btn {
      width: 280px;
      height: 70px;
      line-height: 70px;
      border: 1px solid #c3c3c3;
      font-size: 30px;
      color: #666666;
    }
  }

  .article-bottom {
    position: fixed;
    left: 0;
    right: 0;
    bottom: 0;
    display: flex;
    justify-content: space-around;
    align-items: center;
    box-sizing: border-box;
    height: 88px;
    border-top: 1px solid #d8d8d8;
    background-color: #fff;
    .comment-btn {
      width: 282px;
      height: 46px;
      border: 2px solid #eeeeee;
      font-size: 30px;
      line-height: 46px;
      color: #a7a7a7;
    }
    /deep/ .van-icon {
      font-size: 40px;
    }
    .comment-icon {
      top: 2px;
      color: #777;
      .van-info {
        font-size: 16px;
        background-color: #e22829;
      }
    }
    .btn-item {
      border: none;
      padding: 0;
      height: 40px;
      line-height: 40px;
      color: #777777;
    }
    .collect-btn--collected {
      color: #ffa500;
    }
    .like-btn--liked {
      color: #e5645f;
    }
  }
}
</style>
