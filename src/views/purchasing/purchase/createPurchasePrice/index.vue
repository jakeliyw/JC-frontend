<template>
  <div class="content">
    <jc-title />
    <el-tabs v-model="activeName" type="border-card">
      <el-tab-pane label="价目" name="purchase" class="layout">
        <div class="header">
          <el-button size="mini" @click="refresh">刷新</el-button>
          <el-button size="mini" type="primary" @click="preservation">提交</el-button>
        </div>
        <el-form ref="purchaseRef" :model="purchaseForm" label-width="100px" size="mini" :rules="purchaseRules">
          <el-row :gutter="30" type="flex" justify="start" class="elRow">
            <el-col :span="6">
              <el-form-item label="创建组织" prop="fcreateOrgId">
                <el-select v-model="purchaseForm.fcreateOrgId" placeholder="请选择组织" class="input-width">
                  <el-option
                    v-for="option in purchaseForm.teamList"
                    :key="option.value"
                    :label="option.label"
                    :value="option.value"
                  />
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item label="供应商" prop="fsupplierName">
                <el-input v-model="purchaseForm.fsupplierName" class="input-width">
                  <i slot="suffix" class="el-input__icon el-icon-search" @click="handleSupplier" />
                </el-input>
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item label="币别" prop="fcurrencyFname">
                <el-input v-model="purchaseForm.fcurrencyFname" class="input-width">
                  <i slot="suffix" class="el-input__icon el-icon-search" @click="handleGetCurrency" />
                </el-input>
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item label="供应商税率" prop="fpaezBaseName">
                <el-input v-model="purchaseForm.fpaezBaseName" class="input-width">
                  <i slot="suffix" class="el-input__icon el-icon-search" @click="handleSupplierTaxRate" />
                </el-input>
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item label="单据编号" prop="code">
                <el-input v-model="purchaseForm.code" class="input-width" placeholder="保存时自动生成" disabled />
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item label="名称" prop="fname">
                <el-input v-model="purchaseForm.fname" class="input-width" />
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item label="价目表对象" prop="fpriceObject">
                <el-select v-model="purchaseForm.fpriceObject" placeholder="请选择价目表" class="input-width">
                  <el-option
                    v-for="option in purchaseForm.priceList"
                    :key="option.value"
                    :label="option.label"
                    :value="option.value"
                  />
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item label="价格类型" prop="fpriceType">
                <el-select v-model="purchaseForm.fpriceType" placeholder="请选择价格类型" class="input-width">
                  <el-option
                    v-for="option in purchaseForm.priceTypeList"
                    :key="option.value"
                    :label="option.label"
                    :value="option.value"
                  />
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item label="含税" prop="fisIncludedTax">
                <el-checkbox v-model="purchaseForm.fisIncludedTax" @change="handleTax" />
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item label="描述" prop="fdescripTion">
                <el-input v-model="purchaseForm.fdescripTion" type="textarea" />
              </el-form-item>
            </el-col>
          </el-row>
        </el-form>
        <jc-table
          :table-data="tableData"
          :table-header="tableHeader"
          :cell-style="cellStyle"
          class="jcTable"
          table-height="auto"
        >
          <el-table-column label="物料编码" prop="fmaterialId" align="center" width="200px">
            <template slot-scope="scope">
              <el-input v-model="scope.row.fmaterialId" placeholder="请选择物料编码" size="mini">
                <i slot="prefix" class="iconfont icon-jin-rud-ao-bo" @click="sonJumpMateriel(scope.row.fmaterialId)" />
                <i
                  slot="suffix"
                  class="el-input__icon el-icon-search"
                  @click="handleGetMateriel(scope.row, scope.$index)"
                />
              </el-input>
            </template>
          </el-table-column>
          <el-table-column label="物料描述" prop="fdescripTion" align="center" min-width="200px" :show-overflow-tooltip="true" />
          <el-table-column label="规格型号" prop="fmodel" align="center" />
          <el-table-column label="尺寸单位" prop="fvolumeUnit" align="center" />
          <el-table-column label="计价单位" prop="FBASEUNIT" align="center" />
          <el-table-column label="单价" prop="fprice" align="center" min-width="150px">
            <template slot-scope="scope">
              <el-input-number
                v-model="scope.row.fprice"
                size="mini"
                :disabled="fpriceDisabled"
                :precision="4"
                :step="0.0001"
                :min="0.0000"
                @change="handleUnitPrice(scope.row)"
              />
            </template>
          </el-table-column>
          <el-table-column label="含税单价" prop="ftaxPrice" align="center" min-width="150px">
            <template slot-scope="scope">
              <el-input-number
                v-model.number="scope.row.ftaxPrice"
                size="mini"
                :disabled="ftaxPriceDisabled"
                :precision="4"
                :step="0.0001"
                :min="0.0000"
                @change="handleTaxIncluded(scope.row)"
              />
            </template>
          </el-table-column>
          <el-table-column label="最小起订量" prop="fminNum" align="center" min-width="150px">
            <template slot-scope="scope">
              <el-input-number v-model.number="scope.row.fminNum" size="mini" :precision="4" :step="0.0001" :min="0.0000" />
            </template>
          </el-table-column>
          <el-table-column label="生效时间" prop="feffectiveDate" width="200px" align="center" min-width="150px">
            <template slot-scope="scope">
              <el-date-picker
                v-model="scope.row.feffectiveDate"
                size="mini"
                type="date"
                style="width: 150px"
                value-format="yyyy-MM-dd"
                placeholder="选择日期"
              />
            </template>
          </el-table-column>
          <el-table-column label="税率" prop="ftaxRate" align="center" min-width="150px">
            <template slot-scope="scope">
              <el-input-number
                v-model.number="scope.row.ftaxRate"
                size="mini"
                :precision="4"
                :step="0.0001"
                :min="0.0000"
                @change="handleTaxRate(scope.row)"
              />
            </template>
          </el-table-column>
          <template v-slot:btnSlot="clo">
            <el-button type="danger" size="mini" @click="handleDelete(clo.scope.row, clo.scope.$index)">删除价目
            </el-button>
          </template>
        </jc-table>
      </el-tab-pane>
    </el-tabs>
    <!--    币别弹窗-->
    <jc-popup
      v-model="fname"
      :dialog-title="dialogTitle"
      :open-dialog="openCurrency"
      :popup-title="popupTitle"
      @closeDialog="closeDialog"
      @emptyForm="emptyForm"
      @handleSearch="searchCurrency"
    >
      <template v-slot:content>
        <jc-table
          v-show="dialogTitle === '币别列表'"
          :table-data="currencyData"
          :table-header="currencyHeader"
          :cell-style="cellStyle"
          @clickRow="currencySelectRow"
        />
      </template>
      <template v-slot:pagination>
        <jc-pagination
          v-if="dialogTitle === '币别列表'"
          v-show="currencyPagination.total > 0"
          :total="currencyPagination.total"
          :page.sync="currencyPagination.pageNum"
          :limit.sync="currencyPagination.pageSize"
          @pagination="handleGetCurrency"
        />
      </template>
    </jc-popup>
    <!--    供应商税率-->
    <jc-popup
      v-model="taxRateName"
      :dialog-title="dialogTitle"
      :popup-title="popupTitle"
      :open-dialog="openTaxRate"
      @closeDialog="closeDialog"
      @emptyForm="emptyForm"
      @handleSearch="searchTaxRate"
    >
      <template v-slot:content>
        <jc-table
          v-show="dialogTitle === '税率列表'"
          :table-data="taxRateTableData"
          :table-header="taxRateHeader"
          :cell-style="cellStyle"
          @clickRow="taxRateSelectRow"
        />
      </template>
      <template v-slot:pagination>
        <jc-pagination
          v-if="dialogTitle === '税率列表'"
          v-show="taxRatePagination.total > 0"
          :total="taxRatePagination.total"
          :page.sync="taxRatePagination.pageNum"
          :limit.sync="taxRatePagination.pageSize"
          @pagination="handleSupplierTaxRate"
        />
      </template>
    </jc-popup>
    <!--    供应商-->
    <jc-popup
      v-model="supplierName"
      :dialog-title="dialogTitle"
      :popup-title="popupTitle"
      :open-dialog="openSupplier"
      @closeDialog="closeDialog"
      @emptyForm="emptyForm"
      @handleSearch="searchSupplier"
    >
      <template v-slot:content>
        <jc-table
          v-show="dialogTitle === '供应商列表'"
          :table-data="supplierData"
          :table-header="supplierHeader"
          :cell-style="cellStyle"
          @clickRow="supplierSelectRow"
        />
      </template>
      <template v-slot:pagination>
        <jc-pagination
          v-if="dialogTitle === '供应商列表'"
          v-show="supplierPagination.total > 0"
          :total="supplierPagination.total"
          :page.sync="supplierPagination.pageNum"
          :limit.sync="supplierPagination.pageSize"
          @pagination="handleSupplier"
        />
      </template>
    </jc-popup>
    <!--    物料弹窗-->
    <el-dialog
      class="dialogClass"
      title="物料列表"
      model
      :visible.sync="openMaterialDialog"
      :close-on-click-modal="false"
      width="60%"
      :before-close.sync="closeDialog"
      @close="closeDialogForm"
    >
      <div class="materiel-form">
        <search :options="selectData" :msg="fbillNo" @seek="collect" @hand="getGetMateriel" />
        <el-button size="mini" type="primary" class="btn" @click="getGetMateriel">搜索</el-button>
      </div>
      <jc-table
        :table-data="materielDialogData"
        :table-header="materielDialogHeader"
        :cell-style="cellStyle"
        table-height="calc(100vh - 500px)"
        @clickRow="materielSelectRow"
      />
      <jc-pagination
        v-show="materielPagination.total > 0"
        :total="materielPagination.total"
        :page.sync="materielPagination.pageNum"
        :limit.sync="materielPagination.pageSize"
        @pagination="getGetMateriel"
      />
    </el-dialog>
  </div>
