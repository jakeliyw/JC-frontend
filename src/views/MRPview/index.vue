<template>
  <div class="content">
    <el-form :model="orderNumber" label-width="90px">
      <el-form-item label="销售订单号">
        <el-input v-model.trim="Sonum" size="mini" @keyup.enter.native="gainData" />
      </el-form-item>
      <el-form-item label="客户">
        <el-input v-model="orderNumber.customer" disabled size="mini" />
      </el-form-item>
      <el-form-item label="客户订单号">
        <el-input v-model="orderNumber.fpaezText1" disabled size="mini" />
      </el-form-item>
      <el-form-item label="品质标准">
        <el-input v-model="orderNumber.fpaezCombo" disabled size="mini" />
      </el-form-item>
      <el-form-item label="交货日期">
        <el-input v-model="orderNumber.fdeliveryDate" disabled size="mini" />
      </el-form-item>
      <el-form-item>
        <el-button type="primary" size="mini" @click="gainData">运算</el-button>
      </el-form-item>
    </el-form>
    <jc-table
      :table-data="tableData"
      :table-header="tableHeader"
      table-height="500px"
      :cell-style="cellStyle"
      table-selection
      @selectionChange="selectData"
    />
    <div class="footer">
      <p>总金额： <span>{{ grossAmount }}</span></p>
      <el-button type="primary">确认下发</el-button>
    </div>
  </div>
</template>
<script>
import jcTable from '@/components/Table'
import { MrpInfo } from '@/api/mrpView'

export default {
  components: {
    jcTable
  },
  data() {
    return {
      Sonum: 'WX20122920', // 销售订单号
      orderNumber: {
        customer: '',
        fpaezText1: '',
        fpaezCombo: '',
        fdeliveryDate: ''
      },
      cellStyle: { padding: '10 10' },
      grossAmount: 0, // 总金额
      tableData: [],
      tableHeader: [
        { label: '状态', prop: 'zt', align: 'center' },
        { label: '订单类型', prop: 'ddlx', align: 'center' },
        { label: '生产单号', prop: 'ssdh', align: 'center' },
        { label: '型号', prop: 'itemXH', align: 'center' },
        { label: '物料编号', prop: 'itemCode', align: 'center', minWidth: '100px' },
        { label: '物料描述', prop: 'itemName', align: 'center', minWidth: '200px' },
        { label: '生产类型', type: 'sclx', align: 'center' },
        { label: '生产部门', type: 'scbm', align: 'center' },
        { label: '仓库', type: 'ck', align: 'center' },
        { label: '库存', type: 'kc', align: 'center' },
        { label: '计划数量', prop: 'qty', align: 'center' },
        { label: '数量单位', prop: 'dw', align: 'center' },
        { label: '损耗率', prop: 'shl', align: 'center' },
        { label: '损耗数', prop: 'shs', align: 'center' },
        { label: '生产数量', prop: 'scQty', align: 'center' },
        { label: '加工单价', prop: 'rprice', align: 'center' },
        { label: '行金额', prop: 'hje', align: 'center' },
        { label: '配件交期', prop: 'pjjq', align: 'center' },
        { label: '包装方式', prop: 'BZBOM', align: 'center' }
      ]
    }
  },
  methods: {
    // 获取表格数据
    async gainData() {
      const DATA = { Sonum: this.Sonum }
      const { data: RES } = await MrpInfo(DATA)
      this.grossAmount = 0
      RES.map(item => {
        item.qty = Number(item.qty).toFixed(4)
        item.scQty = Number(item.scQty).toFixed(4)
        item.rprice = Number(item.rprice).toFixed(4)
        item.hje = Number(item.hje).toFixed(2)
        this.grossAmount += Number(item.hje)
      })
      this.tableData = RES
    },
    // 多选时触发的事件
    selectData(val) {
    }
  }
}
</script>

<style scoped lang="scss">
.content {
  @include listBom;

  .el-form {
    display: flex;
    flex-wrap: wrap;

    .el-form-item {
      width: 263px;
    }
  }
  .el-table ::v-deep .el-table__body-wrapper {
    height: 500px;
  }
  .footer {
    display: flex;
    flex-direction: column;
    align-items: flex-end;
    margin-right: 50px;

    p {
      width: 200px;
    }

    .el-button {
      width: 200px;
      font-size: 16px;
      letter-spacing: 2px;
    }
  }
}
</style>
