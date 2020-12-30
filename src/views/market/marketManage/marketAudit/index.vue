<template>
  <div class="content">
    <div class="header">
      <div class="header-name">
        <span class="parentItemNo">销售订单号</span>
        <el-input
          v-model="fbillNo"
          class="input-content"
          placeholder="请输入销售订单号"
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
      >
        <el-table-column prop="fcreateDate" label="销售订单时间" align="center" min-width="150px"/>
        <el-table-column prop="fbillType" label="订单类型" align="center"/>
        <el-table-column prop="fbillNo" label="销售订单号" align="center"/>
        <el-table-column prop="fprimaryGroup" label="客户分组" align="center"/>
        <el-table-column prop="customer" label="客户" align="center"/>
        <el-table-column prop="fqty" label="订单产品数量" align="center"/>
        <el-table-column prop="fsettleCurr" label="结算货币" align="center"/>
        <el-table-column prop="fsaleDept" label="销售部门" align="center"/>
        <el-table-column prop="fsaler" label="销售员" align="center"/>
        <el-table-column label="状态流程" min-width="150px" align="center">
          <template slot-scope="clo">
            <el-steps :active="clo.row.fstatus" align-center class="font-style" finish-status="success" process-status="finish">
              <el-step title="销售员" />
              <el-step title="销售主管" />
            </el-steps>
          </template>
        </el-table-column>
        <el-table-column label="关闭状态" align="center">
          <template slot-scope="clo">
            <el-tag v-if="clo.row.fcloseStatus==='A'">正常</el-tag>
            <el-tag v-else>已关闭</el-tag>
          </template>
        </el-table-column>
        <el-table-column label="操作" min-width="80px" fixed="right" align="center">
          <template slot-scope="clo">
            <el-button type="primary" size="mini" @click="detailPurchase(clo.row.fid)">详情</el-button>
          </template>
        </el-table-column>

      </jc-table>

    </div>
    <!--    分页器-->
    <div class="footer">
      <jc-pagination
        v-show="total > 0"
        :total="total"
        :page.sync="currentPage"
        :limit.sync="size"
        @pagination="handleGetUntreated"
      />
    </div>
  </div>
</template>

<script>
import jcTable from '@/components/Table'
import jcPagination from '@/components/Pagination'
import {
  queryReviewSalorderList
} from '@/api/marketManage/marketOrder'

export default {
  name: 'MarketAudit',
  inject: ['reload'],
  components: {
    jcTable,
    jcPagination
  },
  data() {
    return {
      fbillNo: '', // 销售订单号
      total: 0, // 总条目
      currentPage: 1, // 当前页
      size: 10, // 每页显示多少条数据
      tableHeader: [],
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
      const DATA = { pageNum: this.currentPage, pageSize: this.size, fbillNo: this.fbillNo }
      const { data: RES } = await queryReviewSalorderList(DATA)
      this.tableData = RES.array
      this.total = RES.total
    },
    // 搜索
    handleQueryUntreated() {
      this.pageNum = 1
      this.handleGetUntreated()
    },
    // 详情
    detailPurchase(id) {
      this.$router.push({ path: `/marketParticulars/${id}` })
    }
  }
}
</script>
<style lang="scss" scoped>
.content {
  @include listBom;
}
</style>