</template>

<script>
import {
  queryBomSonList, queryMaterialSon,
  queryTOrgOrganizationsL
} from '@/api/engineering/createBom'
import {
  queryFpriceobject,
  queryFpricetype,
  queryTBdCurrency,
  queryTBdSupplier,
  queryTBdTaxrate,
  insertPurPrice
} from '@/api/purchaseManagement/createPurchasePrice'
import jumpMateriel from '@/components/JumpMateriel'
import jcTable from '@/components/Table'
import jcTitle from '@/components/Title'
import jcPopup from '@/views/basic/createMateriel/components/Popup'
import jcPagination from '@/components/Pagination/index'
import search from '@/components/Search'
import searData from '@/components/Search/mixin'

export default {
  name: 'CreatePurchasePrice',
  components: {
    jcTable,
    jcPopup,
    jcPagination,
    jcTitle,
    search
  },
  mixins: [jumpMateriel, searData],
  inject: ['reload'],
  data() {
    return {
      ftype: 0,
      fbillNo: 'fnumber', // 编码
      activeName: 'purchase', // 默认在价目
      tableData: [
        {
          fmaterialId: '', // 物料编码
          fprice: 0, // 单价
          ftaxPrice: 0, // 含税单价
          fminNum: 1, // 最小起订量
          fupPrice: 0, // 价格上限
          fdownPrice: 0, // 价格下限
          feffectiveDate: '', // 生效时间
          ftaxRate: 0, // 税率
          fdescripTion: '', // 描述
          FMATERIALID: '' // 传递给后端的id
        }
      ], // 价目价目表
      tableHeader: [
        { label: '价格上限', prop: 'fupPrice', align: 'center' },
        { label: '价格下限', prop: 'fdownPrice', align: 'center' },
        { label: '操作', type: 'btn', fixed: 'right', minWidth: '100px', align: 'center' }
      ],
      materielDialogData: [],
      materielDialogHeader: [
        { label: '使用组织', prop: 'FUSEORG', align: 'center' },
        { label: '物料编码', prop: 'FNUMBER', align: 'center' },
        { label: '物料规格', prop: 'FSPECIFICATION', align: 'center' },
        { label: '型号', prop: 'FMODEL', align: 'center' },
        { label: '描述', prop: 'FDESCRIPTION', align: 'center', minWidth: '150px' },
        { label: '创建时间', prop: 'FCREATEDATE', align: 'center' }
      ],
      // 币别数据列表
      currencyData: [],
      // 币别表头
      currencyHeader: [
        { label: '编码', prop: 'fsysmbol', align: 'center' },
        { label: '名称', prop: 'fname', align: 'center' },
        { label: '审核状态', prop: 'fdocumentStatus', align: 'center' },
        { label: '禁用状态', prop: 'fforbidStatus', align: 'center' }
      ],
      // 供应商列表
      supplierData: [],
      // 供应商表头
      supplierHeader: [
        { label: '编码', prop: 'fnumber', align: 'center' },
        { label: '使用组织', prop: 'fuseorg', align: 'center' },
        { label: '供应商', prop: 'fname', align: 'center' },
        { label: '供应商组', prop: 'fprimaryGroup', align: 'center' }
      ],
      // 供应商税率
      taxRateTableData: [],
      // 供应商税率表头
      taxRateHeader: [
        { label: '编码', prop: 'fnumber', align: 'center' },
        { label: '名称', prop: 'fname', align: 'center' },
        { label: '税率', prop: 'ftaxRate', align: 'center' },
        { label: '税收制度', prop: 'taxsystem', align: 'center' },
        { label: '税种', prop: 'taxType', align: 'center' }
      ],
      // 税率分页
      taxRatePagination: {
        total: 0, // 总条目
        pageNum: 1, // 当前页
        pageSize: 10 // 每页显示多少条数据
      },
      // 供应商分页
      supplierPagination: {
        total: 0, // 总条目
        pageNum: 1, // 当前页
        pageSize: 10 // 每页显示多少条数据
      },
      // 币别分页
      currencyPagination: {
        total: 0, // 总条目
        pageNum: 1, // 当前页
        pageSize: 10 // 每页显示多少条数据
      },
      // 物料弹窗分页
      materielPagination: {
        total: 0, // 总条目
        pageNum: 1, // 当前页
        pageSize: 10 // 每页显示多少条数据
      },
      openTaxRate: false, // 税率弹窗
      openSupplier: false, // 供应商弹窗
      dialogTitle: '', // 弹窗标题
      openCurrency: false, // 币别、价目表、价格类型
      openMaterialDialog: false, // 物料弹窗
      FNUMBER: '', // 弹窗编码
      FDESCRIPTION: '', // 弹窗描述
      FSPECIFICATION: '', // 弹窗规格型号
      fname: '', // 弹窗搜索关键字
      taxRateName: '', // 税率弹窗关键字
      supplierName: '', // 供应商弹窗关键词
      popupTitle: '', // 查询条件文本
      cellStyle: { padding: '10 10' }, // 行高
      fpriceDisabled: true, // 单价禁用
      ftaxPriceDisabled: false, // 含税单价禁用
      // 点击行的序号
      tableIndex: 0,
      selectTaxRate: '', // 供应商选中税率
      // 价目表头
      purchaseForm: {
        teamList: [], // 组织
        fcreateOrgId: 1, // 组织值
        priceList: [], // 价目表对象
        fpriceObject: 'A', // 价目表值
        priceTypeList: [], // 价格类型
        fpriceType: '2', // 价格类型值
        fcurrencyId: '', // 币别id
        fpaezBase: '', // 供应商税率id
        fpaezBaseName: '', // 供应商税率
        fsupplierId: '', // 供应商
        fsupplierName: '', // 供应商名称
        fcurrencyFname: '', // 币别名称
        code: '', // 编码
        fname: '', // 名称
        fisIncludedTax: true, // 含税
        fdescripTion: '' // 描述
      },
      purchaseRules: {
        fpriceObject: [
          { required: true, message: '请至少选择一个价目表对象', trigger: 'change' }
        ],
        fpriceType: [
          { required: true, message: '请至少选择一个价格类型', trigger: 'change' }
        ],
        fcurrencyFname: [
          { required: true, message: '请输入币别', trigger: 'blur' }
        ],
        fpaezBaseName: [
          { required: true, message: '请输入供应商税率', trigger: 'blur' }
        ],
        fsupplierName: [
          { required: true, message: '请输入供应商', trigger: 'blur' }
        ],
        fname: [
          { required: true, message: '请输入名称', trigger: 'blur' }
        ]
      }
    }
  },
  computed: {
    ftaxRate() {
      const RES = this.tableData.find(item => item.ftaxRate)
      return RES
    }
  },
  watch: {
    ftaxRate(newVal) {
      if (!this.fpriceDisabled) {
        // 含税单价
        newVal.ftaxPrice = newVal.fprice * (1 + newVal.ftaxRate / 100)
        // 价格上限
        newVal.fupPrice = newVal.ftaxPrice
        // 价格下限
        newVal.fdownPrice = newVal.ftaxPrice
        newVal.fupPrice = newVal.fupPrice.toFixed(4)
        newVal.fdownPrice = newVal.fdownPrice.toFixed(4)
      } else {
        // 单价
        newVal.fprice = newVal.ftaxPrice / (1 + newVal.ftaxRate / 100)
        // 价格上限
        newVal.fupPrice = newVal.fprice
        // 价格下限
        newVal.fdownPrice = newVal.fprice
        newVal.fupPrice = newVal.fupPrice.toFixed(4)
        newVal.fdownPrice = newVal.fdownPrice.toFixed(4)
      }
    }
  },
  mounted() {
    this.handleGetPurchase()
    this.handleGetPriceList()
    this.handleGetPriceType()
  },
  updated() {
    this.getDataTime()
  },
  methods: {
    // 保存价目列表
    preservation() {
      this.$refs.purchaseRef.validate(valid => {
        if (!valid) return
        for (const ITEM of this.tableData) {
          if (ITEM.fmaterialId === '' ||
            ITEM.fprice === 0 || ITEM.ftaxPrice === 0 || ITEM.fminNum === 0 || ITEM.feffectiveDate == null) {
            this.$message.warning('表格不能为空,或表格值不能为0')
            return
          }
        }
        const DETAILS = this.tableData.map(item => {
          return {
            fmaterialId: item.FMATERIALID,
            fprice: item.fprice,
            ftaxPrice: item.ftaxPrice,
            fminNum: item.fminNum,
            fupPrice: item.fupPrice,
            fdownPrice: item.fdownPrice,
            fentryEffectiveDate: item.feffectiveDate,
            ftaxRate: item.ftaxRate,
            fdescripTion: item.fdescripTion
          }
        })
        const DATA = {
          fcreateOrgId: this.purchaseForm.fcreateOrgId,
          fname: this.purchaseForm.fname,
          fpriceObject: this.purchaseForm.fpriceObject,
          fpriceType: this.purchaseForm.fpriceType,
          fcurrencyId: this.purchaseForm.fcurrencyId,
          fdescripTion: this.purchaseForm.fdescripTion,
          fsupplierId: this.purchaseForm.fsupplierId,
          fisIncludedTax: this.purchaseForm.fisIncludedTax,
          fpaezBase: this.purchaseForm.fpaezBase,
          details: DETAILS
        }
        insertPurPrice(DATA).then(res => {
          if (res.code !== 0) {
            this.$message.error(res.message)
            return
          }
          this.purchaseForm.code = res.data
          this.$message.success(res.message)
          this.reload()
        }).catch(error => {
          this.$message.error(error)
        })
      })
    },
    // 获取币别
    async handleGetCurrency() {
      this.openCurrency = true
      const { data: RES } = await queryTBdCurrency({ ...this.currencyPagination, fname: this.fname })
      this.currencyData = RES.array
      this.popupTitle = RES.search
      this.dialogTitle = '币别列表'
      this.currencyPagination.total = RES.total
    },
    // 币别选中
    currencySelectRow(item) {
      this.purchaseForm.fcurrencyId = item.fcurrencyId
      this.purchaseForm.fcurrencyFname = item.fname
      this.openCurrency = false
    },
    // 供应商选中
    supplierSelectRow(item) {
      this.purchaseForm.fsupplierId = item.fsupplierId
      this.purchaseForm.fsupplierName = item.fname
      this.openSupplier = false
    },
    // 供应商税率选中
    taxRateSelectRow(item) {
      this.tableData.forEach(list => {
        list.ftaxRate = item.ftaxRate
      })
      this.selectTaxRate = item.ftaxRate
      this.purchaseForm.fpaezBase = item.ftaxrateId
      this.purchaseForm.fpaezBaseName = item.fname
      this.openTaxRate = false
    },
    // 物料弹窗选中
    async materielSelectRow(item) {
      const { data: RES } = await queryMaterialSon({ fmateriAalId: item.FMATERIALID })
      this.tableData[this.tableIndex].fmaterialId = RES.FNUMBER
      this.tableData[this.tableIndex].fvolumeUnit = RES.FVOLUMEUNIT
      this.tableData[this.tableIndex].FMATERIALID = RES.FMATERIALID
      this.tableData[this.tableIndex].fmodel = RES.FSPECIFICATION
      this.tableData[this.tableIndex].FBASEUNIT = RES.FBASEUNIT
      this.tableData[this.tableIndex].fdescripTion = RES.FDESCRIPTION
      this.openMaterialDialog = false
    },
    // 币别弹窗搜索
    searchCurrency() {
      this.currencyPagination.pageNum = 1
      this.handleGetCurrency()
    },
    // 税率弹窗搜索
    searchTaxRate() {
      this.taxRatePagination.pageNum = 1
      this.handleSupplierTaxRate()
    },
    // 供应商弹窗搜索
    searchSupplier() {
      this.supplierPagination.pageNum = 1
      this.handleSupplier()
    },
    // 获取供应商
    async handleSupplier() {
      this.openSupplier = true
      const { data: RES } = await queryTBdSupplier({ ...this.supplierPagination, fname: this.supplierName })
      this.supplierData = RES.array
      this.popupTitle = RES.search
      this.dialogTitle = '供应商列表'
      this.supplierPagination.total = RES.total
    },
    // 获取供应商税率
    async handleSupplierTaxRate() {
      this.openTaxRate = true
      const { data: RES } = await queryTBdTaxrate({ ...this.taxRatePagination, fname: this.taxRateName })
      this.taxRateTableData = RES.array
      this.popupTitle = RES.search
      this.dialogTitle = '税率列表'
      this.taxRatePagination.total = RES.total
    },
    // 获取组织
    async handleGetPurchase() {
      const { data: RES } = await queryTOrgOrganizationsL()
      this.purchaseForm.teamList = RES.map(item => {
        return { label: item.fname, value: item.fpkId }
      })
    },
    // 获取价目表
    async handleGetPriceList() {
      const { data: RES } = await queryFpriceobject()
      this.purchaseForm.priceList = RES.map(item => {
        return { label: item.fcapTion, value: item.fpriceObject }
      })
    },
    // 获取价格类型
    async handleGetPriceType() {
      const { data: RES } = await queryFpricetype()
      this.purchaseForm.priceTypeList = RES.map(item => {
        return { label: item.fcapTion, value: item.fpriceType }
      })
    },
    // 获取物料编码
    async getGetMateriel() {
      const DATA = {
        ...this.materielPagination,
        ...this.searCollData
      }
      const { data: RES, total } = await queryBomSonList(DATA)
      this.materielDialogData = RES
      this.materielPagination.total = total
    },
    // 打开物料编码
    handleGetMateriel(row, index) {
      this.tableIndex = index
      if (index === this.tableData.length - 1) {
        this.tableData.push(
          {
            fmaterialId: '', // 物料编码
            fprice: 0, // 单价
            ftaxPrice: 0, // 含税单价
            fminNum: 1, // 最小起订量
            fupPrice: 0, // 价格上限
            fdownPrice: 0, // 价格下限
            feffectiveDate: '', // 生效时间
            ftaxRate: this.selectTaxRate, // 税率
            fdescripTion: '' // 描述
          }
        )
      }
      this.getGetMateriel()
      this.openMaterialDialog = true
    },
    // 搜索
    handleMaterielSearch() {
      this.materielPagination.pageNum = 1
      this.handleGetMateriel()
    },
    // 关闭弹窗事件
    closeDialog() {
      this.currencyPagination.pageNum = 1
      this.supplierPagination.pageNum = 1
      this.taxRatePagination.pageNum = 1
      this.materielPagination.pageNum = 1
      this.openMaterialDialog = false
      this.openCurrency = false
      this.openTaxRate = false
      this.openSupplier = false
    },
    // 含税选中
    handleTax(row) {
      if (this.purchaseForm.fisIncludedTax) {
        // 单价不可输
        this.fpriceDisabled = true
        this.ftaxPriceDisabled = false
        // 上限
        this.tableData[this.tableIndex].fupPrice = this.tableData[this.tableIndex].fprice
        // 下限
        this.tableData[this.tableIndex].fdownPrice = this.tableData[this.tableIndex].fprice
      } else {
        this.ftaxPriceDisabled = true
        this.fpriceDisabled = false
        // 上限
        this.tableData[this.tableIndex].fupPrice = this.tableData[this.tableIndex].ftaxPrice
        // 下限
        this.tableData[this.tableIndex].fdownPrice = this.tableData[this.tableIndex].ftaxPrice
      }
    },
    // 单价
    handleUnitPrice(row) {
      // 含税单价
      row.ftaxPrice = row.fprice * (1 + row.ftaxPrice / 100)
      // // 上限
      row.fupPrice = row.fprice
      // // 下限
      row.fdownPrice = row.fprice
    },
    // 含税单价
    handleTaxIncluded(row) {
      // 单价
      row.fprice = row.ftaxPrice / (1 + row.ftaxRate / 100)
      // 上限
      row.fupPrice = row.ftaxPrice
      // 下限
      row.fdownPrice = row.ftaxPrice
    },
    // 税率影响
    handleTaxRate(row) {
      if (!this.fpriceDisabled) {
        // 含税单价
        row.ftaxPrice = row.fprice * (1 + row.ftaxRate / 100)
        // 价格上限
        row.fupPrice = row.ftaxPrice
        // 价格下限
        row.fdownPrice = row.ftaxPrice
        row.fupPrice = row.fupPrice.toFixed(4)
        row.fdownPrice = row.fdownPrice.toFixed(4)
      } else {
        // 单价
        row.fprice = row.ftaxPrice / (1 + row.ftaxRate / 100)
        // 价格上限
        row.fupPrice = row.fprice
        // 价格下限
        row.fdownPrice = row.fprice
        row.fupPrice = row.fupPrice.toFixed(4)
        row.fdownPrice = row.fdownPrice.toFixed(4)
      }
    },
    // 清空弹窗表单
    emptyForm() {
      this.fname = ''
      this.taxRateName = ''
      this.supplierName = ''
    },
    // 关闭物料弹窗
    closeDialogForm() {
      this.FNUMBER = ''
      this.FDESCRIPTION = ''
      this.FSPECIFICATION = ''
    },
    // 刷新
    refresh() {
      location.reload()
    },
    // 删除行数据
    handleDelete(item, index) {
      if (index === 0) {
        this.$message.warning('不能删除首行数据')
        return
      }
      this.tableData.splice(index, 1)
      this.$message.success('删除行成功')
    },
    // 默认显示当前时间
    getDataTime() {
      this.tableData.forEach(item => {
        item.feffectiveDate = new Date()
      })
    }
  }
}
</script>

