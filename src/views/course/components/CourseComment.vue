<template>
  <div>
    <el-table :data="commentList" border fit style="width: 100%;margin-top:20px;">
      <el-table-column
        prop="id"
        align="center"
        label="id"
        width="170"
      >
      </el-table-column>
      <el-table-column prop="nickname" width="160" align="center" label="评论人">
      </el-table-column>
      <el-table-column width="350" align="center" label="评论内容">
        <template slot-scope="scope">
          <span>{{ scope.row.content }}</span>
        </template>
      </el-table-column>
      t
      <el-table-column width="150" label="评论时间">
        <template slot-scope="scope">
          <span>{{ scope.row.createTime| parseTime('{y}-{m}-{d} {h}:{i}') }}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="操作">
        <template slot-scope="scope">
          <el-button type="danger" size="small" @click="handleDelete(scope)">删除</el-button>
        </template>
      </el-table-column>

    </el-table>

  </div>

</template>

<script>
import { getComment, deleteComment } from '@/api/course-comment'

export default {
  props: {
    courseId: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      commentList: [],
      loading: true
    }
  },
  created() {
    this.getComment()
  },
  methods: {
    getComment() {
      this.loading = true
      getComment(this.courseId).then(res => {
        this.commentList = res.data
        this.loading = false
      })
    },

    handleDelete({ $index, row }) {
      this.$confirm('确认删除此评论?', '警告', {
        confirmButtonText: '确认',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(async() => {
        const res = await deleteComment(row.id)
        if (res.code === 20000) {
          this.$message({
            type: 'success',
            message: '删除成功!'
          })
          this.commentList.splice($index, 1)
        } else {
          this.$message({
            type: 'error',
            message: '删除失败!'
          })
        }
      })
    }
  }
}

</script>
