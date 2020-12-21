<template>
  <div class="content">
    <el-tabs v-model="activeName" type="border-card">
      <el-tab-pane label="价目" name="purchase">
        <jc-form :option-value="optionValue" :options="options"/>
        <jc-table
          :table-data="tableData"
          :table-header="tableHeader"
          :cell-style="cellStyle"
          serial
          table-height="calc(100vh - 400px)"
        />
      </el-tab-pane>
      <el-tab-pane label="其它" name="other"/>
    </el-tabs>
  </div>
</template>

<script>
import jcForm from '@/components/Form/index'
import jcTable from '@/components/Table/index'
import { detailPriceList } from '@/api/purchaseManagement/purchasePrice'
export default {
  name: 'DetailPurchasePrice',
  components: {
    jcForm,
    jcTable
  },
  data() {
    return {
      pageNum: 1, // 默认第一页
      pageSize: 10, // 当前显示行数
      cellStyle: { padding: '10 10' }, // 行高
      activeName: 'purchase', // 默认在采购
      tableData: [],
      tableHeader: [
        { label: '物料描述', prop: 'fdescripTion', align: 'center' },
        { label: '物料编码', prop: 'fnumber', align: 'center' },
        { label: '计价单位', prop: 'funit', align: 'center' },
        { label: '单价', prop: 'fprice', align: 'center' },
        { label: '含税单价', prop: 'ftaxPrice', align: 'center' },
        { label: '价格系数', prop: 'fpricecoefficient', align: 'center' },
        { label: '价格上限', prop: 'fupPrice', align: 'center' },
        { label: '价格下限', prop: 'fdownPrice', align: 'center' },
        { label: '生效日期', prop: 'feffectiveDate', align: 'center' },
        { label: '失效日期', prop: 'fexpiryDate', align: 'center' },
        { label: '税率', prop: 'ftaxRate', align: 'center' }
      ],
      optionValue: {},
      options: {}
    }
  },
  mounted() {
    this.handleGetPurchase()
  },
  methods: {
    async handleGetPurchase() {
      const FID = this.$route.params.id
      const { data: RES } = await detailPriceList(
        {
          fid: FID,
          pageNum: this.pageNum,
          pageSize: this.pageSize
        }
      )
      this.tableData = RES.detail
      RES.fisIncludedTax = JSON.parse(RES.fisIncludedTax)
      this.optionValue = RES
      this.options = {
        fcreateorgId: {
          label: '采购组织',
          span: 6,
          disabled: 'disabled'
        },
        fnumber: {
          label: '单据编号',
          span: 6,
          disabled: 'disabled'
        },
        fname: {
          label: '名称',
          span: 6,
          disabled: 'disabled'
        },
        fpriceObject: {
          label: '价目表对象',
          span: 6,
          disabled: 'disabled'
        },
        fpriceType: {
          label: '价格类型',
          span: 6,
          disabled: 'disabled'
        },
        fcurrency: {
          label: '币别',
          span: 6,
          disabled: 'disabled'
        },
        fsupplier: {
          label: '供应商',
          span: 6,
          disabled: 'disabled'
        },
        fpricer: {
          label: '定价员',
          span: 6,
          disabled: 'disabled'
        },
        fdocumentStatus: {
          label: '单据状态',
          span: 6,
          disabled: 'disabled'
        },
        fisIncludedTax: {
          label: '含税',
          type: 'checkbox',
          span: 6,
          disabled: 'disabled'
        },
        fpaezBase: {
          label: '供应商税率',
          span: 6,
          disabled: 'disabled'
        },
        fnote: {
          label: '描述',
          type: 'textarea',
          span: 6,
          disabled: 'disabled'
        }
      }
    }
  }
}
</script>

<style scoped lang="scss">
.content{
  @include bomCreate;
}
</style>
