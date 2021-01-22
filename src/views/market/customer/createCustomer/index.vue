<template>
  <div class="content">
    <jc-title />
    <el-tabs v-model="activeName" type="border-card">
      <el-tab-pane label="客户" name="customer" class="layout">
        <div class="header">
          <el-button size="mini">刷新</el-button>
          <el-button size="mini" type="primary" @click="preservation">保存客户</el-button>
        </div>
        <el-form ref="customerRef" :model="customerForm" label-width="100px" size="mini" :rules="customerRules">
          <el-row :gutter="30" type="flex" justify="start" class="elRow">
            <el-col :span="6">
              <el-form-item label="使用组织" prop="fuseOrgId">
                <el-select v-model="customerForm.fuseOrgId" placeholder="请选择组织" class="input-width">
                  <el-option
                    v-for="option in customerForm.teamList"
                    :key="option.value"
                    :label="option.label"
                    :value="option.value"
                  />
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item label="客户名称" prop="customerName">
                <el-input v-model="customerForm.customerName" class="input-width" placeholder="请输入客户名称" />
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item label="国家" prop="country">
                <el-input v-model="customerForm.country" class="input-width" placeholder="请选择国家">
                  <i slot="suffix" class="el-input__icon el-icon-search" @click="handleCountry" />
                </el-input>
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item label="客户类别" prop="fcustTypeId">
                <el-select v-model="customerForm.fcustTypeId" placeholder="请选择客户类别" class="input-width">
                  <el-option
                    v-for="option in customerForm.customerType"
                    :key="option.value"
                    :label="option.label"
                    :value="option.value"
                  />
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item label="客户分组" prop="customerGrouping">
                <el-input v-model="customerForm.customerGrouping" class="input-width" placeholder="请选择客户分组">
                  <i slot="suffix" class="el-input__icon el-icon-search" @click="handleCustomer" />
                </el-input>
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item label="结算币别" prop="currency">
                <el-input v-model="customerForm.currency" class="input-width" placeholder="请选择结算币别">
                  <i slot="suffix" class="el-input__icon el-icon-search" @click="handleCurrency" />
                </el-input>
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item label="结算方式" prop="settlementMode">
                <el-input v-model="customerForm.settlementMode" class="input-width" placeholder="请选择结算方式">
                  <i slot="suffix" class="el-input__icon el-icon-search" @click="handleSettlement" />
                </el-input>
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item label="收款条件" prop="condition">
                <el-input v-model="customerForm.condition" class="input-width" placeholder="请选择收款条件">
                  <i slot="suffix" class="el-input__icon el-icon-search" @click="handleCollection" />
                </el-input>
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item label="税分类" prop="ftaxType">
                <el-select v-model="customerForm.ftaxType" placeholder="请选择税分类" class="input-width">
                  <el-option
                    v-for="option in customerForm.classification"
                    :key="option.value"
                    :label="option.label"
                    :value="option.value"
                  />
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item label="发票类型" prop="finvoiceType">
                <el-select v-model="customerForm.finvoiceType" placeholder="请选择发票类型" class="input-width">
                  <el-option
                    v-for="option in customerForm.invoice"
                    :key="option.value"
                    :label="option.label"
                    :value="option.value"
                  />
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item label="默认税率" prop="default">
                <el-input v-model="customerForm.default" class="input-width" placeholder="请选择默认税率">
                  <i slot="suffix" class="el-input__icon el-icon-search" @click="handleTaxRate" />
                </el-input>
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item label="启用信用管理" prop="fiscreditcheck">
                <el-checkbox v-model="customerForm.fiscreditcheck" disabled />
              </el-form-item>
            </el-col>
          </el-row>
        </el-form>
      </el-tab-pane>
    </el-tabs>
    <!--    国家列表-->
    <jc-popup
      v-model="countryPagination.fname"
      :dialog-title="dialogTitle"
      :open-dialog="openCountry"
      :popup-title="popupTitle"
      @closeDialog="closeDialog"
      @emptyForm="emptyForm"
      @handleSearch="searchCountry"
    >
      <template v-slot:content>
        <jc-table
          v-show="dialogTitle === '国家列表'"
          :cell-style="cellStyle"
          :table-data="countryTableData"
          :table-header="countryHeader"
          :table-height="0"
          @clickRow="countrySelect"
        />
      </template>
      <template v-slot:pagination>
        <jc-pagination
          v-if="dialogTitle === '国家列表'"
          v-show="total > 0"
          :total="total"
          :page.sync="countryPagination.pageNum"
          :limit.sync="countryPagination.pageSize"
          @pagination="handleCountry"
        />
      </template>
    </jc-popup>
    <!--    结算方式-->
    <jc-popup
      v-model="settlementPagination.fname"
      :dialog-title="dialogTitle"
      :open-dialog="openSettlement"
      :popup-title="popupTitle"
      @closeDialog="closeDialog"
      @emptyForm="emptyForm"
      @handleSearch="searchSettlement"
    >
      <template v-slot:content>
        <jc-table
          v-show="dialogTitle === '结算方式'"
          :cell-style="cellStyle"
          :table-data="settlementTableData"
          :table-header="settlementHeader"
          :table-height="0"
          @clickRow="settlementSelect"
        />
      </template>
      <template v-slot:pagination>
        <jc-pagination
          v-if="dialogTitle === '结算方式'"
          v-show="total > 0"
          :total="total"
          :page.sync="settlementPagination.pageNum"
          :limit.sync="settlementPagination.pageSize"
          @pagination="handleSettlement"
        />
      </template>
    </jc-popup>
    <!--    默认税率-->
    <jc-popup
      v-model="taxRatePagination.fname"
      :dialog-title="dialogTitle"
      :open-dialog="openTaxRate"
      :popup-title="popupTitle"
      @closeDialog="closeDialog"
      @emptyForm="emptyForm"
      @handleSearch="searchTaxRate"
    >
      <template v-slot:content>
        <jc-table
          v-show="dialogTitle === '税率列表'"
          :cell-style="cellStyle"
          :table-data="taxRateTableData"
          :table-header="taxRateHeader"
          :table-height="0"
          @clickRow="taxRateSelect"
        />
      </template>
      <template v-slot:pagination>
        <jc-pagination
          v-if="dialogTitle === '税率列表'"
          v-show="total > 0"
          :total="total"
          :page.sync="taxRatePagination.pageNum"
          :limit.sync="taxRatePagination.pageSize"
          @pagination="handleTaxRate"
        />
      </template>
    </jc-popup>
    <!--    结算币别-->
    <jc-popup
      v-model="currencyPagination.fname"
      :dialog-title="dialogTitle"
      :open-dialog="openCurrency"
      :popup-title="popupTitle"
      @closeDialog="closeDialog"
      @emptyForm="emptyForm"
      @handleSearch="searchCurrency"
    >
      <template v-slot:content>
        <jc-table
          v-show="dialogTitle === '结算币别'"
          :cell-style="cellStyle"
          :table-data="currencyTableData"
          :table-header="currencyHeader"
          :table-height="0"
          @clickRow="currencySelect"
        />
      </template>
      <template v-slot:pagination>
        <jc-pagination
          v-if="dialogTitle === '结算币别'"
          v-show="total > 0"
          :total="total"
          :page.sync="currencyPagination.pageNum"
          :limit.sync="currencyPagination.pageSize"
          @pagination="handleCurrency"
        />
      </template>
    </jc-popup>
    <!--    收款条件-->
    <jc-popup
      v-model="collectionPagination.fname"
      :dialog-title="dialogTitle"
      :open-dialog="openCollection"
      :popup-title="popupTitle"
      @closeDialog="closeDialog"
      @emptyForm="emptyForm"
      @handleSearch="searchCollection"
    >
      <template v-slot:content>
        <jc-table
          v-show="dialogTitle === '收款条件'"
          :cell-style="cellStyle"
          :table-data="collectionTableData"
          :table-header="collectionHeader"
          :table-height="0"
          @clickRow="collectionSelect"
        />
      </template>
      <template v-slot:pagination>
        <jc-pagination
          v-if="dialogTitle === '收款条件'"
          v-show="total > 0"
          :total="total"
          :page.sync="collectionPagination.pageNum"
          :limit.sync="collectionPagination.pageSize"
          @pagination="handleCollection"
        />
      </template>
    </jc-popup>
    <!--    客户分组-->
    <el-dialog
      title="客户分组"
      :visible.sync="openGrouping"
      width="60%"
      :close-on-click-modal="false"
      close-on-press-escape
    >
      <el-input
        v-model="filterText"
        placeholder="输入关键字进行过滤"
      />

      <el-tree
        ref="tree"
        class="filter-tree"
        :data="treeData"
        :props="defaultProps"
        default-expand-all
        :filter-node-method="filterNode"
        @node-click="handleNodeClick"
      />
    </el-dialog>
  </div>
