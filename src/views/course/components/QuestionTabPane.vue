<template>
  <div>
    <el-button type="primary" @click="handleAddQuestion">新增试题</el-button>
    <el-table
      :data="questionList"
      border
      fit
      style="width: 100%;margin-top:20px;"
    >
      <el-table-column v-loading="loading" align="center" label="id" width="170" element-loading-text="请给我点时间！">
        <template slot-scope="scope">
          <span>{{ scope.row.id }}</span>
        </template>
      </el-table-column>
      <el-table-column width="80" align="center" label="类型">
        <template slot-scope="scope">
          <span>{{ scope.row.type }}</span>
        </template>
      </el-table-column>
      <el-table-column width="240" align="center" label="题干">
        <template slot-scope="scope">
          <span>{{ scope.row.content }}</span>
        </template>
      </el-table-column>

      <el-table-column width="180" label="选项">
        <template slot-scope="scope">
          <span>{{ scope.row.optionContent }}</span>
        </template>
      </el-table-column>

      <el-table-column width="80" align="center" label="答案">
        <template slot-scope="scope">
          <span>{{ scope.row.answer }}</span>
        </template>
      </el-table-column>

      <el-table-column width="120" label="解析">
        <template slot-scope="scope">
          <span>{{ scope.row.analysis }}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="操作">
        <template slot-scope="scope">
          <el-button type="primary" size="small" @click="handleEdit(scope)">编辑</el-button>
          <el-button type="danger" size="small" @click="handleDelete(scope)">删除</el-button>
        </template>
      </el-table-column>

    </el-table>

    <el-dialog :visible.sync="dialogVisible" :modal="false" :title="dialogType==='edit'?'编辑章节':'新增章节'">
      <el-form :model="question" label-width="100px" label-position="left">
        <el-form-item label="类型">
          <el-input v-model="question.type" placeholder="类型" />
        </el-form-item>
        <el-form-item label="题干">
          <el-input
            v-model="question.content"
            :autosize="{ minRows: 3, maxRows: 4}"
            type="textarea"
            resize="none"
            placeholder="题干"
          />
        </el-form-item>
        <el-form-item label="选项">
          <el-input
            v-model="question.optionContent"
            :autosize="{ minRows: 2, maxRows: 3}"
            type="textarea"
            resize="none"
            placeholder="选项"
          />
        </el-form-item>
        <el-form-item label="答案">
          <el-input v-model="question.answer" placeholder="答案" />
        </el-form-item>
        <el-form-item label="解析">
          <el-input v-model="question.analysis" placeholder="解析" />
        </el-form-item>
      </el-form>
      <div style="text-align:right;">
        <el-button type="danger" @click="dialogVisible=false">取消</el-button>
        <el-button type="primary" @click="confirmQuestion">确认</el-button>
      </div>
    </el-dialog>
  </div>

</template>

<script>
import { getQuestion, addQuestion, updateQuestion, deleteQuestion } from '@/api/course-question'

export default {
  props: {
    courseId: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      questionList: [],
      loading: false,
      dialogVisible: false,
      dialogType: 'new',
      question: {},
      questionIndex: 0
    }
  },
  created() {
    this.getQuestion()
  },
  methods: {
    getQuestion() {
      this.loading = true
      getQuestion(this.courseId).then(res => {
        this.questionList = res.data
        this.loading = false
      })
    },
    handleAddQuestion() {
      this.dialogType = 'new'
      this.dialogVisible = true
    },
    handleEdit(scope) {
      this.dialogType = 'edit'
      this.dialogVisible = true
      this.questionIndex = scope.$index
      this.question = scope.row
    },

    handleDelete({ $index, row }) {
      this.$confirm('确认删除此试题?', '警告', {
        confirmButtonText: '确认',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(async() => {
        const res = await deleteQuestion(row.id)
        if (res.code === 20000) {
          this.$message({
            type: 'success',
            message: '删除成功!'
          })
          this.questionList.splice($index, 1)
        } else {
          this.$message({
            type: 'error',
            message: '删除失败!'
          })
        }
      })
    },
    async confirmQuestion() {
      const isEdit = this.dialogType === 'edit'
      if (isEdit) {
        const res = await updateQuestion(this.question.id, this.question)
        if (res.code === 20000) {
          this.dialogVisible = false
          this.$message({
            type: 'success',
            message: '更新成功!'
          })
          this.getQuestion()
        } else {
          this.$message({
            type: 'error',
            message: '更新失败!'
          })
        }
      } else {
        this.question.courseId = this.courseId
        const res = await addQuestion(this.question)
        if (res.code === 20000) {
          this.questionList.unshift(this.question)
          this.$message({
            type: 'success',
            message: '添加成功!'
          })
        } else {
          this.$message({
            type: 'error',
            message: '添加失败!'
          })
        }
        this.dialogVisible = false
      }
    }
  }
}

</script>
