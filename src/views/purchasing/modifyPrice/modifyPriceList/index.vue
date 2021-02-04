<template>
  <div class="content">
    <jc-title />
    <div class="header">
      <div class="header-name">
        <search :options="selectData" :msg="fbillNo" @seek="collect" @hand="handleQueryUntreated" />
        <el-button type="primary" class="btn" size="mini" @click="handleQueryUntreated">搜索</el-button>
        <el-button type="primary" size="mini" @click="addPurchase">新增调价</el-button>
      </div>
    </div>
    <div class="table-content">
      <jc-table
        :table-data="tableData"
        :table-header="tableHeader"
        :cell-style="cellStyle"
      >
        <template v-slot:btnSlot="clo">
          <el-button v-show="false" type="warning" size="mini" @click="editPurchase(clo.scope.row.fid)">修改价目</el-button>
          <el-button v-show="false" type="danger" size="mini" @click="deletePurchase(clo.scope.row.fid)">删除价目</el-button>
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
import { queryTPurPatList } from '@/api/modifyPriceManagement/modifyPriceList'
import search from '@/components/Search/index'
import searData from '@/components/Search/mixin'
export default {
  name: 'ModifyPriceList',
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
      ftype: 5,
      fbillNo: 'fname',
      total: 0, // 总条目
      getPriceList: {
        pageNum: 1, // 当前页
        pageSize: 10 // 每页显示多少条数据
      },
      cellStyle: { padding: '10 10' }, // 行高
      tableHeader: [
        { label: '单据编号', prop: 'fbillno', align: 'center' },
        { label: '调价名称', prop: 'fname', align: 'center' },
        { label: '调价原因', prop: 'fdataValue', align: 'center' },
        { label: '调价日期', prop: 'fdate', align: 'center' },
        { label: '描述', prop: 'fdescripTion', align: 'center', minWidth: '200px' },
        { label: '状态流程', type: 'state', prop: 'ftatus', align: 'center', minWidth: '150px' },
        { label: '生效时间', prop: 'fcreateDate', align: 'center' },
        { label: '操作', type: 'btn', minWidth: '120px', align: 'center' }
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
    jumpMateriel(fnumber) {
      this.$router.push({ path: `/detailMateriel/${fnumber}` })
    },
    // 获取列表数据
    async handleGetPurchaseList() {
      const { data: RES } = await queryTPurPatList({ ...this.getPriceList, ...this.searCollData })
      this.tableData = RES.array
      this.total = RES.total
    },
    // 新增调价
    addPurchase() {
      this.$router.push({ name: 'CreateModifyPrice' })
    },
    // 搜索
    handleQueryUntreated() {
      this.pageNum = 1
      this.handleGetPurchaseList()
    },
    // 详情调价
    detailPurchase(fid) {
      this.$router.push({ path: `/detailModifyPrice/${fid}` })
    },
    // 修改调价
    editPurchase(fid) {
      this.$router.push({ path: `/editModifyPrice/${fid}` })
    },
    // 删除调价
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
    }
    .btn{
      transform: translateY(18%);
      margin-left: 410px!important;
      z-index: 999;
    }
  }
}
</style>
