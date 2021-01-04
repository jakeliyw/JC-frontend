<template>
  <div class="content">
    <el-button type="primary" style="width: 80px;margin-bottom: 10px" @click="subMarker()">保存</el-button>
    <el-tabs type="border-card">
      <el-tab-pane label="主产品">
        <el-form ref="purchaseRef" :model="prodValue" label-width="100px">
          <el-form-item label="单据类型" prop="fbillType">
            <el-input
              v-model="prodValue.fbillType"
              placeholder="请选择单据类型"
              size="mini"
              disabled
            />
          </el-form-item>
          <el-form-item label="销售组织" prop="fsaleOrgId">
            <el-input v-model="prodValue.fsaleOrg" placeholder="请选择组织" disabled size="mini" />
          </el-form-item>
          <el-form-item label="客户" prop="fcustId">
            <el-input v-model.trim="prodValue.customer" placeholder="请选择客户" size="mini">
              <i
                slot="suffix"
                class="el-input__icon el-icon-search"
                @click="queryTBdCustomerList()"
              />
            </el-input>
          </el-form-item>
          <el-form-item label="交货方式" prop="fheadDeliveryWay">
            <el-input v-model.trim="prodValue.fdataValue" placeholder="请选择交货方式" size="mini">
              <i
                slot="suffix"
                class="el-input__icon el-icon-search"
                @click="queryFheadDelivery()"
              />
            </el-input>
          </el-form-item>
          <el-form-item label="销售员" prop="fsalerId">
            <el-input v-model.trim="prodValue.fsaler" placeholder="请选择销售员" size="mini">
              <i
                slot="suffix"
                class="el-input__icon el-icon-search"
                @click="querySalesperson()"
              />
            </el-input>
          </el-form-item>
          <el-form-item label="结算币别" prop="fsettleCurrId">
            <el-input v-model.trim="prodValue.fsettleCurr" placeholder="请选择结算币别" size="mini">
              <i
                slot="suffix"
                class="el-input__icon el-icon-search"
                @click="queryTBdCurrency()"
              />
            </el-input>
          </el-form-item>
          <el-form-item label="收款条件" prop="frecConditionId">
            <el-input v-model.trim="prodValue.frecCondition" placeholder="请选择收款条件" size="mini">
              <i
                slot="suffix"
                class="el-input__icon el-icon-search"
                @click="querytReccondition()"
              />
            </el-input>
          </el-form-item>
          <el-form-item label="单据编号">
            <el-input v-model="prodValue.fbillNo" placeholder="保存自动生成" disabled size="mini" />
          </el-form-item>
          <el-form-item label="汇率类型">
            <el-input v-model="prodValue.fexchangeType" placeholder="请输入汇率类型" disabled size="mini" />
          </el-form-item>
          <el-form-item label="本位币">
            <el-input v-model="prodValue.flocalCurr" placeholder="请输入本位币" disabled size="mini" />
          </el-form-item>
          <el-form-item label="汇率">
            <el-input v-model="prodValue.fexchangeRate" disabled size="mini" />
          </el-form-item>
          <el-form-item label="价目表" prop="fpriceListId">
            <el-input v-model.trim="prodValue.fpriceList" placeholder="请选择价目表" size="mini">
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
          <el-form-item label="备注" prop="fnote">
            <el-input v-model.trim="prodValue.fnote" type="textarea" placeholder="请填写备注" size="mini" />
          </el-form-item>
          <el-form-item label="是否含税">
            <el-checkbox v-model="prodValue.fisIncludedTax" />
          </el-form-item>
        </el-form>
        <el-tabs v-model="activeName">
          <el-tab-pane label="明细信息" name="first">
            <jc-table
              :table-data="saleDetails"
              :table-header="tableHeard1"
              serial
              :cell-style="cellStyle"
            >
              <el-table-column label="物料编码" prop="fmaterialId" align="center" width="200px">
                <template slot-scope="scope">
                  <el-input v-model.trim="scope.row.fnumber" placeholder="请选择物料编码" size="mini">
                    <i slot="prefix" class="iconfont icon-jin-rud-ao-bo" @click="sonJumpMateriel(scope.row.fmaterialIdName)" />
                    <i
                      slot="suffix"
                      class="el-input__icon el-icon-search"
                      @click="handleGetMateriel(scope.row, scope.$index)"
                    />
                  </el-input>
                </template>
              </el-table-column>
              <el-table-column label="物料描述" prop="fdescripTion" align="center" min-width="200px" :show-overflow-tooltip="true" />
              <el-table-column label="销售单位" prop="funit" align="center" />
              <el-table-column label="销售数量" prop="fqty" min-width="140px" align="center">
                <template slot-scope="scope">
                  <el-input-number
                    v-model="scope.row.fqty"
                    :min="1"
                    size="mini"
                  />
                </template>
              </el-table-column>
              <el-table-column label="是否赠品" prop="fisFree" align="center">
                <template slot-scope="scope">
                  <el-checkbox v-model="scope.row.fisFree" :value="scope.row.fisFree" @change="handleCheckedCitiesChange(scope.row.fisFree, scope.$index)" />
                </template>
              </el-table-column>
              <el-table-column label="税率" min-width="140px" align="center">
                <template slot-scope="scope">
                  <el-input-number
                    v-model="scope.row.ftaxRate"
                    :min="0"
                    :max="100"
                    size="mini"
                    :disabled="scope.row.fisFree"
                  />
                </template>
              </el-table-column>
              <el-table-column label="要货时间" prop="fqty" min-width="220px" align="center">
                <template slot-scope="scope">
                  <el-date-picker v-model="scope.row.fdeliveryDate" type="datetime" value-format="yyyy-MM-dd HH:mm:ss" size="mini" placeholder="选择日期" />
                </template>
              </el-table-column>
              <el-table-column label="操作" prop="fqty" min-width="100px" align="center">
                <template slot-scope="scope">
                  <el-button type="danger" size="medium" @click="delectSale(scope.$index)">删除</el-button>
                </template>
              </el-table-column>
            </jc-table>
          </el-tab-pane>
          <el-tab-pane label="收款计划" name="second">
            <jc-table
              :table-data="planDetails"
              :table-header="tableHeader2"
              serial
              :cell-style="cellStyle"
            >
              <el-table-column label="是否预收" prop="fqty" align="center" width="80px">
                <template slot-scope="scope">
                  <el-checkbox v-model="scope.row.fneedRecAdvance" :value="scope.row.fneedRecAdvance" />
                </template>
              </el-table-column>
              <el-table-column label="应收比例%" align="center">
                <template slot-scope="scope">
                  <el-input-number
                    v-model="scope.row.frecAdvanceRate"
                    :min="0"
                    :max="100"
                    size="mini"
                  />
                </template>
              </el-table-column>
              <el-table-column label="应收金额" align="center">
                <template slot-scope="scope">
                  <el-input-number
                    v-model="scope.row.frecAdvanCeamount"
                    :min="0"
                    size="mini"
                  />
                </template>
              </el-table-column>
            </jc-table>
          </el-tab-pane>
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
        <span class="materiel-code">销售名称</span>
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
        <el-input v-model.trim="FNUMBER" class="input-width" size="mini" placeholder="请输入物料编码" @keyup.enter.native="handleMaterielSearch" />
        <span class="materiel-code">物料描述</span>
        <el-input v-model.trim="FDESCRIPTION" class="input-width" size="mini" placeholder="请输入物料描述" @keyup.enter.native="handleMaterielSearch" />
        <span class="materiel-code">物料规格</span>
        <el-input v-model.trim="FSPECIFICATION" class="input-width" size="mini" placeholder="请输入规格" @keyup.enter.native="handleMaterielSearch" />
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
  insertSalOrder,
  queryMaterialList,
  queryTSalOrderNtry,
  updateSalOrder
} from '@/api/marketManage/marketOrder'
import jcTable from '@/components/Table'
import jcPagination from '@/components/Pagination'
import jumpMateriel from '@/components/JumpMateriel'
import { queryTPurPatLs } from '@/api/modifyPriceManagement/createModifyPrice'

