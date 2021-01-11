<template>
  <div class="content">
    <jc-title/>
    <el-form :model="orderNumber" label-width="90px">
      <el-form-item label="销售订单号">
        <el-input v-model.trim="fbillNo" size="mini" @keyup.enter.native="gainData" />
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
    </el-form>
    <jc-table :table-data="tableData" :table-header="tableHeader" serial table-selection @selectionChange="selectData" />
  </div>
</template>
<script>
import jcTable from '@/components/Table'
import jcTitle from '@/components/Title'
import { queryTOrgOrganizationsL } from '@/api/engineering/createBom'

export default {
  components: {
    jcTable,
    jcTitle
  },
  data() {
    return {
      fbillNo: '', // 销售订单号
      orderNumber: {
        customer: '',
        fpaezText1: '',
        fpaezCombo: '',
        fdeliveryDate: ''
      },
      tableData: [],
      tableHeader: [
        { label: '状态', prop: 'status', align: 'center' },
        { label: '订单类型', prop: 'status', align: 'center' },
        { label: '生产单号', prop: 'status', align: 'center' },
        { label: '型号', prop: 'status', align: 'center' },
        { label: '物料编号', prop: 'status', align: 'center' },
        { label: '物料描述', prop: 'status', align: 'center' },
        { label: '生产类型', type: 'btn', align: 'center' },
        { label: '生产部门', type: 'status', align: 'center' },
        { label: '仓库', type: 'status', align: 'center' },
        { label: '库存', type: 'status', align: 'center' },
        { label: '计划数量', prop: 'status', align: 'center' },
        { label: '数量单位', prop: 'status', align: 'center' },
        { label: '损耗率', prop: 'status', align: 'center' },
        { label: '损耗数', prop: 'status', align: 'center' },
        { label: '生产/采购数量', prop: 'status', align: 'center' },
        { label: '加工/采购单价', prop: 'status', align: 'center' },
        { label: '行金额(RMB)', prop: 'status', align: 'center' },
        { label: '配件交期', prop: 'status', align: 'center' }
      ]
    }
  },
  watch: {
    fbillNo(val) {
      console.log(val)
    }
  },
  methods: {
    // 获取表格数据
    async gainData() {
      const { data: RES } = await queryTOrgOrganizationsL()
      this.teamList = RES
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
}
</style>
