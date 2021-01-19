<template>
  <div class="content">
    <!--    客户列表弹窗-->
    <el-dialog
      title="生产部门"
      model
      :visible.sync="isstorklDialog"
      :close-on-click-modal="false"
      width="60%"
      :before-close="handleClose"
    >
      <div class="materiel-form">
        <span class="materiel-code">生产部门名称</span>
        <el-input v-model.trim="stork.fname" class="input-width" size="mini" placeholder="请输入客户名称" @keyup.enter.native="storkSearch" />
        <el-button size="mini" type="primary" @click="storkSearch">搜索</el-button>
      </div>
      <jc-table
        :table-data="storklDialogData"
        :table-header="storkDialogHeader"
        table-height="53vh"
        serial
        :cell-style="cellStyle"
        @clickRow="storklSelectRow"
      />
      <jc-pagination
        v-show="stork.total > 0"
        :total="stork.total"
        :page.sync="stork.pageNum"
        :limit.sync="stork.pageSize"
        @pagination="queryTBdCustomerList"
      />
    </el-dialog>
  </div>
</template>
<script>
import { Show_StockInfo } from '@/api/mrpView'
import jcTable from '@/components/Table'
import jcPagination from '@/components/Pagination'
export default {
  components: {
    jcTable,
    jcPagination
  },
  props: {
    msg: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      // 客户列表数据分页
      isstorklDialog: true,
      stork: {
        total: 0, // 总条目
        pageNum: 1, // 当前页
        pageSize: 10, // 每页显示多少条数据
        fname: ''
      },
      storklDialogData: [],
      storkDialogHeader: [
        { label: '生产部门ID', prop: 'scbmno', align: 'center' },
        { label: '生产部门', prop: 'scbm', align: 'center' }
      ],
      cellStyle: { padding: '10 10' },
      prodValue: { scbmno: '', scbm: '', isstorklDialog: true },
      ddlx: ''
    }
  },
  created() {
    this.queryTBdCustomerList()
  },
  methods: {
    // 获取生产部门
    async queryTBdCustomerList() {
      if (this.msg === '生产订单') {
        this.ddlx = 'SCDD'
      } else if (this.msg === '委外订单') {
        this.ddlx = 'WWDD'
      } else if (this.msg === '采购订单') {
        this.ddlx = 'CGDD'
      }
      const DATA = { ddlx: this.ddlx, bm: this.stork.fname }
      const { data: RES } = await Show_StockInfo(DATA)
      this.storklDialogData = RES
      this.stork.total = RES.total
    },
    // 生产部门弹窗选中
    storklSelectRow(item) {
      this.prodValue.scbmno = item.scbmno
      this.prodValue.scbm = item.scbm
      this.prodValue.isstorklDialog = false
      this.$emit('stork', this.prodValue)
    },
    storkSearch() {
      this.stork.pageNum = 1
      this.queryTBdCustomerList()
    },
    // 关闭前回调
    handleClose() {
      this.prodValue.isstorklDialog = false
      this.$emit('stork', this.prodValue)
    }
  }
}
</script>

<style scoped lang="scss">
.content {
  @include listBom;
}
.materiel-form {
  display: flex;
  align-items: center;
  flex-direction: row;
  margin-bottom: 20px;

  .materiel-code {
    margin-right: 5px;
    font-weight: bold;
    font-size: 14px;
    min-width: 65px;
    color: #606266;
    line-height: 40px;
  }

  .input-width {
    width: 200px;
    margin-right: 10px;
  }
}
</style>
