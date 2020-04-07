<template>
  <div class="dashboard-editor-container">
    <div class=" clearfix">
      <pan-thumb image="https://wpimg.wallstcn.com/f778738c-e4f8-4870-b634-56703b4acafe.gif" style="float: left">
        Your roles:
        <span v-for="item in roles" :key="item" class="pan-info-roles">{{ item }}</span>
      </pan-thumb>
      <github-corner style="position: absolute; top: 0px; border: 0; right: 0;" />
      <div class="info-container">
        <span class="display_name">{{ userInfo.user.username }}</span>
        <br>
        <span style="font-size:20px;display:inline-block;">角色: </span>
        <el-tag v-for=" item in roles " :key="item" style="font-size:20px;">{{ item }}</el-tag>
        <br>
        <span style="font-size:20px;padding-top:-220px;display:inline-block;">权限: </span>
        <el-tag v-for="item in userInfo.authorities" :key="item" type="success" style="font-size:20px;">{{ item }}</el-tag>
      </div>
    </div>
    <div>
      <img :src="emptyGif" class="emptyGif">
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import PanThumb from '@/components/PanThumb'
import GithubCorner from '@/components/GithubCorner'
import { getUserInfo } from '@/utils/auth'

export default {
  name: 'DashboardEditor',
  components: { PanThumb, GithubCorner },
  data() {
    return {
      emptyGif: 'https://wpimg.wallstcn.com/0e03b7da-db9e-4819-ba10-9016ddfdaed3',
      userInfo: { }
    }
  },
  computed: {
    ...mapGetters([
      'name',
      'avatar',
      'roles'
    ])
  },
  created() {
    this.getUserInfo()
  },
  methods: {
    getUserInfo() {
      this.userInfo = getUserInfo()
    }
  }
}
</script>

<style lang="scss" scoped>
  .emptyGif {
    display: block;
    width: 45%;
    margin: 0 auto;
  }

  .dashboard-editor-container {
    position: relative;
    background-color: #e3e3e3;
    min-height: 100vh;
    padding: 50px 60px 0px;
    .pan-info-roles {
      font-size: 12px;
      font-weight: 700;
      color: #333;
      display: block;
    }
    .info-container {
      position: relative;
      margin-left: 190px;
      height: 150px;
      line-height: 50px;
      .display_name {
        font-size: 48px;
        line-height: 48px;
        color: #212121;
        top: 25px;
      }
      .el-tag{
        margin: 0 10px;
      }
    }
  }
</style>
