<template>
  <div class="app-container">
    <el-button type="primary" @click="handleAddPermission">新增权限</el-button>

    <el-table :data="permissionList" style="width: 100%;margin-top:30px;" border>
      <el-table-column align="center" label="id" width="180">
        <template slot-scope="scope">
          {{ scope.row.id }}
        </template>
      </el-table-column>
      <el-table-column align="center" label="权限名称" width="180">
        <template slot-scope="scope">
          {{ scope.row.name }}
        </template>
      </el-table-column>
      <el-table-column align="center" label="权限描述" width="200">
        <template slot-scope="scope">
          {{ scope.row.description }}
        </template>
      </el-table-column>
      <el-table-column align="center" label="创建人" width="180">
        <template slot-scope="scope">
          {{ scope.row.createUser }}
        </template>
      </el-table-column>
      <el-table-column align="center" label="更新人" width="180">
        <template slot-scope="scope">
          {{ scope.row.updateUser }}
        </template>
      </el-table-column>
      <el-table-column align="center" label="操作">
        <template slot-scope="scope">
          <el-button type="primary" size="small" @click="handleEdit(scope)">编辑</el-button>
          <el-button type="danger" size="small" @click="handleDelete(scope)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>

    <el-dialog :visible.sync="dialogVisible" :title="dialogType==='edit'?'编辑权限':'新增权限'">
      <el-form :model="permission" label-width="90px" label-position="left">
        <el-form-item label="name">
          <el-input v-model="permission.name" placeholder="权限名称" />
        </el-form-item>
        <el-form-item label="description">
          <el-input v-model="permission.description" placeholder="权限描述" />
        </el-form-item>
      </el-form>
      <div style="text-align:right;">
        <el-button type="danger" @click="dialogVisible=false">取消</el-button>
        <el-button type="primary" @click="confirmPermission">确认</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { deepClone } from '@/utils'
import { getPermissions, addPermission, deletePermission, updatePermission } from '@/api/permission'

export default {
  data() {
    return {
      permission: {},
      permissionList: [],
      permissionIndex: 0,
      dialogVisible: false,
      dialogType: 'new'
    }
  },
  computed: {

  },
  created() {
    this.getPermissions()
  },
  methods: {
    async getPermissions() {
      const res = await getPermissions()
      this.permissionList = res.data
    },
    handleAddPermission() {
      this.dialogType = 'new'
      this.dialogVisible = true
    },
    handleEdit(scope) {
      this.dialogType = 'edit'
      this.dialogVisible = true
      this.permissionIndex = scope.$index
      this.permission = deepClone(scope.row)
    },
    handleDelete({ $index, row }) {
      this.$confirm('确认删除此权限?', '警告', {
        confirmButtonText: '确认',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(async() => {
        const res = await deletePermission(row.id)
        if (res.code === 20000) {
          this.permissionList.splice($index, 1)
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

    async confirmPermission() {
      const isEdit = this.dialogType === 'edit'
      if (isEdit) {
        const res = await updatePermission(this.permission.id, this.permission)
        if (res.code === 20000) {
          this.$set(this.permissionList, this.permissionIndex, this.permission)
          this.dialogVisible = false
          this.$notify({
            title: 'Success',
            dangerouslyUseHTMLString: true,
            message: `
            <div>Permission Key: ${res.flag}</div>
            <div>Permission Name: ${res.code}</div>
            <div>Description: ${res.message}</div>
          `,
            type: 'success'
          })
        } else {
          this.$notify({
            title: '错误',
            dangerouslyUseHTMLString: true,
            message: `
            <div>Permission Key: ${res.flag}</div>
            <div>Permission Name: ${res.code}</div>
            <div>Description: ${res.message}</div>
          `,
            type: 'error'
          })
        }
      } else {
        const res = await addPermission(this.permission)
        if (res.code === 20000) {
          this.permissionList.unshift(this.permission)
          this.$notify({
            title: 'Success',
            dangerouslyUseHTMLString: true,
            message: `
            <div>Permission Key: ${res.flag}</div>
            <div>Permission Name: ${res.code}</div>
            <div>Description: ${res.message}</div>
          `,
            type: 'success'
          })
          this.getPermissions()
        } else {
          this.$notify({
            title: '错误',
            dangerouslyUseHTMLString: true,
            message: `
            <div>Permission Key: ${res.flag}</div>
            <div>Permission Name: ${res.code}</div>
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
.app-container {
  .roles-table {
    margin-top: 30px;
  }
  .permission-tree {
    margin-bottom: 30px;
  }
}
</style>
