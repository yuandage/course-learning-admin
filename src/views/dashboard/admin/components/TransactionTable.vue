<template>
  <el-table :data="list" style="width: 100%;padding-top: 15px;">
    <el-table-column label="序号" width="180" align="center">
      <template slot-scope="scope">
        {{ scope.row.order_no | orderNoFilter }}
      </template>
    </el-table-column>
    <el-table-column label="价格" width="195" align="center">
      <template slot-scope="scope">
        ¥{{ scope.row.price | toThousandFilter }}
      </template>
    </el-table-column>
    <el-table-column label="状态" width="100" align="center">
      <template slot-scope="{row}">
        <el-tag :type="row.status | statusFilter">
          {{ row.status }}
        </el-tag>
      </template>
    </el-table-column>
  </el-table>
</template>

<script>

export default {
  filters: {
    statusFilter(status) {
      const statusMap = {
        success: 'success',
        pending: 'danger'
      }
      return statusMap[status]
    },
    orderNoFilter(str) {
      return str.substring(0, 30)
    }
  },
  data() {
    return {
      list: null
    }
  },
  created() {
    this.fetchData()
  },
  methods: {
    fetchData() {
      this.list = [
        { 'order_no': '1',
          'timestamp': 838799467628,
          'username': 'Richard Miller',
          'price': 14027.38,
          'status': 'pending' },
        { 'order_no': '2',
          'timestamp': 838799467628,
          'username': 'Joseph Davis',
          'price': 11726.6, 'status':
        'success' },
        { 'order_no': '3',
          'timestamp': 838799467628,
          'username': 'Sharon Moore',
          'price': 6764.7,
          'status': 'pending' },
        { 'order_no': '4',
          'timestamp': 838799467628,
          'username': 'Jeffrey Hernandez',
          'price': 3546, 'status': 'success' },
        { 'order_no': '5',
          'timestamp': 838799467628,
          'username': 'Brian Young',
          'price': 3390.3,
          'status': 'success' },
        { 'order_no': '6', 'timestamp': 838799467628, 'username': 'Shirley Taylor', 'price': 6122.4, 'status': 'pending' },
        { 'order_no': '7', 'timestamp': 838799467628, 'username': 'Cynthia Jones', 'price': 10450.35, 'status': 'success' },
        { 'order_no': '8', 'timestamp': 838799467628, 'username': 'Donald Hall', 'price': 11907.2, 'status': 'pending' }]
    }
  }
}
</script>
