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
                @click="queryTBdCurrency()"
              />
            </el-input>
          </el-form-item>
          <el-form-item label="备注" prop="fdescription">
            <el-input v-model.trim="prodValue.fdescription" type="textarea" placeholder="请填写备注" size="mini" />
          </el-form-item>
          <el-form-item label="是否含税">
            <el-checkbox v-model="prodValue.fisIncludedTax" />
          </el-form-item>
        </el-form>
        <jc-table
          :table-data="prodValue.priceDetails"
          :table-header="tableHeader"
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
          <el-table-column label="单位" prop="funitName" align="center" />
          <el-table-column label="销售系数(%)" prop="fpriceBase" min-width="140px" align="center">
            <template slot-scope="scope">
              <el-input-number
                v-model="scope.row.fpriceBase"
                :min="1"
                size="mini"
                disabled
                @change="inputNum(scope.$index)"
              />
            </template>
          </el-table-column>
          <el-table-column label="销售单价" prop="fprice" min-width="140px" align="center">
            <template slot-scope="scope">
              <el-input-number
                v-model="scope.row.fprice"
                :min="1"
                size="mini"
              />
            </template>
          </el-table-column>
          <el-table-column label="销售基准价" prop="fdownPrice" min-width="140px" align="center">
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
              <el-button type="danger" size="medium" @click="delectSale(scope.$index)">删除</el-button>
            </template>
          </el-table-column>
        </jc-table>
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
    <!--    币别列表弹窗-->
    <el-dialog
      title="币别"
      model
      :visible.sync="isCurrencyDialog"
      :close-on-click-modal="false"
      width="60%"
    >
      <div class="materiel-form">
        <span class="materiel-code">币别名称</span>
        <el-input
          v-model.trim="currency.fname"
          class="input-width"
          size="mini"
          placeholder="请输入币别名称"
          @keyup.enter.native="currencySearch"
        />
        <el-button size="mini" type="primary" @click="currencySearch">搜索</el-button>
      </div>
      <jc-table
        :table-data="currencyDialogData"
        :table-header="currencyDialogHeader"
        table-height="52vh"
        serial
        :cell-style="cellStyle"
        @clickRow="currencySelectRow"
      >
        <el-table-column label="编码" prop="fnumber" align="center" />
        <el-table-column label="名称" prop="fname" align="center" />
        <el-table-column label="货币代码" prop="fcode" align="center" />
        <el-table-column label="审核状态" align="center">
          <template slot-scope="scope">
            <span v-if="scope.row.fdocumentStatus=='C'">已审核</span>
            <span v-else>否</span>
          </template>
        </el-table-column>
        <el-table-column label="禁用状态" align="center">
          <template slot-scope="scope">
            <span v-if="scope.row.fforbidStatus=='C'">已审核</span>
            <span v-else>否</span>
          </template>
        </el-table-column>
      </jc-table>
      <jc-pagination
        v-show="currency.total > 0"
        :total="currency.total"
        :page.sync="currency.pageNum"
        :limit.sync="currency.pageSize"
        @pagination="queryTBdCurrency"
      />
    </el-dialog>
    <!--    物料弹窗-->
    <el-dialog
      title="物料列表"
      model
      :visible.sync="isMaterielDialog"
      :close-on-click-modal="false"
      width="60%"
    >
      <div class="materiel-form">
        <span class="materiel-code">物料编码</span>
        <el-input
          v-model.trim="FNUMBER"
          class="input-width"
          size="mini"
          placeholder="请输入物料编码"
          @keyup.enter.native="handleMaterielSearch"
        />
        <span class="materiel-code">物料描述</span>
        <el-input
          v-model.trim="FDESCRIPTION"
          class="input-width"
          size="mini"
          placeholder="请输入物料描述"
          @keyup.enter.native="handleMaterielSearch"
        />
        <span class="materiel-code">物料规格</span>
        <el-input
          v-model.trim="FSPECIFICATION"
          class="input-width"
          size="mini"
          placeholder="请输入规格"
          @keyup.enter.native="handleMaterielSearch"
        />
        <el-button size="mini" type="primary" @click="handleMaterielSearch">搜索</el-button>
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
    <!--客户列表-->
    <client v-if="clientVisiblit" @client="clientData" />
  </div>
