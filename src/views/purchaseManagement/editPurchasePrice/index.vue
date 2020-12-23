<template>
  <div class="content">
    <el-tabs v-model="activeName" type="border-card">
      <el-tab-pane label="价目" name="purchase" class="layout">
        <div class="header">
          <el-button size="mini" @click="refresh">刷新</el-button>
          <el-button size="mini" type="primary" @click="preservation">保存价目</el-button>
        </div>
        <el-form :model="purchaseForm" ref="purchaseRef" label-width="100px" size="mini">
          <el-row :gutter="30" type="flex" justify="start" class="elRow">
            <el-col :span="6">
              <el-form-item label="创建组织" prop="fcreateorgId">
                <el-select v-model="purchaseForm.fcreateorgId" placeholder="请选择组织" disabled/>
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item label="币别" prop="fcurrency">
                <el-input class="input-width" v-model="purchaseForm.fcurrency" disabled>
                  <i slot="suffix" class="el-input__icon el-icon-search"/>
                </el-input>
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item label="供应商税率" prop="fpaezBase">
                <el-input class="input-width" v-model="purchaseForm.fpaezBase" disabled>
                  <i slot="suffix" class="el-input__icon el-icon-search"/>
                </el-input>
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item label="供应商" prop="fsupplier">
                <el-input class="input-width" v-model="purchaseForm.fsupplier" disabled>
                  <i slot="suffix" class="el-input__icon el-icon-search"/>
                </el-input>
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item label="单据编号" prop="code">
                <el-input class="input-width" placeholder="保存时自动生成" v-model="purchaseForm.code" disabled/>
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item label="名称" prop="fname">
                <el-input class="input-width" v-model="purchaseForm.fname" disabled/>
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item label="价目表对象" prop="fpriceObject">
                <el-select v-model="purchaseForm.fpriceObject" placeholder="请选择价目表" disabled/>
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item label="价格类型" prop="fpriceType">
                <el-select v-model="purchaseForm.fpriceType" placeholder="请选择价格类型" disabled/>
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item label="含税" prop="fisIncludedTax">
                <el-checkbox v-model="purchaseForm.fisIncludedTax" @change="handleTax"/>
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item label="描述" prop="fdescripTion">
                <el-input type="textarea" v-model="purchaseForm.fdescripTion" disabled/>
              </el-form-item>
            </el-col>
          </el-row>
        </el-form>
        <jc-table
          :table-data="tableData"
          :table-header="tableHeader"
          serial
          :cell-style="cellStyle"
          class="jcTable"
          table-height="auto"
        >
          <el-table-column label="物料编码" prop="fnumber" align="center" width="200px">
            <template slot-scope="scope">
              <el-input v-model="scope.row.fnumber" placeholder="请选择物料编码" size="mini">
                <i class="iconfont icon-jin-rud-ao-bo" slot="prefix" @click="sonJumpMateriel(scope.row.fnumber)"/>
                <i
                  slot="suffix"
                  class="el-input__icon el-icon-search"
                  @click="handleGetMateriel(scope.row, scope.$index)"
                />
              </el-input>
            </template>
          </el-table-column>
          <el-table-column label="物料描述" prop="fdescripTion" align="center" min-width="200px" :show-overflow-tooltip="true"/>
          <el-table-column label="规格型号" prop='fspecificaTion' align="center" :show-overflow-tooltip="true"/>
          <el-table-column label="计价单位" prop='funit' align="center"/>
          <el-table-column label="单价" prop="fprice" align="center" min-width="150px">
            <template slot-scope="scope">
              <el-input-number
                v-model="scope.row.fprice"
                size="mini"
                :disabled="fpriceDisabled"
                :precision="3"
                :step="0.1"
                :min="0"
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
                :precision="3"
                :step="0.1"
                :min="0"
                @change="handleTaxIncluded(scope.row)"
              />
            </template>
          </el-table-column>
          <el-table-column label="价格系数" prop="fpriceCoefficient" align="center" min-width="150px">
            <template slot-scope="scope">
              <el-input-number v-model.number="scope.row.fpriceCoefficient" size="mini" :precision="3" :step="0.1" :min="0"/>
            </template>
          </el-table-column>
          <el-table-column label="生效时间" prop="feffectiveDate" width="200px" align="center" min-width="150px">
            <template slot-scope="scope">
              <el-date-picker
                size="mini"
                v-model="scope.row.feffectiveDate"
                type="date"
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
                :precision="1"
                :step="0.1"
                :min="0"
                @change="handleTaxRate(scope.row)"
              />
            </template>
          </el-table-column>
          <template v-slot:btnSlot="clo">
            <el-button type="danger" size="mini" @click="deleteMateriel(clo.scope.row, clo.scope.$index)">删除bom
            </el-button>
          </template>
        </jc-table>
      </el-tab-pane>
      <el-tab-pane label="其它" name="other">
        <h2>待开发</h2>
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
        <el-input class="input-width" size="mini" placeholder="请输入物料编码" v-model="FNUMBER" @keyup.enter.native="handleMaterielSearch"/>
        <span class="materiel-code">物料描述</span>
        <el-input class="input-width" size="mini" placeholder="请输入物料描述" v-model="FDESCRIPTION" @keyup.enter.native="handleMaterielSearch"/>
        <span class="materiel-code">物料规格</span>
        <el-input class="input-width" size="mini" placeholder="请输入规格" v-model="FSPECIFICATION" @keyup.enter.native="handleMaterielSearch"/>
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
  queryBomSonList, queryMaterialSon
} from '@/api/engineering/createBom'
import { detailPriceList } from '@/api/purchaseManagement/purchasePrice'
import jumpMateriel from '@/components/JumpMateriel'
import {
  updatePurPrice
} from '@/api/purchaseManagement/createPurchasePrice'
import jcTable from '@/components/Table'
import jcPagination from '@/components/Pagination/index'

