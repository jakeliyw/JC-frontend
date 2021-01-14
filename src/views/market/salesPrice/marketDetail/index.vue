<template>
  <div class="content">
    <jc-title />
    <el-tabs type="border-card"  @tab-click="handleOther">
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
            <el-table-column prop="fnumber" label="物料编码" min-width="200px" align="center" :show-overflow-tooltip="true">
              <template slot-scope="scope">
                <el-input v-model="scope.row.fnumber" size="mini" disabled>
                  <i slot="prefix" class="iconfont icon-jin-rud-ao-bo" @click="sonJumpMateriel(scope.row.fnumber)" />
                </el-input>
              </template>
            </el-table-column>
            <el-table-column prop="fdescripTion" label="物料描述" min-width="300" align="center" :show-overflow-tooltip="true" />
            <el-table-column prop="funit" label="基本单位" min-width="80" align="center" />
            <el-table-column prop="fpriceBase" label="销售系数(%)" align="center" />
            <el-table-column prop="fprice" label="销售单价" align="center" />
            <el-table-column prop="fdownPrice" label="销售基准价" align="center" />
            <el-table-column prop="feffectiveDate" label="生效期" align="center" :show-overflow-tooltip="true" />
          </jc-table>
        </div>
      </el-tab-pane>
      <el-tab-pane label="其他">
        <jc-marker
          :other-url-object="otherUrlObject"
          :other-log-table-data="otherLogTableData"
        >
          <div slot="slotPagination">
            <jc-pagination
              v-show="total > 0"
              :total="total"
              :page.sync="pageNum"
              :limit.sync="size"
              @pagination="handleOther"
            />
          </div>
        </jc-marker>
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
import {
  querySalOrderLog
} from '@/api/marketManage/marketOrder'
import jcMarker from '@/components/marker'
import jcPagination from '@/components/Pagination'

export default {
  components: {
    jcTable,
    jcForm,
    jcTitle,
    jcMarker,
    jcPagination
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
      organization: {}, // 表单组织控件
      otherUrlObject: {}, // 其它审核人
      otherLogTableData: [], // 日志数据
      pageNum: 1,
      size: 10,
      total: 0
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
    },
    // 获取其它
    async handleOther() {
      const id = this.$route.params.id
      const DATA = { pageNum: this.pageNum, pageSize: this.size, fid: id }
      const { data: RES } = await querySalOrderLog(DATA)
      this.otherUrlObject = RES.operator
      this.total = RES.total
      this.otherLogTableData = RES.array
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
