<template>
  <div class="content">
    <jc-title />
    <div class="header">
      <div class="header-name">
        <search :options="selectData" :msg="fbillNo" @seek="collect" @hand="handleQueryUntreated" />
        <el-button type="primary" class="btn" size="mini" @click="handleQueryUntreated">搜索</el-button>
        <el-button type="primary" size="mini" @click="addPurchase">新增价目</el-button>
      </div>
    </div>
    <div class="table-content">
      <jc-table
        :table-data="tableData"
        :table-header="tableHeader"
        :cell-style="cellStyle"
      >
        <template v-slot:btnState="clo">
          <el-tag v-if="clo.scope.row.fdocumentStatus !== '重新审核'">{{ clo.scope.row.fdocumentStatus }}</el-tag>
          <el-tag v-else type="danger">{{ clo.scope.row.fdocumentStatus }}</el-tag>
        </template>
        <template v-slot:btnSlot="clo">
          <el-button type="danger" size="mini" @click="editPurchase(clo.scope.row.fid)">反审核</el-button>
          <el-button v-show="false" size="mini" type="danger" @click="deletePurchase(clo.scope.row.fid)">删除价目</el-button>
          <el-button type="primary" size="mini" @click="detailPurchase(clo.scope.row.fid)">查询价目</el-button>
        </template>
      </jc-table>

    </div>
    <!--    分页器-->
    <div class="footer">
      <jc-pagination
        v-show="total > 0"
        :total="total"
        :page.sync="getPriceList.pageNum"
        :limit.sync="getPriceList.pageSize"
        @pagination="handleGetPurchaseList"
      />
    </div>
  </div>
</template>

<script>
import jcTable from '@/components/Table/index'
import jcPagination from '@/components/Pagination/index'
import jcTitle from '@/components/Title'
import { queryTPurPriceList, updateNotReview } from '@/api/purchaseManagement/purchasePrice'
import { toMxAmina } from '@/components/ToMxamineState'
import search from '@/components/Search/index'
import searData from '@/components/Search/mixin'
export default {
  name: 'PurchasePriceList',
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
      ftype: 4,
      fbillNo: 'fname',
      total: 0, // 总条目
      getPriceList: {
        pageNum: 1, // 当前页
        pageSize: 10 // 每页显示多少条数据
      },
      cellStyle: { padding: '10, 10' },
      tableHeader: [
        { label: '价目编码', prop: 'fnumbe', minWidth: '100px', align: 'center' },
        { label: '价目表名称', prop: 'fname', align: 'center', minWidth: '150px' },
        { label: '供应商名称', prop: 'fsupplier', align: 'center', minWidth: '200px' },
        { label: '物料编码', prop: 'fnumber', minWidth: '120px', align: 'center' },
        { label: '物料型号', prop: 'fmodel', minWidth: '50px', align: 'center' },
        { label: '物料描述', prop: 'fdescripTion', minWidth: '250px', align: 'center' },
        { label: '物料规格', prop: 'fspecificaTion', minWidth: '100px', align: 'center' },
        { label: '是否含税', prop: 'fisIncludedTax', align: 'center', minWidth: '50px' },
        { label: '币别', prop: 'fcurrency', align: 'center' },
        { label: '创建时间', prop: 'fcreateDate', align: 'center' },
        { label: '审核状态', type: 'state', prop: 'fdocumentStatus', align: 'center' },
        { label: '操作', type: 'btn', minWidth: '200px', align: 'center' }
      ],
      // 表格数据
      tableData: []
    }
  },
  mounted() {
    this.handleGetPurchaseList()
  },
  methods: {
    // 进入物料主数据
    jumpMateriel(FNUMBER) {
      this.$router.push({ path: `/detailMateriel/${FNUMBER}` })
    },
    // 获取列表数据
    async handleGetPurchaseList() {
      const { data: RES } = await queryTPurPriceList({ ...this.getPriceList, ...this.searCollData })
      this.tableData = RES.array.map(item => {
        return toMxAmina(item)
      })
      this.total = RES.total
    },
    // 新增采购
    addPurchase() {
      this.$router.push({ name: 'CreatePurchasePrice' })
    },
    // 搜索
    handleQueryUntreated() {
      this.pageNum = 1
      this.handleGetPurchaseList()
    },
    // 详情采购
    detailPurchase(fid) {
      this.$router.push({ path: `/detailPurchasePrice/${fid}` })
    },
    // 反审核
    async editPurchase(fid) {
      const { message, code } = await updateNotReview({ fid })
      if (code !== 0) {
        this.$message.warning(message)
        return
      }
      this.$message.success(message)
      this.$router.push({ name: 'RefusePriceList' })
      this.reload()
    },
    // 删除采购
    deletePurchase(fid) {
      console.log(fid)
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
       display: flex;
       align-items: center;
     }
    .btn{
      transform: translateY(18%);
      margin-left: 410px!important;
    }
  }
}
</style>
