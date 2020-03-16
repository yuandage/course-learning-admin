<template>
  <div>
    <el-button type="primary" @click="handleAddQuestion">新增试题</el-button>
    <el-table
      :data="questionList"
      border
      fit
      style="width: 100%;margin-top:20px;"
    >
      <el-table-column prop="id" align="center" label="id" width="100">
      </el-table-column>
      <el-table-column prop="type" width="80" align="center" label="类型">
      </el-table-column>
      <el-table-column prop="content" width="280" align="center" label="题干">
      </el-table-column>

      <el-table-column width="180" label="选项">
        <template slot-scope="scope">
          <div v-for="item in scope.row.optionContent.split('#')" :key="item">{{ item }}</div>
        </template>
      </el-table-column>

      <el-table-column width="80" align="center" label="答案">
        <template slot-scope="scope">
          <span>{{ scope.row.answer|optionFilter }}</span>
        </template>
      </el-table-column>

      <el-table-column prop="analysis" width="140" label="解析">
      </el-table-column>
      <el-table-column align="center" label="操作">
        <template slot-scope="scope">
          <el-button type="primary" size="small" @click="handleEdit(scope)">编辑</el-button>
          <el-button type="danger" size="small" @click="handleDelete(scope)">删除</el-button>
        </template>
      </el-table-column>

    </el-table>

    <el-dialog :visible.sync="dialogVisible" :modal="false" :title="dialogType==='edit'?'编辑试题':'新增试题'">
      <el-form :model="question" label-width="100px" label-position="left">
        <el-form-item label="类型">
          <span v-if="dialogType==='edit'">{{ question.type }}</span>
          <el-select v-else v-model="question.type" placeholder="请选择">
            <el-option
              v-for="item in questionTypes"
              :key="item"
              :label="item"
              :value="item"
            >
            </el-option>
          </el-select>

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
          <div v-if="dialogType==='edit'">
            <div v-for="(item,index) in optionContent" :key="item.value">
              <el-input
                v-model="optionContent[index]"
                :autosize="{ minRows: 2, maxRows: 3}"
                type="textarea"
                resize="none"
                placeholder="选项"
              />
            </div>
          </div>
          <div v-else>
            <div v-if="question.type=='单选题'">
              <div v-for="(item,index) in optionList" :key="item.value">
                <el-input
                  v-model="optionContent[index]"
                  :autosize="{ minRows: 2, maxRows: 3}"
                  type="textarea"
                  resize="none"
                  placeholder="选项"
                />
              </div>
            </div>
            <div v-else>
              <div v-for="(item,index) in optionList.slice(0,2)" :key="item.value">
                <el-input
                  v-model="tfOptionContent[index]"
                  :autosize="{ minRows: 2, maxRows: 3}"
                  type="textarea"
                  resize="none"
                  placeholder="选项"
                />
              </div>
            </div>

          </div></el-form-item>

        <el-form-item label="答案">
          <div v-if="dialogType==='edit'">
            <el-select v-model="question.answer" placeholder="请选择">
              <el-option
                v-for="(item,index) in optionContent"
                :key="item"
                :label="item.slice(0,1)"
                :value="index+1+''"
              >
              </el-option>
            </el-select>

          </div>
          <div v-else>
            <el-select v-model="question.answer" placeholder="请选择">
              <el-option
                v-for="(item,index) in question.type=='单选题'?answerList:answerList.slice(0,2)"
                :key="item.item"
                :label="item.slice(0,1)"
                :value="index+1+''"
              >
              </el-option>
            </el-select>
          </div>
        </el-form-item>
        <el-form-item label="解析">
          <el-input
            v-model="question.analysis"
            :autosize="{ minRows: 3, maxRows: 4}"
            type="textarea"
            resize="none"
            placeholder="解析"
          />
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
import { deepClone } from '@/utils'
import { getQuestion, addQuestion, updateQuestion, deleteQuestion } from '@/api/course-question'

export default {
  filters: {
    optionFilter(option) {
      const optionList = ['无', 'A', 'B', 'C', 'D', 'E', 'F', 'G']
      return optionList[option]
    }
  },
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
      questionIndex: 0,
      questionTypes: ['单选题', '判断题'],
      optionList: ['A、', 'B、', 'C、', 'D、'],
      answerList: ['A、', 'B、', 'C、', 'D、'],
      optionContent: ['A、', 'B、', 'C、', 'D、'],
      tfOptionContent: ['A、正确', 'B、错误']
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
      this.question = deepClone(scope.row)
      this.optionContent = scope.row.optionContent.split('#')
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
        this.question.optionContent = this.optionContent.join('#')
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
        if (this.question.type === '单选题') {
          this.question.optionContent = this.optionContent.join('#')
        } else {
          this.question.optionContent = this.tfOptionContent.join('#')
        }
        const res = await addQuestion(this.question)
        if (res.code === 20000) {
          this.$message({
            type: 'success',
            message: '添加成功!'
          })
          this.getQuestion()
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
