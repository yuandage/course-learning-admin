<template>
  <div>
    <el-button type="primary" @click="handleAddChapter">新增章节</el-button>
    <el-table
      :data="chapterList"
      row-key="id"
      :tree-props="{children: 'children', hasChildren: 'hasChildren'}"
      border
      fit
      highlight-current-row
      style="width: 100%;margin-top:20px;"
    >
      <el-table-column prop="id" align="center" label="id" width="160">
      </el-table-column>
      <el-table-column prop="title" width="180" align="center" label="章节标题">
      </el-table-column>
      <el-table-column prop="description" width="320" label="章节描述">
      </el-table-column>

      <el-table-column width="60" align="center" label="时长">
        <template slot-scope="scope">
          <span>{{ scope.row.time }}</span>
        </template>
      </el-table-column>

      <el-table-column width="180" label="视频链接">
        <template slot-scope="scope">
          <a :href="scope.row.videoUrl">{{ scope.row.videoUrl }}</a>
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
      <el-form :model="chapter" label-width="100px" label-position="left">
        <el-form-item label="标题">
          <el-input v-model="chapter.title" placeholder="章节标题" />
        </el-form-item>
        <el-form-item label="描述">
          <el-input
            v-model="chapter.description"
            :autosize="{ minRows: 3, maxRows: 4}"
            type="textarea"
            resize="none"
            placeholder="章节描述"
          />
        </el-form-item>
        <el-form-item label="父章节">
          <el-radio-group v-model="isParentChapter">
            <el-radio :label="1">是</el-radio>
            <el-radio :label="0">否</el-radio>
          </el-radio-group>
          <div v-if="isParentChapter===0">
            <el-select v-model="chapter.parentId" placeholder="请选择父章节">
              <el-option
                v-for="item in chapterList"
                :key="item.id"
                :label="item.title"
                :value="item.id"
              >
              </el-option>
            </el-select></div>
        </el-form-item>
        <el-form-item label="视频链接">
          <el-input v-model="chapter.videoUrl" placeholder="视频链接" />
        </el-form-item>
      </el-form>
      <div style="text-align:right;">
        <el-button type="danger" @click="dialogVisible=false">取消</el-button>
        <el-button type="primary" @click="confirmChapter">确认</el-button>
      </div>
    </el-dialog>
  </div>

</template>

<script>
import { getChapter, addChapter, updateChapter, deleteChapter } from '@/api/course-chapter'

export default {
  props: {
    courseId: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      chapterList: [],
      loading: false,
      dialogVisible: false,
      dialogType: 'new',
      chapter: {},
      isParentChapter: 1
    }
  },
  created() {
    this.getChapter()
  },
  methods: {
    getChapter() {
      this.loading = true
      this.$emit('create') // for test
      getChapter(this.courseId, 0).then(res => {
        this.chapterList = res.data
        this.chapterList.forEach(item => {
          getChapter(this.courseId, item.id).then(res => {
            if (res.data != null) {
              this.$set(item, 'children', res.data)
            }
          })
        })
        this.loading = false
      })
    },
    handleAddChapter() {
      this.dialogType = 'new'
      this.dialogVisible = true
    },
    handleEdit(scope) {
      this.dialogType = 'edit'
      this.dialogVisible = true
      this.chapter = scope.row
    },

    handleDelete({ $index, row }) {
      if (row.parentId === '0') {
        this.$confirm('确认删除此章节?其所有子章节也会一并删除!', '警告', {
          confirmButtonText: '确认',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(async() => {
          var i = 0
          for (i = 0; i < this.chapterList.length; i++) {
            if (this.chapterList[i].id === row.id) {
              break
            }
          }
          const hasChildren = this.chapterList[i].children && this.chapterList[i].children.length > 0
          if (hasChildren) {
            this.chapterList[i].children.forEach(item => {
              deleteChapter(item.id).then(res => {
                if (res.code === 20000) {
                  this.$message({
                    type: 'success',
                    message: '子章节删除成功!'
                  })
                } else {
                  this.$message({
                    type: 'error',
                    message: '子章节删除失败!'
                  })
                }
              })
            })
          }

          deleteChapter(row.id).then(res => {
            if (res.code === 20000) {
              this.$message({
                type: 'success',
                message: '章节删除成功!'
              })
              this.chapterList.splice(i, 1)
            } else {
              this.$message({
                type: 'error',
                message: '章节删除失败!'
              })
            }
          })
        })
      } else {
        this.$confirm('确认删除此章节?', '警告', {
          confirmButtonText: '确认',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(async() => {
          const res = await deleteChapter(row.id)
          if (res.code === 20000) {
            this.$message({
              type: 'success',
              message: '删除成功!'
            })
            this.getChapter()
          } else {
            this.$message({
              type: 'error',
              message: '删除失败!'
            })
          }
        })
      }
    },
    async confirmChapter() {
      const isEdit = this.dialogType === 'edit'
      // 子章节可以变为父章节,但是父章节变为子章节需要父章节没有子章节
      if (this.isParentChapter === 1) { this.chapter.parentId = 0 }

      if (isEdit) {
        const res = await updateChapter(this.chapter.id, this.chapter)
        if (res.code === 20000) {
          this.dialogVisible = false
          this.$message({
            type: 'success',
            message: '更新成功!'
          })
          this.getChapter()
        } else {
          this.$message({
            type: 'error',
            message: '更新失败!'
          })
        }
      } else {
        this.chapter.courseId = this.courseId
        const res = await addChapter(this.chapter)
        if (res.code === 20000) {
          this.chapterList.unshift(this.chapter)
          this.$message({
            type: 'success',
            message: '添加成功!'
          })
          this.getChapter()
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
