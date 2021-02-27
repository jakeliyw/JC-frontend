<template>
  <div class="content">
    <jc-title />
    <el-tabs type="border-card" @tab-click="handleOther">
      <el-tab-pane label="价目明细">
        <div class="header-card">
          <div class="organization">
            <el-form :model="organizationValue" label-width="100px">
              <el-form-item label="销售组织">
                <el-input v-model="organizationValue.fsaleOrg" disabled size="mini" />
              </el-form-item>
              <el-form-item label="编码">
                <el-input v-model="organizationValue.fnumber" disabled size="mini" />
              </el-form-item>
              <el-form-item label="价目表名称">
                <el-input v-model="organizationValue.fname" disabled size="mini" />
              </el-form-item>
              <el-form-item label="客户">
                <el-input v-model="organizationValue.fcustName" disabled placeholder="请选择客户" size="mini">
                  <i
                    slot="suffix"
                    class="el-input__icon el-icon-search"
                    @click="clientVisiblit=true"
                  />
                </el-input>
              </el-form-item>
              <el-form-item label="限定客户" prop="limitName">
                <el-input v-model="organizationValue.limitName" size="mini" disabled />
              </el-form-item>
              <el-form-item label="币别">
                <el-input v-model="organizationValue.fcurrency" size="mini" disabled>
                  <i
                    slot="suffix"
                    class="el-input__icon el-icon-search"
                    @click="currencyVisiblit=true"
                  />
                </el-input>
              </el-form-item>
              <el-form-item label="价目对象">
                <el-input v-model="organizationValue.fpriceObject" size="mini" disabled />
              </el-form-item>
              <el-form-item label="备注">
                <el-input v-model="organizationValue.fdescripTion" type="textarea" size="mini" disabled />
              </el-form-item>
              <el-form-item v-if="false" label="含税">
                <el-checkbox v-model="organizationValue.fisIncludedTax" disabled />
              </el-form-item>
            </el-form>
          </div>
        </div>
        <div class="table-content">
          <jc-table
            :table-data="tableData"
            :table-header="tableHeader"
            serial
            table-height="calc(100vh - 340px)"
            :cell-style="cellStyle"
          >
            <el-table-column prop="fnumber" label="物料编码" min-width="200px" align="center" :show-overflow-tooltip="true">
              <template slot-scope="scope">
                <el-input v-model="scope.row.fnumber" size="mini" disabled>
                  <i slot="prefix" class="iconfont icon-jin-rud-ao-bo" @click="sonJumpMateriel(scope.row.fnumber)" />
                </el-input>
              </template>
            </el-table-column>
            <el-table-column prop="foldNumber" label="旧物料编码" min-width="120px" align="center" />
            <el-table-column prop="fdescripTion" label="物料描述" min-width="300px" align="center" :show-overflow-tooltip="true" />
            <el-table-column prop="funit" label="基本单位" min-width="80px" align="center" />
            <el-table-column label="销售基准价(x:餐台数量, y:餐椅数量)" min-width="190px" align="center">
              <el-table-column label="x<20" align="center">
                <el-table-column label="y<80" align="center" min-width="110px" prop="fdownPrice1" />
              </el-table-column>
              <el-table-column label="20<=x<100" align="center">
                <el-table-column label="80<=y<400" align="center" min-width="110px" prop="fdownPrice2" />
              </el-table-column>
              <el-table-column label="100<=x<500" align="center">
                <el-table-column label="400<=y<2000" align="center" min-width="110px" prop="fdownPrice3" />
              </el-table-column>
              <el-table-column label="500<=x<1000" align="center">
                <el-table-column label="2000<=y<4000" align="center" min-width="110px" prop="fdownPrice4" />
              </el-table-column>
              <el-table-column label="x>=1000" align="center">
                <el-table-column label="y>=4000" align="center" min-width="110px" prop="fdownPrice5" />
              </el-table-column>
            </el-table-column>
            <el-table-column label="销售基准价(含税)" min-width="180px" align="center">
              <template slot="header">
                <el-select v-model="fdownPriceRate" size="mini" @change="priceRate">
                  <el-option label="含税销售基准价(13%)" value="13">含税销售基准价(13%)</el-option>
                  <el-option label="含税销售基准价(7%)" value="7">含税销售基准价(7%)</el-option>
                  <el-option label="含税销售基准价(5%)" value="5">含税销售基准价(5%)</el-option>
                </el-select>
              </template>
              <el-table-column label="x<20" align="center">
                <el-table-column label="y<80" align="center" min-width="110px" prop="fdownPrice11" />
              </el-table-column>
              <el-table-column label="20<=x<100" align="center">
                <el-table-column label="80<=y<400" align="center" min-width="110px" prop="fdownPrice12" />
              </el-table-column>
              <el-table-column label="100<=x<500" align="center">
                <el-table-column label="400<=y<2000" align="center" min-width="110px" prop="fdownPrice13" />
              </el-table-column>
              <el-table-column label="500<=x<1000" align="center">
                <el-table-column label="2000<=y<4000" align="center" min-width="110px" prop="fdownPrice14" />
              </el-table-column>
              <el-table-column label="x>=1000" align="center">
                <el-table-column label="y>=4000" align="center" min-width="110px" prop="fdownPrice15" />
              </el-table-column>
            </el-table-column>
            <el-table-column v-if="false" prop="deliveryPrice" label="出厂价" align="center" />
            <el-table-column v-if="false" prop="fdownPrice" label="销售基准价" min-width="90px" align="center" />
            <el-table-column prop="feffectiveDate" label="生效期" min-width="100px" align="center" :show-overflow-tooltip="true" />
          </jc-table>
        </div>
      </el-tab-pane>
      <el-tab-pane label="其他">
        <jc-marker
          other-height="calc(100vh - 390px)"
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
import jcTitle from '@/components/Title'
import {
  querySalPriceNtry
} from '@/api/marketManage/marketPriceList'
import jumpMateriel from '@/components/JumpMateriel'
import jcMarker from '@/components/marker'
import jcPagination from '@/components/Pagination'
import salPrice from '@/views/market/salesPrice/createMarketPrice/components/mixin'
export default {
  components: {
    jcTable,
    jcTitle,
    jcMarker,
    jcPagination
  },
  mixins: [jumpMateriel, salPrice],
  data() {
    return {
      rate: 1.13, // 销售基准价(默认13%税率)
      fdownPriceRate: '13', // 销售基准价税率
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
      total: 0,
      tableIndex: 0
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
      RES.detail.map(item => {
        item.fdownPrice1 = (item.fdownPrice / 0.5).toFixed(4)
        item.fdownPrice2 = (item.fdownPrice / 0.55).toFixed(4)
        item.fdownPrice3 = (item.fdownPrice / 0.6).toFixed(4)
        item.fdownPrice4 = (item.fdownPrice / 0.65).toFixed(4)
        item.fdownPrice5 = (item.fdownPrice / 0.7).toFixed(4)

        item.fdownPrice11 = (item.fdownPrice / 0.5 * this.rate).toFixed(4)
        item.fdownPrice12 = (item.fdownPrice / 0.55 * this.rate).toFixed(4)
        item.fdownPrice13 = (item.fdownPrice / 0.6 * this.rate).toFixed(4)
        item.fdownPrice14 = (item.fdownPrice / 0.65 * this.rate).toFixed(4)
        item.fdownPrice15 = (item.fdownPrice / 0.7 * this.rate).toFixed(4)
      })
      this.tableData = RES.detail
      RES.limitName = '客户'
      this.organizationValue = RES
    },
    priceRate(val) {
      this.rate = 1 + (val / 100)
      this.tableData.map(item => {
        if (item.fdownPrice) {
          item.fdownPrice11 = (item.fdownPrice1 * this.rate).toFixed(4)
          item.fdownPrice12 = (item.fdownPrice2 * this.rate).toFixed(4)
          item.fdownPrice13 = (item.fdownPrice3 * this.rate).toFixed(4)
          item.fdownPrice14 = (item.fdownPrice4 * this.rate).toFixed(4)
          item.fdownPrice15 = (item.fdownPrice5 * this.rate).toFixed(4)
        }
      })
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
  .el-tabs{
    .el-table {
      &::v-deep td{
        padding: 8px 0;
      }
      &::v-deep thead.is-group th{
        padding: 3px 0;
        .el-input__inner{
          background: #e6ebfc;
          color: #909399;
          font-size: 13px;
          font-weight: 550;
          border: none;
        }
      }
    }
  }
  .el-form{
    display: flex;
    flex-wrap: wrap;
    .el-form-item {
      width: 16.6%;
      min-width: 253px;
      margin-bottom: 0px;
    }
  }
}
</style>
