<template>
  <div class="content">
    <jc-title />
    <el-button type="primary" style="width: 80px;margin-bottom: 10px" size="mini" @click="subMarker()">保存</el-button>
    <el-tabs type="border-card">
      <el-tab-pane label="主产品">
        <el-form ref="purchaseRef" :model="prodValue" label-width="100px">
          <el-form-item label="单据类型" prop="fbillType">
            <el-input
              v-model="prodValue.fbillType"
              placeholder="请选择单据类型"
              size="mini"
              disabled
            />
          </el-form-item>
          <el-form-item label="销售组织" prop="fsaleOrgId">
            <el-input v-model="prodValue.fsaleOrg" placeholder="请选择组织" disabled size="mini" />
          </el-form-item>
          <el-form-item label="单据编号">
            <el-input v-model="prodValue.fbillNo" placeholder="保存自动生成" disabled size="mini" />
          </el-form-item>
          <el-form-item label="客户" prop="fcustId">
            <el-input v-model.trim="prodValue.customer" placeholder="请选择客户" size="mini" disabled />
          </el-form-item>
          <el-form-item label="交货方式" prop="fheadDeliveryWay">
            <el-input v-model.trim="prodValue.fheadDeliveryWayName" placeholder="请选择交货方式" size="mini">
              <i
                slot="suffix"
                class="el-input__icon el-icon-search"
                @click="deliveVisiblit=true"
              />
            </el-input>
          </el-form-item>
          <el-form-item label="要货时间" prop="fdeliveryDate">
            <el-date-picker
              v-model="prodValue.fdeliveryDate"
              type="date"
              value-format="yyyy-MM-dd"
              size="mini"
              placeholder="选择日期"
              style="width: 163px"
            />
          </el-form-item>
          <el-form-item label="销售员" prop="fsalerId">
            <el-input v-model.trim="prodValue.fsaler" placeholder="请选择销售员" size="mini">
              <i
                slot="suffix"
                class="el-input__icon el-icon-search"
                @click="marketVisiblit=true"
              />
            </el-input>
          </el-form-item>
          <el-form-item label="收款条件" prop="frecConditionId">
            <el-input v-model.trim="prodValue.frecCondition" placeholder="请选择收款条件" size="mini">
              <i
                slot="suffix"
                class="el-input__icon el-icon-search"
                @click="gatheringVisiblit=true"
              />
            </el-input>
          </el-form-item>
          <el-form-item label="结算币别" prop="fsettleCurrId">
            <el-input v-model.trim="prodValue.fsettleCurr" placeholder="请选择结算币别" size="mini">
              <i
                slot="suffix"
                class="el-input__icon el-icon-search"
                @click="currencyVisiblit=true"
              />
            </el-input>
          </el-form-item>
          <el-form-item label="汇率类型">
            <el-input v-model="prodValue.fexchangeType" placeholder="请输入汇率类型" disabled size="mini" />
          </el-form-item>
          <el-form-item label="本位币">
            <el-input v-model="prodValue.flocalCurr" placeholder="请输入本位币" disabled size="mini" />
          </el-form-item>
          <el-form-item label="汇率">
            <el-input v-model="prodValue.fexchangeRate" disabled size="mini" />
          </el-form-item>
          <el-form-item label="价目表" prop="fpriceListId">
            <el-input v-model.trim="prodValue.fpriceList" placeholder="请选择价目表" size="mini" disabled />
          </el-form-item>
          <el-form-item label="柜型" prop="fpaezText">
            <el-input v-model.trim="prodValue.fpaezText" placeholder="请输入柜型" size="mini" /></el-form-item>
          <el-form-item label="客户订单号" prop="fpaezText1">
            <el-input v-model.trim="prodValue.fpaezText1" placeholder="请输入客户订单号" size="mini" /></el-form-item>
          <el-form-item label="客户PO NO" prop="fpaezText2">
            <el-input v-model.trim="prodValue.fpaezText2" placeholder="请输入客户PO NO" size="mini" /></el-form-item>
          <el-form-item label="品质标准" prop="fpaezCombo">
            <el-select v-model="prodValue.fpaezCombo" placeholder="请选择品质标准" size="mini" filterable>
              <el-option v-for="(item, index) in standard" :key="index" :label="item.fpaezCombo" :value="item.fpaezCombo" />
            </el-select>
          </el-form-item>
          <el-form-item label="备注" prop="fnote">
            <el-input v-model.trim="prodValue.fnote" type="textarea" placeholder="请填写备注" size="mini" />
          </el-form-item>
          <el-form-item label="是否含税">
            <el-checkbox v-model="prodValue.fisIncludedTax" />
          </el-form-item>
        </el-form>
        <tab :msg="saleDetails" :msg1="planDetails" :msg2="prodValue" @visible="handlechange" />
      </el-tab-pane>
      <el-tab-pane label="其他">
        <h1>开发中</h1>
      </el-tab-pane>
    </el-tabs>
    <!--客户列表-->
    <client v-if="clientVisiblit" @client="clientData" />
    <!--交货方式列表-->
    <deliver v-if="deliveVisiblit" @delive="deliveData" />
    <!--销售员列表-->
    <market v-if="marketVisiblit" @market="marketData" />
    <!--结算币别列表-->
    <currency v-if="currencyVisiblit" @currency="currencyData" />
    <!--收款条件列表-->
    <gathering v-if="gatheringVisiblit" @gathering="gatheringData" />
  </div>
