<template>
  <div class="content">
    <!--    客户列表弹窗-->
    <el-dialog
      title="客户列表"
      model
      :visible.sync="isclientlDialog"
      :close-on-click-modal="false"
      width="60%"
      :before-close="handleClose"
    >
      <div class="materiel-form">
        <span class="materiel-code">客户名称</span>
        <el-input v-model.trim="client.fname" class="input-width" size="mini" placeholder="请输入客户名称" @keyup.enter.native="clientSearch" />
        <el-button size="mini" type="primary" @click="clientSearch">搜索</el-button>
      </div>
      <jc-table
        :table-data="clientlDialogData"
        :table-header="clientDialogHeader"
        table-height="53vh"
        serial
        :cell-style="cellStyle"
        @clickRow="clientlSelectRow"
      />
      <jc-pagination
        v-show="client.total > 0"
        :total="client.total"
        :page.sync="client.pageNum"
        :limit.sync="client.pageSize"
        @pagination="queryTBdCustomerList"
      />
    </el-dialog>
  </div>
</template>
<script>
import { queryTBdCustomerList } from '@/api/marketManage/marketOrder'
import jcTable from '@/components/Table'
import jcPagination from '@/components/Pagination'
export default {
  components: {
    jcTable,
    jcPagination
  },
  data() {
    return {
      // 客户列表数据分页
      isclientlDialog: true,
      client: {
        total: 0, // 总条目
        pageNum: 1, // 当前页
        pageSize: 10, // 每页显示多少条数据
        fname: ''
      },
      clientlDialogData: [],
      clientDialogHeader: [
        { label: '客户ID', prop: 'fcustId', align: 'center' },
        { label: '客户编码', prop: 'fnumber', align: 'center' },
        { label: '客户名称', prop: 'fname', align: 'center' },
        { label: '客户分组', prop: 'fcustGroup', align: 'center' }
      ],
      cellStyle: { padding: '5px 0' },
      prodValue: { fcustId: '', fname: '', isclientlDialog: true }
    }
  },
  created() {
    this.queryTBdCustomerList()
  },
  methods: {
    // 获取客户列表
    async queryTBdCustomerList() {
      this.isclientlDialog = true
      const DATA = this.client
      const { data: RES } = await queryTBdCustomerList(DATA)
      this.clientlDialogData = RES.array
      this.client.total = RES.total
    },
    // 客户弹窗选中
    clientlSelectRow(item) {
      this.prodValue.fcustId = item.fcustId
      this.prodValue.fname = item.fname
      this.prodValue.isclientlDialog = false
      this.$emit('client', this.prodValue)
    },
    clientSearch() {
      this.client.pageNum = 1
      this.queryTBdCustomerList()
    },
    // 关闭前回调
    handleClose() {
      this.prodValue.isclientlDialog = false
      this.$emit('client', this.prodValue)
    }
  }
}
</script>

<style scoped lang="scss">
.content {
  @include listBom;
}
</style>
