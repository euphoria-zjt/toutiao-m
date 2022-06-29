<template>
  <!--    只有list 在 可视范围内才会检查滚动位置触发onload -->
  <van-list
    v-model="loading"
    :finished="finished"
    finished-text="没有更多了"
    @load="onLoad"
    :error="error"
    error-text="加载失败,请点击重试"
    :immediate-check="false"
  >
    <comment-item
      v-for="(item,index) in list"
      :key="index"
      :comment="item"
      @reply-click="$emit('reply-click',$event)"
    ></comment-item>

  </van-list>
</template>

<script>
import { getComments } from '@/api/comment'
import CommentItem from '@/views/article/components/comment-item'
export default {
  name: 'CommentList',
  components: { CommentItem },
  props: {
    source: {
      type: [Number, String, Object],
      required: true,
      offset: null // 获取下一页数据的标记
    },
    list: {
      type: Array,
      default: () => []
    },
    type: {
      type: String,
      // 自定义Props数据验证
      validator (value) {
        return ['a', 'c'].includes(value)
      },
      default: 'a'
    }
  },
  data () {
    return {
      // list: [],
      loading: false,
      finished: false,
      limit: 10,
      error: false
    }
  },
  computed: {},
  watch: {},
  created () {
    // 手动开始 初始loading
    this.loading = true
    this.onLoad()
  },
  mounted () { },
  methods: {
    async onLoad () {
      try {
        // 获取文章的评论和获取评论的回复是同一个接口
        // 唯一的区别是接口参数不一样
        // type
        // a = 获取文章的评论
        // c = 获取评论的回复
        // source
        // 文章的评论，则传递文章的id
        // 评论的回复，则传递评论的id
        // 1. 请求获取数据
        const { data } = await getComments({
          type: this.type, //  评论类型，a-对文章(article)的评论，c-对评论(comment)的回复
          source: this.source.toString(), // 源id，文章id或评论id(特别注意：需要手动加上toString()，否则会在source的值两边加上双引号，导致id不是一个有效的整形)
          offset: this.offset, // 获取评论数据的偏移量，值为评论id，表示从此id的数据向后取，不传表示从第一页开始读取数据
          limit: this.limit // 获取的评论数据个数，不传表示采用后端服务设定的默认每页数据量
        })
        // console.log(data)
        // 2. 将数据添加到列表中
        const { results } = data.data
        this.list.push(...results)
        // 把文章评论的总数量传给外部
        this.$emit('onload-success', data.data)
        // 3. 将 loading 设置为 false
        this.loading = false

        // 4. 判断是否还有数据
        if (results.length) {
          // 有就更新获取下一页的数据页码
          this.offset = data.data.last_id
        } else {
          // 没有就将 finished 设置结束
          this.finished = true
        }
      } catch (err) {
        this.error = true
        this.loading = false
      }
    }
  }
}
</script>

<style scoped lang="less">
</style>
