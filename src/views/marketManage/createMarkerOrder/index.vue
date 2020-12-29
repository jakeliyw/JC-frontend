<template>
  <div class="content">
    <el-button type="primary" style="width: 80px;margin-bottom: 10px" @click="subMarker()">保存</el-button>
    <el-tabs type="border-card">
      <el-tab-pane label="主产品">
        <el-form v-model="prodValue" label-width="100px">
          <el-form-item label="单据类型">
            <el-select
              v-model="prodValue.fbillTypeId"
              placeholder="请选择单据类型"
            >
              <option
                v-for="billty in billtypes"
                :key="billty.fbillTypeId"
                :label="billty.fname"
                :value="billty.fbillTypeId"
              />
            </el-select></el-form-item>
          <el-form-item label="销售组织">
            <el-select v-model="prodValue.fsaleOrgId" placeholder="请选择组织">
              <el-option
                v-for="option in teamList"
                :key="option.value"
                :label="option.FNAME"
                :value="option.FPKID"
              />
            </el-select></el-form-item>
          <el-form-item label="客户">
            <el-input v-model="prodValue.fname" placeholder="请选择客户">
              <i
                slot="suffix"
                class="el-input__icon el-icon-search"
                @click="queryTBdCustomerList()"
              />
            </el-input></el-form-item>
          <el-form-item label="交货方式">
            <el-input v-model="prodValue.fdataValue" placeholder="请选择交货方式">
              <i
                slot="suffix"
                class="el-input__icon el-icon-search"
                @click="queryFheadDelivery()"
              />
            </el-input></el-form-item>
          <el-form-item label="销售员">
            <el-input v-model="prodValue.fsalerIdName" placeholder="请选择销售员">
              <i
                slot="suffix"
                class="el-input__icon el-icon-search"
                @click="querySalesperson()"
              />
            </el-input></el-form-item>
          <el-form-item label="结算币别">
            <el-input v-model="prodValue.fsettleCurrIdName" placeholder="请选择结算币别">
              <i
                slot="suffix"
                class="el-input__icon el-icon-search"
                @click="queryTBdCurrency()"
              />
            </el-input></el-form-item>
          <el-form-item label="收款条件">
            <el-input v-model="prodValue.frecConditionIdName" placeholder="请选择收款条件">
              <i
                slot="suffix"
                class="el-input__icon el-icon-search"
                @click="querytReccondition()"
              />
            </el-input></el-form-item>
          <el-form-item label="汇率类型">
            <el-input v-model="prodValue.fxxchangeTypeId" placeholder="请输入汇率类型" /></el-form-item>
          <el-form-item label="汇率">
            <el-input v-model="prodValue.fexchangeRate" placeholder="请输入汇率" /></el-form-item>
          <el-form-item label="本位币">
            <el-input v-model="prodValue.flocalCurrId" placeholder="请输入本位币" /></el-form-item>
          <el-form-item label="价目表ID">
            <el-input v-model="prodValue.fpriceListId" placeholder="请输入价目表" /></el-form-item>
          <el-form-item label="柜型">
            <el-input v-model="prodValue.fpaezText" placeholder="请输入柜型" /></el-form-item>
          <el-form-item label="客户订单号">
            <el-input v-model="prodValue.fpaezText1" placeholder="请输入客户订单号" /></el-form-item>
          <el-form-item label="客户PO NO">
            <el-input v-model="prodValue.fpaezText2" placeholder="请输入客户PO NO" /></el-form-item>
          <el-form-item label="品质标准">
            <el-select v-model="prodValue.fpaezCombo" placeholder="请选择品质标准">
              <option v-for="(item, index) in standard" :key="index" :label="item.label" :value="item.value" />
            </el-select></el-form-item>
          <el-form-item label="备注">
            <el-input v-model="prodValue.fnote" type="textarea" placeholder="请填写备注" /></el-form-item>
          <el-form-item label="是否含税">
            <el-checkbox v-model="prodValue.fisIncludedTax" />
          </el-form-item>
        </el-form>
        <el-tabs v-model="activeName">
          <el-tab-pane label="明细信息" name="first">
            <jc-table
              :table-data="prodValue.planDetails"
              :table-header="tableHeader"
              serial
              :cell-style="cellStyle"
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
              <el-table-column label="物料描述" prop="fdescripTion" align="center" min-width="200px" />
              <el-table-column label="销售单位" prop="funitId" />
              <el-table-column label="销售数量" prop="fqty" min-width="110">
                <template scope="scope">
                  <el-input-number
                    v-model="scope.row.fqty"
                    :min="1"
                    size="mini"
                  />
                </template>
              </el-table-column>
              <el-table-column label="是否赠品" prop="fqty">
                <template scope="scope">
                  <el-checkbox v-model="scope.row.fisFree" :value="scope.row.fisFree" />
                </template>
              </el-table-column>
              <el-table-column label="税率" prop="fqty">
                <template scope="scope">
                  <el-input v-model="scope.row.fentryTaxRate" size="mini" />
                </template>
              </el-table-column>
              <el-table-column label="要货时间" prop="fqty">
                <template scope="scope">
                  <el-date-picker v-model="scope.row.fdeliveryDate" size="mini" placeholder="选择日期" />
                </template>
              </el-table-column>
            </jc-table>
          </el-tab-pane>
          <el-tab-pane label="收款计划" name="second" />
        </el-tabs>
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
        <el-input v-model="client.fname" class="input-width" size="mini" placeholder="请输入客户名称" @keyup.enter.native="clientSearch" />
        <el-button size="mini" type="primary" @click="clientSearch">搜索</el-button>
      </div>
      <jc-table
        :table-data="clientlDialogData"
        :table-header="clientDialogHeader"
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
    <!--    收货方式弹窗-->
    <el-dialog
      title="交货方式"
      model
      :visible.sync="isdeliverlDialog"
      :close-on-click-modal="false"
      width="60%"
    >
      <div class="materiel-form">
        <span class="materiel-code">交货名称</span>
        <el-input v-model="deliver.fdataValue" class="input-width" size="mini" placeholder="请输入交货名称" @keyup.enter.native="deliverSearch" />
        <el-button size="mini" type="primary" @click="deliverSearch">搜索</el-button>
      </div>
      <jc-table
        :table-data="deliverlDialogData"
        :table-header="deliverDialogHeader"
        serial
        :cell-style="cellStyle"
        @clickRow="deliverlSelectRow"
      />
      <jc-pagination
        v-show="client.total > 0"
        :total="client.total"
        :page.sync="client.pageNum"
        :limit.sync="client.pageSize"
        @pagination="queryTBdCustomerList"
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
        <span class="materiel-code">客户名称</span>
        <el-input v-model="market.fname" class="input-width" size="mini" placeholder="请输入销售员名称" @keyup.enter.native="marketSearch" />
        <el-button size="mini" type="primary" @click="marketSearch">搜索</el-button>
      </div>
      <jc-table
        :table-data="marketDialogData"
        :table-header="marketDialogHeader"
        serial
        :cell-style="cellStyle"
        @clickRow="marketlSelectRow"
      />
      <jc-pagination
        v-show="market.total > 0"
        :total="market.total"
        :page.sync="market.pageNum"
        :limit.sync="market.pageSize"
        @pagination="queryTBdCustomerList"
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
        <el-input v-model="currency.fname" class="input-width" size="mini" placeholder="请输入币别名称" @keyup.enter.native="currencySearch" />
        <el-button size="mini" type="primary" @click="currencySearch">搜索</el-button>
      </div>
      <jc-table
        :table-data="currencyDialogData"
        :table-header="currencyDialogHeader"
        serial
        :cell-style="cellStyle"
        @clickRow="currencySelectRow"
      />
      <jc-pagination
        v-show="currency.total > 0"
        :total="currency.total"
        :page.sync="currency.pageNum"
        :limit.sync="currency.pageSize"
        @pagination="queryTBdCustomerList"
      />
    </el-dialog>
    <!--    销售订单收款条件列表弹窗-->
    <el-dialog
      title="订单收款条件"
      model
      :visible.sync="isgatheringDialog"
      :close-on-click-modal="false"
      width="60%"
    >
      <div class="materiel-form">
        <span class="materiel-code">币别名称</span>
        <el-input v-model="gathering.fname" class="input-width" size="mini" placeholder="请输入币别名称" @keyup.enter.native="gatheringSearch" />
        <el-button size="mini" type="primary" @click="gatheringSearch">搜索</el-button>
      </div>
      <jc-table
        :table-data="gatheringDialogData"
        :table-header="gatheringDialogHeader"
        serial
        :cell-style="cellStyle"
        @clickRow="gatheringSelectRow"
      />
      <jc-pagination
        v-show="gathering.total > 0"
        :total="gathering.total"
        :page.sync="gathering.pageNum"
        :limit.sync="gathering.pageSize"
        @pagination="queryTBdCustomerList"
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
        <el-input v-model="FNUMBER" class="input-width" size="mini" placeholder="请输入物料编码" @keyup.enter.native="handleMaterielSearch" />
        <span class="materiel-code">物料描述</span>
        <el-input v-model="FDESCRIPTION" class="input-width" size="mini" placeholder="请输入物料描述" @keyup.enter.native="handleMaterielSearch" />
        <span class="materiel-code">物料规格</span>
        <el-input v-model="FSPECIFICATION" class="input-width" size="mini" placeholder="请输入规格" @keyup.enter.native="handleMaterielSearch" />
        <el-button size="mini" type="primary" @click="handleMaterielSearch">搜索</el-button>
      </div>
      <jc-table
        :table-data="materielDialogData"
        :table-header="materielDialogHeader"
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
  queryBomSonList, queryMaterialSon,
  queryTOrgOrganizationsL
} from '@/api/engineering/createBom'
import { queryTBasBilltype,
  queryTBdCustomerList,
  queryFheadDelivery,
  querySalesperson,
  queryTBdCurrency,
  querytReccondition,
  queryFpaezCombo
} from '@/api/marketManage/marketOrder'
import jcTable from '@/components/Table'
import jcPagination from '@/components/Pagination'
import jcForm from '@/components/Form'