</template>
<script>
import {
  queryTOrgOrganizationsL
} from '@/api/engineering/createBom'
import {
  queryTBdCurrency,
  insertSalPrice,
  querySalPriceMaterial
} from '@/api/marketManage/marketPriceList'
import jcTable from '@/components/Table'
import jcPagination from '@/components/Pagination'
import jumpMateriel from '@/components/JumpMateriel'
import jcTitle from '@/components/Title'
import client from '@/views/market/marketManage/createMarkerOrder/components/client'
import {
  queryMaterialList,
  querySalOrderLog
} from '@/api/marketManage/marketOrder'
import jcMarker from '@/components/marker'
export default {
  name: 'CreateMarketPrice',
  components: {
    jcTable,
    jcPagination,
    jcTitle,
    jcMarker,
    client
  },
  mixins: [jumpMateriel],
  data() {
    return {
      clientVisiblit: false, // 客户弹窗
      disabled: false, // 税率是否禁用
      isMaterielDialog: false, // 物料弹窗
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
        fdescription: '', // 备注
        fisIncludedTax: false, // 含税
        fcurrencyIdName: '', // 币别名称
        limitName: '客户', // 限定客户
        fcust: '', // 选择客户
        priceDetails: [{
          fmaterialId: '', // 物料编码ID
          fmaterialIdName: '', // 物料编码
          funitId: '', // 单位ID
          funitName: '', // 单位
          fmaterialTypeId: '', // 存货类型ID
          fpriceBase: 40, // 销售系数
          fprice: '', // 销售单价
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
        ], fdescription: [
          { required: true, message: '请输入备注', trigger: 'blue' }
        ]
      },
      // 结算币别
      isCurrencyDialog: false,
      currency: {
        total: 0, // 总条目
        pageNum: 1, // 当前页
        pageSize: 10, // 每页显示多少条数据
        fname: ''
      },
      currencyDialogData: [],
      currencyDialogHeader: [],
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
          if (item.fmaterialId === '' || item.fprice === '' || item.fdownPrice === '' || item.fpriceBase === '') {
            this.$message.error('表格不能为空或删除空行')
            this.loading = false
            return false
          }
          if (item.fprice < item.fdownPrice) {
            this.$message.error('销售单价不能小于销售基准价')
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
              location.reload()
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
      this.prodValue.priceDetails[this.tableIndex].fmaterialId = item.fmaterialId
      this.prodValue.priceDetails[this.tableIndex].fmaterialIdName = item.fnumber
      this.prodValue.priceDetails[this.tableIndex].fdescripTion = item.fdescripTion
      this.prodValue.priceDetails[this.tableIndex].funitId = item.funitId
      this.prodValue.priceDetails[this.tableIndex].funitName = item.funitName
      this.prodValue.priceDetails[this.tableIndex].fmaterialTypeId = item.fcategoryId
      this.isMaterielDialog = false
      this.querySalPriceMaterial()
    },
    // 打开物料编码
    async handleGetMateriel(row, index) {
      if (index) {
        this.tableIndex = index
      }
      if (index === this.prodValue.priceDetails.length - 1) {
        this.prodValue.priceDetails.push(
          { fmaterialId: '', funitId: '', fmaterialTypeId: '', fpriceBase: '', fprice: '', fdownPrice: '' }
        )
      }
      const DATA = {
        pageNum: this.materielPagination.pageNum,
        pageSize: this.materielPagination.pageSize,
        fnumber: this.FNUMBER,
        fdescription: this.FDESCRIPTION,
        fspecification: this.FSPECIFICATION
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
    // 获取出厂价
    async querySalPriceMaterial() {
      const DATA = { fmaterialId: this.prodValue.priceDetails[this.tableIndex].fmaterialId }
      const { data: RES } = await querySalPriceMaterial(DATA)
      const fpriceBase = (this.prodValue.priceDetails[this.tableIndex].fpriceBase) / 100
      // 基准价
      this.prodValue.priceDetails[this.tableIndex].fdownPrice = (RES * (1 + fpriceBase)).toFixed(4)
    },
    // 监听销售系数
    inputNum(index) {
      this.tableIndex = index
      if (this.prodValue.priceDetails[this.tableIndex].fmaterialId) {
        this.querySalPriceMaterial()
      }
    },
    // 获取客户数据(子传父)
    clientData(item) {
      this.prodValue.fcustId = item.fcustId
      this.prodValue.fcust = item.fname
      this.clientVisiblit = item.isclientlDialog
    },
    // 获取组织
    async handleGetPurchase() {
      const { data: RES } = await queryTOrgOrganizationsL()
      this.teamList = RES
    },
    // 查询币别
    async queryTBdCurrency() {
      this.isCurrencyDialog = true
      const DATA = this.currency
      const { data: RES } = await queryTBdCurrency(DATA)
      this.currencyDialogData = RES.array
      this.currency.total = RES.total
    },
    currencySearch() {
      this.currency.pageNum = 1
      this.queryTBdCurrency()
    },
    // 选择结算货币
    currencySelectRow(item) {
      this.prodValue.fcurrencyIdName = item.fname
      this.prodValue.fcurrencyId = item.fcurrencyId
      this.isCurrencyDialog = false
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
