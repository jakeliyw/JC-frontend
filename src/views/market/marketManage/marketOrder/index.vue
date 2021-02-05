<template>
  <div class="content">
    <jc-title />
    <div class="header">
      <div class="header-name">
        <search :options="selectData" :msg="fbillNo" @seek="collect" @hand="handleQuerySonClass()" />
        <el-button type="primary" class="btn" size="mini" @click="handleQuerySonClass()">搜索</el-button>
      </div>
    </div>
    <div class="table-content">
      <jc-table
        :table-data="tableData"
        :table-header="tableHeader"
        :cell-style="cellStyle"
        serial
      >
        <template v-slot:billSlot="clo">
          <el-link type="primary" @click="detailPurchase(clo.scope.row.fid)">{{ clo.scope.row.fbillNo }}</el-link>
        </template>
        <template v-slot:tagSlot="clo">
          <el-tag v-if="clo.scope.row.fcloseStatus==='A'">否</el-tag>
          <el-tag v-else type="danger">是</el-tag>
        </template>
        <template v-slot:btnState="clo">
          <el-tag v-if="clo.scope.row.fdocumentStatus !== '重新审核'">{{ clo.scope.row.fdocumentStatus }}</el-tag>
          <el-tag v-else type="danger">{{ clo.scope.row.fdocumentStatus }}</el-tag>
        </template>
        <template v-slot:btnSlot="clo">
          <el-button type="primary" size="mini" @click="detailPurchase(clo.scope.row.fid)">详情</el-button>
          <el-button type="danger" size="mini" @click="approvalRejection(clo.scope.row.fid)">反审核</el-button>
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
  notReviewSalorder,
  queryTSalOrderList
} from '@/api/marketManage/marketOrder'
import search from '@/components/Search'
import searData from '@/components/Search/mixin'
import { toMxAmina } from '@/components/ToMxamineState'

export default {
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
      // 表头
      cellStyle: { padding: '10 10' }, // 行高
      tableData: [], // 销售数据
      tableHeader: [
        { label: '订单时间', prop: 'fcreateDate', align: 'center', minWidth: '155px' },
        { label: '单据类型', prop: 'fbillType', align: 'center', minWidth: '110px' },
        { label: '销售订单号', type: 'bill', align: 'center', minWidth: '110px' },
        { label: '客户订单号', prop: 'fpaezText', align: 'center', minWidth: '110px' },
        { label: '客户分组', prop: 'fprimaryGroup', align: 'center', minWidth: '100px' },
        { label: '客户', prop: 'customer', align: 'center' },
        { label: '产品数量', prop: 'fqty', align: 'center', minWidth: '100px' },
        { label: '结算货币', prop: 'fsettleCurr', align: 'center', minWidth: '100px' },
        { label: '销售部门', prop: 'fsaleDept', align: 'center', minWidth: '100px' },
        { label: '销售员', prop: 'fsaler', align: 'center', minWidth: '90px' },
        { label: '禁用状态', type: 'tag', align: 'center', minWidth: '100px' },
        { label: '审核状态', type: 'state', align: 'center', minWidth: '100px' },
        { label: '操作', type: 'btn', align: 'center', minWidth: '160px' }
      ]
    }
  },
  mounted() {
    this.handleGetUntreated()
  },
  methods: {
    // 获取订单列表数据
    async handleGetUntreated() {
      const DATA = { pageNum: this.currentPage, pageSize: this.size, ...this.searCollData }
      const { data: RES, data: total } = await queryTSalOrderList(DATA)
      this.tableData = RES.array.map(item => {
        return (toMxAmina(item))
      })
      this.total = total.total
    },
    // 搜索
    handleQuerySonClass() {
      this.pageNum = 1
      this.handleGetUntreated()
    },
    // 订单详情
    detailPurchase(id) {
      this.$router.push({ path: `/marketParticulars/${id}` })
    },
    // 反审核
    async approvalRejection(fid) {
      const DATA = {
        fid: fid,
        fuserId: window.sessionStorage.getItem('fuserId')
      }
      const { message, code } = await notReviewSalorder(DATA)
      if (code === 0) {
        this.handleGetUntreated()
        this.$message.success(message)
        this.$router.push({ name: 'MarketNoPass' })
      }
    }
  }
}
</script>
<style lang="scss" scoped>
.content {
  @include listBom;

  .header {
    position: relative;

    .header-name {
      width: 100%;
    }

    .btn {
      transform: translateY(18%);
      margin-left: 410px !important;
      z-index: 999;
    }
  }
}

.inTheBtn {
  transform: translateY(-15px);
}

.tag-mar {
  margin-right: 3px;
  margin-bottom: 3px;
}

.tag-mar:hover {
  cursor: pointer;
}

.el-tag + .el-tag {
  margin-left: 10px;
}

.button-new-tag {
  margin-left: 10px;
  height: 32px;
  line-height: 30px;
  padding-top: 0;
  padding-bottom: 0;
}

.input-new-tag {
  width: 90px;
  margin-left: 10px;
  vertical-align: bottom;
}
</style>