export default {
  name: 'CreateMarkerOrder',
  components: {
    jcTable,
    jcPagination,
    jcForm
  },
  data() {
    return {
      standard: [], // 品质标准
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
      materielDialogHeader: [
        { label: '使用组织', prop: 'FUSEORG', align: 'center' },
        { label: '物料编码', prop: 'FNUMBER', align: 'center' },
        { label: '物料规格', prop: 'FSPECIFICATION', align: 'center' },
        { label: '型号', prop: 'FMODEL', align: 'center' },
        { label: '描述', prop: 'FDESCRIPTION', align: 'center', minWidth: '150px' },
        { label: '创建时间', prop: 'FCREATEDATE', align: 'center' }
      ],
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
        { label: '物料编码', prop: 'fnumber', align: 'center' },
        { label: '客户名称', prop: 'fname', align: 'center' },
        { label: '物料编码', prop: 'fcustGroup', align: 'center' }
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
      currencyDialogHeader: [
        { label: '编码', prop: 'fnumber', align: 'center' },
        { label: '名称', prop: 'fname', align: 'center' },
        { label: '货币代码', prop: 'fcode', align: 'center' }
      ],
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
      activeName: 'first',
      // 点击行的序号
      tableIndex: 0,
      tableHeader: [],
      billtypes: [], // 单据类型
      teamList: [], // 组织
      prodValue: { fbillTypeId: '', fsaleOrgId: '', fcustId: '', fdataValue: '', fname: '', fsettleCurrIdName: '',
        fheadDeliveryWay: '', fsalerId: '', fnote: '', fsettleCurrId: '', fsalerIdName: '',
        frecConditionId: '', fisIncludedTax: '', fexchangeRate: '', frecConditionIdName: '',
        flocalCurrId: '', fxxchangeTypeId: '',
        planDetails: [
          { fmaterialId: '', fdescripTion: '', funitId: '', fqty: '', fisFree: '', fentryTaxRate: '', fdeliveryDate: '' }
        ], saleDetails: []
      },
      cellStyle: { padding: '10 10' }
    }
  },
  created() {
    this.queryTBasBilltype()
    this.handleGetPurchase()
    this.queryFpaezCombo()
  },
  methods: {
    subMarker() {
      console.log(this.prodValue)
    },
    // 物料弹窗选中
    async materielSelectRow(item) {
      const fmateriAalId = item.FMATERIALID
      const { data: RES } = await queryMaterialSon({ fmateriAalId })
      this.prodValue.planDetails[this.tableIndex].fmaterialId = RES.FNUMBER
      this.prodValue.planDetails[this.tableIndex].fdescripTion = RES.FDESCRIPTION
      this.prodValue.planDetails[this.tableIndex].funitId = RES.FBASEUNIT
      console.log(this.tableIndex)
      this.isMaterielDialog = false
    },
    // 打开物料编码
    async handleGetMateriel(row, index) {
      this.tableIndex = index
      if (index === this.prodValue.planDetails.length - 1) {
        this.prodValue.planDetails.push(
          {
            fmaterialId: '', fdescripTion: '', funitId: '', fqty: '', fisFree: '', fentryTaxRate: '', fdeliveryDate: ''
          }
        )
      }
      const DATA = {
        pageNum: this.materielPagination.pageNum,
        pageSize: this.materielPagination.pageSize,
        fnumber: this.FNUMBER,
        fdescription: this.FDESCRIPTION,
        fspecification: this.FSPECIFICATION
      }
      const { data: RES, total } = await queryBomSonList(DATA)
      this.materielDialogData = RES
      this.materielPagination.total = total
      this.isMaterielDialog = true
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
    // 搜索
    handleMaterielSearch() {
      this.materielPagination.pageNum = 1
      this.handleGetMateriel()
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
      const DATA = this.deliver
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
    // 选择结算货币
    gatheringSelectRow(item) {
      this.prodValue.frecConditionIdName = item.fname
      this.prodValue.frecConditionId = item.frecConditionId
      this.isgatheringDialog = false
    },
    // 品质标准
    async queryFpaezCombo() {
      const { data: RES } = await queryFpaezCombo()
      this.standard = RES.map(item => {
        return { label: item.fpaezCombo, value: item.fpaezCombo }
      })
      console.log(this.standard)
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
      max-width: 278px;
    }
  }
}
.el-input__icon{
  cursor: pointer;
}
el-form-item{
  max-width: 178px;
}
.materiel-form {
  display: flex;
  align-items: center;
  flex-direction: row;
  margin-bottom: 20px;

  .materiel-code {
    font-weight: bold;
    font-size: 14px;
    color: #606266;
    line-height: 40px;
    padding: 0 12px 0 0;
  }

  .input-width {
    width: 200px;
    margin-right: 10px;
  }
}
</style>
