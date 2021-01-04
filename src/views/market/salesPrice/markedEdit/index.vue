<template>
  <div class="content">
    <el-button type="primary" style="width: 80px;margin-bottom: 10px" @click="subMarker()">保存</el-button>
    <el-tabs type="border-card">
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
              <el-form-item label="币别">
                <el-input v-model="organizationValue.fcurrency" size="mini">
                  <i
                    slot="suffix"
                    class="el-input__icon el-icon-search"
                    @click="queryTBdCurrency()"
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
            :cell-style="cellStyle"
          >
            <el-table-column label="物料编码" prop="fmaterialId" align="center" width="200px">
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
            <el-table-column label="物料描述" prop="fdescripTion" align="center" min-width="200px" :show-overflow-tooltip="true" />
            <el-table-column label="单位" prop="funit" align="center" />
            <el-table-column label="价格系数" prop="fpriceBase" min-width="140px" align="center">
              <template slot-scope="scope">
                <el-input-number
                  v-model="scope.row.fpriceBase"
                  :min="1"
                  size="mini"
                />
              </template>
            </el-table-column>
            <el-table-column label="单价" prop="fprice" min-width="140px" align="center">
              <template slot-scope="scope">
                <el-input-number
                  v-model="scope.row.fprice"
                  :min="1"
                  size="mini"
                />
              </template>
            </el-table-column>
            <el-table-column label="最低限价" prop="fdownPrice" min-width="140px" align="center">
              <template slot-scope="scope">
                <el-input-number
                  v-model="scope.row.fdownPrice"
                  :min="1"
                  size="mini"
                />
              </template>
            </el-table-column>
            <el-table-column label="操作" prop="fqty" min-width="100px" align="center">
              <template slot-scope="scope">
                <el-button type="danger" size="medium" @click="delectSale(scope.$index)">删除</el-button>
              </template>
            </el-table-column>
          </jc-table>
        </div>
      </el-tab-pane>
      <el-tab-pane label="其他">
        <h1>待开发</h1>
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
    <el-dialog
      title="币别"
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
  </div>
</template>

<script>
import jcTable from '@/components/Table'
import jcPagination from '@/components/Pagination'
import {
  querySalPriceNtry, queryTBdCurrency,
  updateSalPrice
} from '@/api/marketManage/marketPriceList'
import {
  queryMaterialList
} from '@/api/marketManage/marketOrder'
import jumpMateriel from '@/components/JumpMateriel'

export default {
  components: {
    jcTable,
    jcPagination
  },
  mixins: [jumpMateriel],
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
        { label: '物料编码', prop: 'fnumber', align: 'center' },
        { label: '描述', prop: 'fdescripTion', align: 'center', minWidth: '150px' },
        { label: '物料规格', prop: 'fspecificaTion', align: 'center' },
        { label: '型号', prop: 'fmodel', align: 'center' },
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
      // 结算币别
      isCurrencyDialog: false,
      currency: {
        total: 0, // 总条目
        pageNum: 1, // 当前页
        pageSize: 10, // 每页显示多少条数据
        fname: ''
      },
      currencyDialogData: [],
      currencyDialogHeader: []
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
        { fmaterialId: '', funitId: '', fmaterialTypeId: '', fpriceBase: '', fprice: '', fdownPrice: '' }
      )
    },
    // 保存
    subMarker() {
      for (const item of this.tableData) {
        if (item.fmaterialId === '' || item.fprice === '' || item.fdownPrice === '' || item.fpriceBase === '') {
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
            location.reload()
          }, 2000)
        }
      }).catch(error => {
        this.$message.error(error)
      })
    },
    // 物料弹窗选中
    async materielSelectRow(item) {
      this.tableData[this.tableIndex].fmaterialId = item.fmaterialId
      this.tableData[this.tableIndex].fmaterialIdName = item.fnumber
      this.tableData[this.tableIndex].fdescripTion = item.fdescripTion
      this.tableData[this.tableIndex].funitId = item.funitId
      this.tableData[this.tableIndex].funit = item.funitName
      this.tableData[this.tableIndex].fmaterialTypeId = item.fcategoryId
      this.isMaterielDialog = false
    },
    // 打开物料编码
    async handleGetMateriel(row, index) {
      this.tableIndex = index
      if (index === this.tableData.length - 1) {
        this.tableData.push(
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
    // 选择货币
    currencySelectRow(item) {
      this.organizationValue.fcurrency = item.fname
      this.organizationValue.fcurrencyId = item.fcurrencyId
      this.isCurrencyDialog = false
    },
    // 删除明细空行
    delectSale(index) {
      if (index === 0) {
        this.$message.error('不能删除第一行')
        return false
      }
      this.tableData.splice(index, 1)
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
