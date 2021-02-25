<template>
  <div class="content">
    <jc-title />
    <el-tabs v-model="activeName" type="border-card" @tab-click="handleOther">
      <el-tab-pane label="价目" name="purchase" class="layout">
        <div class="header">
          <el-button size="mini" @click="refresh">刷新</el-button>
          <el-button size="mini" type="primary" @click="preservation">确定更新</el-button>
        </div>
        <el-form ref="purchaseRef" :model="purchaseForm" label-width="100px" size="mini">
          <el-row :gutter="30" type="flex" justify="start" class="elRow">
            <el-col :span="6">
              <el-form-item label="创建组织" prop="fcreateorgId">
                <el-select v-model="purchaseForm.fcreateorgId" placeholder="请选择组织" disabled class="input-width" />
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item label="供应商" prop="fsupplier">
                <el-input v-model="purchaseForm.fsupplier" class="input-width" disabled>
                  <i slot="suffix" class="el-input__icon el-icon-search" />
                </el-input>
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item label="币别" prop="fcurrency">
                <el-input v-model="purchaseForm.fcurrency" class="input-width" disabled>
                  <i slot="suffix" class="el-input__icon el-icon-search" />
                </el-input>
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item label="供应商税率" prop="fpaezBase">
                <el-input v-model="purchaseForm.fpaezBase" class="input-width" disabled>
                  <i slot="suffix" class="el-input__icon el-icon-search" />
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
                <el-input v-model="purchaseForm.fname" class="input-width" disabled />
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item label="价目表对象" prop="fpriceObject">
                <el-select v-model="purchaseForm.fpriceObject" placeholder="请选择价目表" disabled class="input-width" />
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item label="价格类型" prop="fpriceType">
                <el-select v-model="purchaseForm.fpriceType" placeholder="请选择价格类型" disabled class="input-width" />
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item label="含税" prop="fisIncludedTax">
                <el-checkbox v-model="purchaseForm.fisIncludedTax" @change="handleTax" />
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item label="描述" prop="fdescripTion">
                <el-input v-model="purchaseForm.fdescripTion" type="textarea" disabled />
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
          <el-table-column label="物料编码" prop="fnumber" align="center" width="200px">
            <template slot-scope="scope">
              <el-input v-model="scope.row.fnumber" placeholder="请选择物料编码" size="mini">
                <i slot="prefix" class="iconfont icon-jin-rud-ao-bo" @click="sonJumpMateriel(scope.row.fnumber)" />
                <i
                  slot="suffix"
                  class="el-input__icon el-icon-search"
                  @click="handleGetMateriel(scope.row, scope.$index)"
                />
              </el-input>
            </template>
          </el-table-column>
          <el-table-column label="物料描述" prop="fdescripTion" align="center" min-width="200px" :show-overflow-tooltip="true" />
          <el-table-column label="物料规格" prop="fspecificaTion" align="center" :show-overflow-tooltip="true" />
          <el-table-column label="尺寸单位" prop="fvolumeUnit" align="center" />
          <el-table-column label="计价单位" prop="funit" align="center" />
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
                value-format="yyyy-MM-dd"
                style="width: 150px"
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
            <el-button type="danger" size="mini" @click="deleteMateriel(clo.scope.row, clo.scope.$index)">删除价目
            </el-button>
          </template>
        </jc-table>
      </el-tab-pane>
      <el-tab-pane label="其它" name="other">
        <jc-other
          :other-url-object="otherUrlObject"
          :other-log-table-data="otherLogTableData"
        >
          <jc-pagination
            v-show="otherPagination.total > 0"
            slot="slotPagination"
            :total="otherPagination.total"
            :page.sync="otherPagination.pageNum"
            :limit.sync="otherPagination.pageSize"
            @pagination="handleOther"
          />
        </jc-other>
      </el-tab-pane>
    </el-tabs>

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
import { queryBomSonList, queryMaterialSon } from '@/api/engineering/createBom'
import { detailPriceList, queryPricelistLog } from '@/api/purchaseManagement/purchasePrice'
import jcTitle from '@/components/Title'
import jcOther from '@/components/Other'
import jumpMateriel from '@/components/JumpMateriel'
import {
  updatePurPrice
} from '@/api/purchaseManagement/createPurchasePrice'
import jcTable from '@/components/Table'
import jcPagination from '@/components/Pagination/index'
import search from '@/components/Search'
import searData from '@/components/Search/mixin'