export default {
  name: 'CreateMarkerOrder',
  components: {
    jcTable,
    jcPagination
  },
  mixins: [jumpMateriel],
  data() {
    return {
      tableHeard1: [], // 明细信息
      tableHeader2: [], // 收款计划
      rateIndex: '', // 税率下标
      // disabled: false, // 税率是否禁用
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
        { label: '使用组织', prop: 'fuseOrg', align: 'center' },
        { label: '物料编码', prop: 'fnumber', align: 'center' },
        { label: '描述', prop: 'fdescripTion', align: 'center', minWidth: '150px' },
        { label: '物料规格', prop: 'fspecificaTion', align: 'center' },
        { label: '型号', prop: 'fmodel', align: 'center' },
        { label: '创建时间', prop: 'fcreateDate', align: 'center' }
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
      activeName: 'first',
      // 点击行的序号
      tableIndex: 0,
      billtypes: [], // 单据类型
      teamList: [], // 组织
      cellStyle: { padding: '10 10' },
      prodValue: {}, // 表单数据
      saleDetails: [], // 明细数据
      planDetails: [] // 明细数据
    }
  },
  created() {
    this.queryTBasBilltype() // 查询单据类型
    this.handleGetPurchase() // 获取组织
    this.queryFpaezCombo() // 品质标准
    this.querySalOrderFxxchange() // 查询销售订单本位币和汇率类型
    this.queryTSalOrderNtry() // 获取订单列表数据
  },
  methods: {
    // 获取订单列表数据
    async queryTSalOrderNtry() {
      const id = this.$route.params.id
      const DATA = { fid: id }
      const { data: RES } = await queryTSalOrderNtry(DATA)
      if (RES.fcloseStatus === 'A') {
        RES.fcloseStatus = '正常'
      } else {
        RES.fcloseStatus = '已关闭'
      }
      this.prodValue = RES
      this.saleDetails = RES.saleDetails
      this.planDetails = RES.planDetails
      // 修改自动添加一条空数据
      this.saleDetails.push(
        {
          fmaterialId: '', fdescripTion: '', funitId: '', fqty: '', fisFree: false, ftaxRate: '', fdeliveryDate: ''
        }
      )
    },
    // 保存
    subMarker() {
      for (const item of this.prodValue.saleDetails) {
        if (item.fmaterialId === '' || item.funitId === '' || item.fqty === '' || item.fdeliveryDate === '') {
          this.$message.error('表格不能为空或删除空行')
          return false
        }
      }
      for (const item of this.prodValue.planDetails) {
        if (item.frecAdvanceRate === '' || item.frecAdvanCeamount === '') {
          this.$message.error('表格不能为空')
          return false
        }
      }
      const DATA = this.prodValue
      this.prodValue.planDetails = this.planDetails
      this.prodValue.saleDetails = this.saleDetails
      updateSalOrder(DATA).then(res => {
        if (res.code === 0) {
          this.$message({
            type: 'success',
            message: '修改成功'
          })
          setTimeout(() => {
            location.reload()
          }, 2000)
        }
      }).catch(error => {
        this.$message.error(error)
      })
    },
    // 物料弹窗选中
    async materielSelectRow(item) {
      this.saleDetails[this.tableIndex].fmaterialId = item.fmaterialId
      this.saleDetails[this.tableIndex].fnumber = item.fnumber
      this.saleDetails[this.tableIndex].fdescripTion = item.fdescripTion
      this.saleDetails[this.tableIndex].funitId = item.funitId
      this.saleDetails[this.tableIndex].funit = item.funitName
      this.isMaterielDialog = false
    },
    // 打开物料编码
    async handleGetMateriel(row, index) {
      this.tableIndex = index
      if (index === this.saleDetails.length - 1) {
        this.saleDetails.push(
          {
            fmaterialId: '', fdescripTion: '', funitId: '', fqty: '', fisFree: false, ftaxRate: '', fdeliveryDate: ''
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
      const { data: RES } = await queryMaterialList(DATA)
      this.materielDialogData = RES.array
      this.materielPagination.total = RES.total
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
      this.prodValue.customer = item.fname
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
      this.prodValue.fsaler = item.fname
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
      this.prodValue.fsettleCurr = item.fname
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
      this.prodValue.frecCondition = item.fname
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
      this.prodValue.fpriceList = item.fname
      this.prodValue.fpriceListId = item.fid
      this.openPriceList = false
    },
    // 监听是否勾选赠品
    handleCheckedCitiesChange(val, index) {
      this.rateIndex = index
      if (val) {
        this.saleDetails[this.rateIndex].ftaxRate = ''
      }
    },
    // 删除明细空行
    delectSale(index) {
      if (index === 0) {
        this.$message.error('不能删除第一行')
        return false
      }
      this.saleDetails.splice(index, 1)
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
      max-width: 263px;
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
