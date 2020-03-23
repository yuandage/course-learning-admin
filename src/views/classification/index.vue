<template>
  <div class="app-container">
    <el-button type="primary" @click="handleAddClassification">新增分类</el-button>

    <el-table
      :data="classificationList"
      style="width: 100%;margin-top:30px;"
      border
      row-key="id"
      :tree-props="{children: 'children', hasChildren: 'hasChildren'}"
    >

      <el-table-column prop="id" align="center" label="id" width="180">
      </el-table-column>
      <el-table-column prop="name" align="center" label="分类名称" width="220">
      </el-table-column>
      <el-table-column prop="parentId" align="center" label="父id" width="180">
      </el-table-column>
      <el-table-column align="center" label="操作">
        <template slot-scope="scope">
          <el-button type="primary" size="small" @click="handleEdit(scope)">编辑</el-button>
          <el-button type="danger" size="small" @click="handleDelete(scope)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>

    <el-dialog :visible.sync="dialogVisible" :modal="false" :title="dialogType==='edit'?'编辑分类':'新增分类'">
      <el-form :model="classification" label-width="100px" label-position="left">
        <el-form-item label="名称">
          <el-input v-model="classification.name" placeholder="分类名称" />
        </el-form-item>
        <el-form-item label="父分类">
          <el-radio-group v-model="isParentClassification">
            <el-radio :label="1">是</el-radio>
            <el-radio :label="0">否</el-radio>
          </el-radio-group>
          <div v-if="isParentClassification===0">
            <el-select v-model="classification.parentId" placeholder="请选择父分类">
              <el-option
                v-for="item in classificationList"
                :key="item.id"
                :label="item.name"
                :value="item.id"
              >
              </el-option>
            </el-select></div>
        </el-form-item>
      </el-form>
      <div style="text-align:right;">
        <el-button type="danger" @click="dialogVisible=false">取消</el-button>
        <el-button type="primary" @click="confirmClassification">确认</el-button>
      </div>
    </el-dialog>

  </div>
</template>

<script>

import { getClassifications, addClassification, deleteClassification, updateClassification } from '@/api/course-classification'

export default {
  name: 'Classification',
  data() {
    return {
      classification: {},
      classificationList: [],
      dialogVisible: false,
      dialogType: 'new',
      isParentClassification: 1
    }
  },
  computed: {
  },

  created() {
    this.getClassifications()
  },
  methods: {
    getClassifications() {
      getClassifications(0).then(res => {
        this.classificationList = res.data
        this.classificationList.forEach(item => {
          getClassifications(item.id).then(res => {
            if (res.data != null) {
              this.$set(item, 'children', res.data)
            }
          })
        })
      })
    },
    handleAddClassification() {
      this.dialogType = 'new'
      this.dialogVisible = true
    },
    handleEdit(scope) {
      this.dialogType = 'edit'
      this.dialogVisible = true
      this.classification = scope.row
    },

    handleDelete({ $index, row }) {
      if (row.parentId === '0') {
        this.$confirm('确认删除此分类?其所有子分类也会一并删除!', '警告', {
          confirmButtonText: '确认',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(async() => {
          var i = 0
          for (i = 0; i < this.classificationList.length; i++) {
            if (this.classificationList[i].id === row.id) {
              break
            }
          }
          const hasChildren = this.classificationList[i].children && this.classificationList[i].children.length > 0
          if (hasChildren) {
            this.classificationList[i].children.forEach(item => {
              deleteClassification(item.id).then(res => {
                if (res.code === 20000) {
                  this.$message({
                    type: 'success',
                    message: '子分类删除成功!'
                  })
                } else {
                  this.$message({
                    type: 'error',
                    message: '子分类删除失败!'
                  })
                }
              })
            })
          }

          deleteClassification(row.id).then(res => {
            if (res.code === 20000) {
              this.$message({
                type: 'success',
                message: '分类删除成功!'
              })
              this.classificationList.splice(i, 1)
            } else {
              this.$message({
                type: 'error',
                message: '分类删除失败!'
              })
            }
          })
        })
      } else {
        this.$confirm('确认删除此分类?', '警告', {
          confirmButtonText: '确认',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(async() => {
          const res = await deleteClassification(row.id)
          if (res.code === 20000) {
            this.$message({
              type: 'success',
              message: '删除成功!'
            })
            this.getClassifications()
          } else {
            this.$message({
              type: 'error',
              message: '删除失败!'
            })
          }
        })
      }
    },
    async confirmClassification() {
      const isEdit = this.dialogType === 'edit'
      // 子分类可以变为父分类,但是父分类变为子分类需要父分类没有子分类
      if (this.isParentClassification === 1) { this.classification.parentId = 0 }

      if (isEdit) {
        const res = await updateClassification(this.classification.id, this.classification)
        if (res.code === 20000) {
          this.dialogVisible = false
          this.$message({
            type: 'success',
            message: '更新成功!'
          })
          this.getClassifications()
        } else {
          this.$message({
            type: 'error',
            message: '更新失败!'
          })
        }
      } else {
        const res = await addClassification(this.classification)
        if (res.code === 20000) {
          this.classificationList.unshift(this.classification)
          this.$message({
            type: 'success',
            message: '添加成功!'
          })
          this.getClassifications()
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

<style lang="scss" scoped>
</style>
