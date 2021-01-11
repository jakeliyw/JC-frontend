<template>
  <div class="content">
    <jc-title/>
    <div class="header">
      <div class="header-name">
        <span class="parentItemNo">物料编码</span>
        <el-input
          v-model="getPriceList.fnumber"
          class="input-content"
          placeholder="请输入物料编号"
          size="mini"
          @keyup.enter.native="handleQueryUntreated"
        />
        <span class="parentItemNo">供应商名称</span>
        <el-input
          v-model="getPriceList.fsupplier"
          class="input-content"
          placeholder="请输入供应商名称"
          size="mini"
          @keyup.enter.native="handleQueryUntreated"
        />
        <el-button type="primary" class="btn" size="mini" @click="handleQueryUntreated">搜索</el-button>
        <el-button type="primary" class="btn" size="mini" @click="addPurchase">新增价目</el-button>
      </div>
    </div>
    <div class="table-content">
      <jc-table
        :table-data="tableData"
        :table-header="tableHeader"
        :cell-style="cellStyle"
      >
        <el-table-column label="价目名称" prop="price" align="center" show-overflow-tooltip />
        <el-table-column label="供应商名称" prop="fsupplier" align="center" show-overflow-tooltip min-width="150px" />
        <el-table-column
          label="物料编码"
          align="center"
          show-overflow-tooltip
        >
          <template slot-scope="scope">
            <span class="jumpMateriel" @click="jumpMateriel(scope.row.fnumber)">{{ scope.row.fnumber }}</span>
          </template>
        </el-table-column>
        <template v-slot:btnSlot="clo">
          <el-button type="warning" size="mini" @click="editPurchase(clo.scope.row.fid)">修改价目</el-button>
          <el-button v-show="false" size="mini" type="danger" @click="deletePurchase(clo.scope.row.fid)">删除价目</el-button>
          <el-button type="primary" size="mini" @click="detailPurchase(clo.scope.row.fid)">详情价目</el-button>
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
import { queryTPurPriceList } from '@/api/purchaseManagement/purchasePrice'

export default {
  name: 'PurchasePriceList',
  inject: ['reload'],
  components: {
    jcTable,
    jcPagination,
    jcTitle
  },
  data() {
    return {
      total: 0, // 总条目
      getPriceList: {
        pageNum: 1, // 当前页
        pageSize: 10, // 每页显示多少条数据
        fnumber: '', // 物料编码
        fsupplier: '' // 供应商名称
      },
      cellStyle: { padding: '10, 10' },
      tableHeader: [
        { label: '物料描述', prop: 'fdescripTion', minWidth: '400px', align: 'center' },
        { label: '单价', prop: 'fprice', align: 'center' },
        { label: '计价单位', prop: 'funit', align: 'center' },
        { label: '含税单价', prop: 'ftaxprice', align: 'center' },
        { label: '币别', prop: 'fcurrency', align: 'center' },
        { label: '税率', prop: 'ftaxrate', align: 'center' },
        { label: '含税', prop: 'fisincludedtax', align: 'center' },
        { label: '失效日期', prop: 'feffectiveDate', align: 'center' },
        { label: '生效日期', prop: 'fexpiryDate', align: 'center' },
        { label: '操作', type: 'btn', fixed: 'right', minWidth: '200px', align: 'center' }
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
      const { data: RES } = await queryTPurPriceList({ ...this.getPriceList })
      this.tableData = RES.array
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
    // 修改采购
    editPurchase(fid) {
      this.$router.push({ path: `/editPurchasePrice/${fid}` })
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
}
</style>
