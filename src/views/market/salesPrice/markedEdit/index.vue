<template>
  <div class="content">
    <jc-title />
    <el-button type="primary" style="width: 80px;margin-bottom: 10px" size="mini" @click="subMarker()">保存</el-button>
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
              <el-form-item label="价目名称">
                <el-input v-model="organizationValue.fname" size="mini" />
              </el-form-item>
              <el-form-item label="客户">
                <el-input v-model="organizationValue.fcustName" placeholder="请选择客户" size="mini">
                  <i
                    slot="suffix"
                    class="el-input__icon el-icon-search"
                    @click="clientVisiblit=true"
                  />
                </el-input>
              </el-form-item>
              <el-form-item label="限定客户" prop="limitName">
                <el-select v-model.trim="limitName" size="mini" disabled>
                  <option label="客户" value="1">客户</option>
                </el-select>
              </el-form-item>
              <el-form-item label="币别">
                <el-input v-model="organizationValue.fcurrency" size="mini">
                  <i
                    slot="suffix"
                    class="el-input__icon el-icon-search"
                    @click="currencyVisiblit=true"
                  />
                </el-input>
              </el-form-item>
              <el-form-item label="备注">
                <el-input v-model="organizationValue.fdescripTion" type="textarea" size="mini" />
              </el-form-item>
              <el-form-item label="含税">
                <el-checkbox v-model="organizationValue.fisIncludedTax" />
              </el-form-item>
            </el-form>
          </div>
        </div>
        <div class="table-content">
          <jc-table
            :table-data="tableData"
            :table-header="tableHeader"
            table-height="55vh"
            :cell-style="cellStyle"
          >
            <el-table-column label="物料编码" prop="fmaterialId" align="center" min-width="135px">
              <template slot-scope="scope">
                <el-input v-model.trim="scope.row.fmaterialIdName" placeholder="请选择物料编码" size="mini">
                  <i slot="prefix" class="iconfont icon-jin-rud-ao-bo" @click="sonJumpMateriel(scope.row.fmaterialIdName)" />
                  <i
                    slot="suffix"
                    class="el-input__icon el-icon-search"
                    @click="handleGetMateriel(scope.row, scope.$index)"
                  />
                </el-input>
              </template>
            </el-table-column>
            <el-table-column label="物料描述" prop="fdescripTion" align="center" min-width="250px" :show-overflow-tooltip="true" />
            <el-table-column label="销售单位" prop="funit" align="center" />
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
            <el-table-column label="操作" prop="fqty" min-width="80px" align="center" fixed="right">
              <template slot-scope="scope">
                <el-button type="danger" size="mini" @click="delectSale(scope.$index)">删除</el-button>
              </template>
            </el-table-column>
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
    <!--    币别列表弹窗-->
    <currency v-if="currencyVisiblit" @currency="currencyData" />
    <!--客户列表-->
    <client v-if="clientVisiblit" @client="clientData" />
  </div>
</template>

<script>
import jcTable from '@/components/Table'
import jcPagination from '@/components/Pagination'
import jcTitle from '@/components/Title'
import {
  querySalPriceNtry,
  updateSalPrice
} from '@/api/marketManage/marketPriceList'
import {
  queryMaterialList
} from '@/api/marketManage/marketOrder'
import jumpMateriel from '@/components/JumpMateriel' // 物料详情
import jcMarker from '@/components/marker'
import client from '@/views/market/marketManage/createMarkerOrder/components/client'
import currency from '@/views/market/marketManage/createMarkerOrder/components/currency'
import salPrice from '@/views/market/salesPrice/createMarketPrice/components/mixin' // 其他

export default {
  components: {
    jcTable,
    jcPagination,
    jcTitle,
    jcMarker,
    currency,
    client
  },
  mixins: [jumpMateriel, salPrice],
  inject: ['reload'],
  data() {
    return {
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
        { label: '型号', prop: 'fmodel', align: 'center' },
        { label: '物料编码', prop: 'fnumber', align: 'center' },
        { label: '描述', prop: 'fdescripTion', align: 'center', minWidth: '150px' },
        { label: '物料规格', prop: 'fspecificaTion', align: 'center' },
        { label: '创建时间', prop: 'fcreateDate', align: 'center' }
      ],
      // 点击行的序号
      tableIndex: 0,
      // 表头
      cellStyle: { padding: '10 10' }, // 行高
      tableData: [], // 价目明细数据
      tableHeader: [],
      // 表单
      organizationValue: {}, // 表单组织值
      organization: {}, // 表单组织控件
      limitName: '客户',
      // 结算币别
      currencyVisiblit: false,
      clientVisiblit: false, // 客户列表
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
      for (const iten of RES.detail) {
        iten.fmaterialIdName = iten.fnumber
      }
      this.tableData = RES.detail
      this.organizationValue = RES
      // 表格添加一空行
      this.tableData.push(
        { fpriceBase: 10, fdownPrice: 0 }
      )
    },
    // 保存
    subMarker() {
      for (const item of this.tableData) {
        if (!item.fmaterialIdName) {
          this.$message.error('表格不能为空或删除空行')
          return false
        }
      }
      const DATA = this.organizationValue
      this.organizationValue.priceDetails = this.tableData
      updateSalPrice(DATA).then(res => {
        this.loading = false
        if (res.code === 0) {
          this.$message({
            type: 'success',
            message: '修改成功'
          })
          setTimeout(() => {
            this.reload()
          }, 2000)
        }
      })
    },
    // 物料弹窗选中
    async materielSelectRow(item) {
      this.tableData[this.tableIndex].fmaterialId = item.fmaterialId
      this.isMaterielDialog = false
      this.querySalPriceMaterial()
    },
    // 打开物料编码
    async handleGetMateriel(row, index) {
      if (index || index === 0) {
        this.tableIndex = index
      }
      if (index === this.tableData.length - 1) {
        this.tableData.push(
          { fpriceBase: 10, fdownPrice: 0 }
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
    // 选择币别
    currencyData(item) {
      if (item.fsettleCurrId) {
        this.organizationValue.fcurrency = item.fsettleCurrIdName
        this.organizationValue.fcurrencyId = item.fsettleCurrId
        this.currencyVisiblit = item.isCurrencyDialog
      } else {
        // 点击关闭按钮
        this.currencyVisiblit = item.isCurrencyDialog
      }
    },
    // 获取客户数据(子传父)
    clientData(item) {
      this.organizationValue.fcustId = item.fcustId
      this.organizationValue.fcustName = item.fname
      this.clientVisiblit = item.isclientlDialog
    },
    // 删除明细空行
    delectSale(index) {
      if (index === 0) {
        this.$message.error('不能删除首行数据')
        return false
      }
      this.tableData.splice(index, 1)
    },
    // 监听销售系数
    inputNum(index) {
      this.tableIndex = index
      if (this.tableData[this.tableIndex].fmaterialId) {
        const tBase = (this.tableData[this.tableIndex].fpriceBase) / 100
        const tPrice = this.tableData[this.tableIndex].deliveryPrice
        this.tableData[this.tableIndex].fdownPrice = (tPrice * (1 + tBase)).toFixed(4) // 基准价
      }
    }
  }
}
</script>
<style lang="scss" scoped>
.content {
  @include listBom;
  .el-form{
    display: flex;
    flex-wrap: wrap;
    .el-form-item {
      max-width: 263px;
      margin-bottom: 15px;
    }
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
