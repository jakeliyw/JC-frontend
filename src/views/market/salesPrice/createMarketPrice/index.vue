<template>
  <div v-loading="loading" class="content">
    <jc-title />
    <el-button type="primary" style="width: 80px;margin-bottom: 10px" size="mini" @click="subMarker()">保存</el-button>
    <el-tabs type="border-card">
      <el-tab-pane label="主产品">
        <el-form ref="purchaseRef" :model="prodValue" label-width="100px" :rules="prodValueRules">
          <el-form-item label="销售组织" prop="fcreateOrgId">
            <el-select v-model="prodValue.fcreateOrgId" placeholder="请选择组织" size="mini">
              <el-option
                v-for="option in teamList"
                :key="option.value"
                :label="option.FNAME"
                :value="option.FPKID"
              />
            </el-select>
          </el-form-item>
          <el-form-item label="价目表名称" prop="fname">
            <el-input v-model.trim="prodValue.fname" placeholder="请输入价目表名称" size="mini" />
          </el-form-item>
          <el-form-item label="客户" prop="fcustId">
            <el-input v-model="prodValue.fcust" placeholder="请选择客户" size="mini">
              <i
                slot="suffix"
                class="el-input__icon el-icon-search"
                @click="clientVisiblit=true"
              />
            </el-input>
          </el-form-item>
          <el-form-item label="限定客户" prop="limitName">
            <el-select v-model.trim="prodValue.limitName" size="mini" disabled>
              <option label="客户" value="1">客户</option>
            </el-select>
          </el-form-item>
          <el-form-item label="币别" prop="fcurrencyId">
            <el-input v-model.trim="prodValue.fcurrencyIdName" placeholder="请选择币别" size="mini">
              <i
                slot="suffix"
                class="el-input__icon el-icon-search"
                @click="currencyVisiblit=true"
              />
            </el-input>
          </el-form-item>
          <el-form-item label="备注" prop="fdescripTion">
            <el-input v-model.trim="prodValue.fdescripTion" type="textarea" placeholder="请填写备注" size="mini" />
          </el-form-item>
          <el-form-item label="是否含税">
            <el-checkbox v-model="prodValue.fisIncludedTax" />
          </el-form-item>
        </el-form>
        <jc-table
          :table-data="prodValue.priceDetails"
          :table-header="tableHeader"
          table-height="500px"
          serial
          :cell-style="cellStyle"
        >
          <el-table-column label="物料编码" prop="fmaterialId" align="center" width="200px">
            <template slot-scope="scope">
              <el-input v-model.trim="scope.row.fmaterialIdName" placeholder="请选择物料编码" size="mini">
                <i
                  slot="prefix"
                  class="iconfont icon-jin-rud-ao-bo"
                  @click="sonJumpMateriel(scope.row.fmaterialIdName)"
                />
                <i
                  slot="suffix"
                  class="el-input__icon el-icon-search"
                  @click="handleGetMateriel(scope.row, scope.$index)"
                />
              </el-input>
            </template>
          </el-table-column>
          <el-table-column
            label="物料描述"
            prop="fdescripTion"
            align="center"
            min-width="200px"
            :show-overflow-tooltip="true"
          />
          <el-table-column label="销售单位" prop="funitName" align="center" />
          <el-table-column label="出厂价" align="center">
            <template slot-scope="scope">
              {{ scope.row.deliveryPrice }}
            </template>
          </el-table-column>
          <el-table-column label="销售系数(%)" prop="fpriceBase" min-width="150px" align="center">
            <template slot-scope="scope">
              <el-input-number
                v-model="scope.row.fpriceBase"
                :min="10"
                :max="40"
                size="mini"
                @change="inputNum(scope.$index)"
              />
            </template>
          </el-table-column>
          <el-table-column label="销售基准价" prop="fdownPrice" min-width="150px" align="center">
            <template slot-scope="scope">
              <el-input-number
                v-model="scope.row.fdownPrice"
                size="mini"
                disabled
              />
            </template>
          </el-table-column>
          <el-table-column label="操作" prop="fqty" min-width="100px" align="center">
            <template slot-scope="scope">
              <el-button type="danger" size="mini" @click="delectSale(scope.$index)">删除</el-button>
            </template>
          </el-table-column>
        </jc-table>
      </el-tab-pane>
      <el-tab-pane label="其他">
        <jc-marker
          other-height="500px"
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
    <!--    币别列表弹窗-->
    <currency v-if="currencyVisiblit" @currency="currencyData" />
    <!--客户列表-->
    <client v-if="clientVisiblit" @client="clientData" />
    <!--    物料弹窗-->
    <el-dialog
      title="物料列表"
      model
      :visible.sync="isMaterielDialog"
      :close-on-click-modal="false"
      width="60%"
    >
      <div class="materiel-form">
        <search :options="selectData" :msg="fbillNo" @seek="collect" @hand="handleMaterielSearch" />
        <el-button size="mini" type="primary" class="btn" @click="handleMaterielSearch">搜索</el-button>
      </div>
      <jc-table
        :table-data="materielDialogData"
        :table-header="materielDialogHeader"
        table-height="53vh"
        serial
        :cell-style="cellStyle"
        @clickRow="materielSelectRow"
      />
      <jc-pagination
        v-show="materielPagination.total > 0"
        :total="materielPagination.total"
        :page.sync="materielPagination.pageNum"
        :limit.sync="materielPagination.pageSize"
        @pagination="handleGetMateriel"
      />
    </el-dialog>
  </div>
