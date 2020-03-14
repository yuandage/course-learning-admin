<template>
  <div class="app-container">
    <el-button type="primary" @click="handleAddCourse">新增课程</el-button>

    <el-table :data="courseList" style="width: 100%;margin-top:30px;" border @expand-change="expand">
      <el-table-column type="expand">
        <template slot-scope="props">

          <div v-if="rowExpand==props.row.id" class="tab-container">
            <el-tabs v-model="activeComponent" style="margin-top:15px;" type="border-card">
              <el-tab-pane v-for="item in tabMapOptions" :key="item.key" :label="item.label" :name="item.key">
                <keep-alive>
                  <component :is="item.component" v-if="activeComponent==item.key" :course-id="props.row.id" />
                </keep-alive>
              </el-tab-pane>
            </el-tabs>
          </div>

        </template>
      </el-table-column>
      <el-table-column align="center" label="id" width="180">
        <template slot-scope="scope">
          {{ scope.row.id }}
        </template>
      </el-table-column>
      <el-table-column align="center" label="课程名称" width="180">
        <template slot-scope="scope">
          {{ scope.row.name }}
        </template>
      </el-table-column>
      <el-table-column align="center" label="课程简介" width="180">
        <template slot-scope="scope">
          {{ scope.row.summary }}
        </template>
      </el-table-column>
      <el-table-column align="center" label="热门课程" width="80">
        <template slot-scope="scope">
          {{ scope.row.popular }}
        </template>
      </el-table-column>
      <el-table-column align="center" label="操作">
        <template slot-scope="scope">
          <el-button type="primary" size="small" @click="handleEdit(scope)">编辑</el-button>
          <el-button type="danger" size="small" @click="handleDelete(scope)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>

    <pagination v-show="total>0" :total="total" :page.sync="listQuery.page" :limit.sync="listQuery.limit" @pagination="getCourses" />

    <el-dialog :visible.sync="dialogVisible" :modal="false" :title="dialogType==='edit'?'编辑课程':'新增课程'">
      <el-form :model="course" label-width="100px" label-position="left">
        <el-form-item label="name">
          <el-input v-model="course.name" placeholder="课程名称" />
        </el-form-item>
        <el-form-item label="summary">
          <el-input v-model="course.summary" placeholder="课程简介" />
        </el-form-item>
        <el-form-item label="description">
          <el-input
            v-model="course.description"
            :autosize="{ minRows: 3, maxRows: 4}"
            type="textarea"
            resize="none"
            placeholder="课程描述"
          />
        </el-form-item>
        <el-form-item label="popular">
          <el-radio v-model="course.popular" label="1">是</el-radio>
          <el-radio v-model="course.popular" label="2">否</el-radio>
        </el-form-item>
        <el-form-item label="coverUrl">
          <el-input v-model="course.coverUrl" placeholder="课程封面" />
        </el-form-item>
      </el-form>
      <div style="text-align:right;">
        <el-button type="danger" @click="dialogVisible=false">取消</el-button>
        <el-button type="primary" @click="confirmCourse">确认</el-button>
      </div>
    </el-dialog>

  </div>
</template>

<script>
import Pagination from '@/components/Pagination' // Secondary package based on el-pagination
import ChapterTabPane from './components/ChapterTabPane'
import QuestionTabPane from './components/QuestionTabPane'
import ResourceTabPane from './components/ResourceTabPane'
import CourseCommentTabPane from './components/CourseCommentTabPane'
import QuestionCommentTabPane from './components/QuestionCommentTabPane'
import { deepClone } from '@/utils'
import { getCourses, addCourse, deleteCourse, updateCourse } from '@/api/course'