</template>

<script>
import jcTitle from '@/components/Title'
import jcPopup from '@/views/basic/createMateriel/components/Popup'
import jcTable from '@/components/Table'
import jcPagination from '@/components/Pagination'
import { queryTOrgOrganizationsL } from '@/api/engineering/createBom'
import {
  queryFcustType,
  queryFcountryList,
  queryCustomerGroup,
  queryftaxTypeList,
  queryFinvoiceType,
  querySettletype,
  queryTBdTaxrate,
  queryTBdCurrency,
  querytReccondition,
  insertCustomer
} from '@/api/marketManage/customer/createCustomer'

export default {
  name: 'CreatePurchasePrice',
  components: {
    jcTitle,
    jcPopup,
    jcTable,
    jcPagination
  },
  inject: ['reload'],
  data() {
    return {
      activeName: 'customer', // 默认在价目
      filterText: '', // 树结构查询
      cellStyle: { padding: '10 10' }, // 行高
      dialogTitle: '', // 弹窗标题
      popupTitle: '', // 搜索条件
      openCountry: false, // 国家弹窗
      openGrouping: false, // 客户分组弹窗
      openSettlement: false, // 结算方式弹窗
      openTaxRate: false, // 默认税率弹窗
      openCurrency: false, // 结算币别弹窗
      openCollection: false, // 收款条件
      total: 0,
      countryPagination: {
        pageNum: 1,
        pageSize: 10,
        fname: ''
      },
      settlementPagination: {
        pageNum: 1,
        pageSize: 10,
        fname: ''
      },
      taxRatePagination: {
        pageNum: 1,
        pageSize: 10,
        fname: ''
      },
      currencyPagination: {
        pageNum: 1,
        pageSize: 10,
        fname: ''
      },
      collectionPagination: {
        pageNum: 1,
        pageSize: 10,
        fname: ''
      },
      settlementTableData: [], // 结算方式
      settlementHeader: [
        { label: '编码', prop: 'fnumber', align: 'center' },
        { label: '名称', prop: 'fname', align: 'center' },
        { label: '支付手续费', prop: 'fissupbankpay', align: 'center' },
        { label: '业务分类', prop: 'fcapTion', align: 'center' }
      ],
      countryTableData: [], // 国家数据
      countryHeader: [
        { label: '编码', prop: 'fnumber', align: 'center' },
        { label: '国家名称', prop: 'fdataValue', align: 'center' }
      ],
      taxRateTableData: [], // 默认税率弹窗
      taxRateHeader: [
        { label: '编码', prop: 'fnumber', align: 'center' },
        { label: '名称', prop: 'fname', align: 'center' },
        { label: '税率', prop: 'ftaxRate', align: 'center' },
        { label: '税收制度', prop: 'taxsystem', align: 'center' },
        { label: '税种', prop: 'taxType', align: 'center' }
      ],
      currencyTableData: [], // 币别数据
      currencyHeader: [
        { label: '编码', prop: 'fnumber', align: 'center' },
        { label: '货币符号', prop: 'fsysmbol', align: 'center' },
        { label: '名称', prop: 'fname', align: 'center' },
        { label: '货币代码', prop: 'fcode', align: 'center' },
        { label: '审核状态', prop: 'fdocumentStatus', align: 'center' },
        { label: '禁用状态', prop: 'fforbidStatus', align: 'center' }
      ],
      collectionTableData: [], // 收款条件
      collectionHeader: [
        { label: '编码', prop: 'fnumber', align: 'center' },
        { label: '收款条件名称', prop: 'fname', align: 'center' },
        { label: '多到期日设置标准', prop: 'fcapTion', align: 'center' },
        { label: '到期日计算日期', prop: 'standard', align: 'center' },
        { label: '描述', prop: 'fdescripTion', align: 'center' }
      ],
      treeData: [], // 树形数据
      defaultProps: {
        children: 'children',
        label: 'label'
      },
      // 表单值
      customerForm: {
        teamList: [], // 组织
        fuseOrgId: 1,
        customerName: '', // 客户名称
        classification: [], // 税分类
        fiscreditcheck: true, // 启用信用管理
        ftaxType: '', // 税分类值
        condition: '', // 收款条件
        settlementMode: '', // 结算方式
        fsettleTypeId: '', // 结算方式id
        currency: '', // 结算币别
        invoice: [], // 发票类型
        finvoiceType: '', // 发票类型值
        customerGrouping: '', // 客户分组
        country: '', // 国家名称
        customerType: [], // 客户类别
        fcustTypeId: '', // 客户类别值
        freccondiTionId: '', // 收款条件值
        default: '' // 默认税率
      },
      result: {
        fcountry: null,
        fgroup: null,
        ftaxRate: null,
        ftradingCurrId: null
      }, // 提交值
      customerRules: {
        customerName: [
          { required: true, message: '请输入客户名称', trigger: 'blur' }
        ],
        country: [
          { required: true, message: '请选择国家', trigger: 'blur' }
        ],
        customerGrouping: [
          { required: true, message: '请选择客户分组', trigger: 'blur' }
        ],
        currency: [
          { required: true, message: '请选择币别', trigger: 'blur' }
        ],
        ftaxType: [
          { required: true, message: '请选择税分类', trigger: 'blur' }
        ],
        default: [
          { required: true, message: '请选择默认税率', trigger: 'blur' }
        ],
        customerType: [
          { required: true, message: '请选择客户类别', trigger: 'blur' }
        ],
        finvoiceType: [
          { required: true, message: '请选择发票类型', trigger: 'change' }
        ],
        fcustTypeId: [
          { required: true, message: '请选择客户类别', trigger: 'change' }
        ]
      }
    }
  },
  // 树结构查询
  watch: {
    filterText(val) {
      this.$refs.tree.filter(val)
    }
  },
  mounted() {
    this.handleGetPurchase()
    this.getCustomerType()
    this.getClassification()
    this.getInvoice()
  },
  methods: {
    // 保存
    preservation() {
      this.$refs.customerRef.validate(valid => {
        if (!valid) {
          return
        }
        const { fuseOrgId, ftaxType, finvoiceType, fcustTypeId, customerName: fname, fiscreditcheck } = this.customerForm
        const RES = { fuseOrgId, ftaxType, finvoiceType, fcustTypeId, fname, fiscreditcheck }
        Object.assign(this.result, { ...RES })
        if (Object.values(this.result).includes(null)) {
          this.$message.warning('内容不完整,请重新填写')
          return
        }
        const DATA = {
          ...this.result,
          fsettleTypeId: this.customerForm.fsettleTypeId,
          freccondiTionId: this.customerForm.freccondiTionId
        }
        insertCustomer(DATA).then(res => {
          if (res.code === 0) {
            this.$message.success(res.message)
            this.reload()
          }
        }).catch(error => error)
      })
    },
    // 国家选中
    countrySelect(item) {
      this.result.fcountry = item.fcountryId
      this.customerForm.country = item.fdataValue
      this.openCountry = false
    },
    // 客户分组选中
    handleNodeClick(item) {
      this.result.fgroup = item.value
      this.customerForm.customerGrouping = item.label
      this.openGrouping = false
    },
    // 默认税率选中
    taxRateSelect(item) {
      this.result.ftaxRate = item.ftaxrateId
      this.customerForm.default = item.fname
      this.openTaxRate = false
    },
    // 结算币别选中
    currencySelect(item) {
      this.result.ftradingCurrId = item.fcurrencyId
      this.customerForm.currency = item.fname
      this.openCurrency = false
    },
    // 结算方式选中
    settlementSelect(item) {
      this.customerForm.settlementMode = item.fname
      this.customerForm.fsettleTypeId = item.fsettleTypeId
      this.openSettlement = false
    },
    // 收款条件选中
    collectionSelect(item) {
      this.customerForm.condition = item.fname
      this.customerForm.freccondiTionId = item.frecConditionId
      this.openCollection = false
    },
    // 获取组织
    async handleGetPurchase() {
      const { data: RES } = await queryTOrgOrganizationsL()
      this.customerForm.teamList = RES.map(item => {
        return { label: item.FNAME, value: item.FPKID }
      })
    },
    // 获取客户类别
    async getCustomerType() {
      const { data: RES } = await queryFcustType()
      this.customerForm.customerType = RES.map(item => {
        return { label: item.fdataValue, value: item.fentryId }
      })
    },
    // 获取税分类
    async getClassification() {
      const { data: RES } = await queryftaxTypeList()
      this.customerForm.classification = RES.map(item => {
        return { label: item.fdataValue, value: item.ftaxType }
      })
    },
    // 获取发票类型
    async getInvoice() {
      const { data: RES } = await queryFinvoiceType()
      this.customerForm.invoice = RES.map(item => {
        return { label: item.fcapTion, value: item.finvoiceType }
      })
    },
    // 获取国家
    async handleCountry() {
      this.openCountry = true
      const { data: RES } = await queryFcountryList({ ...this.countryPagination })
      this.dialogTitle = '国家列表'
      this.popupTitle = RES.search
      this.countryTableData = RES.array
      this.total = RES.total
    },
    // 获取结算方式
    async handleSettlement() {
      this.openSettlement = true
      const { data: RES } = await querySettletype({ ...this.settlementPagination })
      this.dialogTitle = '结算方式'
      this.popupTitle = RES.search
      this.settlementTableData = RES.array
      this.total = RES.total
    },
    // 获取客户分组
    async handleCustomer() {
      this.openGrouping = true
      const { data: RES } = await queryCustomerGroup()
      this.treeData = RES
    },
    // 获取税率
    async handleTaxRate() {
      this.openTaxRate = true
      const { data: RES } = await queryTBdTaxrate({ ...this.taxRatePagination })
      this.dialogTitle = '税率列表'
      this.popupTitle = RES.search
      this.taxRateTableData = RES.array
      this.total = RES.total
    },
    // 结算币别
    async handleCurrency() {
      this.openCurrency = true
      const { data: RES } = await queryTBdCurrency({ ...this.currencyPagination })
      this.dialogTitle = '结算币别'
      this.popupTitle = RES.search
      this.currencyTableData = RES.array
      this.total = RES.total
    },
    // 收款条件
    async handleCollection() {
      this.openCollection = true
      const { data: RES } = await querytReccondition({ ...this.collectionPagination })
      this.dialogTitle = '收款条件'
      this.popupTitle = RES.search
      this.collectionTableData = RES.array
      this.total = RES.total
    },
    // 国家查询
    searchCountry() {
      this.countryPagination.pageNum = 1
      this.handleCountry()
    },
    // 结算方式查询
    searchSettlement() {
      this.settlementPagination.pageNum = 1
      this.handleSettlement()
    },
    // 默认税率
    searchTaxRate() {
      this.taxRatePagination.pageNum = 1
      this.handleTaxRate()
    },
    // 结算币别
    searchCurrency() {
      this.currencyPagination.pageNum = 1
      this.handleCurrency()
    },
    // 收款条件
    searchCollection() {
      this.collectionPagination.pageNum = 1
      this.handleCollection()
    },
    // 关闭弹窗
    closeDialog() {
      this.countryPagination.pageNum = 1
      this.settlementPagination.pageNum = 1
      this.taxRatePagination.pageNum = 1
      this.currencyPagination.pageNum = 1
      this.collectionPagination.pageNum = 1
      this.openCountry = false
      this.openSettlement = false
      this.openTaxRate = false
      this.openCurrency = false
      this.openCollection = false
    },
    // 清空搜索框
    emptyForm() {
      this.countryPagination.fname = ''
      this.settlementPagination.fname = ''
      this.taxRatePagination.fname = ''
      this.currencyPagination.fname = ''
      this.collectionPagination.fname = ''
    },
    // 树结构查询关键词
    filterNode(value, data) {
      if (!value) return true
      return data.label.indexOf(value) !== -1
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
  }
}

.el-input__icon {
  cursor: pointer;
}

.icon-jin-rud-ao-bo {
  cursor: pointer;

  &:hover {
    color: #409eff;
  }
}

</style>
