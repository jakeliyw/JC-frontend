<template>
  <div v-loading="loading" class="content">
    <el-button type="primary" style="width: 80px;margin-bottom: 10px" @click="subMarker()">保存</el-button>
    <el-tabs type="border-card">
      <el-tab-pane label="主产品">
        <el-form ref="purchaseRef" :model="prodValue" label-width="100px" :rules="prodValueRules">
          <el-form-item label="单据类型" prop="fbillTypeId">
            <el-select
              v-model="prodValue.fbillTypeId"
              placeholder="请选择单据类型"
              size="mini"
            >
              <el-option
                v-for="billty in billtypes"
                :key="billty.fbillTypeId"
                :label="billty.fname"
                :value="billty.fbillTypeId"
              />
            </el-select>
          </el-form-item>
          <el-form-item label="销售组织" prop="fsaleOrgId">
            <el-select v-model="prodValue.fsaleOrgId" placeholder="请选择组织" size="mini">
              <el-option
                v-for="option in teamList"
                :key="option.value"
                :label="option.FNAME"
                :value="option.FPKID"
              />
            </el-select>
          </el-form-item>
          <el-form-item label="客户" prop="fcustId">
            <el-input v-model="prodValue.fname" placeholder="请选择客户" size="mini">
              <i
                slot="suffix"
                class="el-input__icon el-icon-search"
                @click="queryTBdCustomerList()"
              />
            </el-input>
          </el-form-item>
          <el-form-item label="交货方式" prop="fheadDeliveryWay">
            <el-input v-model="prodValue.fdataValue" placeholder="请选择交货方式" size="mini">
              <i
                slot="suffix"
                class="el-input__icon el-icon-search"
                @click="queryFheadDelivery()"
              />
            </el-input>
          </el-form-item>
          <el-form-item label="销售员" prop="fsalerId">
            <el-input v-model="prodValue.fsalerIdName" placeholder="请选择销售员" size="mini">
              <i
                slot="suffix"
                class="el-input__icon el-icon-search"
                @click="querySalesperson()"
              />
            </el-input>
          </el-form-item>
          <el-form-item label="结算币别" prop="fsettleCurrId">
            <el-input v-model="prodValue.fsettleCurrIdName" placeholder="请选择结算币别" size="mini">
              <i
                slot="suffix"
                class="el-input__icon el-icon-search"
                @click="queryTBdCurrency()"
              />
            </el-input>
          </el-form-item>
          <el-form-item label="收款条件" prop="frecConditionId">
            <el-input v-model="prodValue.frecConditionIdName" placeholder="请选择收款条件" size="mini">
              <i
                slot="suffix"
                class="el-input__icon el-icon-search"
                @click="querytReccondition()"
              />
            </el-input>
          </el-form-item>
          <el-form-item label="单据编号">
            <el-input v-model="prodValue.fbillNo" placeholder="保存自动生成" size="mini" disabled /></el-form-item>
          <el-form-item label="汇率类型">
            <el-input v-model="prodValue.fxxchangeTypeIdName" placeholder="请输入汇率类型" disabled size="mini" /></el-form-item>
          <el-form-item label="本位币">
            <el-input v-model="prodValue.flocalCurrIdName" placeholder="请输入本位币" disabled size="mini" /></el-form-item>
          <el-form-item label="汇率">
            <el-input v-model="prodValue.fexchangeRate" disabled size="mini" /></el-form-item>
          <el-form-item label="价目表" prop="fpriceListId">
            <el-input v-model="prodValue.fpriceListIdName" placeholder="请选择价目表" size="mini">
              <i
                slot="suffix"
                class="el-input__icon el-icon-search"
                @click="handlePriceList()"
              />
            </el-input></el-form-item>
          <el-form-item label="柜型" prop="fpaezText">
            <el-input v-model.trim="prodValue.fpaezText" placeholder="请输入柜型" size="mini" /></el-form-item>
          <el-form-item label="客户订单号" prop="fpaezText1">
            <el-input v-model.trim="prodValue.fpaezText1" placeholder="请输入客户订单号" size="mini" /></el-form-item>
          <el-form-item label="客户PO NO" prop="fpaezText2">
            <el-input v-model.trim="prodValue.fpaezText2" placeholder="请输入客户PO NO" size="mini" /></el-form-item>
          <el-form-item label="品质标准" prop="fpaezCombo">
            <el-select v-model="prodValue.fpaezCombo" placeholder="请选择品质标准" size="mini">
              <el-option v-for="(item, index) in standard" :key="index" :label="item.fpaezCombo" :value="item.fpaezCombo" />
            </el-select>
          </el-form-item>
          <!--          <el-form-item label="图片1" prop="fpaezCombo">-->
          <!--            <el-upload-->
          <!--              class="avatar-uploader"-->
          <!--              action="https://jsonplaceholder.typicode.com/posts/"-->
          <!--              :show-file-list="false"-->
          <!--              :on-success="handleAvatarSuccess"-->
          <!--            >-->
          <!--              <img v-if="imageUrl" :src="imageUrl" class="avatar">-->
          <!--              <i v-else class="el-icon-plus avatar-uploader-icon" />-->
          <!--            </el-upload>-->
          <!--          </el-form-item>-->
          <el-form-item label="备注" prop="fnote">
            <el-input v-model.trim="prodValue.fnote" type="textarea" placeholder="请填写备注" size="mini" />
          </el-form-item>
          <el-form-item label="是否含税">
            <el-checkbox v-model="prodValue.fisIncludedTax" />
          </el-form-item>
        </el-form>
        <tab @visible="prodOrder" />
      </el-tab-pane>
      <el-tab-pane label="其他">
        <h1>开发中</h1>
      </el-tab-pane>
    </el-tabs>
    <!--    客户列表弹窗-->
    <el-dialog
      title="客户列表"
      model
      :visible.sync="isclientlDialog"
      :close-on-click-modal="false"
      width="60%"
    >
      <div class="materiel-form">
        <span class="materiel-code">客户名称</span>
        <el-input v-model.trim="client.fname" class="input-width" size="mini" placeholder="请输入客户名称" @keyup.enter.native="clientSearch" />
        <el-button size="mini" type="primary" @click="clientSearch">搜索</el-button>
      </div>
      <jc-table
        :table-data="clientlDialogData"
        :table-header="clientDialogHeader"
        table-height="53vh"
        serial
        :cell-style="cellStyle"
        @clickRow="clientlSelectRow"
      />
      <jc-pagination
        v-show="client.total > 0"
        :total="client.total"
        :page.sync="client.pageNum"
        :limit.sync="client.pageSize"
        @pagination="queryTBdCustomerList"
      />
    </el-dialog>
    <!--    交货方式弹窗-->
    <el-dialog
      title="交货方式"
      model
      :visible.sync="isdeliverlDialog"
      :close-on-click-modal="false"
      width="60%"
    >
      <div class="materiel-form">
        <span class="materiel-code">交货名称</span>
        <el-input v-model.trim="deliver.fdataValue" class="input-width" size="mini" placeholder="请输入交货名称" @keyup.enter.native="deliverSearch" />
        <el-button size="mini" type="primary" @click="deliverSearch">搜索</el-button>
      </div>
      <jc-table
        :table-data="deliverlDialogData"
        :table-header="deliverDialogHeader"
        table-height="53vh"
        serial
        :cell-style="cellStyle"
        @clickRow="deliverlSelectRow"
      />
      <jc-pagination
        v-show="deliver.total > 0"
        :total="deliver.total"
        :page.sync="deliver.pageNum"
        :limit.sync="deliver.pageSize"
        @pagination="queryFheadDelivery"
      />
    </el-dialog>
    <!--    销售订单销售员列表弹窗-->
    <el-dialog
      title="销售员列表"
      model
      :visible.sync="ismarketlDialog"
      :close-on-click-modal="false"
      width="60%"
    >
      <div class="materiel-form">
        <span class="materiel-code">销售员名称</span>
        <el-input v-model.trim="market.fname" class="input-width" size="mini" placeholder="请输入销售员名称" @keyup.enter.native="marketSearch" />
        <el-button size="mini" type="primary" @click="marketSearch">搜索</el-button>
      </div>
      <jc-table
        :table-data="marketDialogData"
        :table-header="marketDialogHeader"
        table-height="53vh"
        serial
        :cell-style="cellStyle"
        @clickRow="marketlSelectRow"
      />
      <jc-pagination
        v-show="market.total > 0"
        :total="market.total"
        :page.sync="market.pageNum"
        :limit.sync="market.pageSize"
        @pagination="querySalesperson"
      />
    </el-dialog>
    <!--    结算币别列表弹窗-->
    <el-dialog
      title="结算币别"
      model
      :visible.sync="isCurrencyDialog"
      :close-on-click-modal="false"
      width="60%"
    >
      <div class="materiel-form">
        <span class="materiel-code">币别名称</span>
        <el-input v-model.trim="currency.fname" class="input-width" size="mini" placeholder="请输入币别名称" @keyup.enter.native="currencySearch" />
        <el-button size="mini" type="primary" @click="currencySearch">搜索</el-button>
      </div>
      <jc-table
        :table-data="currencyDialogData"
        :table-header="currencyDialogHeader"
        table-height="53vh"
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
    <!--    收款条件列表弹窗-->
    <el-dialog
      title="订单收款条件"
      model
      :visible.sync="isgatheringDialog"
      :close-on-click-modal="false"
      width="60%"
    >
      <div class="materiel-form">
        <span class="materiel-code">收款条件名称</span>
        <el-input v-model.trim="gathering.fname" class="input-width" size="mini" placeholder="请输入收款条件名称" @keyup.enter.native="gatheringSearch" />
        <el-button size="mini" type="primary" @click="gatheringSearch">搜索</el-button>
      </div>
      <jc-table
        :table-data="gatheringDialogData"
        :table-header="gatheringDialogHeader"
        serial
        :cell-style="cellStyle"
        table-height="53vh"
        @clickRow="gatheringSelectRow"
      />
      <jc-pagination
        v-show="gathering.total > 0"
        :total="gathering.total"
        :page.sync="gathering.pageNum"
        :limit.sync="gathering.pageSize"
        @pagination="querytReccondition"
      />
    </el-dialog>
    <!--    价目列表-->
    <el-dialog
      title="价目表"
      model
      :visible.sync="openPriceList"
      :close-on-click-modal="false"
      width="60%"
    >
      <div class="materiel-form">
        <span class="materiel-code">供应商名称</span>
        <el-input v-model.trim="priceListPagination.fsupplier" class="input-width" size="mini" placeholder="请输入供应商名称" @keyup.enter.native="handlePriceList" />
        <el-button size="mini" type="primary" @click="handlePriceList">搜索</el-button>
      </div>
      <jc-table
        :table-data="priceListData"
        :table-header="priceListHeader"
        table-height="53vh"
        serial
        :cell-style="cellStyle"
        @clickRow="priceListSelectRow"
      />
      <jc-pagination
        v-show="priceListPagination.total > 0"
        :total="priceListPagination.total"
        :page.sync="priceListPagination.pageNum"
        :limit.sync="priceListPagination.pageSize"
        @pagination="handlePriceList"
      />
    </el-dialog>
  </div>
