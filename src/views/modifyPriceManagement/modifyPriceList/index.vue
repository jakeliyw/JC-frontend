<template>
  <div class="content">
    <div class="header">
      <div class="header-name">
        <span class="parentItemNo">物料编码</span>
        <el-input
          v-model="getPriceList.fnumber"
          class="input-content"
          placeholder="请输入物料编号"
          @keyup.enter.native="handleQueryUntreated"
          size="mini"
        />
        <el-button type="primary" class="btn" size="mini" @click="handleQueryUntreated">搜索</el-button>
        <el-button type="primary" class="btn" size="mini" @click="addPurchase">新增调价</el-button>
      </div>
    </div>
    <div class="table-content">
      <jc-table
        :table-data="tableData"
        :table-header="tableHeader"
        :cell-style="cellStyle"
      >
        <el-table-column
          label="物料编码"
          align="center"
        >
          <template slot-scope="scope">
            <span class="jumpMateriel" @click="jumpMateriel(scope.row.fnumber)">{{ scope.row.fnumber }}</span>
          </template>
        </el-table-column>
        <template v-slot:btnSlot="clo">
          <el-button v-show="false" type="warning" size="mini" @click="editPurchase(clo.scope.row.fid)">修改价目</el-button>
          <el-button v-show="false" type="danger" size="mini" @click="deletePurchase(clo.scope.row.fid)">删除价目</el-button>
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
import { queryTPurPatList } from '@/api/modifyPriceManagement/modifyPriceList'

export default {
  name: 'ModifyPriceList',
  inject: ['reload'],
  components: {
    jcTable,
    jcPagination
  },
  data() {
    return {
      total: 0, // 总条目
      getPriceList: {
        pageNum: 1, // 当前页
        pageSize: 10, // 每页显示多少条数据
        fnumber: '' // 物料编码
      },
      cellStyle: { padding: '10 10' }, // 行高
      tableHeader: [
        { label: '调价名称', prop: 'fname', align: 'center' },
        { label: '供应商名称', prop: 'fsupplier', minWidth: '200px', align: 'center' },
        { label: '物料描述', prop: 'fdescripTion', align: 'center', minWidth: '300px' },
        { label: '计价单位', prop: 'funit', align: 'center' },
        { label: '调后单价', prop: 'fafterPrice', align: 'center' },
        { label: '调后含税单价', prop: 'fafterTaxPrice', align: 'center', minWidth: '150px' },
        { label: '币别', prop: 'fcurrency', align: 'center' },
        { label: '调后价格系数', prop: 'fafterPriceCoefficient', align: 'center', minWidth: '150px' },
        { label: '生效时间', prop: 'fcreateDate', align: 'center' },
        { label: '操作', type: 'btn', fixed: 'right', minWidth: '120px', align: 'center' }
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
      this.$router.push({ path: `/queryMateriel/${fnumber}` })
    },
    // 获取列表数据
    async handleGetPurchaseList() {
      const { data: RES } = await queryTPurPatList({ ...this.getPriceList })
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
}
</style>
