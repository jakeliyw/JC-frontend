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
        { label: '日期', prop: 'CREATEDATE', align: 'center' },
        { label: '操作人', prop: 'FNAME', align: 'center' },
        { label: '部门', prop: 'FDEAPRT', align: 'center' },
        { label: 'IP地址', prop: 'FIP', align: 'center' },
        { label: '行为', prop: 'FDESCRIBE', align: 'center' }
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
        FCREATOR: '',
        FCREATEDATE: '',
        FDEVEL: '',
        FDEVELDATE: '',
        FIEID: '',
        FIEDATE: '',
        FFINANCEID: '',
        FFINANCEDATE: '',
        FINFOID: '',
        FINFODATE: ''
      }
      this.otherOptions = {
        FCREATOR: {
          label: '创建人',
          disabled: 'disabled'
        },
        FDEVEL: {
          label: '研发审核人',
          disabled: 'disabled'
        },
        FIEID: {
          label: 'IE审核人',
          disabled: 'disabled'
        },
        FCREATEDATE: {
          label: '创建时间',
          disabled: 'disabled'
        },
        FDEVELDATE: {
          label: '审核时间',
          disabled: 'disabled'
        },
        FIEDATE: {
          label: '审核时间',
          disabled: 'disabled'
        },
        FFINANCEID: {
          label: '财务审核人',
          disabled: 'disabled'
        },
        FINFOID: {
          label: '信息部审核人',
          disabled: 'disabled'
        },
        FFINANCEDATE: {
          label: '审核时间',
          disabled: 'disabled'
        },
        FINFODATE: {
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
