<template>
  <div>
    <el-button type="primary" @click="handleAddResource">新增资料</el-button>
    <el-table
      :data="resourceList"
      border
      fit
      style="width: 100%;margin-top:20px;"
    >
      <el-table-column prop="id" align="center" label="id" width="170">
      </el-table-column>
      <el-table-column prop="name" width="180" align="center" label="资料名称">
      </el-table-column>
      <el-table-column prop="summary" width="180" align="center" label="资料简介">
      </el-table-column>

      <el-table-column prop="type" width="80" label="资料类型">
      </el-table-column>

      <el-table-column width="240" align="center" label="资料下载">
        <template slot-scope="scope">
          <a :href="scope.row.resUrl">{{ scope.row.resUrl }}</a>
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
      <el-form :model="resource" label-width="100px" label-position="left">
        <el-form-item label="名称">
          <el-input v-model="resource.name" placeholder="名称" />
        </el-form-item>
        <el-form-item label="简介">
          <el-input
            v-model="resource.summary"
            :autosize="{ minRows: 2, maxRows: 3}"
            type="textarea"
            resize="none"
            placeholder="简介"
          />
        </el-form-item>
        <el-form-item label="类型">
          <el-input v-model="resource.type" placeholder="类型" />
        </el-form-item>
        <el-form-item label="文件">
          <el-upload
            ref="upload"
            action="/"
            accept=""
            :on-preview="handlePreview"
            :before-upload="handleBeforeUpload"
            :on-success="handlesuccess"
            :on-remove="handleRemove"
            :before-remove="beforeRemove"
          >
            <el-button size="small" type="primary">选择文件</el-button>
            <div slot="tip" class="el-upload__tip">文件大小不超过10MB</div>
          </el-upload>
        </el-form-item>
      </el-form>
      <div style="text-align:right;">
        <el-button type="danger" @click="dialogVisible=false">取消</el-button>
        <el-button type="primary" @click="confirmResource">确认</el-button>
      </div>
    </el-dialog>
  </div>

</template>

<script>
import { getResource, updateResource, deleteResource, uploadResource } from '@/api/course-resource'

export default {
  props: {
    courseId: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      resourceList: [],
      loading: false,
      dialogVisible: false,
      dialogType: 'new',
      resource: {},
      resourceIndex: 0,
      resourceFormData: {}
    }
  },
  created() {
    this.getResource()
  },
  methods: {
    getResource() {
      this.loading = true
      getResource(this.courseId).then(res => {
        this.resourceList = res.data
        this.loading = false
      })
    },
    handleAddResource() {
      this.dialogType = 'new'
      this.dialogVisible = true
    },
    handleEdit(scope) {
      this.dialogType = 'edit'
      this.dialogVisible = true
      this.resourceIndex = scope.$index
      this.resource = scope.row
    },

    handleDelete({ $index, row }) {
      this.$confirm('确认删除此资料?', '警告', {
        confirmButtonText: '确认',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(async() => {
        const res = await deleteResource(row.id)
        if (res.code === 20000) {
          this.$message({
            type: 'success',
            message: '删除成功!'
          })
          this.resourceList.splice($index, 1)
        } else {
          this.$message({
            type: 'error',
            message: '删除失败!'
          })
        }
      })
    },
    async confirmResource() {
      const isEdit = this.dialogType === 'edit'
      if (isEdit) {
        const res = await updateResource(this.resource.id, this.resource)
        if (res.code === 20000) {
          this.dialogVisible = false
          this.$message({
            type: 'success',
            message: '更新成功!'
          })
          this.getResource()
        } else {
          this.$message({
            type: 'error',
            message: '更新失败!'
          })
        }
      } else {
        this.resourceFormData.append('courseId', this.courseId)
        this.resourceFormData.append('name', this.resource.name)
        this.resourceFormData.append('type', this.resource.type)
        this.resourceFormData.append('summary', this.resource.summary)
        uploadResource(this.resourceFormData).then(res => {
          if (res.code === 20000) {
            this.resourceList.unshift(this.resource)
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
        })
        this.dialogVisible = false
      }
    },
    handleBeforeUpload(file) {
      this.resourceFormData = new FormData()
      this.resourceFormData.append('file', file)// 传文件

      return false
    },
    handlesuccess(res, file) {
      console.log(res, file)
    },
    handleRemove(file) {
      console.log(file)
    },
    handlePreview(file) {
      console.log(file)
    },
    beforeRemove(file) {
    }
  }
}

</script>
