<template>
  <div class="content">
    <jc-title />
    <div class="header">
      <div class="header-name">
        <span class="parentItemNo">客户名称</span>
        <el-input
          v-model="fname"
          class="input-content"
          placeholder="请输入客户名称"
          size="mini"
          @keyup.enter.native="handleQueryUntreated"
        />
        <el-button type="primary" class="btn" size="mini" @click="handleQueryUntreated">搜索</el-button>
      </div>
    </div>
    <div class="table-content">
      <jc-table
        :table-data="tableData"
        :table-header="tableHeader"
        :cell-style="cellStyle"
      >
        <template v-slot:btnSlot="clo">
          <el-button type="danger" size="mini" @click="detailCustomer(clo.scope.row.fcustId)">查询客户</el-button>
        </template>
      </jc-table>
    </div>
    <!--    分页器-->
    <div class="footer">
      <jc-pagination
        v-show="total > 0"
        :total="total"
        :page.sync="pageNum"
        :limit.sync="size"
        @pagination="handleGetUntreated"
      />
    </div>
  </div>
</template>

<script>
import jcTable from '@/components/Table'
import jcPagination from '@/components/Pagination'
import jcTitle from '@/components/Title'
import { queryCustomerList } from '@/api/marketManage/customer'

export default {
  name: 'CustomerList',
  components: {
    jcTable,
    jcPagination,
    jcTitle
  },
  data() {
    return {
      fname: '', // 产品描述
      total: 0, // 总条目
      pageNum: 1, // 当前页
      cellStyle: { padding: '10 10' }, // 行高
      size: 10, // 每页显示多少条数据
      tableHeader: [
        { label: '组织名称', prop: 'fuseorg', align: 'center' },
        { label: '客户编码', prop: 'fnumber', align: 'center' },
        { label: '客户名称', prop: 'fname', align: 'center' },
        { label: '客户分组', prop: 'fcustGroup', align: 'center', minWidth: '200px' },
        { label: '操作', type: 'btn', fixed: 'right', minWidth: '200px', align: 'center' }
      ],
      // 表格数据
      tableData: []
    }
  },
  mounted() {
    this.handleGetUntreated()
  },
  methods: {
    // 获取列表数据
    async handleGetUntreated() {
      const DATA = { pageNum: this.pageNum, pageSize: this.size, fname: this.fname }
      const { data: RES } = await queryCustomerList(DATA)
      this.tableData = RES.array
      this.total = RES.total
    },
    // 搜索
    handleQueryUntreated() {
      this.pageNum = 1
      this.handleGetUntreated()
    },
    detailCustomer(fcustId) {
      this.$router.push({ path: `/detailCustomer/${fcustId}` })
    }
  }
}
</script>
<style lang="scss" scoped>
.content {
  @include listBom;
}
</style>