export default {
  name: 'EditPurchasePrice',
  components: {
    jcTable,
    jcPagination,
    jcTitle,
    jcOther,
    search
  },
  mixins: [jumpMateriel, searData],
  inject: ['reload'],
  data() {
    return {
      ftype: 0,
      fbillNo: 'fnumber', // 编码
      activeName: 'purchase', // 默认在采购
      tableData: [], // 采购价目表
      tableHeader: [
        { label: '价格上限', prop: 'fupPrice', align: 'center' },
        { label: '价格下限', prop: 'fdownPrice', align: 'center' },
        { label: '操作', type: 'btn', fixed: 'right', minWidth: '100px', align: 'center' }
      ],
      materielDialogData: [],
      materielDialogHeader: [
        { label: '物料编码', prop: 'FNUMBER', align: 'center' },
        { label: '物料规格', prop: 'FSPECIFICATION', align: 'center' },
        { label: '尺寸单位', prop: 'FVOLUMEUNIT', align: 'center' },
        { label: '型号', prop: 'FMODEL', align: 'center' },
        { label: '描述', prop: 'FDESCRIPTION', align: 'center', minWidth: '150px' },
        { label: '创建时间', prop: 'FCREATEDATE', align: 'center' }
      ],
      // 物料弹窗分页
      materielPagination: {
        total: 0, // 总条目
        pageNum: 1, // 当前页
        pageSize: 10 // 每页显示多少条数据
      },
      ftaxRate: 0, // 税率
      openMaterialDialog: false, // 物料弹窗
      FNUMBER: '', // 弹窗编码
      FDESCRIPTION: '', // 弹窗描述
      FSPECIFICATION: '', // 弹窗物料规格
      cellStyle: { padding: '10 10' }, // 行高
      fpriceDisabled: true, // 单价禁用
      ftaxPriceDisabled: false, // 含税单价禁用
      // 点击行的序号
      tableIndex: 0,
      otherUrlObject: {}, // 其它审核人
      otherLogTableData: [], // 日志数据
      otherPagination: {
        pageNum: 1,
        pageSize: 10,
        total: 0
      },
      // 采购价目表头
      purchaseForm: {
        fid: '', // 价目表ID
        fcreateOrgId: '', // 组织值
        fpriceObject: '', // 价目表值
        fpriceType: '', // 价格类型值
        fpaezBase: '', // 供应商税率
        fsupplier: '', // 供应商名称
        fcurrency: '', // 币别名称
        code: '', // 编码
        fname: '', // 名称
        fisIncludedTax: false, // 含税
        fdescripTion: '' // 描述
      }
    }
  },
  mounted() {
    this.getPriceList()
  },
  methods: {
    // 获取其它
    async handleOther() {
      const RES = await queryPricelistLog({ ...this.otherPagination, fid: this.$route.params.id })
      this.otherLogTableData = RES.data.array
      this.otherPagination.total = RES.data.total
      this.otherUrlObject = RES.data.operator
    },
    async getPriceList() {
      const { data: RES } = await detailPriceList({ fid: this.$route.params.id })
      this.ftaxRate = RES.ftaxRate
      RES.fisIncludedTax = JSON.parse(RES.fisIncludedTax)
      this.purchaseForm = RES
      this.tableData = RES.detail
    },
    // 保存采购列表
    preservation() {
      for (const ITEM of this.tableData) {
        if (ITEM.fmaterialId === '' || ITEM.fprice === 0 ||
          ITEM.ftaxPrice === 0 || ITEM.fminNum === 0 || ITEM.feffectiveDate == null) {
          this.$message.warning('表格不能为空,或表格值不能为0')
          return
        }
      }
      const DETAILS = this.tableData.map(item => {
        return {
          fmaterialId: item.fmaterialId,
          fprice: item.fprice,
          ftaxPrice: item.ftaxPrice,
          fminNum: item.fminNum,
          fupPrice: item.fupPrice,
          fdownPrice: item.fdownPrice,
          ftaxRate: item.ftaxRate,
          fentryEffectiveDate: item.feffectiveDate
        }
      })
      const DATA = {
        fid: this.purchaseForm.fid,
        details: DETAILS
      }
      updatePurPrice(DATA).then(res => {
        if (res.code !== 0) {
          this.$message.warning(res.message)
          return
        }
        this.$message.success(res.message)
        this.reload()
      }).catch(error => {
        this.$message.error(error)
      })
    },
    // 物料弹窗选中
    async materielSelectRow(item) {
      const { data: RES } = await queryMaterialSon({ fmateriAalId: item.FMATERIALID })
      this.tableData[this.tableIndex].fnumber = RES.FNUMBER
      this.tableData[this.tableIndex].fmaterialId = RES.FMATERIALID
      this.tableData[this.tableIndex].fvolumeUnit = RES.FVOLUMEUNIT
      this.tableData[this.tableIndex].fspecificaTion = RES.FSPECIFICATION
      this.tableData[this.tableIndex].funit = RES.FBASEUNIT
      this.tableData[this.tableIndex].fdescripTion = RES.FDESCRIPTION
      this.openMaterialDialog = false
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
    async handleGetMateriel(row, index) {
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
            feffectiveDate: new Date(), // 生效时间
            ftaxRate: this.ftaxRate, // 税率
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
    // 含税选中
    handleTax() {
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
      row.ftaxPrice = row.fprice * (1 + row.ftaxRate / 100)
      // // 上限
      row.fupPrice = row.fprice
      // // 下限
      row.fdownPrice = row.fprice
    },
    // 含税单价
    handleTaxIncluded(row) {
      row.fprice = row.ftaxPrice / (1 + row.ftaxRate / 100)
      // 上限
      row.fupPrice = row.ftaxPrice
      // 下限
      row.fdownPrice = row.ftaxPrice
    },
    // 税率影响
    handleTaxRate(row) {
      if (!this.fpriceDisabled) {
        row.ftaxPrice = row.fprice * (1 + row.ftaxRate / 100)
        row.fupPrice = row.ftaxPrice
        row.fdownPrice = row.ftaxPrice
        row.fupPrice = row.fupPrice.toFixed(4)
        row.fdownPrice = row.fdownPrice.toFixed(4)
      } else {
        row.fprice = row.ftaxPrice / (1 + row.ftaxRate / 100)
        row.fupPrice = row.fprice
        row.fdownPrice = row.fprice
        row.fupPrice = row.fupPrice.toFixed(4)
        row.fdownPrice = row.fdownPrice.toFixed(4)
      }
    },
    // 关闭弹窗事件
    closeDialog() {
      this.materielPagination.pageNum = 1
      this.openMaterialDialog = false
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
    deleteMateriel(item, index) {
      if (index === 0) {
        this.$message.warning('不能删除首行数据')
        return
      }
      this.tableData.splice(index, 1)
      this.$message.success('删除行成功')
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
</style>
