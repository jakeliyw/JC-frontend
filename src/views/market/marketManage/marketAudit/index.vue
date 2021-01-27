<template>
  <div class="content">
    <jc-title />
    <div class="header">
      <div class="header-name">
        <search :options="selectData" :msg="fbillNo" @seek="collect" @hand="handleQueryUntreated" />
        <el-button type="primary" class="btn" size="mini" @click="handleQueryUntreated">搜索</el-button>
      </div>
    </div>
    <div class="table-content">
      <jc-table
        :table-data="tableData"
        :table-header="tableHeader"
      >
        <el-table-column prop="fcreateDate" label="订单时间" align="center" min-width="155px" />
        <el-table-column prop="fbillType" label="单据类型" align="center" min-width="110px" />
        <el-table-column prop="fbillNo" label="订单号" align="center" min-width="110px" :show-overflow-tooltip="true">
          <template slot-scope="scope">
            <el-link type="primary" @click="detailPurchase(scope.row.fid)">{{ scope.row.fbillNo }}</el-link>
          </template>
        </el-table-column>
        <el-table-column prop="fprimaryGroup" label="客户分组" align="center" />
        <el-table-column prop="customer" label="客户" align="center" min-width="100px" :show-overflow-tooltip="true" />
        <el-table-column prop="fqty" label="产品数量" align="center" />
        <el-table-column prop="fsettleCurr" label="结算货币" align="center" />
        <el-table-column prop="fsaleDept" label="销售部门" align="center" />
        <el-table-column prop="fsaler" label="销售员" align="center" />
        <el-table-column label="状态流程" min-width="180px" align="center">
          <template slot-scope="clo">
            <el-steps :active="clo.row.fstatus" align-center class="font-style" finish-status="success" process-status="finish">
              <el-step title="销售员" />
              <el-step title="销售主管" />
            </el-steps>
          </template>
        </el-table-column>
        <el-table-column label="禁用状态" align="center">
          <template slot-scope="clo">
            <el-tag v-if="clo.row.fcloseStatus==='A'">否</el-tag>
            <el-tag v-else type="danger">是</el-tag>
          </template>
        </el-table-column>
        <el-table-column label="审核状态" align="center" min-width="100px">
          <template slot-scope="clo">
            <el-tag v-if="clo.row.fdocumentStatus !== '重新审核'">{{ clo.row.fdocumentStatus }}</el-tag>
            <el-tag v-else type="danger">{{ clo.row.fdocumentStatus }}</el-tag>
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
import jcTitle from '@/components/Title'
import {
  queryReviewSalorderList
} from '@/api/marketManage/marketOrder'
import searData from '@/components/Search/mixin'
import search from '@/components/Search'
import { toMxAmina } from '@/components/ToMxamineState'

export default {
  name: 'MarketAudit',
  inject: ['reload'],
  components: {
    jcTable,
    jcPagination,
    jcTitle,
    search
  },
  mixins: [searData],
  data() {
    return {
      ftype: 6,
      fbillNo: 'fbillNo', // 销售订单号
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
      const DATA = { pageNum: this.currentPage, pageSize: this.size, ...this.searCollData }
      const { data: RES } = await queryReviewSalorderList(DATA)
      this.tableData = RES.array.map(item => {
        return (toMxAmina(item))
      })
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
  .header{
    position:relative;
    .header-name{
      width: 100%;
    }
    .btn{
      transform: translateY(18%);
      margin-left: 410px!important;
      z-index: 999;
    }
  }
}
</style>
