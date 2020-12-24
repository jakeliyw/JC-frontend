<template>
  <div class="content">
    <div class="header">
      <div class="header-name">
        <span class="parentItemNo">调价名称</span>
        <el-input
          v-model="fname"
          class="input-content"
          placeholder="请输入调价名称"
          @keyup.enter.native="handleQueryUnderReview"
        />
        <el-button type="primary" class="btn" size="medium" @click="handleQueryUnderReview">搜索</el-button>
      </div>
    </div>
    <div class="table-content">
      <jc-table
        :table-data="tableData"
        :table-header="tableHeader"
        serial
      >
        <template v-slot:btnState="clo">
          <el-steps :active="clo.scope.row.fstatus" align-center class="font-style" finish-status="success" process-status="finish">
            <el-step title="研发审核"/>
            <el-step title="财务审核"/>
          </el-steps>
        </template>
        <template v-slot:btnSlot="clo">
          <el-button  type="primary" size="mini" @click="detailPurchase(clo.scope.row.fid)">详情调价</el-button>
        </template>
      </jc-table>
    </div>
    <!--    分页器-->
    <div class="footer">
      <jc-pagination
        v-show="total > 0"
        :total="total"
        :page.sync="currentPage"
        :limit.sync="size"
        @pagination="handleGetData"
      />
    </div>
  </div>
</template>

<script>
import jcTable from '@/components/Table'
import jcPagination from '@/components/Pagination'
import { queryReviewPurPatList } from '@/api/modifyPriceManagement/underReviewModifyPrice'

export default {
  name: 'UnderReviewModifyPrice',
  components: {
    jcTable,
    jcPagination
  },
  data() {
    return {
      fname: '', // 产品描述
      total: 0, // 总条目
      currentPage: 0, // 当前页
      size: 10, // 每页显示多少条数据
      // 表头
      tableHeader: [
        { label: '调价编码', prop: 'fbillno', align: 'center' },
        { label: '调价名称', prop: 'fname', align: 'center' },
        { label: '调价日期', prop: 'fdate', align: 'center' },
        { label: '描述', prop: 'fdescripTion', align: 'center' },
        { label: '采购组织', prop: 'fpurchaseOrg', width: '200px', align: 'center' },
        { label: '状态流程', type: 'state', prop: 'ftatus', align: 'center', width: '300px' },
        { label: '操作', type: 'btn', fixed: 'right', minWidth: '100px', align: 'center' }
      ],
      // 表格数据
      tableData: []
    }
  },
  mounted() {
    this.handleGetData()
  },
  methods: {
    // 获取列表数据
    async handleGetData() {
      const DATA = { pageNum: this.currentPage, pageSize: this.size, fname: this.fname }
      const { data: RES } = await queryReviewPurPatList(DATA)
      this.tableData = RES.array
      this.total = RES.total
    },
    // 搜索
    handleQueryUnderReview() {
      this.pageNum = 1
      this.handleGetData()
    },
    // 详情价目
    detailPurchase(fid) {
      this.$router.push({ path: `/detailModifyPrice/${fid}` })
    }
  }
}
</script>
<style lang="scss" scoped>
.content {
  @include listBom;
}
</style>
