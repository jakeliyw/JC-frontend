<template>
  <div class="content">
    <jc-title />
    <el-form :model="orderNumber" label-width="120px">
      <el-form-item label="销售订单号">
        <el-input v-model.trim="orderNumber.sonum" size="mini">
          <i
            slot="suffix"
            class="el-input__icon el-icon-search"
            @click="orderVisiblit=true"
          />
        </el-input>
      </el-form-item>
      <el-form-item label="客户订单号">
        <el-input v-model="orderNumber.khdh" size="mini" />
      </el-form-item>
      <el-form-item label="成品交期始">
        <el-date-picker
          v-model="orderNumber.sd"
          type="date"
          size="mini"
          value-format="yyyy-MM-dd"
          placeholder="选择开始日期"
        />
      </el-form-item>
      <el-form-item label="成品交期至">
        <el-date-picker
          v-model="orderNumber.ed"
          type="date"
          size="mini"
          value-format="yyyy-MM-dd"
          placeholder="选择结束日期"
        />
      </el-form-item>
      <el-form-item label="大类列表">
        <el-input v-model.trim="largeName" size="mini">
          <i
            slot="suffix"
            class="el-input__icon el-icon-search"
            @click="largeVisiblit=true"
          />
        </el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" size="mini" @click="gainData()">运算</el-button>
        <el-button type="primary" size="mini" @click="handleExport">导出Excel</el-button>
        <el-button type="primary" size="mini" @click="Show_StockInfo">设置默认供应商</el-button>
        <el-button type="primary" size="mini" @click="batch">批量填充供应商</el-button>
      </el-form-item>
    </el-form>
    <jc-table
      v-loading="loading"
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
        <el-select
          v-if="col.scope.row.zt==='未转'"
          v-model="col.scope.row.fsupplierid"
          size="mini"
          :disabled="col.scope.row.zt==='已转'"
          @change="seleBatch(col.scope)"
        >
          <el-option
            v-for="item in col.scope.row.fsuppSelect"
            :key="item.scbmno"
            :label="item.scbm"
            :value="item.scbmno"
          />
        </el-select>
        <el-select v-else v-model="col.scope.row.fsuppliername" size="mini" :disabled="col.scope.row.zt==='已转'" />
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
    <!--  销售单价弹窗-->
    <order-num v-if="orderVisiblit" @xsddh="orderData" />
    <!--  大类列表弹窗-->
    <large v-if="largeVisiblit" @large="largeData" />
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
  MrpGetCGprice,
  InsertPO, Show_StockInfo
} from '@/api/mrpView'
import orderNum from '@/views/purchasing/procurement/components/orderNum/index'
import large from '@/views/purchasing/procurement/components/large/index'
import jcPagination from '@/components/Pagination'
import { queryTBdStock } from '@/api/purchaseManagement/createPurchasePrice'
import { export_json_to_excel, formatJson } from '@/utils/Export2Excel'

