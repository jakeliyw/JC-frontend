<template>
  <div class="content">
    <jc-title />
    <el-tabs v-model="activeName" type="border-card" @tab-click="handleOther">
      <el-tab-pane label="调价" name="modifyPrice" class="layout">
        <div class="header">
          <el-button size="mini" @click="refresh">刷新</el-button>
          <el-button size="mini" type="primary" @click="preservation">确定更新</el-button>
        </div>
        <jc-form ref="zrf" :option-value="optionValue" :options="options">
          <el-input v-model="optionValue.fdataValue" class="input-width" size="mini" disabled>
            <i slot="suffix" class="el-input__icon el-icon-search" />
          </el-input>
        </jc-form>
        <jc-table
          :table-data="modifyPriceTable"
          :table-header="modifyPriceHeader"
          :cell-style="cellStyle"
          class="jcTable"
          table-height="auto"
        >
          <el-table-column label="价目表" prop="fname" align="center" min-width="150px">
            <template slot-scope="scope">
              <el-input v-model="scope.row.fname" size="mini" placeholder="请选择价目表">
                <i
                  slot="suffix"
                  class="el-input__icon el-icon-search"
                  @click="handlePriceList(scope.$index)"
                />
              </el-input>
            </template>
          </el-table-column>
          <el-table-column label="含税" prop="fisIncludedTax" align="center">
            <template slot-scope="scope">
              <el-checkbox v-model="scope.row.fisIncludedTax" disabled />
            </template>
          </el-table-column>
          <el-table-column label="物料编码" prop="fnumber" align="center" min-width="150px">
            <template slot-scope="scope">
              <el-input v-model="scope.row.fnumber" size="mini" placeholder="请选择物料编码">
                <i slot="suffix" class="el-input__icon el-icon-search" @click="handleMateriel(scope.row, scope.$index)" />
              </el-input>
            </template>
          </el-table-column>
          <el-table-column label="物料描述" prop="fdescripTion" align="center" min-width="200px" :show-overflow-tooltip="true" />
          <el-table-column label="供应商名称" prop="fsupplier" align="center" min-width="100px" :show-overflow-tooltip="true" />
          <el-table-column label="币别" prop="fcurrency" align="center" min-width="100px" :show-overflow-tooltip="true" />
          <el-table-column label="调前单价" prop="fprice" align="center" min-width="150px">
            <template slot-scope="scope">
              <el-input-number
                v-model="scope.row.fprice"
                size="mini"
                :precision="4"
                :step="0.0001"
                :min="0.0000"
                disabled
              />
            </template>
          </el-table-column>
          <el-table-column label="调后单价" prop="fafterPrice" align="center" min-width="150px">
            <template slot-scope="scope">
              <el-input-number
                v-model="scope.row.fafterPrice"
                size="mini"
                :precision="4"
                :step="0.0001"
                :min="0.0000"
                :disabled="scope.row.fisIncludedTax"
                @change="handlePrice(scope.row)"
              />
            </template>
          </el-table-column>
          <el-table-column label="调前含税单价" prop="ftaxPrice" align="center" min-width="150px">
            <template slot-scope="scope">
              <el-input-number
                v-model="scope.row.ftaxPrice"
                size="mini"
                :precision="4"
                :step="0.0001"
                :min="0.0000"
                disabled
              />
            </template>
          </el-table-column>
          <el-table-column label="调后含税单价" prop="fafterTaxPrice" align="center" min-width="150px">
            <template slot-scope="scope">
              <el-input-number
                v-model="scope.row.fafterTaxPrice"
                size="mini"
                :precision="4"
                :step="0.0001"
                :min="0.0000"
                :disabled="!scope.row.fisIncludedTax"
                @change="handleTaxIncluded(scope.row)"
              />
            </template>
          </el-table-column>
          <el-table-column label="调前税率" prop="ftaxRate" align="center" min-width="150px">
            <template slot-scope="scope">
              <el-input-number v-model="scope.row.ftaxRate" size="mini" :precision="4" :step="0.0001" :min="0.0000" disabled />
            </template>
          </el-table-column>
          <el-table-column label="调后税率" prop="fafterTaxRate" align="center" min-width="150px">
            <template slot-scope="scope">
              <el-input-number
                v-model="scope.row.fafterTaxRate"
                size="mini"
                :precision="4"
                :step="0.0001"
                :min="0.0000"
                @change="handleTaxRate(scope.row)"
              />
            </template>
          </el-table-column>
          <template v-slot:btnSlot="clo">
            <el-button type="danger" size="mini" @click="handleDelete(clo.scope.$index)">删除调价</el-button>
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
    <!--    采购价目列表-->
    <jc-popup
      v-model="priceListPagination.fsupplier"
      :dialog-title="dialogTitle"
      :open-dialog="openPriceList"
      :popup-title="popupTitle"
      @closeDialog="closeDialog"
      @emptyForm="emptyForm"
      @handleSearch="getPriceList"
    >
      <template v-slot:content>
        <jc-table
          v-show="dialogTitle === '采购价目列表'"
          :table-data="priceListData"
          :table-header="priceListHeader"
          :cell-style="cellStyle"
          @clickRow="priceListSelectRow"
        />
      </template>
      <template v-slot:pagination>
        <jc-pagination
          v-if="dialogTitle === '采购价目列表'"
          v-show="priceListPagination.total > 0"
          :total="priceListPagination.total"
          :page.sync="priceListPagination.pageNum"
          :limit.sync="priceListPagination.pageSize"
          @pagination="getPriceList"
        />
      </template>
    </jc-popup>
    <!--    物料编码列表-->
    <jc-popup
      v-model="materielPagination.fnumber"
      :dialog-title="dialogTitle"
      :open-dialog="openMaterial"
      :popup-title="popupTitle"
      @closeDialog="closeDialog"
      @emptyForm="emptyForm"
      @handleSearch="getMateriel"
    >
      <template v-slot:content>
        <jc-table
          v-show="dialogTitle === '物料编码列表'"
          :table-data="materielDialogData"
          :table-header="materielDialogHeader"
          :cell-style="cellStyle"
          @clickRow="materielSelectRow"
        />
      </template>
      <template v-slot:pagination>
        <jc-pagination
          v-if="dialogTitle === '物料编码列表'"
          v-show="materielPagination.total > 0"
          :total="materielPagination.total"
          :page.sync="materielPagination.pageNum"
          :limit.sync="materielPagination.pageSize"
          @pagination="getMateriel"
        />
      </template>
    </jc-popup>
  </div>
