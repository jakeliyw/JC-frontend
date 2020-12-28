<template>
  <div class="content">
    <el-tabs type="border-card">
      <el-tab-pane label="订单详情">
        <div class="header-card">
          <div class="organization">
            <jc-form :option-value="organizationValue" :options="organization" />
          </div>
        </div>
        <div class="table-content">
          <jc-table
            :table-data="tableData"
            :table-header="tableHeader"
            :cell-style="cellStyle"
          >
            <el-table-column prop="fnumber" label="物料编码" min-width="100" align="center" />
            <el-table-column prop="fdescripTion" label="物料描述" min-width="300" align="center" />
            <el-table-column prop="funit" label="基本单位" min-width="80" align="center" />
            <el-table-column prop="flength" label="长" min-width="60" align="center" />
            <el-table-column prop="fwidth" label="宽" min-width="60" align="center" />
            <el-table-column prop="fheight" label="高" min-width="60" align="center" />
            <el-table-column prop="fprice" label="产品单价" align="center" />
            <el-table-column prop="fqty" label="产品数量" align="center" />
            <el-table-column prop="fdeliveryDate" label="交货日期" min-width="80" align="center" />
            <el-table-column prop="fvolume" label="产品体积" align="center" />
            <el-table-column prop="fisFree" label="是否赠品" align="center">
              <template slot-scope="scope">
                <el-checkbox v-model="scope.row.fisFree" disabled />
              </template>
            </el-table-column>
            <el-table-column prop="ftaxRate" label="税率" align="center" />
          </jc-table>
        </div>
      </el-tab-pane>
      <el-tab-pane label="其他">
        <h1>待开发</h1>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>
import jcTable from '@/components/Table'
import jcForm from '@/components/Form'
import {
  queryTSalOrderNtry
} from '@/api/marketManage/marketOrder'

export default {
  components: {
    jcTable,
    jcForm
  },
  data() {
    return {
      // 表头
      cellStyle: { padding: '10 10' }, // 行高
      tableData: [], // 销售数据
      tableHeader: [],
      // 表单
      organizationValue: {}, // 表单组织值
      organization: {} // 表单组织控件
    }
  },
  mounted() {
    this.queryTSalOrderNtry()
  },
  methods: {
    // 获取订单列表数据
    async queryTSalOrderNtry() {
      const id = this.$route.params.id
      const DATA = { fid: id }
      const { data: RES } = await queryTSalOrderNtry(DATA)
      this.tableData = RES.detail
      if (RES.fcloseStatus === 'A') {
        RES.fcloseStatus = '正常'
      } else {
        RES.fcloseStatus = '已关闭'
      }
      this.organizationValue = RES
      this.organization = {
        fcreateDate: {
          label: '订单时间',
          disabled: 'disabled'
        }, fbillType: {
          label: '订单类型',
          disabled: 'disabled'
        }, fbillNo: {
          label: '销售订单号',
          disabled: 'disabled'
        }, fsaleOrg: {
          label: '销售组织',
          disabled: 'disabled'
        }, customer: {
          label: '客户',
          disabled: 'disabled'
        }, fsettleCurr: {
          label: '结算货币',
          disabled: 'disabled'
        }, fsaleDept: {
          label: '销售部门',
          disabled: 'disabled'
        }, fsaler: {
          label: '销售员',
          disabled: 'disabled'
        }, fcloseStatus: {
          label: '关闭状态',
          disabled: 'disabled'
        }, fexchangeType: {
          label: '汇率类型',
          disabled: 'disabled'
        }, fexchangeRate: {
          label: '税率',
          disabled: 'disabled'
        }, flocalCurr: {
          label: '本位币',
          disabled: 'disabled'
        }
      }
    },
    // 搜索
    handleQuerySonClass() {
      this.pageNum = 1
      this.getSonClass()
    },
    // 订单详情
    particulars(id) {

    }
  }
}
</script>
<style lang="scss" scoped>
.content {
  @include listBom;
}
.inTheBtn{
  transform: translateY(-15px);
}
.tag-mar {
  margin-right: 3px;
  margin-bottom: 3px;
}

.tag-mar:hover {
  cursor: pointer;
}

.el-tag + .el-tag {
  margin-left: 10px;
}

.button-new-tag {
  margin-left: 10px;
  height: 32px;
  line-height: 30px;
  padding-top: 0;
  padding-bottom: 0;
}

.input-new-tag {
  width: 90px;
  margin-left: 10px;
  vertical-align: bottom;
}
</style>