</template>
<script>
import {
  queryTOrgOrganizationsL
} from '@/api/engineering/createBom'
import {
  insertSalPrice,
  querySalPriceMaterial
} from '@/api/marketManage/marketPriceList'
import jcTable from '@/components/Table'
import jcPagination from '@/components/Pagination'
import jumpMateriel from '@/components/JumpMateriel'
import jcTitle from '@/components/Title'
import currency from '@/views/market/marketManage/createMarkerOrder/components/currency'
import client from '@/views/market/marketManage/createMarkerOrder/components/client'
import {
  queryMaterialList,
  querySalOrderLog
} from '@/api/marketManage/marketOrder'
import jcMarker from '@/components/marker'
import search from '@/components/Search'
import searData from '@/components/Search/mixin'
export default {
  name: 'CreateMarketPrice',
  components: {
    jcTable,
    jcPagination,
    jcTitle,
    jcMarker,
    client,
    currency,
    search
  },
  mixins: [jumpMateriel, searData],
  inject: ['reload'],
  data() {
    return {
      ftype: 0,
      fbillNo: 'fnumber', // 编码
      clientVisiblit: false, // 客户弹窗
      disabled: false, // 税率是否禁用
      isMaterielDialog: false, // 物料弹窗
      materialId: '', // 物料ID
      // 物料弹窗分页
      materielPagination: {
        total: 0, // 总条目
        pageNum: 1, // 当前页
        pageSize: 10 // 每页显示多少条数据
      },
      FNUMBER: '', // 弹窗编码
      FDESCRIPTION: '', // 弹窗描述
      FSPECIFICATION: '', // 弹窗规格型号
      materielDialogData: [],
      materielDialogHeader: [ // 物料表头
        { label: '物料编码', prop: 'fnumber', align: 'center' },
        { label: '物料规格', prop: 'fspecificaTion', align: 'center' },
        { label: '型号', prop: 'fmodel', align: 'center' },
        { label: '描述', prop: 'fdescripTion', align: 'center', minWidth: '150px' },
        { label: '创建时间', prop: 'fcreateDate', align: 'center' }
      ],
      // 点击行的序号
      tableIndex: 0,
      tableHeader: [],
      teamList: [], // 组织
      prodValue: {
        fcreateOrgId: 1, // 销售组织
        fname: '', // 价目表名称
        fcurrencyId: '', // 币别ID
        fdescripTion: '', // 备注
        fisIncludedTax: false, // 含税
        fcurrencyIdName: '', // 币别名称
        limitName: '客户', // 限定客户
        fcust: '', // 选择客户
        fcustId: '', // 客户ID
        priceDetails: [{
          fmaterialId: '', // 物料编码ID
          fmaterialIdName: '', // 物料编码
          funitName: '', // 单位
          fpriceBase: 10, // 销售系数
          deliveryPrice: '', // 出厂价
          fdownPrice: '' // 销售基准价
        }]
      },
      cellStyle: { padding: '10 10' },
      prodValueRules: { // 是否填写验证
        fname: [
          { required: true, message: '请输入价目表名称', trigger: 'blue' }
        ], fcreateOrgId: [
          { required: true, message: '请选择销售组织', trigger: 'change' }
        ], fcurrencyId: [
          { required: true, message: '请选择币别', trigger: 'change' }
        ], fdescripTion: [
          { required: true, message: '请输入备注', trigger: 'blue' }
        ], fcustId: [
          { required: true, message: '请选择客户', trigger: 'change' }
        ]
      },
      // 结算币别
      currencyVisiblit: false,
      loading: false,
      otherUrlObject: {}, // 其它审核人
      otherLogTableData: [], // 日志数据
      pageNum: 1,
      size: 10,
      total: 0
    }
  },
  created() {
    this.handleGetPurchase()
  },
  methods: {
    // 保存
    subMarker() {
      this.loading = true
      this.$refs.purchaseRef.validate(valid => {
        if (!valid) {
          this.loading = false
          return false
        }
        for (const item of this.prodValue.priceDetails) {
          if (item.fmaterialId === '' || item.fdownPrice === '' || item.fpriceBase === '') {
            this.$message.error('表格不能为空或删除空行')
            this.loading = false
            return false
          }
        }
        const DATA = this.prodValue
        insertSalPrice(DATA).then(res => {
          this.loading = false
          if (res.code === 0) {
            this.$message({
              type: 'success',
              message: '新增成功'
            })
            setTimeout(() => {
              this.reload()
            }, 2000)
          }
        }).catch(error => {
          this.loading = false
          this.$message.error(error)
        })
      })
    },
    // 物料弹窗选中
    async materielSelectRow(item) {
      this.materialId = item.fmaterialId
      this.isMaterielDialog = false
      this.querySalPriceMaterial()
    },
    // 打开物料编码
    async handleGetMateriel(row, index) {
      if (index || index === 0) {
        this.tableIndex = index
      }
      if (index === this.prodValue.priceDetails.length - 1) {
        this.prodValue.priceDetails.push(
          { fpriceBase: 10, fdownPrice: 0 }
        )
      }
      const DATA = {
        pageNum: this.materielPagination.pageNum,
        pageSize: this.materielPagination.pageSize,
        ...this.searCollData
      }
      const { data: RES } = await queryMaterialList(DATA)
      this.materielDialogData = RES.array
      this.materielPagination.total = RES.total
      this.isMaterielDialog = true
    },
    // 物料搜索
    handleMaterielSearch() {
      this.materielPagination.pageNum = 1
      this.handleGetMateriel()
    },
    // 获取出厂价及物料信息
    async querySalPriceMaterial() {
      const DATA = { fmaterialId: this.materialId }
      const { data: RES } = await querySalPriceMaterial(DATA)
      // 销售系数
      const fpriceBase = (this.prodValue.priceDetails[this.tableIndex].fpriceBase) / 100
      this.prodValue.priceDetails[this.tableIndex].fmaterialId = RES.fmaterialId
      this.prodValue.priceDetails[this.tableIndex].fmaterialIdName = RES.fnumber
      this.prodValue.priceDetails[this.tableIndex].fdescripTion = RES.fdescripTion
      this.prodValue.priceDetails[this.tableIndex].funitId = RES.funitId
      this.prodValue.priceDetails[this.tableIndex].funitName = RES.funitName
      this.prodValue.priceDetails[this.tableIndex].deliveryPrice = RES.deliveryPrice
      // 基准价
      this.prodValue.priceDetails[this.tableIndex].fdownPrice = (RES.deliveryPrice * (1 + fpriceBase)).toFixed(4)
    },
    // 监听销售系数
    inputNum(index) {
      this.tableIndex = index
      if (this.prodValue.priceDetails[this.tableIndex].fmaterialId) {
        const fBase = (this.prodValue.priceDetails[this.tableIndex].fpriceBase) / 100 // 系数
        const fPrice = this.prodValue.priceDetails[this.tableIndex].deliveryPrice // 出厂价
        this.prodValue.priceDetails[this.tableIndex].fdownPrice = (fPrice * (1 + fBase)).toFixed(4) // 基准价
      }
    },

    // 获取客户数据(子传父)
    clientData(item) {
      if (item.fcustId) {
        this.prodValue.fcustId = item.fcustId
        this.prodValue.fcust = item.fname
        this.clientVisiblit = item.isclientlDialog
      } else {
        this.clientVisiblit = item.isclientlDialog
      }
    },
    // 获取组织
    async handleGetPurchase() {
      const { data: RES } = await queryTOrgOrganizationsL()
      this.teamList = RES
    },
    // 选择币别
    currencyData(item) {
      if (item.fsettleCurrId) {
        this.prodValue.fcurrencyIdName = item.fsettleCurrIdName
        this.prodValue.fcurrencyId = item.fsettleCurrId
        this.currencyVisiblit = item.isCurrencyDialog
      } else {
        // 点击关闭按钮
        this.currencyVisiblit = item.isCurrencyDialog
      }
    },
    // 删除明细空行
    delectSale(index) {
      if (index === 0) {
        this.$message.error('不能删除首行数据')
        return false
      }
      this.prodValue.priceDetails.splice(index, 1)
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
<style scoped lang="scss">
.content {
  @include listBom;
  .el-tabs{
    height: calc( 100vh - 230px );
  }
  .el-form {
    display: flex;
    flex-wrap: wrap;

    .el-form-item {
      max-width: 263px;
    }
  }
}

.el-input__icon {
  cursor: pointer;
}
.materiel-form{
  position:relative;
  width: 100%;
  .btn{
    transform: translateY(18%);
    margin-left: 410px!important;
    z-index: 999;
  }
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
    color: #606266;
    line-height: 40px;
    min-width: 65px;
  }

  .input-width {
    width: 200px;
    margin-right: 10px;
  }
}
</style>
