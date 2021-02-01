<template>
  <div class="content">
    <jc-title />
    <el-form :model="orderNumber" label-width="90px">
      <el-form-item label="销售订单号">
        <el-input v-model.trim="Sonum" size="mini" @keyup.enter.native="gainData()" @blur="gainData()" />
      </el-form-item>
      <el-form-item label="客户">
        <el-input v-model="orderNumber.customer" disabled size="mini" />
      </el-form-item>
      <el-form-item label="客户订单号">
        <el-input v-model="orderNumber.fpaezText1" disabled size="mini" />
      </el-form-item>
      <el-form-item label="品质标准">
        <el-input v-model="orderNumber.fpaezCombo" disabled size="mini" />
      </el-form-item>
      <el-form-item label="交货日期">
        <el-input v-model="orderNumber.fdeliveryDate" disabled size="mini" />
      </el-form-item>
      <el-form-item>
        <el-button type="primary" size="mini" @click="gainData()">运算</el-button>
        <el-button type="primary" size="mini" @click="handleExport">导出Excel</el-button>
      </el-form-item>
    </el-form>
    <jc-table
      id="out-table"
      :table-data="tableData"
      :table-header="tableHeader"
      :cell-style="cellStyle"
      @selectionChange="selectData"
    >
      <el-table-column type="selection" width="60px" sortable="true" align="center" />
      <template v-slot:btnState="col">
        <el-select
          v-model="col.scope.row.sclx"
          placeholder="请选择"
          size="mini"
          :disabled="col.scope.row.zt==='已转'"
          @change="editLx(col.scope)"
        >
          <el-option label="委外" value="委外" />
          <el-option label="自制" value="自制" />
        </el-select>
      </template>
      <template v-slot:btnSlot="col">
        <el-input
          v-model="col.scope.row.scbm"
          placeholder="请选择生产部门"
          size="mini"
          :disabled="col.scope.row.zt==='已转'"
          oncopy="return false"
          onpaste="return false"
        >
          <i
            slot="suffix"
            class="el-input__icon el-icon-search"
            @click="storkCli(col.scope.row, col.scope.$index)"
          />
        </el-input>
      </template>
      <template v-slot:tagSlot="col">
        <el-input
          v-model="col.scope.row.ck"
          placeholder="请选择仓库"
          size="mini"
          :disabled="col.scope.row.zt==='已转'"
          oncopy="return false"
          onpaste="return false"
        >
          <i
            slot="suffix"
            class="el-input__icon el-icon-search"
            @click="handleWarehouse(col.scope.$index)"
          />
        </el-input>
      </template>
    </jc-table>
    <div class="footer">
      <el-button type="primary" @click="InsertMO()">确认下发</el-button>
    </div>
    <!--  生产部门-->
    <stork v-if="storkVisiblit" :msg="ddlx" :msg2="itemCode" @stork="storkData" />
    <!--    仓库-->
    <jc-popup
      v-model="warehouseName"
      dialog-title="仓库列表"
      :popup-title="popupTitle"
      :open-dialog="openWarehouse"
      @closeDialog="closeDialog"
      @emptyForm="emptyForm"
      @handleSearch="searchWarehouse"
    >
      <template v-slot:content>
        <jc-table
          v-show="dialogTitle === '仓库列表'"
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
  </div>
</template>
<script>
import jcTable from '@/components/Table'
import jcTitle from '@/components/Title'
import jcPopup from '@/views/basic/createMateriel/components/Popup'
import {
  MrpInfo,
  InsertMO,
  Show_SALOrder
} from '@/api/mrpView'
import stork from '@/views/purchasing/procurement/components/stork/index'
import jcPagination from '@/components/Pagination'
import { queryTBdStock } from '@/api/purchaseManagement/createPurchasePrice'
import {
  export_json_to_excel,
  formatJson
} from '@/utils/Export2Excel'