</template>

<script>
import jcForm from '@/components/Form'
import jcTable from '@/components/Table'
import jcTitle from '@/components/Title'
import jcPopup from '@/views/basic/createMateriel/components/Popup'
import jcPagination from '@/components/Pagination/index'
import jcOther from '@/components/Other'
import { queryTOrgOrganizationsL } from '@/api/engineering/createBom'
import { queryTPurPatLs, queryTPurPatLm } from '@/api/modifyPriceManagement/createModifyPrice'
import { updateTPurPat } from '@/api/modifyPriceManagement/editModifyPrice'
import { queryPurPatLog, queryTPurPatDetailList } from '@/api/modifyPriceManagement/detailModifyPrice'
export default {
  name: 'EditModifyPrice',
  components: {
    jcForm,
    jcTable,
    jcPopup,
    jcPagination,
    jcTitle,
    jcOther
  },
  inject: ['reload'],
  data() {
    return {
      activeName: 'modifyPrice',
      dialogTitle: '', // 弹窗名称
      openPriceList: false, // 采购价目列表弹窗
      openMaterial: false, // 物料编码弹窗
      popupTitle: '', // 弹窗名称
      teamList: [], // 组织数
      modifyPriceTable: [], // 调价表数据
      modifyPriceHeader: [
        { label: '物料规格', prop: 'fspecificaTion', align: 'center' },
        { label: '价格上限', prop: 'fupPrice', align: 'center' },
        { label: '价格下限', prop: 'fdownPrice', align: 'center' },
        { label: '操作', type: 'btn', fixed: 'right', minWidth: '100px', align: 'center' }
      ],
      // 价目表
      priceListData: [],
      priceListHeader: [
        { label: '价目表', prop: 'fname', align: 'center' },
        { label: '供应商名称', prop: 'fsupplier', align: 'center' },
        { label: '币别', prop: 'fcurrency', align: 'center' },
        { label: '含税', prop: 'fisIncludedTax', align: 'center' }
      ],
      // 物料编码数据
      materielDialogData: [],
      // 物料编码表头
      materielDialogHeader: [
        { label: '使用组织', prop: 'fuseOrg', align: 'center' },
        { label: '物料编码', prop: 'fnumber', align: 'center' },
        { label: '物料描述', prop: 'fdescripTion', align: 'center' },
        { label: '物料规格', prop: 'fspecificaTion', align: 'center' },
        { label: '调前单价', prop: 'fprice', align: 'center' },
        { label: '调前含税单价', prop: 'ftaxPrice', align: 'center', minWidth: '150px' },
        { label: '调前税率', prop: 'ftaxRate', align: 'center', minWidth: '150px' }
      ],
      // 价目表分页
      priceListPagination: {
        pageNum: 1, // 当前页
        pageSize: 10, // 限制行数
        fsupplier: '', // 关键词
        total: 0 // 总条目
      },
      // 物料弹窗分页
      materielPagination: {
        total: 0, // 总条目
        pageNum: 1, // 当前页
        pageSize: 10, // 每页显示多少条数据
        fnumber: '', // 物料编码
        fid: '' // 价目ID
      },
      otherUrlObject: {}, // 其它审核人
      otherLogTableData: [], // 日志数据
      otherPagination: {
        pageNum: 1,
        pageSize: 10,
        total: 0
      },
      cellStyle: { padding: '10 10' }, // 行高
      optionValue: {}, // 表单值
      options: {}, // 表单控件
      tableIndex: 0 // 表格序号
    }
  },
  mounted() {
    this.getForm()
  },
  methods: {
    // 保存调价
    preservation() {
      for (const RES of this.modifyPriceTable) {
        if (RES.fid === '' || RES.fmaterialId === '' || RES.fafterPrice === 0 || RES.fafterTaxPrice === 0) {
          this.$message.warning('表格不能为空,或表格值不能为0')
          return
        }
      }
      const DETAILS = this.modifyPriceTable.map(item => {
        return {
          fpriceListId: item.fpriceListId,
          fmaterialId: item.fmaterialId,
          fafterPrice: item.fafterPrice,
          fafterTaxPrice: item.fafterTaxPrice,
          fafterTaxRate: item.fafterTaxRate,
          fupPrice: item.fupPrice,
          fdownPrice: item.fdownPrice
        }
      })
      const fuserId = window.sessionStorage.getItem('fuserId')
      const DATA = {
        fuserId,
        fid: this.optionValue.fpaReason,
        details: DETAILS
      }
      updateTPurPat(DATA).then(res => {
        if (res.code !== 0) {
          this.$message.error(res.message)
          return
        }
        this.$message.success(res.message)
        this.reload()
      }).catch(error => {
        this.$message.error(error)
      })
    },
    // 调前单价
    handlePrice(row) {
      // 价格上限 fupPrice、价格下限 fdownPrice、调后含税单价 fafterTaxPrice 调后单价 fafterPrice
      row.fupPrice = row.fafterPrice
      row.fdownPrice = row.fafterPrice
      row.fafterTaxPrice = row.fafterPrice * (1 + row.fafterTaxRate / 100)
    },
    // 调前含税单价
    handleTaxIncluded(row) {
      row.fupPrice = row.fafterTaxPrice
      row.fdownPrice = row.fafterTaxPrice
      row.fafterPrice = row.fafterTaxPrice / (1 + row.fafterTaxRate / 100)
    },
    // 调后税率
    handleTaxRate(row) {
      if (!row.fisIncludedTax) {
        // 单价
        row.fafterTaxPrice = row.fafterPrice * (1 + row.fafterTaxRate / 100)
        row.fupPrice = row.fafterTaxPrice
        row.fdownPrice = row.fafterTaxPrice
      } else {
        // 含税单价
        row.fafterPrice = row.fafterTaxPrice / (1 + row.fafterTaxRate / 100)
        row.fupPrice = row.fafterPrice
        row.fdownPrice = row.fafterPrice
      }
    },
    // 获取价目表
    priceListSelectRow(item) {
      this.modifyPriceTable[this.tableIndex].fpriceListId = item.fid
      this.modifyPriceTable[this.tableIndex].fname = item.fname
      this.modifyPriceTable[this.tableIndex].fsupplier = item.fsupplier
      this.modifyPriceTable[this.tableIndex].fisIncludedTax = item.fisIncludedTax
      this.modifyPriceTable[this.tableIndex].fcurrency = item.fcurrency
      this.modifyPriceTable[this.tableIndex].fid = item.fid
      // 物料编码
      this.modifyPriceTable[this.tableIndex].fmaterialId = ''
      this.modifyPriceTable[this.tableIndex].fnumber = ''
      this.openPriceList = false
    },
    // 获取物料编码
    materielSelectRow(item) {
      this.modifyPriceTable[this.tableIndex].fmaterialId = item.fmaterialId
      this.modifyPriceTable[this.tableIndex].fnumber = item.fnumber
      this.modifyPriceTable[this.tableIndex].fspecificaTion = item.fspecificaTion
      this.modifyPriceTable[this.tableIndex].fdescripTion = item.fdescripTion
      this.modifyPriceTable[this.tableIndex].fprice = item.fprice
      this.modifyPriceTable[this.tableIndex].ftaxPrice = item.ftaxPrice
      this.modifyPriceTable[this.tableIndex].ftaxRate = item.ftaxRate
      this.openMaterial = false
    },
    async getMateriel() {
      const { data: RES } = await queryTPurPatLm({ ...this.materielPagination })
      this.materielDialogData = RES.array
      this.materielPagination.total = RES.total
    },
    // 获取物料编码
    async handleMateriel(row, index) {
      this.tableIndex = index
      if (index === this.modifyPriceTable.length - 1) {
        this.modifyPriceTable.push({
          fid: '', //
          fpriceListId: '', // 价目id
          fmaterialId: '', // 物料ID
          fname: '', // 价目表`
          fisIncludedTax: false, // 含税
          fnumber: '', // 物料编码
          fafterPrice: '', // 调后单价
          fafterTaxPrice: '', // 调后含税单价
          fafterTaxRate: '', // 调后税率
          fsupplier: '', // 供应商名称
          fcurrency: '', // 币别
          fdescripTion: '', // 描述
          fspecificaTion: '', // 规格型号
          fprice: '', // 调前单价
          ftaxPrice: '', // 调前含税单价
          ftaxRate: '', // 调前税率
          fupPrice: 0, // 上限
          fdownPrice: 0 // 下限
        })
      }
      if (!row.fid) {
        this.$message.warning('价目表未选择或数据出错,请重新选择')
        return
      }
      this.materielPagination.fid = this.modifyPriceTable[this.tableIndex].fid
      this.openMaterial = true
      this.dialogTitle = '物料编码列表'
      this.popupTitle = '物料编码'
      this.getMateriel()
    },
    // 价目表
    async getPriceList() {
      const { data: RES } = await queryTPurPatLs({ ...this.priceListPagination })
      this.priceListData = RES.array
      this.priceListPagination.total = RES.total
    },
    // 价目表
    async handlePriceList(index) {
      this.tableIndex = index
      this.openPriceList = true
      this.getPriceList()
      this.dialogTitle = '采购价目列表'
      this.popupTitle = '供应商名称'
    },
    // 关闭弹窗
    closeDialog() {
      this.priceListPagination.pageNum = 1
      this.materielPagination.pageNum = 1
      this.openPriceList = false
      this.openModifyPrice = false
      this.openMaterial = false
    },
    // 清空弹窗表单
    emptyForm() {
      this.priceListPagination.fsupplier = ''
      this.materielPagination.fnumber = ''
      this.priceListPagination.pageNum = 1
      this.materielPagination.pageNum = 1
    },
    // 采购价目列表
    searchPriceList() {
      this.priceListPagination.pageNum = 1
      this.handlePriceList()
    },
    // 删除行数据
    handleDelete(index) {
      if (index === 0) {
        this.$message.warning('不能删除首行数据')
        return
      }
      this.modifyPriceTable.splice(index, 1)
      this.$message.success('删除行成功')
    },
    refresh() {
      location.reload()
    },
    // 获取其它
    async handleOther() {
      const RES = await queryPurPatLog({ ...this.otherPagination, fid: this.$route.params.id })
      this.otherLogTableData = RES.data.array
      this.otherPagination.total = RES.data.total
      this.otherUrlObject = RES.data.operator
    },
    // 获取表格
    async getForm() {
      const { data: RES } = await queryTPurPatDetailList({ fid: this.$route.params.id })
      this.modifyPriceTable = RES.detail
      const { data: TEAMlIST } = await queryTOrgOrganizationsL()
      this.teamList = TEAMlIST.map(item => {
        return { label: item.fname, value: item.fpkId }
      })
      this.optionValue = {
        fcreateOrgId: 1, // 组织
        fdataValue: RES.fdataValue, // 调价原因名称
        fpaReason: RES.fid, // 调价原因id
        fname: RES.fname, // 名称
        billCode: RES.fbillno, // 单据编号
        fdescription: RES.fdescripTion // 描述
      }
      this.options = {
        fcreateOrgId: {
          label: '创建组织',
          type: 'select',
          span: 6,
          selectItems: this.teamList
        },
        fdataValue: {
          label: '调价原因',
          type: 'slot',
          span: 6,
          rules: [{ required: true, message: '调价原因不可为空', trigger: 'blur' }]
        },
        fname: {
          label: '名称',
          span: 6,
          disabled: 'disabled',
          rules: [{ required: true, message: '名称不可为空', trigger: 'blur' }]
        },
        billCode: {
          label: '单据编号',
          span: 6,
          disabled: 'disabled'
        },
        fdescription: {
          label: '描述',
          span: 6,
          disabled: 'disabled',
          type: 'textarea',
          rules: [{ required: true, message: '描述不可为空', trigger: 'blur' }]
        }
      }
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
    .input-width{
      width: 10vw;
    }
  }
}
.el-input__icon {
  cursor: pointer;
}
.layout ::v-deep .jcTable{
  min-height: calc(100vh - 450px);
}
.el-table ::v-deep .el-table__body-wrapper{
  height: 480px;
}
</style>
