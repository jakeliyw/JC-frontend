<template>
  <div>
    <span class="title-background">采购</span>
    <el-row class="elRow" :gutter="30" type="flex" justify="start">
      <el-col :span="6">
        <span class="large">采购单位</span>
        <el-input v-model="company.label" size="mini" class="input-width" placeholder="请选择采购单位" disabled />
      </el-col>
      <el-col :span="6">
        <span class="large">采购计价单位</span>
        <el-input v-model="company.label" size="mini" class="input-width" placeholder="请选择采购计价单位" disabled />
      </el-col>
      <el-col :span="6">
        <span class="large">供应商</span>
        <el-input v-model="information.fdefaultvendor" placeholder="请选择供应商" size="mini" class="input-width" :disabled="detailDisabled">
          <i v-show="detailShow" slot="suffix" class="el-input__icon el-icon-search" @click="handleSupplier" />
        </el-input>
      </el-col>
      <el-col :span="6">
        <span class="large">采购类型</span>
        <el-input v-model="information.fpobillTypeName" placeholder="请选择采购类型" size="mini" class="input-width" :disabled="detailDisabled">
          <i v-show="detailShow" slot="suffix" class="el-input__icon el-icon-search" @click="handlePurchaseType" />
        </el-input>
      </el-col>
      <el-col :span="6">
        <span class="large">配额方式</span>
        <el-select v-model="information.fquotaType" placeholder="请选择配额方式" size="mini" class="input-width" :disabled="detailDisabled" @change="handleFquotaType">
          <el-option
            v-for="item in quotaMethod"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          />
        </el-select>
      </el-col>
    </el-row>
    <span class="title-background">仓库</span>
    <el-row class="elRow" :gutter="30" type="flex" justify="start">
      <el-col :span="6">
        <span class="large">库存单位</span>
        <el-input v-model="company.label" placeholder="请选择库存单位" size="mini" class="input-width" disabled />
      </el-col>
      <el-col :span="6">
        <span class="large">辅助单位</span>
        <el-input v-model="company.label" placeholder="请选择辅助单位" size="mini" class="input-width" disabled />
      </el-col>
      <el-col :span="6">
        <span class="large warehouse">仓库</span>
        <el-input v-model="information.fstockName" placeholder="请选择仓库" size="mini" class="input-width" :disabled="detailDisabled">
          <i v-show="detailShow" slot="suffix" class="el-input__icon el-icon-search" @click="handleWarehouse" />
        </el-input>
      </el-col>
      <el-col :span="6">
        <span class="large">仓位</span>
        <el-input v-model="information.position" placeholder="请输入仓位" size="mini" class="input-width" :disabled="detailDisabled" @change="handlePosition" />
      </el-col>
      <el-col :span="6">
        <span class="large">最小库存</span>
        <el-input v-model="information.fminStock" placeholder="请输入最小库存" size="mini" class="input-width" type="number" :disabled="detailDisabled" @change="handleFminStock" />
      </el-col>
      <el-col :span="6">
        <span class="large">安全库存</span>
        <el-input v-model="information.fsafeStock" placeholder="请输入安全库存" size="mini" class="input-width" type="number" :disabled="detailDisabled" @click="handleFsafeStock" />
      </el-col>
      <el-col :span="6">
        <span class="large">最大库存</span>
        <el-input v-model="information.fmaxStock" placeholder="请输入最大库存" size="mini" class="input-width" type="number" :disabled="detailDisabled" @click="handleFmaxStock" />
      </el-col>
    </el-row>
    <!--  供应商弹窗-->
    <jc-popup
      v-model="supplierName"
      :dialog-title="dialogTitle"
      :popup-title="popupTitle"
      :open-dialog="openSupplier"
      @closeDialog="closeDialog"
      @emptyForm="emptyForm"
      @handleSearch="searchSupplier"
    >
      <template v-slot:content>
        <jc-table
          v-show="dialogTitle === '供应商列表'"
          serial
          :table-data="supplierData"
          :table-header="supplierHeader"
          :cell-style="cellStyle"
          @clickRow="supplierSelectRow"
        />
      </template>
      <template v-slot:pagination>
        <jc-pagination
          v-if="dialogTitle === '供应商列表'"
          v-show="supplierPagination.total > 0"
          :total="supplierPagination.total"
          :page.sync="supplierPagination.pageNum"
          :limit.sync="supplierPagination.pageSize"
          @pagination="handleSupplier"
        />
      </template>
    </jc-popup>
    <!--    仓库-->
    <jc-popup
      v-model="warehouseName"
      :dialog-title="dialogTitle"
      :popup-title="popupTitle"
      :open-dialog="openWarehouse"
      @closeDialog="closeDialog"
      @emptyForm="emptyForm"
      @handleSearch="searchWarehouse"
    >
      <template v-slot:content>
        <jc-table
          v-show="dialogTitle === '仓库列表'"
          serial
          :table-data="warehouseData"
          :table-header="warehouseHeader"
          :cell-style="cellStyle"
          @clickRow="warehouseSelectRow"
        />
      </template>
      <template v-slot:pagination>
        <jc-pagination
          v-if="dialogTitle === '仓库列表'"
          v-show="warehousePagination.total > 0"
          :total="warehousePagination.total"
          :page.sync="warehousePagination.pageNum"
          :limit.sync="warehousePagination.pageSize"
          @pagination="handleWarehouse"
        />
      </template>
    </jc-popup>
    <!--采购类型-->
    <jc-popup
      v-model="purchaseTypeName"
      :dialog-title="dialogTitle"
      :popup-title="popupTitle"
      :open-dialog="openPurchaseType"
      @closeDialog="closeDialog"
      @emptyForm="emptyForm"
      @handleSearch="searchPurchaseType"
    >
      <template v-slot:content>
        <jc-table
          v-show="dialogTitle === '采购类型列表'"
          serial
          :table-data="purchaseTypeData"
          :table-header="purchaseTypeHeader"
          :cell-style="cellStyle"
          @clickRow="purchaseTypeSelectRow"
        />
      </template>
      <template v-slot:pagination>
        <jc-pagination
          v-if="dialogTitle === '采购类型列表'"
          v-show="purchaseTypePagination.total > 0"
          :total="purchaseTypePagination.total"
          :page.sync="purchaseTypePagination.pageNum"
          :limit.sync="purchaseTypePagination.pageSize"
          @pagination="handlePurchaseType"
        />
      </template>
    </jc-popup>
  </div>