export default {
  name: 'MrpView',
  components: {
    jcTable,
    stork,
    jcTitle,
    jcPopup,
    jcPagination
  },
  data() {
    return {
      ddlx: '', // 订单类型
      itemCode: '', // 物料编号
      storkVisiblit: false, // 生产部门
      Sonum: '', // 销售订单号
      orderNumber: {
        customer: '',
        fpaezText1: '',
        fpaezCombo: '',
        fdeliveryDate: ''
      },
      indexSelf: '', // 下标
      cellStyle: { padding: '10 10' },
      tableData: [],
      tableHeader: [
        { label: '状态', prop: 'zt', align: 'center' },
        { label: '客户订单号', prop: 'KHDD', align: 'center' },
        { label: '销售订单号', prop: 'SoNum', align: 'center' },
        { label: '订单类型', prop: 'ddlx', align: 'center', minWidth: '100px' },
        { label: '生产单号', prop: 'ssdh', align: 'center', minWidth: '140px' },
        { label: '型号', prop: 'itemXH', align: 'center' },
        { label: '物料编号', prop: 'itemCode', align: 'center', minWidth: '160px' },
        { label: '物料描述', prop: 'itemName', align: 'left', minWidth: '260px', headerAlign: 'center' },
        { label: '尺寸', prop: 'cc', align: 'center', minWidth: '120px' },
        { label: '生产类型', type: 'state', prop: 'sclx', align: 'center', minWidth: '100px' },
        { label: '生产部门', type: 'btn', prop: 'scbm', align: 'center', minWidth: '150px' },
        { label: '仓库', type: 'tag', prop: 'ck', align: 'center', minWidth: '150px' },
        { label: '库存', prop: 'kc', align: 'center' },
        { label: '计划数量', prop: 'qty', align: 'center' },
        { label: '数量单位', prop: 'dw', align: 'center' },
        { label: '损耗率', prop: 'shl', align: 'center' },
        { label: '损耗数', prop: 'shs', align: 'center' },
        { label: '生产数量', prop: 'scQty', align: 'center' },
        { label: '加工单价', prop: 'rprice', align: 'center' },
        { label: '行金额', prop: 'hje', align: 'center' },
        { label: '配件交期', prop: 'pjjq', align: 'center', minWidth: '100px' },
        { label: '大类', prop: 'CZ', align: 'center' },
        { label: '订单详情', prop: 'DDQC', align: 'center' },
        { label: '工单号', prop: 'Monum', align: 'center' }
      ],
      insetData: {
        CreateID: '',
        Sonum: '',
        insert_MoLists: []
      },
      // 仓库
      warehouseName: '', // 仓库关键词
      openWarehouse: false, // 仓库弹窗
      dialogTitle: '', // 弹窗标题
      popupTitle: '', // 查询条件文本
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
      val: [],
      showCode: 0
    }
  },
  methods: {
    // 导出表格
    handleExport() {
      require.ensure([], () => {
        const tHeader = ['状态', '订单类型', '生产单号', '型号', '物料编号', '物料描述', '尺寸', '生产类型', '生产部门', '仓库名',
          '库存', '计划数量', '单位', '损耗率', '损耗数', '生产数量', '加工单价', '行金额', '配件交期', '包装BOM']
        const filterVal = ['zt', 'ddlx', 'ssdh', 'itemXH', 'itemCode', 'itemName', 'cc', 'sclx', 'scbm', 'ck',
          'kc', 'qty', 'dw', 'shl', 'shs', 'scQty', 'rprice', 'hje', 'pjjq', 'BZBOM']
        if (this.val.length === 0) {
          this.$message.warning('请选择导出数据')
        } else {
          const list = this.val
          const data = formatJson(filterVal, list)
          export_json_to_excel(tHeader, data, '生产拆单')
        }
      })
    },
    // 获取表头数据
    async gainData(ev) {
      if (ev) {
        this.insetData.Sonum = ev
        this.Sonum = ev
      }
      if (!this.Sonum) {
        return false
      }
      this.insetData.Sonum = this.Sonum
      const DATA = { sonum: this.Sonum }
      // 获取表头数据
      const RES = await Show_SALOrder(DATA)
      if (RES.code === 0) {
        this.orderNumber.customer = RES.data.fname
        this.orderNumber.fpaezText1 = RES.data.f_PAEZ_TEXT1
        this.orderNumber.fpaezCombo = RES.data.f_PAEZ_COMBO
        this.orderNumber.fdeliveryDate = RES.data.f_JC_Duedocdate
        if (this.orderNumber.customer) {
          this.MrpInfo()
        }
      } else {
        this.orderNumber = {}
        this.tableData = []
      }
    },
    // 获取表格数据
    async MrpInfo(ev) {
      if (ev) {
        this.insetData.Sonum = ev
        this.Sonum = ev
      }
      if (!this.orderNumber.customer) {
        this.$message.error('销售订单未审核')
        return
      }
      this.insetData.Sonum = this.Sonum
      const DATA = { Sonum: this.Sonum }
      const { data: RES } = await MrpInfo(DATA)
      this.insetData.CreateID = RES.creater
      RES.array.map(item => {
        if (item.ck === 'null') {
          item.ck = '杰希仓库'
          item.ckid = '323311'
        }
        item.qty = Number(item.qty).toFixed(4)
        item.scQty = Number(item.scQty).toFixed(4)
        item.rprice = Number(item.rprice).toFixed(4)
        item.kc = Number(item.kc).toFixed(4)
        item.hje = Number(item.hje).toFixed(2)
      })
      this.tableData = RES.array
    },
    // 确认下发
    async InsertMO() {
      this.insetData.insert_MoLists = []
      this.val.map(res => {
        if (res.zt === '未转') {
          this.insetData.insert_MoLists.push({
            DDLX: res.ddlx,
            Qutntity: res.qty,
            Rprice: res.rprice,
            StockID: res.ckid,
            StockName: res.ck,
            SCBMID: res.scbmno,
            SCBM: res.scbm,
            DueDocdate: res.pjjq,
            ItemCode: res.itemCode
          })
        }
      })
      if (this.insetData.insert_MoLists.length === 0) {
        this.$message.error('没有可转订单')
        return
      }
      const DATA = this.insetData
      for (const item of this.insetData.insert_MoLists) {
        if (!item.SCBM || !item.StockID) {
          this.$message.error('生产部门或仓库不能为空')
          return
        }
      }
      await InsertMO(DATA).then(res => {
        if (res.code === 0) {
          this.$message.success('下发成功')
          this.val = []
          this.MrpInfo(res.data)
        } else {
          this.$message.error(res.message)
        }
      })
    },
    // 多选时触发的事件
    selectData(val) {
      this.val = val
    },
    // 选择生产部门（弹窗）
    storkCli(ev, en) {
      this.storkVisiblit = true
      this.ddlx = ev.ddlx
      this.itemCode = ev.itemCode
      this.indexSelf = en
    },
    // 接受子组件传值
    storkData(ev) {
      if (ev.scbmno) {
        this.tableData[this.indexSelf].scbmno = ev.scbmno
        this.tableData[this.indexSelf].scbm = ev.scbm
        this.storkVisiblit = false
      } else {
        this.storkVisiblit = false
      }
    },
    // 仓库列表
    async handleWarehouse(index) {
      if (typeof index === 'number') {
        this.indexSelf = index
      }
      this.openWarehouse = true
      const { data: RES } = await queryTBdStock({ ...this.warehousePagination, fname: this.warehouseName })
      this.warehouseData = RES.array
      this.popupTitle = RES.search
      this.warehousePagination.total = RES.total
      this.dialogTitle = '仓库列表'
    },
    // 双击仓库弹窗
    warehouseSelectRow(item) {
      this.tableData[this.indexSelf].ckid = String(item.fstockId)
      this.tableData[this.indexSelf].ck = item.fname
      this.openWarehouse = false
    },
    // 仓库弹窗搜索
    searchWarehouse() {
      this.warehousePagination.pageNum = 1
      this.handleWarehouse()
    },
    // 弹窗关闭事件
    closeDialog() {
      this.openWarehouse = false
      this.warehousePagination.pageNum = 1
    },
    // 清空弹窗表单
    emptyForm() {
      this.warehouseName = ''
    },
    // 监听生产类型
    editLx(res) {
      if (res.row.sclx === '自制') {
        this.tableData[res.$index].ddlx = '生产订单'
        this.tableData[res.$index].scbmno = ''
        this.tableData[res.$index].scbm = ''
      } else if (res.row.sclx === '委外') {
        this.tableData[res.$index].ddlx = '委外订单'
        this.tableData[res.$index].scbmno = ''
        this.tableData[res.$index].scbm = ''
      }
    }
  }
}
</script>

<style scoped lang="scss">
.content {
  @include listBom;

  .el-form {
    display: flex;
    flex-wrap: wrap;

    .el-form-item {
      width: 263px;
      margin-bottom: 15px;
    }
  }

  .el-table ::v-deep .el-table__body-wrapper {
    height: calc(100vh - 400px)
  }

  .footer {
    display: flex;
    flex-direction: column;
    align-items: flex-end;
    margin-right: 50px;
    margin-top: 20px;

    p {
      width: 200px;
    }

    .el-button {
      width: 200px;
      font-size: 16px;
      letter-spacing: 2px;
    }
  }
}
</style>
