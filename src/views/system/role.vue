<template>
  <div class="app-container">
    <el-button type="primary" @click="handleAddRole">新增角色</el-button>

    <el-table :data="rolesList" style="width: 100%;margin-top:30px;" border>
      <el-table-column align="center" label="id" width="180">
        <template slot-scope="scope">
          {{ scope.row.id }}
        </template>
      </el-table-column>
      <el-table-column align="center" label="角色名称" width="180">
        <template slot-scope="scope">
          {{ scope.row.name }}
        </template>
      </el-table-column>
      <el-table-column align="center" label="角色描述" width="200">
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
          <el-button type="success" size="small" @click="handleChangeRolePermissioms(scope)">修改权限</el-button>
        </template>
      </el-table-column>
    </el-table>

    <el-dialog :visible.sync="dialogVisible" :title="dialogType==='edit'?'编辑角色':'新增角色'">
      <el-form :model="role" label-width="80px" label-position="left">
        <el-form-item label="Name">
          <el-input v-model="role.name" placeholder="角色名称" />
        </el-form-item>
        <el-form-item label="Desc">
          <el-input
            v-model="role.description"
            :autosize="{ minRows: 2, maxRows: 4}"
            type="textarea"
            placeholder="角色描述"
          />
        </el-form-item>
      </el-form>
      <div style="text-align:right;">
        <el-button type="danger" @click="dialogVisible=false">取消</el-button>
        <el-button type="primary" @click="confirmRole">确认</el-button>
      </div>
    </el-dialog>

    <el-dialog :visible.sync="rolePermissiomDialogVisible" :modal="false" :title="role.name+' 权限:'">
      <el-select v-model="rolePermissions" multiple placeholder="请选择权限" style="width:500px">
        <el-option
          v-for="item in permissions"
          :key="item.id"
          :label="item.name"
          :value="item.id"
        >
        </el-option>
      </el-select>
      <div style="text-align:right;">
        <el-button type="danger" @click="rolePermissiomDialogVisible=false">取消</el-button>
        <el-button type="primary" @click="confirmRolePermissioms">确认</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { deepClone } from '@/utils'
import { getRoles, addRole, deleteRole, updateRole } from '@/api/role'
import { getRolePermissions, addRolePermission, deleteRolePermission } from '@/api/role-permission'
import { getPermissions } from '@/api/permission'

export default {
  data() {
    return {
      role: {},
      rolesList: [],
      roleIndex: 0,
      dialogVisible: false,
      dialogType: 'new',
      rolePermissiomDialogVisible: false,
      permissions: [],
      rolePermissions: []
    }
  },
  computed: {

  },
  watch: {
    async rolePermissions(newVal, oldVal) {
      if (this.rolePermissiomDialogVisible === false) { return }
      if (newVal.length > oldVal.length) {
        const rolePermissiom = { roleId: this.role.id, permissionId: newVal[newVal.length - 1] }
        const res = await addRolePermission(rolePermissiom)
        if (res.code === 20000) {
          this.$message({
            message: '添加权限成功',
            type: 'success'
          })
        }
      } else if (newVal.length < oldVal.length) {
        const [a] = oldVal.concat(newVal).filter(function(v, i, arr) {
          return arr.indexOf(v) === arr.lastIndexOf(v)
        })
        const res = await deleteRolePermission(this.role.id, a)
        if (res.code === 20000) {
          this.$message({
            message: '删除权限成功',
            type: 'success'
          })
        }
      }
    }
  },
  created() {
    this.getRoles()
    this.getPermissions()
  },
  methods: {
    async getRoles() {
      const res = await getRoles()
      this.rolesList = res.data
    },
    async getPermissions() {
      const res = await getPermissions()
      this.permissions = res.data
    },
    handleAddRole() {
      this.dialogType = 'new'
      this.dialogVisible = true
    },
    handleEdit(scope) {
      this.dialogType = 'edit'
      this.dialogVisible = true
      this.roleIndex = scope.$index
      this.role = deepClone(scope.row)
    },
    handleDelete({ $index, row }) {
      this.$confirm('确认删除此角色?', '警告', {
        confirmButtonText: '确认',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(async() => {
        const res = await deleteRole(row.id)
        if (res.code === 20000) {
          this.rolesList.splice($index, 1)
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

    async confirmRole() {
      const isEdit = this.dialogType === 'edit'
      if (isEdit) {
        const res = await updateRole(this.role.id, this.role)
        if (res.code === 20000) {
          this.$set(this.rolesList, this.roleIndex, this.role)
          this.dialogVisible = false
          this.$notify({
            title: 'Success',
            dangerouslyUseHTMLString: true,
            message: `
            <div>User Key: ${res.flag}</div>
            <div>User Name: ${res.code}</div>
            <div>Description: ${res.message}</div>
          `,
            type: 'success'
          })
        } else {
          this.$notify({
            title: '错误',
            dangerouslyUseHTMLString: true,
            message: `
            <div>User Key: ${res.flag}</div>
            <div>User Name: ${res.code}</div>
            <div>Description: ${res.message}</div>
          `,
            type: 'error'
          })
        }
        this.dialogVisible = false
      } else {
        const res = await addRole(this.role)
        if (res.code === 20000) {
          this.rolesList.unshift(this.role)
          this.$notify({
            title: 'Success',
            dangerouslyUseHTMLString: true,
            message: `
            <div>User Key: ${res.flag}</div>
            <div>User Name: ${res.code}</div>
            <div>Description: ${res.message}</div>
          `,
            type: 'success'
          })
          this.getRoles()
        } else {
          this.$notify({
            title: '错误',
            dangerouslyUseHTMLString: true,
            message: `
            <div>User Key: ${res.flag}</div>
            <div>User Name: ${res.code}</div>
            <div>Description: ${res.message}</div>
          `,
            type: 'error'
          })
        }
        this.dialogVisible = false
      }
    },
    async handleChangeRolePermissioms(scope) {
      this.rolePermissions = []
      this.role = scope.row
      const RolePermissionsRes = await getRolePermissions(scope.row.id)
      RolePermissionsRes.data.forEach(item => {
        this.rolePermissions.push(item.id)
      })
      this.rolePermissiomDialogVisible = true
    },
    confirmRolePermissioms() {
      this.rolePermissiomDialogVisible = false
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