</template>

<script>
import {
  queryTBdSupplier,
  queryTBdStock,
  queryFquotaType,
  queryFbillType
} from '@/api/purchaseManagement/createPurchasePrice'
import jcPopup from '@/views/basic/createMateriel/components/Popup'
import jcTable from '@/components/Table'
import jcPagination from '@/components/Pagination'

export default {
  name: 'Index',
  components: {
    jcPopup,
    jcTable,
    jcPagination
  },
  props: {
    company: {
      type: Object,
      default: () => {
        return {}
      }
    },
    information: {
      type: Object,
      required: true,
      default: () => {
        return {}
      }
    },
    detailDisabled: {
      type: Boolean,
      default: false
    },
    detailShow: {
      type: Boolean,
      default: true
    }
  },
  data() {
    return {
      quotaMethod: [], // 配额方式
      // 供应商列表
      supplierData: [],
      // 供应商表头
      supplierHeader: [
        { label: '编码', prop: 'fnumber', align: 'center' },
        { label: '使用组织', prop: 'fuseorg', align: 'center' },
        { label: '供应商', prop: 'fname', align: 'center' },
        { label: '供应商组', prop: 'fprimaryGroup', align: 'center' }
      ],
      // 供应商分页
      supplierPagination: {
        total: 0, // 总条目
        pageNum: 1, // 当前页
        pageSize: 10 // 每页显示多少条数据
      },
      // 仓库
      warehouseData: [],
      warehouseHeader: [
        { label: '编码', prop: 'fnumber', align: 'center' },
        { label: '仓库名', prop: 'fname', align: 'center' },
        { label: '仓库地址', prop: 'faddress', align: 'center' },
        { label: '仓库负责人', prop: 'fprincipal', align: 'center' }
      ],
      warehousePagination: {
        total: 0, // 总条目
        pageNum: 1, // 当前页
        pageSize: 10 // 每页显示多少条数据
      },
      // 采购类型
      purchaseTypeData: [],
      purchaseTypeHeader: [
        { label: '采购编码', prop: 'fnumber', align: 'center' },
        { label: '采购类型', prop: 'fname', align: 'center' },
        { label: '采购类型描述', prop: 'fdescripTion', align: 'center' }
      ],
      purchaseTypePagination: {
        total: 0, // 总条目
        pageNum: 1, // 当前页
        pageSize: 10 // 每页显示多少条数据
      },
      purchaseTypeName: '', // 采购列表关键字
      supplierName: '', // 供应商弹窗关键词
      warehouseName: '', // 仓库关键词
      openWarehouse: false, // 仓库弹窗
      dialogTitle: '', // 弹窗标题
      popupTitle: '', // 查询条件文本
      openPurchaseType: false, // 采购类型弹窗
      openSupplier: false, // 供应商弹窗
      cellStyle: { padding: '10 10' } // 行高
    }
  },
  mounted() {
    this.getQuotaMethod()
  },
  methods: {
    // 供应商列表
    async handleSupplier() {
      this.openSupplier = true
      const { data: RES } = await queryTBdSupplier({ ...this.supplierPagination, fname: this.supplierName })
      this.supplierData = RES.array
      this.popupTitle = RES.search
      this.dialogTitle = '供应商列表'
      this.supplierPagination.total = RES.total
    },
    // 仓库列表
    async handleWarehouse() {
      this.openWarehouse = true
      const { data: RES } = await queryTBdStock({ ...this.warehousePagination, fname: this.warehouseName })
      this.warehouseData = RES.array
      this.popupTitle = RES.search
      this.dialogTitle = '仓库列表'
      this.warehousePagination.total = RES.total
    },
    // 仓位
    handlePosition() {
      this.$emit('update:information', this.information)
    },
    // 最小库存
    handleFminStock() {
      this.$emit('update:information', this.information)
    },
    // 安全库存
    handleFsafeStock() {
      this.$emit('update:information', this.information)
    },
    // 最大库存
    handleFmaxStock() {
      this.$emit('update:information', this.information)
    },
    // 配额方式
    handleFquotaType() {
      this.$emit('update:information', this.information)
    },
    // 配额方式列表
    async getQuotaMethod() {
      const RES = await queryFquotaType()
      this.quotaMethod = RES.data.map(item => {
        return { label: item.fcapTion, value: item.fquotaType }
      })
    },
    // 采购类型
    async handlePurchaseType() {
      this.openPurchaseType = true
      const { data: RES } = await queryFbillType({ ...this.purchaseTypePagination, fname: this.purchaseTypeName })
      this.purchaseTypeData = RES.array
      this.popupTitle = RES.search
      this.dialogTitle = '采购类型列表'
      this.purchaseTypePagination.total = RES.total
    },
    // 双击供应商弹窗
    supplierSelectRow(item) {
      this.$emit('update:information', this.information)
      this.information.fdefaultvendor = item.fname
      this.information.fsupplierId = item.fsupplierId
      this.openSupplier = false
    },
    // 双击采购弹窗
    purchaseTypeSelectRow(item) {
      this.$emit('update:information', this.information)
      this.information.fbillTypeId = item.fbillTypeId
      this.information.fpobillTypeName = item.fname
      this.openPurchaseType = false
    },
    // 双击仓库弹窗
    warehouseSelectRow(item) {
      this.$emit('update:information', this.information)
      this.information.fstockId = item.fstockId
      this.information.fstockName = item.fname
      this.openWarehouse = false
    },
    // 弹窗关闭事件
    closeDialog() {
      this.openSupplier = false
      this.openWarehouse = false
      this.openPurchaseType = false
      this.purchaseTypePagination.pageNum = 1
      this.warehousePagination.pageNum = 1
      this.supplierPagination.pageNum = 1
    },
    // 清空弹窗表单
    emptyForm() {
      this.supplierName = ''
      this.warehouseName = ''
      this.purchaseTypeName = ''
    },
    // 供应商弹窗搜索
    searchSupplier() {
      this.supplierPagination.pageNum = 1
      this.handleSupplier()
    },
    // 仓库弹窗搜索
    searchWarehouse() {
      this.warehousePagination.pageNum = 1
      this.handleWarehouse()
    },
    searchPurchaseType() {
      this.purchaseTypePagination.pageNum = 1
      this.handlePurchaseType()
    }
  }
}
</script>

<style scoped lang="scss">
.title-background {
  color: wheat;
  display: table-cell;
  font-weight: 800;
  background-color: #848383;
  width: 90vw;
  height: 40px;
  line-height: 40px;
  border-left: groove;
  letter-spacing: 5px;
  text-indent: 10px;
}
.elRow{
  display: flex;
  flex-wrap: wrap;
  .large{
    font-size: 14px;
    color: #606266;
    line-height: 40px;
    padding: 0 12px 0 12px;
    font-weight: 700;
  }
  .warehouse::before{
    content: '*';
    padding-right: 2px;
    color: red;
  }
  .input-width{
    width: 10vw;
  }
  .el-icon-search{
    cursor: pointer;
  }
}
.el-table ::v-deep .el-table__body-wrapper{
  height: 480px;
}
</style>