export default {
  name: 'EditPurchasePrice',
  components: {
    jcTable,
    jcPagination
  },
  mixins: [jumpMateriel],
  data() {
    return {
      activeName: 'purchase', // 默认在采购
      tableData: [
        {
          fnumber: '', // 物料编码
          fprice: 0, // 单价
          ftaxPrice: 0, // 含税单价
          fpriceCoefficient: 0, // 价格系数
          fupPrice: 0, // 价格上限
          fdownPrice: 0, // 价格下限
          feffectiveDate: '', // 生效时间
          ftaxRate: 12, // 税率
          fdescripTion: '', // 描述
          fmaterialId: '' // 传递给后端的id
        }
      ], // 采购价目表
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
      // 物料弹窗分页
      materielPagination: {
        total: 0, // 总条目
        pageNum: 1, // 当前页
        pageSize: 10 // 每页显示多少条数据
      },
      isMaterielDialog: false, // 物料弹窗
      FNUMBER: '', // 弹窗编码
      FDESCRIPTION: '', // 弹窗描述
      FSPECIFICATION: '', // 弹窗规格型号
      cellStyle: { padding: '10 10' }, // 行高
      fpriceDisabled: false, // 单价禁用
      ftaxPriceDisabled: true, // 含税单价禁用
      // 点击行的序号
      tableIndex: 0,
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
    async getPriceList() {
      const FID = this.$route.params.id
      const { data: RES } = await detailPriceList({ fid: FID })
      console.log(RES)
      RES.fisIncludedTax = JSON.parse(RES.fisIncludedTax)
      this.purchaseForm = RES
      this.tableData = RES.detail
    },
    // 保存采购列表
    preservation() {
      for (const ITEM of this.tableData) {
        for (const OBJ in ITEM) {
          if (ITEM[OBJ] === '' || ITEM[OBJ] === undefined) {
            this.$message.error('表格不能为空')
            return
          }
        }
      }
      const details = this.tableData.map(item => {
        item.fentryEffectiveDate = this.$moment(item.fentryEffectiveDate).format('YYYY-MM-DD HH:mm:ss')
        return {
          fmaterialId: item.fmaterialId,
          fprice: item.fprice,
          ftaxPrice: item.ftaxPrice,
          fpriceCoefficient: item.fpriceCoefficient,
          fupPrice: item.fupPrice,
          fdownPrice: item.fdownPrice,
          ftaxRate: item.ftaxRate,
          fentryEffectiveDate: item.fentryEffectiveDate
        }
      })
      const DATA = {
        fid: this.purchaseForm.fid,
        details
      }
      updatePurPrice(DATA).then(res => {
        if (res.code === 0) {
          this.$message.success(res.message)
        }
      }).catch(error => {
        this.$message.error(error)
      })
    },
    // 物料弹窗选中
    async materielSelectRow(item) {
      const fmateriAalId = item.FMATERIALID
      const { data: RES } = await queryMaterialSon({ fmateriAalId })
      this.tableData[this.tableIndex].fnumber = RES.FNUMBER
      this.tableData[this.tableIndex].fmaterialId = RES.FMATERIALID
      this.tableData[this.tableIndex].fspecificaTion = RES.FSPECIFICATION
      this.tableData[this.tableIndex].funit = RES.FBASEUNIT
      this.tableData[this.tableIndex].fdescripTion = RES.FDESCRIPTION
      this.isMaterielDialog = false
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
            fpriceCoefficient: 0, // 价格系数
            fupPrice: 0, // 价格上限
            fdownPrice: 0, // 价格下限
            feffectiveDate: '', // 生效时间
            ftaxRate: 0, // 税率
            fdescripTion: '' // 描述
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
      // console.log(num.ftaxPrice, num.fprice, num.fupPrice, num.fdownPrice)
      row.ftaxPrice = row.fprice * (1 + row.ftaxPrice / 100)
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
      } else {
        row.fprice = row.ftaxPrice / (1 + row.ftaxRate / 100)
        row.fupPrice = row.fprice
        row.fdownPrice = row.fprice
      }
    },
    // 刷新
    refresh() {
      location.reload()
    },
    // 删除行数据
    deleteMateriel(item, index) {
      if (index === 0) {
        this.$message.error('不能删除首行数据')
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
        width: 200px;
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
.layout ::v-deep .jcTable{
  min-height: calc(100vh - 400px);
}
</style>
