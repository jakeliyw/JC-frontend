<template>
  <div class="content">
    <div class="header">
      <div class="header-name">
        <span class="parentItemNo">用户名称</span>
        <el-input
          v-model="FNAME"
          class="input-content"
          placeholder="请输入用户"
          size="mini"
          @keyup.enter.native="getUserList"
        />
        <el-button size="mini" type="primary" class="btn" @click="getUserList">搜索</el-button>
      </div>
    </div>
    <div class="table-content">
      <jc-table
        :table-data="tableData"
        :table-header="tableHeader"
        :cell-style="cellStyle"
      >
        <template v-slot:btnSlot="clo">
          <el-switch
            v-if="hasPerm('user:disable')"
            v-model="clo.scope.row.FFORBIDSTATUS"
            active-text="启用用户"
            inactive-text="禁用用户"
            @change="disableUser(clo.scope.row)"
          />
        </template>
      </jc-table>
    </div>
    <div class="footer">
      <jc-pagination
        v-show="total > 0"
        :total="total"
        :page.sync="currentPage"
        :limit.sync="size"
        @pagination="handleQueryUserList"
      />
    </div>
  </div>
</template>

<script>
import jcTable from '@/components/Table'
import jcPagination from '@/components/Pagination'
import { queryTEngBomList, updateUserDisable } from '@/api/userAdmin/userList'
import { userDisable } from '@/components/ToMxamineState'

export default {
  name: 'Index',
  components: {
    jcTable,
    jcPagination
  },
  data() {
    return {
      FNAME: '',
      total: 0, // 总条目
      currentPage: 1, // 当前页
      size: 10, // 每页显示多少条数据
      tableData: [], // 列表数据
      userDisable: true,
      // 表头数据
      tableHeader: [
        { label: '用户名称', prop: 'FNAME', align: 'center' },
        { label: '部门分组', prop: 'FPRIMARYGROUP', align: 'center' },
        { label: '手机号码', prop: 'FPHONE', align: 'center' },
        { label: '创建时间', prop: 'FCREATEDATE', align: 'center' },
        { label: '操作', type: 'btn', fixed: 'right', minWidth: '100px', align: 'center' }
      ],
      // 行高
      cellStyle: { padding: '10 10' }
    }
  },
  mounted() {
    this.getUserList()
  },
  methods: {
    async disableUser(row) {
      const DATA = { FFORBIDSTATUS: row.FFORBIDSTATUS, FUSERID: row.FUSERID }
      const { code, message } = await updateUserDisable(DATA)
      if (code !== 0) {
        return
      }
      this.$message.success(message)
    },
    handleQueryUserList() {
      this.pageNum = 1
      this.getUserList()
    },
    async getUserList() {
      const DATA = { pageNum: this.currentPage, pageSize: this.size, FNAME: this.FNAME }
      const { data: res, total } = await queryTEngBomList(DATA)
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
