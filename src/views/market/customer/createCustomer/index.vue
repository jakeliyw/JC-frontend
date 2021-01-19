<template>
  <div class="content">
    <jc-title />
    <el-tabs v-model="activeName" type="border-card">
      <el-tab-pane label="客户" name="customer" class="layout">
        <div class="header">
          <el-button size="mini">刷新</el-button>
          <el-button size="mini" type="primary">保存客户</el-button>
        </div>
        <el-form ref="customerRef" :model="customerForm" label-width="100px" size="mini" :rules="customerRules">
          <el-row :gutter="30" type="flex" justify="start" class="elRow">
            <el-col :span="6">
              <el-form-item label="使用组织" prop="fcreateOrgId">
                <el-select v-model="customerForm.teamValue" placeholder="请选择组织" class="input-width">
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
                <el-input v-model="customerForm.customerName" class="input-width" placeholder="请输入客户名称"/>
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
              <el-form-item label="客户类别" prop="customerTypeValue">
                <el-select v-model="customerForm.customerTypeValue" placeholder="请选择客户类别" class="input-width">
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
                  <i slot="suffix" class="el-input__icon el-icon-search" />
                </el-input>
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item label="结算方式" prop="settlementMode">
                <el-input v-model="customerForm.settlementMode" class="input-width" placeholder="请选择结算方式">
                  <i slot="suffix" class="el-input__icon el-icon-search" />
                </el-input>
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item label="收款条件" prop="condition">
                <el-input v-model="customerForm.condition" class="input-width" placeholder="请选择收款条件">
                  <i slot="suffix" class="el-input__icon el-icon-search" />
                </el-input>
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item label="税分类" prop="classificationValue">
                <el-select v-model="customerForm.classificationValue" placeholder="请选择税分类" class="input-width">
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
              <el-form-item label="发票类型" prop="invoiceValue">
                <el-select v-model="customerForm.invoiceValue" placeholder="请选择发票类型" class="input-width">
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
                  <i slot="suffix" class="el-input__icon el-icon-search" />
                </el-input>
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
  querySettletype
} from '@/api/marketManage/customer'

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
      total: 0,
      countryPagination: {
        pageNum: 1,
        pageSize: 10,
        fname: ''
      },
      countryTableData: [], // 国家数据
      countryHeader: [
        { label: '编码', prop: 'fnumber', align: 'center' },
        { label: '国家名称', prop: 'fdataValue', align: 'center' }
      ],
      treeData: [], // 树形数据
      defaultProps: {
        children: 'children',
        label: 'label'
      },
      // 表单值
      customerForm: {
        teamList: [], // 组织
        teamValue: 1,
        customerName: '', // 客户名称
        classification: [], // 税分类
        classificationValue: '', // 税分类值
        condition: '', // 收款条件
        settlementMode: '', // 结算方式
        currency: '', // 结算币别
        invoice: [], // 发票类型
        invoiceValue: '', // 发票类型值
        customerGrouping: '', // 客户分组
        country: '', // 国家名称
        customerType: [], // 客户类别
        customerTypeValue: '', // 客户类别值
        default: '' // 默认税率
      },
      customerRules: {
        country: [
          { required: true, message: '请选择国家', trigger: 'blur' }
        ],
        customerGrouping: [
          { required: true, message: '请选择客户分组', trigger: 'blur' }
        ],
        currency: [
          { required: true, message: '请选择币别', trigger: 'blur' }
        ],
        classificationValue: [
          { required: true, message: '请选择税分类', trigger: 'blur' }
        ],
        default: [
          { required: true, message: '请选择默认税率', trigger: 'blur' }
        ],
        customerType: [
          { required: true, message: '请选择客户类别', trigger: 'blur' }
        ],
        invoiceValue: [
          { required: true, message: '请选择发票类型', trigger: 'change' }
        ],
        customerTypeValue: [
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
    // 获取客户分组
    async handleCustomer() {
      this.openGrouping = true
      const { data: RES } = await queryCustomerGroup()
      this.treeData = RES
    },
    // 国家查询
    searchCountry() {
      this.countryPagination.pageNum = 1
      this.handleCountry()
    },
    closeDialog() {
      this.countryPagination.pageNum = 1
      this.openCountry = false
    },
    emptyForm() {
      this.countryPagination.fname = ''
    },
    // 树结构查询关键词
    filterNode(value, data) {
      if (!value) return true
      return data.label.indexOf(value) !== -1
    },
    searchCustomer() {

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

.icon-jin-rud-ao-bo{
  cursor: pointer;
  &:hover{
    color: #409eff;
  }
}

</style>