</template>
<script>
import { queryTBasBilltype,
  queryFpaezCombo,
  querySalerRate,
  queryTSalOrderNtry,
  updateSalOrder,
  queryOrgList
} from '@/api/marketManage/marketOrder'
import jumpMateriel from '@/components/JumpMateriel'
import tab from '@/views/market/marketManage/marketRevising/components/tab'
import client from '@/views/market/marketManage/createMarkerOrder/components/client'
import deliver from '@/views/market/marketManage/createMarkerOrder/components/deliver'
import market from '@/views/market/marketManage/createMarkerOrder/components/market'
import currency from '@/views/market/marketManage/createMarkerOrder/components/currency'
import gathering from '@/views/market/marketManage/createMarkerOrder/components/gathering'
import jcTitle from '@/components/Title'
export default {
  name: 'CreateMarkerOrder',
  components: {
    tab,
    client,
    deliver,
    market,
    currency,
    gathering,
    jcTitle
  },
  mixins: [jumpMateriel],
  data() {
    return {
      clientVisiblit: false, // 客户列表弹窗
      deliveVisiblit: false, // 交货方式弹窗
      marketVisiblit: false, // 销售员弹窗
      currencyVisiblit: false, // 结算币别弹窗
      gatheringVisiblit: false, // 收款条件弹窗
      tableHeard1: [], // 明细信息
      tableHeader2: [], // 收款计划
      standard: [], // 品质标准
      // 点击行的序号
      tableIndex: 0,
      billtypes: [], // 单据类型
      teamList: [], // 组织
      cellStyle: { padding: '10 10' },
      prodValue: { flocalCurrId: '' }, // 表单数据
      saleDetails: [], // 明细数据
      planDetails: [] // 明细数据
    }
  },
  created() {
    this.queryFpaezCombo() // 品质标准
    this.queryTSalOrderNtry() // 获取订单列表数据
  },
  methods: {
    // 获取订单列表数据
    async queryTSalOrderNtry() {
      const id = this.$route.params.id
      const DATA = { fid: id }
      const { data: RES } = await queryTSalOrderNtry(DATA)
      if (RES.fcloseStatus === 'A') {
        RES.fcloseStatus = '正常'
      } else {
        RES.fcloseStatus = '已关闭'
      }
      this.prodValue = RES
      this.saleDetails = RES.saleDetails
      this.planDetails = RES.planDetails
      // 修改自动添加一条空数据
      this.saleDetails.push(
        {
          fmaterialId: '', fdescripTion: '', funitId: '', fqty: '', fisFree: false, ftaxRate: '', fdeliveryDate: ''
        }
      )
    },
    // 保存
    subMarker() {
      const DATA = this.prodValue
      this.prodValue.planDetails = this.planDetails
      this.prodValue.saleDetails = this.saleDetails
      // 表格不能为空
      for (const item of this.prodValue.saleDetails) {
        if (item.fmaterialId === '' || item.funitId === '' || item.fqty === '' || item.fdeliveryDate === '') {
          this.$message.error('表格不能为空或删除空行')
          return false
        }
      }
      for (const item of this.prodValue.planDetails) {
        if (item.frecAdvanceRate === '' || item.frecAdvanCeamount === '') {
          this.$message.error('表格不能为空')
          return false
        }
      }
      updateSalOrder(DATA).then(res => {
        if (res.code === 0) {
          this.$message({
            type: 'success',
            message: '修改成功'
          })
          setTimeout(() => {
            location.reload()
          }, 1000)
        }
      }).catch(error => {
        this.$message.error(error)
      })
    },
    // 查询单据类型
    async queryTBasBilltype() {
      const { data: RES } = await queryTBasBilltype()
      this.billtypes = RES
    },
    // 获取组织
    async handleGetPurchase() {
      const { data: RES } = await queryOrgList()
      this.teamList = RES
    },
    // 获取客户数据(子传父)
    clientData(item) {
      this.prodValue.fcustId = item.fcustId
      this.prodValue.customer = item.fname
      this.clientVisiblit = item.isclientlDialog
    },
    // 获取交货方式数据(子传父)
    deliveData(item) {
      this.prodValue.fheadDeliveryWayName = item.fdataValue
      this.prodValue.fheadDeliveryWay = item.fheadDeliveryWay
      this.deliveVisiblit = item.isdeliverlDialog
    },
    // 获取销售员数据(子传父)
    marketData(item) {
      this.prodValue.fsaler = item.fsalerIdName
      this.prodValue.fsalerId = item.fsalerId
      this.marketVisiblit = item.ismarketlDialog
    },
    // 获取结算币别数据(子传父)
    currencyData(item) {
      this.prodValue.fsettleCurr = item.fsettleCurrIdName
      this.prodValue.fsettleCurrId = item.fsettleCurrId
      this.currencyVisiblit = item.isCurrencyDialog
      // 获取汇率
      this.querySalerRate()
    },
    // 收款条件列表
    gatheringData(item) {
      this.prodValue.frecCondition = item.frecConditionIdName
      this.prodValue.frecConditionId = item.frecConditionId
      this.gatheringVisiblit = false
    },
    // 品质标准
    async queryFpaezCombo() {
      const { data: RES } = await queryFpaezCombo()
      this.standard = RES
    },
    // 查询销售订单汇率
    async querySalerRate() {
      const DATA = { fxxchangeTypeId: this.prodValue.fxxchangeTypeId, fsettleCurrId: this.prodValue.fsettleCurrId, flocalCurrId: this.prodValue.flocalCurrId }
      const { data: RES } = await querySalerRate(DATA)
      if (RES) {
        this.prodValue.fexchangeRate = RES.fexchangeRate
      } else {
        this.prodValue.fexchangeRate = ''
      }
    },
    // 明细信息、收款计划数据
    handlechange(ev) {
      this.prodValue.saleDetails = ev.saleDetails
      this.prodValue.planDetails = ev.planDetails
    }
  }
}
</script>
<style scoped lang="scss">
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
.el-input__icon{
  cursor: pointer;
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