export default {
  name: 'Course',
  components: { Pagination, ChapterTabPane, QuestionTabPane,
    ResourceTabPane, CourseCommentTabPane, QuestionCommentTabPane },
  data() {
    return {
      course: {},
      courseList: [],
      courseIndex: 0,
      dialogVisible: false,
      dialogType: 'new',
      total: 0,
      listQuery: {
        page: 1,
        limit: 5
      },
      tabMapOptions: [
        { label: '章节管理', key: 'chapter', component: 'ChapterTabPane' },
        { label: '视频管理', key: 'video', component: 'VideoTabPane' },
        { label: '试题管理', key: 'question', component: 'QuestionTabPane' },
        { label: '资料管理', key: 'resource', component: 'ResourceTabPane' },
        { label: '课程评论管理', key: 'courseComment', component: 'CourseCommentTabPane' },
        { label: '试题评论管理', key: 'questionComment', component: 'QuestionCommentTabPane' }
      ],
      activeComponent: '',
      createdTimes: 0,
      rowExpand: 0
    }
  },
  computed: {
  },
  watch: {
    activeComponent(val) {
      if (this.$route.query.tab !== val) { this.$router.push(`${this.$route.path}?tab=${val}`) }
    }
  },
  created() {
    // init the default selected tab
    const tab = this.$route.query.tab
    if (tab) {
      this.activeComponent = tab
    }
    this.getCourses()
  },
  methods: {
    async getCourses() {
      const res = await getCourses(this.listQuery.page, this.listQuery.limit)
      this.courseList = res.data.rows
      this.total = res.data.total
    },
    expand(row) {
      this.rowExpand = row.id
    },
    showCreatedTimes() {
      this.createdTimes = this.createdTimes + 1
    },
    handleAddCourse() {
      this.dialogType = 'new'
      this.dialogVisible = true
    },
    handleEdit(scope) {
      this.dialogType = 'edit'
      this.dialogVisible = true
      this.courseIndex = scope.$index
      this.course = deepClone(scope.row)
    },
    handleDelete({ $index, row }) {
      this.$confirm('确认删除此课程?', '警告', {
        confirmButtonText: '确认',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(async() => {
        const res = await deleteCourse(row.id)
        if (res.code === 20000) {
          this.courseList.splice($index, 1)
          this.$message({
            type: 'success',
            message: '删除成功!'
          })
        } else {
          this.$message({
            type: 'error',
            message: '删除失败!'
          })
        }
      }).catch(err => { console.error(err) })
    },
    async confirmCourse() {
      const isEdit = this.dialogType === 'edit'
      if (isEdit) {
        const res = await updateCourse(this.course.id, this.course)
        if (res.code === 20000) {
          this.$set(this.courseList, this.courseIndex, this.course)
          this.dialogVisible = false
          this.$notify({
            title: 'Success',
            dangerouslyUseHTMLString: true,
            message: `
            <div>Course Key: ${res.flag}</div>
            <div>Course Name: ${res.code}</div>
            <div>Description: ${res.message}</div>
          `,
            type: 'success'
          })
        } else {
          this.$notify({
            title: '错误',
            dangerouslyUseHTMLString: true,
            message: `
            <div>Course Key: ${res.flag}</div>
            <div>Course Name: ${res.code}</div>
            <div>Description: ${res.message}</div>
          `,
            type: 'error'
          })
        }
      } else {
        const res = await addCourse(this.course)
        if (res.code === 20000) {
          this.courseList.unshift(this.course)
          this.$notify({
            title: 'Success',
            dangerouslyUseHTMLString: true,
            message: `
            <div>Course Key: ${res.flag}</div>
            <div>Course Name: ${res.code}</div>
            <div>Description: ${res.message}</div>
          `,
            type: 'success'
          })
          this.getCourses()
        } else {
          this.$notify({
            title: '错误',
            dangerouslyUseHTMLString: true,
            message: `
            <div>Course Key: ${res.flag}</div>
            <div>Course Name: ${res.code}</div>
            <div>Description: ${res.message}</div>
          `,
            type: 'error'
          })
        }
        this.dialogVisible = false
      }
    }
  }

}
</script>

<style lang="scss" scoped>
  .tab-container {
    margin: 20px;
  }
</style>