<style scoped lang="scss">
.content {
  padding: 20px;
  display: flex;
  flex-direction: column;

  .layout {
    display: flex;
    flex-direction: column;

    .header {
      margin-bottom: 20px;
    }

    .elRow {
      display: flex;
      flex-wrap: wrap;

      .input-width {
        width: 10vw;
      }
    }
    .materiel-form {
      display: flex;
      flex-direction: row;
      position:relative;
      .btn{
        transform: translateY(18%);
        margin-left: 410px!important;
        z-index: 999;
      }
    }
  }
}

.el-input__icon {
  cursor: pointer;
}

.icon-jin-rud-ao-bo{
  cursor: pointer;
  &:hover{
    color: #409eff;
  }
}
.materiel-form {
  display: flex;
  align-items: center;
  flex-direction: row;
  margin-bottom: 20px;
  position:relative;

  .btn{
    transform: translateY(18%);
    margin-left: 410px!important;
    z-index: 999;
  }

  .materiel-code {
    font-weight: bold;
    font-size: 14px;
    color: #606266;
    line-height: 40px;
    padding: 0 12px 0 0;
  }

  .input-width {
    width: 10vw;
    margin-right: 10px;
  }
}
.dialogClass ::v-deep .el-dialog__body {
  padding: 0 20px;
}
.layout ::v-deep .jcTable{
  min-height: calc(100vh - 450px);
}
.el-table ::v-deep .el-table__body-wrapper{
  height: 450px;
}
</style>
