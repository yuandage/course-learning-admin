<template>
  <div>
    <el-button type="primary" @click="handleAddVideo">新增视频</el-button>
    <el-table
      :data="videoList"
      border
      fit
      style="width: 100%;margin-top:20px;"
    >
      <el-table-column prop="id" align="center" label="id" width="170">
      </el-table-column>
      <el-table-column prop="name" width="180" align="center" label="视频名称">
      </el-table-column>
      <el-table-column prop="summary" width="180" align="center" label="视频简介">
      </el-table-column>

      <el-table-column width="80" align="center" label="视频时长">
        <template slot-scope="scope">
          <span>{{ scope.row.time }}</span>
        </template>
      </el-table-column>

      <el-table-column prop="size" width="80" align="center" label="视频大小">
      </el-table-column>

      <el-table-column width="180" align="center" label="视频下载">
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

    <el-dialog :visible.sync="dialogVisible" :modal="false" :title="dialogType==='edit'?'编辑视频':'新增视频'">
      <el-form :model="video" label-width="100px" label-position="left">
        <el-form-item label="名称">
          <el-input v-model="video.name" placeholder="名称" />
        </el-form-item>
        <el-form-item label="简介">
          <el-input
            v-model="video.summary"
            :autosize="{ minRows: 2, maxRows: 3}"
            type="textarea"
            resize="none"
            placeholder="简介"
          />
        </el-form-item>
        <el-form-item label="所属章节">
          <el-select
            v-model="video.sectionId"
            placeholder="请选择"
          >
            <el-option
              v-for="item in chapterList"
              :key="item.id"
              :label="item.title"
              :value="item.id"
            >
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="文件">
          <el-upload
            ref="upload"
            action="/"
            accept=""
            show-file-list
            :file-list="fileList"
            :auto-upload="false"
            :on-change="handleChange"
          >
            <el-button size="small" type="primary">选择文件</el-button>
            <div slot="tip" class="el-upload__tip">文件大小不超过10MB</div>
          </el-upload>
        </el-form-item>
      </el-form>
      <div style="text-align:right;">
        <el-button type="danger" @click="dialogVisible=false">取消</el-button>
        <el-button type="primary" @click="confirmVideo">确认</el-button>
      </div>
    </el-dialog>
  </div>

</template>

<script>
import { getVideo, uploadVideo, updateVideo, deleteVideo } from '@/api/course-video'
import { getCourseChapters } from '@/api/course-chapter'

export default {
  props: {
    courseId: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      videoList: [],
      chapterList: [],
      loading: false,
      dialogVisible: false,
      dialogType: 'new',
      video: {},
      videoIndex: 0,
      videoFormData: {},
      fileList: []
    }
  },
  created() {
    this.getVideo()
  },
  methods: {
    getVideo() {
      this.loading = true
      getVideo(this.courseId).then(res => {
        this.videoList = res.data
        this.loading = false
      })
    },
    handleAddVideo() {
      this.dialogType = 'new'
      this.dialogVisible = true
      this.video = {}
      this.videoFormData = new FormData()
      getCourseChapters(this.courseId).then(res => {
        this.chapterList = res.data
      })
    },
    handleEdit(scope) {
      this.dialogType = 'edit'
      this.dialogVisible = true
      this.videoIndex = scope.$index
      this.video = scope.row
      getCourseChapters(this.courseId).then(res => {
        this.chapterList = res.data
      })
    },

    handleDelete({ $index, row }) {
      this.$confirm('确认删除此视频?', '警告', {
        confirmButtonText: '确认',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(async() => {
        const res = await deleteVideo(row.id)
        if (res.code === 20000) {
          this.$message({
            type: 'success',
            message: '删除成功!'
          })
          this.videoList.splice($index, 1)
        } else {
          this.$message({
            type: 'error',
            message: '删除失败!'
          })
        }
      })
    },
    async confirmVideo() {
      const isEdit = this.dialogType === 'edit'
      if (isEdit) {
        const res = await updateVideo(this.video.id, this.video)
        if (res.code === 20000) {
          this.dialogVisible = false
          this.$message({
            type: 'success',
            message: '更新成功!'
          })
          this.getVideo()
        } else {
          this.$message({
            type: 'error',
            message: '更新失败!'
          })
        }
      } else {
        this.videoFormData.set('courseId', this.courseId)
        this.videoFormData.set('sectionId', this.video.sectionId)
        this.videoFormData.set('name', this.video.name)
        this.videoFormData.set('summary', this.video.summary)
        const res = await uploadVideo(this.videoFormData)
        if (res.code === 20000) {
          this.videoList.unshift(this.video)
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
    },
    handleBeforeUpload(file) {

    },
    handleChange(file, fileList) {
      if (fileList.length > 0) {
        this.fileList = [fileList[fileList.length - 1]] // 这一步，是 展示最后一次选择的csv文件
        this.videoFormData.set('file', file.raw)// 传文件
      }
    }
  }
}

</script>
