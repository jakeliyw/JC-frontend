<template>
  <div class="content">
    <div class="header">
      <div class="header-name">
        <span class="parentItemNo">角色名称</span>
        <el-input
          v-model="NAME"
          class="input-content"
          placeholder="请输入角色"
          @keyup.enter.native="getRoleList"
        />
        <el-button size="medium" type="primary" class="btn" @click="getRoleList">搜索</el-button>
      </div>
    </div>
    <div class="table-content">
      <jc-table
        :table-data="tableData"
        :table-header="tableHeader"
        :cell-style="cellStyle"
      />
    </div>
    <div class="footer">
      <jc-pagination
        v-show="total > 0"
        :total="total"
        :page.sync="currentPage"
        :limit.sync="size"
        @pagination="handleQueryRoleList"
      />
    </div>
  </div>
</template>

<script>
import jcTable from '@/components/Table'
import jcPagination from '@/components/Pagination'
import { queryTJxRoleList } from '@/api/userAdmin/roleList'
import { userDisable } from '@/components/ToMxamineState'
export default {
  name: 'Index',
  components: {
    jcTable,
    jcPagination
  },
  data() {
    return {
      NAME: '',
      total: 0, // 总条目
      currentPage: 1, // 当前页
      size: 10, // 每页显示多少条数据
      tableData: [], // 列表数据
      // 表头数据
      tableHeader: [
        { label: '角色名称', prop: 'NAME', align: 'center' },
        { label: '角色备注', prop: 'DEPICT', align: 'center' },
        { label: '禁用状态', prop: 'ISDISABLE', align: 'center' },
        { label: '创建时间', prop: 'CREATEDATE', align: 'center' }
      ],
      // 行高
      cellStyle: { padding: '10 10' }
    }
  },
  mounted() {
    this.getRoleList()
  },
  methods: {
    disableUser() {
      console.log('禁用成功')
    },
    handleQueryRoleList() {
      this.pageNum = 1
      this.getRoleList()
    },
    async getRoleList() {
      const DATA = { pageNum: this.currentPage, pageSize: this.size, NAME: this.NAME }
      const { data: res, total } = await queryTJxRoleList(DATA)
      this.tableData = res.map(item => {
        return userDisable(item)
      })
      this.total = total
    }
  }
}
</script>

<style scoped lang="scss">
.content {
  @include listBom;
}
</style>