</template>
<script>
import {
  queryTOrgOrganizationsL
} from '@/api/engineering/createBom'
import { queryTBasBilltype,
  queryTBdCustomerList,
  queryFheadDelivery,
  querySalesperson,
  queryTBdCurrency,
  querytReccondition,
  queryFpaezCombo,
  querySalerRate,
  querySalOrderFxxchange,
  insertSalOrder
} from '@/api/marketManage/marketOrder'
import jcTable from '@/components/Table'
import jcPagination from '@/components/Pagination'
import jumpMateriel from '@/components/JumpMateriel'
import { queryTPurPatLs } from '@/api/modifyPriceManagement/createModifyPrice'
import tab from '@/views/market/marketManage/createMarkerOrder/components/tab'
export default {
  name: 'CreateMarkerOrder',
  components: {
    jcTable,
    jcPagination,
    tab
  },
  mixins: [jumpMateriel],
  data() {
    return {
      imageUrl: '', // 图片
      tableHeight: '50vh', // 弹框中表格高度
      loading: false, // 加载中
      // disabled: false, // 税率是否禁用
      standard: [], // 品质标准
      isMaterielDialog: false, // 物料弹窗
      // 客户列表数据分页
      isclientlDialog: false,
      client: {
        total: 0, // 总条目
        pageNum: 1, // 当前页
        pageSize: 10, // 每页显示多少条数据
        fname: ''
      },
      clientlDialogData: [],
      clientDialogHeader: [
        { label: '客户ID', prop: 'fcustId', align: 'center' },
        { label: '客户编码', prop: 'fnumber', align: 'center' },
        { label: '客户名称', prop: 'fname', align: 'center' },
        { label: '客户分组', prop: 'fcustGroup', align: 'center' }
      ],
      // 交货方式
      isdeliverlDialog: false,
      deliver: {
        total: 0, // 总条目
        pageNum: 1, // 当前页
        pageSize: 10, // 每页显示多少条数据
        fdataValue: ''
      },
      deliverlDialogData: [],
      deliverDialogHeader: [
        { label: '编码', prop: 'fnumber', align: 'center' },
        { label: '交货名称', prop: 'fdataValue', align: 'center' },
        { label: '备注', prop: 'fdescripTion', align: 'center' }
      ],
      // 销售员分页
      market: {
        total: 0, // 总条目
        pageNum: 1, // 当前页
        pageSize: 10, // 每页显示多少条数据
        fname: ''
      },
      ismarketlDialog: false,
      marketDialogData: [],
      marketDialogHeader: [
        { label: '编码', prop: 'fnumber', align: 'center' },
        { label: '销售员名称', prop: 'fname', align: 'center' },
        { label: '销售员部门', prop: 'fdeptName', align: 'center' }
      ],
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
      // 收款条件
      isgatheringDialog: false,
      gathering: {
        total: 0, // 总条目
        pageNum: 1, // 当前页
        pageSize: 10, // 每页显示多少条数据
        fname: ''
      },
      gatheringDialogData: [],
      gatheringDialogHeader: [
        { label: '编码', prop: 'fnumber', align: 'center' },
        { label: '收款条件名称', prop: 'fname', align: 'center' },
        { label: '多到期日设置标准', prop: 'fcapTion', align: 'center' },
        { label: '到期日计算日期', prop: 'standard', align: 'center' },
        { label: '描述', prop: 'fdescripTion', align: 'center' }
      ],
      // 价目表分页
      openPriceList: false,
      priceListPagination: {
        pageNum: 1, // 当前页
        pageSize: 10, // 限制行数
        fsupplier: '', // 关键词
        total: 0 // 总条目
      },
      // 价目表
      priceListData: [],
      priceListHeader: [
        { label: '价目表', prop: 'fname', align: 'center' },
        { label: '供应商名称', prop: 'fsupplier', align: 'center' },
        { label: '币别', prop: 'fcurrency', align: 'center' },
        { label: '含税', prop: 'fisIncludedTax', align: 'center' }
      ],
      tableHeader: [],
      billtypes: [], // 单据类型
      teamList: [], // 组织
      prodValue: { fbillTypeId: '', fsaleOrgId: '', fcustId: '', fdataValue: '', fname: '', fsettleCurrIdName: '', fbillNo: '',
        fheadDeliveryWay: '', fsalerId: '', fnote: '', fsettleCurrId: '', fsalerIdName: '', fpriceListIdName: '', fpriceListId: '',
        frecConditionId: '', fisIncludedTax: false, fexchangeRate: '1.0000', frecConditionIdName: '',
        flocalCurrId: '', fxxchangeTypeId: '', fxxchangeTypeIdName: '', flocalCurrIdName: ''
      },
      cellStyle: { padding: '10 10' },
      prodValueRules: {
        fbillTypeId: [
          { required: true, message: '请选择单据类型', trigger: 'change' }
        ], fsaleOrgId: [
          { required: true, message: '请选择销售组织', trigger: 'change' }
        ], fcustId: [
          { required: true, message: '请选择客户', trigger: 'change' }
        ], fheadDeliveryWay: [
          { required: true, message: '请选择交货方式', trigger: 'change' }
        ], fsalerId: [
          { required: true, message: '请选择销售员', trigger: 'change' }
        ], fnote: [
          { required: true, message: '请选择备注', trigger: 'change' }
        ], fsettleCurrId: [
          { required: true, message: '请选择结算币别', trigger: 'change' }
        ], frecConditionId: [
          { required: true, message: '请选择收款条件', trigger: 'change' }
        ], fpaezCombo: [
          { required: true, message: '请选择品质标准', trigger: 'change' }
        ], fpriceListId: [
          { required: true, message: '请选择价目表', trigger: 'blur' }
        ], fpaezText: [
          { required: true, message: '请选择柜型', trigger: 'blur' }
        ], fpaezText1: [
          { required: true, message: '请选择客户订单号', trigger: 'blur' }
        ], fpaezText2: [
          { required: true, message: '请选择客户PO NO', trigger: 'blur' }
        ]
      },
      dialogImageUrl: '',
      dialogVisible: false
    }
  },
  created() {
    this.queryTBasBilltype()
    this.handleGetPurchase()
    this.queryFpaezCombo()
    this.querySalOrderFxxchange()
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
        for (const item of this.prodValue.saleDetails) {
          if (item.fmaterialId === '' || item.funitId === '' || item.fqty === '' || item.fdeliveryDate === '') {
            this.$message.error('表格不能为空或删除空行')
            this.loading = false
            return false
          }
        }
        for (const item of this.prodValue.planDetails) {
          if (item.frecAdvanceRate === '' || item.frecAdvanCeamount === '') {
            this.$message.error('表格不能为空')
            this.loading = false
            return false
          }
        }
        const DATA = this.prodValue
        insertSalOrder(DATA).then(res => {
          this.prodValue.fbillNo = res.data
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
          this.$message.error(error)
        })
      })
    },
    // 查询单据类型
    async queryTBasBilltype() {
      const { data: RES } = await queryTBasBilltype()
      this.billtypes = RES
    },
    // 获取组织
    async handleGetPurchase() {
      const { data: RES } = await queryTOrgOrganizationsL()
      this.teamList = RES
    },
    // 获取客户列表
    async queryTBdCustomerList() {
      this.isclientlDialog = true
      const DATA = this.client
      const { data: RES } = await queryTBdCustomerList(DATA)
      this.clientlDialogData = RES.array
      this.client.total = RES.total
    },
    // 客户弹窗选中
    clientlSelectRow(item) {
      this.prodValue.fcustId = item.fcustId
      this.prodValue.fname = item.fname
      this.isclientlDialog = false
    },
    clientSearch() {
      this.client.pageNum = 1
      this.queryTBdCustomerList()
    },
    // 查询交货方式
    async queryFheadDelivery() {
      this.isdeliverlDialog = true
      const DATA = this.deliver
      const { data: RES } = await queryFheadDelivery(DATA)
      this.deliverlDialogData = RES.array
      this.deliver.total = RES.total
    },
    deliverSearch() {
      this.deliver.pageNum = 1
      this.queryFheadDelivery()
    },
    // 选择交货方式
    deliverlSelectRow(item) {
      this.prodValue.fdataValue = item.fdataValue
      this.prodValue.fheadDeliveryWay = item.fheadDeliveryWay
      this.isdeliverlDialog = false
    }, // 选择交货方式
    marketSelectRow(item) {
      this.prodValue.fdataValue = item.fdataValue
      this.prodValue.fheadDeliveryWay = item.fheadDeliveryWay
      this.isdmarketlDialog = false
    },
    // 查询销售员
    async querySalesperson() {
      this.ismarketlDialog = true
      const DATA = this.market
      const { data: RES } = await querySalesperson(DATA)
      this.marketDialogData = RES.array
      this.market.total = RES.total
    },
    marketSearch() {
      this.market.pageNum = 1
      this.querySalesperson()
    },
    // 选择销售员
    marketlSelectRow(item) {
      this.prodValue.fsalerIdName = item.fname
      this.prodValue.fsalerId = item.fsalerId
      this.ismarketlDialog = false
    },
    // 查询结算币别
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
      this.prodValue.fsettleCurrIdName = item.fname
      this.prodValue.fsettleCurrId = item.fcurrencyId
      this.isCurrencyDialog = false
      // 获取汇率
      this.querySalerRate()
    },
    // 收款条件
    async querytReccondition() {
      this.isgatheringDialog = true
      const DATA = this.gathering
      const { data: RES } = await querytReccondition(DATA)
      this.gatheringDialogData = RES.array
      this.gathering.total = RES.total
    },
    gatheringSearch() {
      this.gathering.pageNum = 1
      this.querytReccondition()
    },
    // 选择收款条件
    gatheringSelectRow(item) {
      this.prodValue.frecConditionIdName = item.fname
      this.prodValue.frecConditionId = item.frecConditionId
      this.isgatheringDialog = false
    },
    // 品质标准
    async queryFpaezCombo() {
      const { data: RES } = await queryFpaezCombo()
      this.standard = RES
    },
    // 查询销售订单本位币和汇率类型
    async querySalOrderFxxchange() {
      const { data: RES } = await querySalOrderFxxchange()
      this.prodValue.flocalCurrId = RES.flocalCurrId
      this.prodValue.fxxchangeTypeId = RES.fxxchangeTypeId
      this.prodValue.flocalCurrIdName = RES.flocalCurr
      this.prodValue.fxxchangeTypeIdName = RES.fxxchangeType
    },
    // 查询销售订单汇率
    async querySalerRate() {
      const DATA = { fxxchangeTypeId: this.prodValue.fxxchangeTypeId, fsettleCurrId: this.prodValue.fsettleCurrId, flocalCurrId: this.prodValue.flocalCurrId }
      const { data: RES } = await querySalerRate(DATA)
      if (RES) {
        this.prodValue.fexchangeRate = RES.fexchangeRate
      } else {
        this.prodValue.fexchangeRate = ''
      }
    },
    // 价目表
    async handlePriceList() {
      this.openPriceList = true
      const { data: RES } = await queryTPurPatLs({ ...this.priceListPagination })
      this.priceListData = RES.array
      this.priceListPagination.total = RES.total
    },
    // 获取价目表
    priceListSelectRow(item) {
      this.prodValue.fpriceListIdName = item.fname
      this.prodValue.fpriceListId = item.fid
      this.openPriceList = false
    },
    // 接受子组件数据
    prodOrder(ev) {
      this.prodValue.saleDetails = ev.saleDetails
      this.prodValue.planDetails = ev.planDetails
    },
    // 上传图片
    handleAvatarSuccess(res, file) {
      this.imageUrl = URL.createObjectURL(file.raw)
    }
  }
}
</script>
<style scoped lang="scss">
.content {
  @include listBom;
  .el-form{
    display: flex;
    flex-wrap: wrap;
    .el-form-item {
     width: 263px;
    }
  }
}
.el-input__icon{
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
    min-width: 65px;
    color: #606266;
    line-height: 40px;
  }

  .input-width {
    width: 200px;
    margin-right: 10px;
  }
}
 .avatar-uploader .el-upload {
   border: 1px dashed #d9d9d9;
   border-radius: 6px;
   cursor: pointer;
   position: relative;
   overflow: hidden;
 }
.avatar-uploader .el-upload:hover {
  border-color: #409EFF;
}
.avatar-uploader-icon {
  font-size: 28px;
  color: #8c939d;
  width: 78px;
  height: 78px;
  line-height: 78px;
  text-align: center;
  border: 1px dashed  #aaa;
  border-radius: 6px;
}
.avatar {
  width: 78px;
  height: 78px;
  display: block;
  border-radius: 6px;
}
</style>
