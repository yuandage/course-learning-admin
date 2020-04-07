<template>
  <div class="app-container">
    <el-button type="primary" @click="handleAddUser">新增用户</el-button>

    <el-table :data="userList" style="width: 100%;margin-top:30px;" border>
      <el-table-column align="center" label="id" width="200">
        <template slot-scope="scope">
          {{ scope.row.id }}
        </template>
      </el-table-column>
      <el-table-column align="center" label="用户名称" width="180">
        <template slot-scope="scope">
          {{ scope.row.username }}
        </template>
      </el-table-column>
      <el-table-column align="center" label="用户昵称" width="180">
        <template slot-scope="scope">
          {{ scope.row.nickname }}
        </template>
      </el-table-column>
      <el-table-column align="center" label="用户手机号" width="180">
        <template slot-scope="scope">
          {{ scope.row.mobile }}
        </template>
      </el-table-column>
      <el-table-column align="center" label="用户邮箱" width="200">
        <template slot-scope="scope">
          {{ scope.row.email }}
        </template>
      </el-table-column>
      <el-table-column align="center" label="操作">
        <template slot-scope="scope">
          <el-button type="primary" size="small" @click="handleEdit(scope)">编辑</el-button>
          <el-button type="warning" size="small" @click="handleDelete(scope)">锁定</el-button>
          <el-button type="success" size="small" @click="handleChangeUserRoles(scope)">修改角色</el-button>
        </template>
      </el-table-column>
    </el-table>

    <el-dialog :visible.sync="dialogVisible" :modal="false" :title="dialogType==='edit'?'编辑用户':'新增用户'">
      <el-form :model="user" label-width="80px" label-position="left">
        <el-form-item label="username">
          <el-input v-model="user.username" placeholder="用户名称" />
        </el-form-item>
        <el-form-item label="nickname">
          <el-input v-model="user.nickname" placeholder="用户昵称" />
        </el-form-item>
        <el-form-item label="mobile">
          <el-input v-model="user.mobile" placeholder="用户手机号" />
        </el-form-item>
        <el-form-item label="email">
          <el-input v-model="user.email" placeholder="用户邮箱" />
        </el-form-item>
        <el-form-item label="Password">
          <el-input v-model="user.password" show-password placeholder="用户密码" />
        </el-form-item>
      </el-form>
      <div style="text-align:right;">
        <el-button type="danger" @click="dialogVisible=false">取消</el-button>
        <el-button type="primary" @click="confirmUser">确认</el-button>
      </div>
    </el-dialog>

    <el-dialog :visible.sync="userRolesDialogVisible" :modal="false" :title="user.username+' 角色:'">
      <el-select v-model="userRoles" multiple placeholder="请选择角色" style="width:500px">
        <el-option
          v-for="item in roles"
          :key="item.id"
          :label="item.name"
          :value="item.id"
        >
        </el-option>
      </el-select>
      <div style="text-align:right;">
        <el-button type="danger" @click="userRolesDialogVisible=false">取消</el-button>
        <el-button type="primary" @click="confirmUserRoles">确认</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { deepClone } from '@/utils'
import { getUsers, addUser, deleteUser, updateUser } from '@/api/user'
import { getUserRoles, addUserRole, deleteUserRole } from '@/api/user-role'
import { getRoles } from '@/api/role'

export default {
  data() {
    return {
      user: {},
      userList: [],
      userIndex: 0,
      dialogVisible: false,
      dialogType: 'new',
      userRolesDialogVisible: false,
      roles: [],
      userRoles: []
    }
  },
  computed: {
  },
  watch: {
    async userRoles(newVal, oldVal) {
      if (this.userRolesDialogVisible === false) { return }
      if (newVal.length > oldVal.length) {
        const userRole = { userId: this.user.id, roleId: newVal[newVal.length - 1] }
        const res = await addUserRole(userRole)
        if (res.code === 20000) {
          this.$message({
            message: '添加角色成功',
            type: 'success'
          })
        }
      } else if (newVal.length < oldVal.length) {
        const [a] = oldVal.concat(newVal).filter(function(v, i, arr) {
          return arr.indexOf(v) === arr.lastIndexOf(v)
        })
        const res = await deleteUserRole(this.user.id, a)
        if (res.code === 20000) {
          this.$message({
            message: '删除角色成功',
            type: 'success'
          })
        }
      }
    }
  },
  created() {
    this.getUsers()
    this.getRoles()
  },
  methods: {
    async getUsers() {
      const res = await getUsers()
      this.userList = res.data
    },
    async getRoles() {
      const res = await getRoles()
      this.roles = res.data
    },
    handleAddUser() {
      this.dialogType = 'new'
      this.dialogVisible = true
    },
    handleEdit(scope) {
      this.dialogType = 'edit'
      this.dialogVisible = true
      this.userIndex = scope.$index
      this.user = deepClone(scope.row)
    },
    handleDelete({ $index, row }) {
      this.$confirm('确认删除此用户?', '警告', {
        confirmButtonText: '确认',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(async() => {
        const res = await deleteUser(row.id)
        if (res.code === 20000) {
          this.userList.splice($index, 1)
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
    async confirmUser() {
      const isEdit = this.dialogType === 'edit'
      if (isEdit) {
        const res = await updateUser(this.user.id, this.user)
        if (res.code === 20000) {
          this.$set(this.userList, this.userIndex, this.user)
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
      } else {
        const res = await addUser(this.user)
        if (res.code === 20000) {
          this.userList.unshift(this.user)
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
          this.getUsers()
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
    async handleChangeUserRoles(scope) {
      this.userRoles = []
      this.user = scope.row
      const userRolesRes = await getUserRoles(scope.row.id)
      userRolesRes.data.forEach(item => {
        this.userRoles.push(item.id)
      })
      this.userRolesDialogVisible = true
    },
    confirmUserRoles() {
      this.userRolesDialogVisible = false
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
