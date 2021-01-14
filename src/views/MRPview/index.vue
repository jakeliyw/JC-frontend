<template>
  <div class="content">
    <el-form :model="orderNumber" label-width="90px">
      <el-form-item label="销售订单号">
        <el-input v-model.trim="Sonum" size="mini" @keyup.enter.native="gainData" />
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
      </el-form-item>
    </el-form>
    <jc-table
      :table-data="tableData"
      :table-header="tableHeader"
      table-height="500px"
      :cell-style="cellStyle"
      @selectionChange="selectData"
    >
      <el-table-column type="selection" :selectable="selectable" width="60px" align="center" />
      <template v-slot:btnSlot="col">
        <el-input v-model="col.scope.row.scbm" placeholder="请选择生产部门" size="mini">
          <i
            slot="suffix"
            class="el-input__icon el-icon-search"
            @click="storkCli(col.scope.row.ddlx, col.scope.$index)"
          />
        </el-input>
      </template>
      <template v-slot:tagSlot="col">
        <el-input v-model="col.scope.row.ck" placeholder="请选择仓库" size="mini">
          <i
            slot="suffix"
            class="el-input__icon el-icon-search"
            @click="handleWarehouse(col.scope.$index)"
          />
        </el-input>
      </template>
    </jc-table>
    <div class="footer">
      <p>总金额： <span>{{ grossAmount }}</span></p>
      <el-button type="primary" @click="InsertMO()">确认下发</el-button>
    </div>
    <stork v-if="storkVisiblit" :msg="ddlx" @stork="storkData" />
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
import jcPopup from '@/views/basic/createMateriel/components/Popup'
import { MrpInfo,
  InsertMO
  // Show_SALOrder
} from '@/api/mrpView'
import stork from '@/views/MRPview/components/stork/index'
import jcPagination from '@/components/Pagination'
import { queryTBdStock } from '@/api/purchaseManagement/createPurchasePrice'
export default {
  components: {
    jcTable,
    stork,
    jcPopup,
    jcPagination
  },
  data() {
    return {
      ddlx: '', // 订单类型
      storkVisiblit: false, // 生产部门
      Sonum: 'NX2101576', // 销售订单号
      orderNumber: {
        customer: '',
        fpaezText1: '',
        fpaezCombo: '',
        fdeliveryDate: ''
      },
      indexSelf: '',
      cellStyle: { padding: '10 10' },
      grossAmount: 0, // 总金额
      tableData: [],
      tableHeader: [
        { label: '状态', prop: 'zt', align: 'center' },
        { label: '订单类型', prop: 'ddlx', align: 'center' },
        { label: '生产单号', prop: 'ssdh', align: 'center' },
        { label: '型号', prop: 'itemXH', align: 'center' },
        { label: '物料编号', prop: 'itemCode', align: 'center', minWidth: '210px' },
        { label: '物料描述', prop: 'itemName', align: 'center', minWidth: '260px' },
        { label: '生产类型', prop: 'sclx', align: 'center' },
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
        { label: '配件交期', prop: 'pjjq', align: 'center' },
        { label: '包装方式', prop: 'BZBOM', align: 'center' }
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
      val: []
    }
  },
  methods: {
    // 获取表格数据
    // async gainData(ev) {
    //   if (ev) {
    //     this.insetData.Sonum = ev
    //     this.Sonum = ev
    //   }
    //   this.insetData.Sonum = this.Sonum
    //   const DATA = { sonum: this.Sonum }
    //   // 获取表头数据
    //   const { data: RES } = await Show_SALOrder(DATA)
    //   console.log(RES)
    // },
    async gainData(ev) {
      if (ev) {
        this.insetData.Sonum = ev
        this.Sonum = ev
      }
      this.insetData.Sonum = this.Sonum
      const DATA = { Sonum: this.Sonum }
      const { data: RES } = await MrpInfo(DATA)
      this.grossAmount = 0
      this.insetData.CreateID = RES.creater
      RES.array.map(item => {
        item.qty = Number(item.qty).toFixed(4)
        item.scQty = Number(item.scQty).toFixed(4)
        item.rprice = Number(item.rprice).toFixed(4)
        item.kc = Number(item.kc).toFixed(4)
        item.hje = Number(item.hje).toFixed(2)
        this.grossAmount += Number(item.hje)
      })
      this.tableData = RES.array
    },
    // 确认下发
    async InsertMO() {
      this.val.map(res => {
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
      })
      const DATA = this.insetData
      await InsertMO(DATA).then(res => {
        if (res.code === 0) {
          this.$message.success('下发成功')
          this.gainData(res.data)
        } else {
          this.$message.error(res.message)
        }
      })
    },
    // 多选时触发的事件
    selectData(val) {
      this.val = val
    },
    // 状态已转禁止选择
    selectable(row, index) {
      if (row.zt === '已转') {
        return false
      } else {
        return true
      }
    },
    // 选择生产部门（弹窗）
    storkCli(ev, en) {
      this.storkVisiblit = true
      this.ddlx = ev
      this.indexSelf = en
    },
    // 接受子组件传值
    storkData(ev) {
      this.tableData[this.indexSelf].scbmno = ev.scbmno
      this.tableData[this.indexSelf].scbm = ev.scbm
      this.storkVisiblit = false
    },
    // 仓库列表
    async handleWarehouse(index) {
      this.indexSelf = index
      this.openWarehouse = true
      const { data: RES } = await queryTBdStock({ ...this.warehousePagination, fname: this.warehouseName })
      this.warehouseData = RES.array
      this.popupTitle = RES.search
      this.dialogTitle = '仓库列表'
      this.warehousePagination.total = RES.total
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
    height: calc( 100vh - 400px)
  }
  .footer {
    display: flex;
    flex-direction: column;
    align-items: flex-end;
    margin-right: 50px;

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
