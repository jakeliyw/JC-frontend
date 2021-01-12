<template>
  <div class="content">
    <jc-title />
    <el-tabs type="border-card">
      <el-tab-pane label="价目明细">
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
            <el-table-column prop="fnumber" label="物料编码" min-width="100" align="center" :show-overflow-tooltip="true">
              <template slot-scope="scope">
                <el-input v-model="scope.row.fnumber" size="mini" disabled>
                  <i slot="prefix" class="iconfont icon-jin-rud-ao-bo" @click="sonJumpMateriel(scope.row.fnumber)" />
                </el-input>
              </template>
            </el-table-column>
            <el-table-column prop="fdescripTion" label="物料描述" min-width="300" align="center" :show-overflow-tooltip="true" />
            <el-table-column prop="funit" label="基本单位" min-width="80" align="center" />
            <el-table-column prop="fpriceBase" label="价格系数" align="center" />
            <el-table-column prop="fprice" label="价格" align="center" />
            <el-table-column prop="fdownPrice" label="最低限价" align="center" />
            <el-table-column prop="feffectiveDate" label="生效期" align="center" :show-overflow-tooltip="true" />
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
import jcTitle from '@/components/Title'
import {
  querySalPriceNtry
} from '@/api/marketManage/marketPriceList'
import jumpMateriel from '@/components/JumpMateriel'

export default {
  components: {
    jcTable,
    jcForm,
    jcTitle
  },
  mixins: [jumpMateriel],
  data() {
    return {
      // 表头
      cellStyle: { padding: '10 10' }, // 行高
      tableData: [], // 价目明细数据
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
      const { data: RES } = await querySalPriceNtry(DATA)
      this.tableData = RES.detail
      this.organizationValue = RES
      this.organization = {
        fsaleOrg: {
          label: '销售组织',
          disabled: 'disabled'
        },
        fnumber: {
          label: '编码',
          disabled: 'disabled'
        },
        fname: {
          label: '销售价目名称',
          disabled: 'disabled'
        },
        fcurrency: {
          label: '币别',
          disabled: 'disabled'
        },
        fpriceObject: {
          label: '价目对象',
          disabled: 'disabled'
        },
        fdescripTion: {
          label: '备注',
          disabled: 'disabled'
        },
        fisIncludedTax: {
          label: '含税',
          type: 'checkbox',
          disabled: 'disabled'
        }
      }
    }
  }
}
</script>
<style lang="scss" scoped>
.content {
  @include listBom;
  .iconfont{
    cursor: pointer;
  }
}
</style>