export default {
  name: 'Procurement',
  components: {
    jcTable,
    jcPopup,
    jcPagination,
    jcTitle,
    orderNum,
    large
  },
  data() {
    return {
      ddlx: '', // 订单类型
      itemCode: '',
      storkVisiblit: false, // 生产部门
      orderVisiblit: false, // 销售订单号弹窗
      largeVisiblit: false, // 大类列表
      orderNumber: {
        sonum: '', // 销售订单号
        khdh: '',
        sd: '',
        ed: '',
        lagerCode: ''
      },
      loading: false,
      indexSelf: '', // 下标
      cellStyle: { padding: '10 10' },
      tableData: [],
      tableHeader: [
        { label: '状态', prop: 'zt', align: 'center', minWidth: '90px' },
        { label: '客户订单号', prop: 'khdh', align: 'center', minWidth: '130px' },
        { label: '销售订单号', prop: 'sonum', align: 'center', minWidth: '130px' },
        { label: '订单类型', prop: 'ddlx', align: 'center', minWidth: '120px' },
        { label: '采购单号', prop: 'cgdh', align: 'center', minWidth: '140px' },
        { label: '型号', prop: 'itemXH', align: 'center', minWidth: '90px' },
        { label: '物料编号', prop: 'itemCode', align: 'center', minWidth: '210px' },
        { label: '物料描述', prop: 'itemName', align: 'left', minWidth: '260px', headerAlign: 'center' },
        { label: '尺寸', prop: 'cc', align: 'center', minWidth: '120px' },
        { label: '生产类型', prop: 'cglx', align: 'center', minWidth: '120px' },
        { label: '供应商', type: 'btn', prop: 'fsuppliername', align: 'center', minWidth: '150px' },
        { label: '仓库', type: 'tag', prop: 'ck', align: 'center', minWidth: '150px' },
        { label: '库存', prop: 'kc', align: 'center', minWidth: '90px' },
        { label: '计划采购数量', prop: 'qty', align: 'center', minWidth: '140px' },
        { label: '数量单位', prop: 'dw', align: 'center', minWidth: '120px' },
        { label: '损耗率', prop: 'shl', align: 'center', minWidth: '110px' },
        { label: '损耗数', prop: 'shs', align: 'center', minWidth: '110px' },
        { label: '实际采购数量', prop: 'cgQty', align: 'center', minWidth: '140px' },
        { label: '采购单价', type: 'state', prop: 'rprice', align: 'center', minWidth: '160px' },
        { label: '采购限价', prop: 'sXprice', align: 'center', minWidth: '130px' },
        { label: '行金额', prop: 'hje', align: 'center', minWidth: '120px' },
        { label: '配件交期', prop: 'pjjq', align: 'center', minWidth: '120px' },
        { label: '包装方式', prop: 'BZBOM', align: 'center', minWidth: '120px' }
      ],
      insetData: {
        CreateID: '',
        // Sonum: '',
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
      showCode: 0,
      largeName: ''
    }
  },
  watch: {
    largeName() {
      if (!this.largeName) {
        this.orderNumber.lagerCode = ''
      }
    },
    orderNumber: {
      handler() {
        if (!this.orderNumber.sd) {
          this.orderNumber.sd = ''
        }
        if (!this.orderNumber.ed) {
          this.orderNumber.ed = ''
        }
      },
      deep: true
    }
  },
  methods: {
    // 导出表格
    handleExport() {
      require.ensure([], () => {
        const tHeader = ['状态', '订单类型', '采购单号', '型号', '物料编号', '物料描述', '尺寸', '生产类型', '供应商', '仓库名',
          '库存', '计划采购数量量', '单位', '损耗率', '损耗数', '实际采购数量', '采购单价', '采购限价', '行金额', '配件交期', '包装方式']
        const filterVal = ['zt', 'ddlx', 'cgdh', 'itemXH', 'itemCode', 'itemName', 'cc', 'cglx', 'fsuppliername', 'ck',
          'kc', 'qty', 'dw', 'shl', 'shs', 'cgQty', 'rprice', 'sXprice', 'hje', 'pjjq', 'BZBOM']
        if (this.val.length === 0) {
          this.$message.warning('请选择导出数据')
        } else {
          const list = this.val
          const data = formatJson(filterVal, list)
          export_json_to_excel(tHeader, data, '采购拆单')
        }
      })
    },
    // 获取表格数据
    async gainData(ev) {
      this.loading = true
      if (ev) {
        this.insetData.Sonum = ev
        this.orderNumber.sonum = ev
      }
      this.insetData.Sonum = this.orderNumber.sonum
      const DATA = { ...this.orderNumber }
      const { data: RES, message, code } = await MrpCGInfor(DATA)
      if (code === 1) {
        this.loading = false
        this.$message.error(message)
      } else {
        this.loading = false
      }
      if (RES) {
        this.insetData.CreateID = RES.creater
      }
      if (RES.array.length === 0) {
        this.$message.warning('生产订单没有转单')
      }
      this.tableData = RES.array
      RES.array.map((item, index) => {
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
      // 筛选
      this.tableHeader.forEach(res => {
        res.filters = []
        this.tableData.forEach(item => {
          if (item[res.prop]) {
            res.filters.push({
              text: item[res.prop], value: item[res.prop]
            })
          }
        })
        const obj = {}
        const result = []
        res.filters.map(item => {
          if (!obj[item.text]) {
            result.push(item)
            obj[item.text] = true
          }
        })
        res.filters = result
      })
      this.loading = false
    },
    // 确认下发
    async InsertMO() {
      this.insetData.insert_MoLists = []
      for (const index in this.tableData) {
        if (!this.tableData[index].fsupplierid || !this.tableData[index].ckid) {
          this.$message.error(Number(index) + Number(1) + '行供应商或仓库不能为空')
          return
        }
        if (this.tableData[index].rprice === 0) {
          this.$message.error(Number(index) + Number(1) + '行采购单价不能为零')
          return
        }
        if (this.tableData[index].rprice > Number(this.tableData[index].sXprice)) {
          this.$message.warning(Number(index) + Number(1) + '行采购单价不能超过限价')
          return
        }
      }
      for (const item of this.val) {
        if (item.zt === '未转') {
          this.insetData.insert_MoLists.push({
            DDLX: item.ddlx,
            Qutntity: item.qty,
            Rprice: String(item.rprice),
            StockID: item.ckid,
            StockName: item.ck,
            SCBMID: item.fsupplierid,
            SCBM: item.fsuppliername,
            DueDocdate: item.pjjq,
            ItemCode: item.itemCode
          })
        }
      }
      if (this.insetData.insert_MoLists.length === 0) {
        this.$message.error('没有可下发订单')
        return
      }
      const DATA = this.insetData
      // 下发转单
      await InsertPO(DATA).then(res => {
        if (res.data.result) {
          this.$message.success('转单成功')
          this.gainData(res.data.messger)
        } else {
          this.$message.error(res.data.messger)
        }
      })
    },
    // 多选时触发的事件
    selectData(val) {
      this.val = val
    },
    // 接受子组件传值,获取销售订单号
    orderData(ev) {
      if (ev.XSDDH.length > 0) {
        this.orderNumber.sonum = ev.XSDDH.join(',')
      }
      this.orderVisiblit = false
    },
    // 接受子组件传值,获取销售订单号
    orderData(ev) {
      if (ev.XSDDH.length > 0) {
        this.orderNumber.sonum = ev.XSDDH.join(',')
      }
      this.orderVisiblit = false
    },
    // 获取大类名称
    largeData(ev) {
      this.largeName = ev.largeName
      this.orderNumber.lagerCode = ev.largeCode
      this.largeVisiblit = false
    },
    // 设置默认供应商
    Show_StockInfo() {
      this.tableData.map((item, index) => {
        // 获取供应商
        if (item.ddlx === '生产订单') {
          this.ddlx = 'SCDD'
        } else if (item.ddlx === '委外订单') {
          this.ddlx = 'WWDD'
        } else if (item.ddlx === '采购订单') {
          this.ddlx = 'CGDD'
        }
        const DATA = { ddlx: this.ddlx, itemCode: item.itemCode, bm: '' }
        Show_StockInfo(DATA).then(res => {
          item.fsuppSelect = res.data
          item.fsupplierid = res.data[0].scbmno
          // 获取单价上限
          const DATA = {
            fsupplierId: item.fsupplierid,
            itemcode: item.itemCode
          }
          MrpGetCGprice(DATA).then(res => {
            if (res.data.result) {
              item.sXprice = Number(res.data.price).toFixed(4)
              item.rprice = Number(res.data.price).toFixed(4)
              this.countHjr(index) // 改变行金额
            }
          })
        })
      })
    },
    // 供应商切换请求限价
    seleBatch(item) {
      const DATA = {
        fsupplierId: item.row.fsupplierid,
        itemcode: item.row.itemCode
      }
      MrpGetCGprice(DATA).then(res => {
        if (res.data.result) {
          this.tableData[item.$index].sXprice = Number(res.data.price).toFixed(4)
          this.tableData[item.$index].rprice = Number(res.data.price).toFixed(4)
          this.countHjr(item.$index) // 改变行金额
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
    },
    // 批量填充供应商
    batch() {
      if (this.val.length > 0) {
        this.val.map(item => {
          item.fsuppSelect.forEach(res => {
            if (res.scbmno === this.val[0].fsupplierid) {
              item.fsupplierid = this.val[0].fsupplierid
            } else {
              item.fsupplierid = ''
              item.sXprice = 0
              item.rprice = 0
            }
          })
        })
      } else {
        this.$message.warning('请选择数据')
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

    .el-form-item:nth-child(1) {
      width: 526px;

      &::v-deep .el-input__inner {
        width: 418px;
      }

      .el-input__icon {
        cursor: pointer;
        transform: translateX(260px);
      }
    }

    .el-form-item:last-child {
      width: 526px;

      &::v-deep .el-form-item__content {
        width: 418px;
      }
    }

    &::v-deep .el-input__inner {
      width: 155px;
    }

    &::v-deep .el-form-item__content {
      width: 160px;
    }

    .el-input__icon {
      cursor: pointer;
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
