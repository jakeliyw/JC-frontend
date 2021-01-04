<template>
  <div>
    <el-row class="elRow" :gutter="30" type="flex" justify="start">
      <el-col :span="6">
        <span class="large">采购单位</span>
        <el-input v-model="optionValue.purchasingUnit" size="mini" class="input-width" placeholder="请输入采购单位" disabled/>
      </el-col>
      <el-col :span="6">
        <span class="large">采购计价单位</span>
        <el-input v-model="optionValue.purchasePricingUnit" size="mini" class="input-width" placeholder="请输入采购计价单位" disabled/>
      </el-col>
      <el-col :span="6">
        <span class="large">供应商</span>
        <el-input v-model="optionValue.fsupplierId" placeholder="请选择供应商" size="mini" class="input-width">
          <i slot="suffix" class="el-input__icon el-icon-search" @click="handleSupplier"/>
        </el-input>
      </el-col>
      <el-col :span="6">
        <span class="large">采购类型</span>
        <el-select v-model="optionValue.fbillTypeId" placeholder="请选择采购类型" size="mini" class="input-width">
          <el-option
            v-for="item in optionValue.fbillType"
            :key="item.value"
            :label="item.label"
            :value="item.value">
          </el-option>
        </el-select>
      </el-col>
      <el-col :span="6">
        <span class="large">配额方式</span>
        <el-select v-model="optionValue.quotaMethodId" placeholder="请选择采购类型" size="mini" class="input-width">
          <el-option
            v-for="item in optionValue.quotaMethod"
            :key="item.value"
            :label="item.label"
            :value="item.value">
          </el-option>
        </el-select>
      </el-col>
      <el-col :span="6">
        <span class="large">库存单位</span>
        <el-input v-model="optionValue.inventoryUnit" placeholder="请选择库存单位" size="mini" class="input-width"/>
      </el-col>
      <el-col :span="6">
        <span class="large">辅助单位</span>
        <el-input v-model="optionValue.auxiliaryUnits" placeholder="请选择辅助单位" size="mini" class="input-width"/>
      </el-col>
      <el-col :span="6">
        <span class="large">仓库</span>
        <el-input v-model="optionValue.warehouse" placeholder="请选择仓库" size="mini" class="input-width">
          <i slot="suffix" class="el-input__icon el-icon-search" />
        </el-input>
      </el-col>
      <el-col :span="6">
        <span class="large">仓位</span>
        <el-input v-model="optionValue.position" placeholder="请输入仓位" size="mini" class="input-width"/>
      </el-col>
      <el-col :span="6">
        <span class="large">最小库存</span>
        <el-input v-model="optionValue.smallInventory" placeholder="请输入最小库存" size="mini" class="input-width"/>
      </el-col>
      <el-col :span="6">
        <span class="large">安全库存</span>
        <el-input v-model="optionValue.securityInventory" placeholder="请输入安全库存" size="mini" class="input-width"/>
      </el-col>
      <el-col :span="6">
        <span class="large">最大库存</span>
        <el-input v-model="optionValue.largeInventory" placeholder="请输入最大库存" size="mini" class="input-width"/>
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
  </div>
</template>

<script>
import { queryTBdSupplier } from '@/api/purchaseManagement/createPurchasePrice'
import jcPopup from '@/views/basicManagement/createMateriel/components/Popup'
import jcTable from '@/components/Table'
import jcPagination from '@/components/Pagination/index'

export default {
  name: 'Index',
  components: {
    jcPopup,
    jcTable,
    jcPagination
  },
  data() {
    return {
      optionValue: {
        purchasingUnit: '', // 采购单位
        purchasePricingUnit: '', // 采购计价单位
        fsupplierId: '', // 供应商id
        fbillType: [
          {
            value: '选项1',
            label: '黄金糕'
          }, {
            value: '选项2',
            label: '双皮奶'
          }, {
            value: '选项3',
            label: '蚵仔煎'
          }
        ], // 采购类型
        fbillTypeId: '', // 采购类型id
        quotaMethod: [], // 配额方式
        quotaMethodId: '', // 配额方式id
        inventoryUnit: '', // 库存单位
        auxiliaryUnits: '', // 辅助单位
        warehouse: '', // 仓库
        position: '', // 仓位
        smallInventory: '', // 最小库存
        securityInventory: '', // 安全库存
        largeInventory: '' // 最大库存
      },
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
      supplierName: '', // 供应商弹窗关键词
      dialogTitle: '', // 弹窗标题
      popupTitle: '', // 查询条件文本
      openSupplier: false, // 供应商弹窗
      fsupplierName: '', // 供应商名称
      cellStyle: { padding: '10 10' } // 行高
    }
  },
  mounted() {
  },
  methods: {
    async handleSupplier() {
      this.openSupplier = true
      const { data: RES } = await queryTBdSupplier({ ...this.supplierPagination, fname: this.supplierName })
      this.supplierData = RES.array
      this.popupTitle = RES.search
      this.dialogTitle = '供应商列表'
      this.supplierPagination.total = RES.total
    },
    // 双击供应商弹窗
    supplierSelectRow() {

    },
    // 弹窗关闭事件
    closeDialog() {
      this.openSupplier = false
      this.supplierPagination.pageNum = 1
    },
    // 清空弹窗表单
    emptyForm() {
      this.fname = ''
    },
    // 供应商弹窗搜索
    searchSupplier() {
      this.supplierPagination.pageNum = 1
      this.handleSupplier()
    }
  }
}
</script>

<style scoped lang="scss">
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
  .input-width{
    width: 10vw;
  }
  .el-icon-search{
    cursor: pointer;
  }
}
</style>
