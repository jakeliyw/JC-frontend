<template>
  <div>
    <jc-form :options="otherOptions" :option-value="otherUrlObject" label-width="100px" />
    <jc-table
      :table-header="logTableHeader"
      :table-data="otherLogTableData"
      :cell-style="cellStyle"
    />
    <slot name="slotPagination" />
  </div>
</template>

<script>
import jcForm from '@/components/Form'
import jcTable from '@/components/Table'

export default {
  name: 'Index',
  components: {
    jcForm,
    jcTable
  },
  props: {
    otherUrlObject: {
      type: Object,
      required: true,
      default: function() {
        return {}
      }
    },
    otherLogTableData: {
      type: Array,
      required: true,
      default: function() {
        return []
      }
    }
  },
  data() {
    return {
      // 其它表单
      otherOptions: {},
      otherValue: {},
      cellStyle: { padding: '10 10' }, // 行高
      // 日志头部
      logTableHeader: [
        { label: '日期', prop: 'createDate', align: 'center' },
        { label: '操作人', prop: 'fname', align: 'center' },
        { label: '部门', prop: 'fdeaprt', align: 'center' },
        { label: 'IP地址', prop: 'fip', align: 'center' },
        { label: '行为', prop: 'fdescribe', align: 'center' }
      ]
    }
  },
  watch: {
    otherUrlObject: {
      handler(val) {
        this.otherValue = val
      },
      // 是否一开始就监视
      immediate: true,
      deep: true
    }
  },
  mounted() {
    this.handleGetForm()
  },
  methods: {
    handleGetForm() {
      this.otherValue = {
        fcreator: '',
        fcreateDate: '',
        fsalter: '',
        fsalterDate: '',
        fsalters: '',
        fsaltersDate: ''
      }
      this.otherOptions = {
        fcreator: {
          label: '创建人',
          disabled: 'disabled'
        },
        fcreateDate: {
          label: '创建时间',
          disabled: 'disabled'
        },
        fsalter: {
          label: '销售员审核',
          disabled: 'disabled'
        },
        fsalterDate: {
          label: '审核时间',
          disabled: 'disabled'
        },
        fsalters: {
          label: '主管审核',
          disabled: 'disabled'
        },
        fsaltersDate: {
          label: '审核时间',
          disabled: 'disabled'
        }
      }
    }
  }
}
</script>

<style lang="scss" scoped>
</style>
