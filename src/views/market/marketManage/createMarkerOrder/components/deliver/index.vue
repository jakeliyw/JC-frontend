<template>
  <div class="content">
    <!--交货方式弹窗-->
    <el-dialog
      title="交货方式"
      model
      :visible.sync="isdeliverlDialog"
      :close-on-click-modal="false"
      width="60%"
      :before-close="handleClose"
    >
      <div class="materiel-form">
        <span class="materiel-code">交货名称</span>
        <el-input v-model.trim="deliver.fdataValue" class="input-width" size="mini" placeholder="请输入交货名称" @keyup.enter.native="deliverSearch" />
        <el-button size="mini" type="primary" @click="deliverSearch">搜索</el-button>
      </div>
      <jc-table
        :table-data="deliverlDialogData"
        :table-header="deliverDialogHeader"
        table-height="53vh"
        serial
        :cell-style="cellStyle"
        @clickRow="deliverlSelectRow"
      />
      <jc-pagination
        v-show="deliver.total > 0"
        :total="deliver.total"
        :page.sync="deliver.pageNum"
        :limit.sync="deliver.pageSize"
        @pagination="queryFheadDelivery"
      />
    </el-dialog>
  </div>
</template>
<script>
import { queryFheadDelivery } from '@/api/marketManage/marketOrder'
import jcTable from '@/components/Table'
import jcPagination from '@/components/Pagination'

export default {
  components: {
    jcTable,
    jcPagination
  },
  data() {
    return {
      // 交货方式
      isdeliverlDialog: true,
      deliver: {
        total: 0, // 总条目
        pageNum: 1, // 当前页
        pageSize: 10, // 每页显示多少条数据
        fdataValue: ''
      },
      deliverlDialogData: [],
      deliverDialogHeader: [
        { label: '编码', prop: 'fnumber', align: 'center' },
        { label: '交货名称', prop: 'fdataValue', align: 'center' },
        { label: '备注', prop: 'fdescripTion', align: 'center' }
      ],
      cellStyle: { padding: '10 10' },
      prodValue: { fdataValue: '', fheadDeliveryWay: '', isdeliverlDialog: true }
    }
  },
  created() {
    this.queryFheadDelivery()
  },
  methods: {
    // 查询交货方式
    async queryFheadDelivery() {
      this.isdeliverlDialog = true
      const DATA = this.deliver
      const { data: RES } = await queryFheadDelivery(DATA)
      this.deliverlDialogData = RES.array
      this.deliver.total = RES.total
    },
    deliverSearch() {
      this.deliver.pageNum = 1
      this.queryFheadDelivery()
    },
    // 选择交货方式
    deliverlSelectRow(item) {
      this.prodValue.fdataValue = item.fdataValue
      this.prodValue.fheadDeliveryWay = item.fheadDeliveryWay
      this.prodValue.isdeliverlDialog = false
      this.$emit('delive', this.prodValue)
    },
    // 关闭前回调
    handleClose() {
      this.prodValue.isdeliverlDialog = false
      this.$emit('delive', this.prodValue)
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

