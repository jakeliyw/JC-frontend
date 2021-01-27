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
        <el-button type="primary" size="mini" @click="MrpInfo()">运算</el-button>
      </el-form-item>
    </el-form>
    <jc-table
      :table-data="tableData"
      :table-header="tableHeader"
      :cell-style="cellStyle"
      @selectionChange="selectData"
    >
      <el-table-column type="selection" width="60px" align="center" />
      <!--采购单价-->
      <template v-slot:btnState="col">
        <el-input-number
          v-model="col.scope.row.rprice"
          size="mini"
          :min="0"
          :disabled="col.scope.row.zt==='已转'"
          @change="countHjr(col.scope.$index)"
        />
      </template>
      <!--供应商-->
      <template v-slot:btnSlot="col">
        <el-input
          v-model="col.scope.row.fsuppliername"
          placeholder="请选择供应商"
          size="mini"
          oncopy="return false"
          onpaste="return false"
        >
          <i
            slot="suffix"
            class="el-input__icon el-icon-search"
            @click="storkCli(col.scope.row.ddlx, col.scope.$index)"
          />
        </el-input>
      </template>
      <!--仓库-->
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
import jcTitle from '@/components/Title'
import jcPopup from '@/views/basic/createMateriel/components/Popup'
import {
  MrpCGInfor,
  Show_SALOrder,
  MrpGetCGprice,
  InsertPO
} from '@/api/mrpView'
import stork from '@/views/purchasing/procurement/components/stork/index'
import jcPagination from '@/components/Pagination'
import { queryTBdStock } from '@/api/purchaseManagement/createPurchasePrice'

export default {
  name: 'Procurement',
  components: {
    jcTable,
    stork,
    jcPopup,
    jcPagination,
    jcTitle
  },
  data() {
    return {
      ddlx: '', // 订单类型
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
        { label: '订单类型', prop: 'ddlx', align: 'center' },
        { label: '采购单号', prop: 'cgdh', align: 'center', minWidth: '140px' },
        { label: '型号', prop: 'itemXH', align: 'center' },
        { label: '物料编号', prop: 'itemCode', align: 'center', minWidth: '210px' },
        { label: '物料描述', prop: 'itemName', align: 'center', minWidth: '260px' },
        { label: '尺寸', prop: 'cc', align: 'center', minWidth: '120px' },
        { label: '生产类型', prop: 'cglx', align: 'center', minWidth: '100px' },
        { label: '供应商', type: 'btn', prop: 'fsuppliername', align: 'center', minWidth: '150px' },
        { label: '仓库', type: 'tag', prop: 'ck', align: 'center', minWidth: '150px' },
        { label: '库存', prop: 'kc', align: 'center' },
        { label: '计划采购数量', prop: 'qty', align: 'center', minWidth: '100px' },
        { label: '数量单位', prop: 'dw', align: 'center' },
        { label: '损耗率', prop: 'shl', align: 'center' },
        { label: '损耗数', prop: 'shs', align: 'center' },
        { label: '实际采购数量', prop: 'cgQty', align: 'center', minWidth: '100px' },
        { label: '采购单价', type: 'state', prop: 'rprice', align: 'center', minWidth: '160px' },
        { label: '采购限价', prop: 'sXprice', align: 'center' },
        { label: '行金额', prop: 'hje', align: 'center' },
        { label: '配件交期', prop: 'pjjq', align: 'center', minWidth: '100px' },
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
      val: [],
      showCode: 0
    }
  },
  methods: {
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
      const DATA = { sonum: this.Sonum }
      const { data: RES } = await MrpCGInfor(DATA)
      this.insetData.CreateID = RES.creater
      if (RES.array.length === 0) {
        this.$message.warning('生产订单没有转单')
      }
      RES.array.map(item => {
        if (item.ck === 'null') {
          item.ck = '杰希仓库'
          item.ckid = '323311'
        }
        if (item.fsuppliername === 'null') {
          item.fsuppliername = ''
          item.fsupplierid = ''
        }
        item.qty = Number(item.qty).toFixed(4)
        item.cgQty = Number(item.cgQty).toFixed(4)
        item.rprice = Number(item.rprice).toFixed(4)
        item.kc = Number(item.kc).toFixed(4)
        item.shs = Number(item.shs).toFixed(4)
        item.sXprice = Number(item.sXprice).toFixed(4)
        item.hje = (item.rprice * item.cgQty).toFixed(2)
      })
      this.tableData = RES.array
    },
    // 确认下发
    async InsertMO() {
      this.insetData.insert_MoLists = []
      for (const res of this.val) {
        if (res.zt === '未转') {
          this.insetData.insert_MoLists.push({
            DDLX: res.ddlx,
            Qutntity: res.qty,
            Rprice: String(res.rprice),
            StockID: res.ckid,
            StockName: res.ck,
            SCBMID: res.fsupplierid,
            SCBM: res.fsuppliername,
            DueDocdate: res.pjjq,
            ItemCode: res.itemCode
          })
        }
        if (res.rprice === 0) {
          this.$message.error('采购单价不能为零')
          return false
        }
        if (res.rprice > Number(res.sXprice)) {
          this.$message.warning('采购单价不能超过限价')
          return
        }
      }
      if (this.insetData.insert_MoLists.length === 0) {
        this.$message.error('没有可下发订单')
        return false
      }
      const DATA = this.insetData
      for (const item of this.insetData.insert_MoLists) {
        if (!item.SCBM || !item.StockID) {
          this.$message.error('供应商或仓库不能为空')
          return false
        }
      }
      // 下发转单
      await InsertPO(DATA).then(res => {
        if (res.data.result) {
          this.$message.success('转单成功')
          this.MrpInfo(res.data.messger)
        } else {
          this.$message.error(res.data.messger)
        }
      })
    },
    // 多选时触发的事件
    selectData(val) {
      this.val = val
    },
    // 选择供应商（弹窗）
    storkCli(ev, en) {
      this.storkVisiblit = true
      this.ddlx = ev
      this.indexSelf = en
    },
    // 接受子组件传值,获取供应商
    storkData(ev) {
      if (ev.scbmno) {
        this.tableData[this.indexSelf].fsuppliername = ev.scbm
        this.tableData[this.indexSelf].fsupplierid = ev.scbmno
        this.storkVisiblit = false
        this.MrpGetCGprice()
      } else {
        this.storkVisiblit = false
      }
    },
    // 获取单价上限
    MrpGetCGprice() {
      const DATA = {
        fsupplierId: this.tableData[this.indexSelf].fsupplierid,
        itemcode: this.tableData[this.indexSelf].itemCode
      }
      MrpGetCGprice(DATA).then(res => {
        if (res.data.result) {
          this.tableData[this.indexSelf].sXprice = Number(res.data.price).toFixed(4)
          this.tableData[this.indexSelf].rprice = Number(res.data.price).toFixed(4)
          this.countHjr(this.indexSelf) // 改变行金额
        } else {
          this.$message.error(res.data.messger)
        }
      })
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
    // 点击数量，改变行金额
    countHjr(ev) {
      this.tableData[ev].hje = (this.tableData[ev].rprice * this.tableData[ev].cgQty).toFixed(2)
    }
    // 已转订单 禁止选择
    // selectable(row, index) {
    //   if (row.zt === '未转') {
    //     return true
    //   } else {
    //     return false
    //   }
    // }
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

    .el-button {
      width: 200px;
      font-size: 16px;
      letter-spacing: 2px;
    }
  }
}
</style>
