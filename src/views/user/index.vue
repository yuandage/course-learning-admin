<template>
  <div class="app-container">
    <el-button type="primary" @click="handleAddUser">新增用户</el-button>

    <el-table :data="userList" style="width: 100%;margin-top:30px;" border>
      <el-table-column align="center" label="id" width="220">
        <template slot-scope="scope">
          {{ scope.row.id }}
        </template>
      </el-table-column>
      <el-table-column align="center" label="用户名称" width="220">
        <template slot-scope="scope">
          {{ scope.row.username }}
        </template>
      </el-table-column>
      <el-table-column align="header-center" label="用户昵称">
        <template slot-scope="scope">
          {{ scope.row.nickname }}
        </template>
      </el-table-column>
      <el-table-column align="header-center" label="联系方式">
        <template slot-scope="scope">
          {{ scope.row.mobile }}
        </template>
      </el-table-column>
      <el-table-column align="center" label="操作">
        <template slot-scope="scope">
          <el-button type="primary" size="small" @click="handleEdit(scope)">编辑</el-button>
          <el-button type="danger" size="small" @click="handleDelete(scope)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>

    <el-dialog :visible.sync="dialogVisible" :title="dialogType==='edit'?'编辑用户':'新增用户'">
      <el-form :model="user" label-width="80px" label-position="left">
        <el-form-item label="username">
          <el-input v-model="user.username" placeholder="用户名称" />
        </el-form-item>
        <el-form-item label="nickname">
          <el-input v-model="user.nickname" placeholder="用户昵称" />
        </el-form-item>
        <el-form-item label="mobile">
          <el-input v-model="user.mobile" placeholder="联系方式" />
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
  </div>
</template>

<script>
import { deepClone } from '@/utils'
import { getUsers, addUser, deleteUser, updateUser } from '@/api/user'

export default {
  data() {
    return {
      user: {},
      userList: [],
      userIndex: 0,
      dialogVisible: false,
      dialogType: 'new'
    }
  },
  computed: {

  },
  created() {
    this.getUsers()
  },
  methods: {
    async getUsers() {
      const res = await getUsers()
      this.userList = res.data
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
      })
        .then(async() => {
          await deleteUser(row.id)
          this.userList.splice($index, 1)
          this.$message({
            type: 'success',
            message: '删除成功!'
          })
        })
        .catch(err => { console.error(err) })
    },

    async confirmUser() {
      const isEdit = this.dialogType === 'edit'
      if (isEdit) {
        const res = await updateUser(this.user.id, this.user)
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
        const res = await addUser(this.user)
        this.dialogVisible = false
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
