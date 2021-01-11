<template>
  <div v-loading="loading" class="content">
    <jc-title/>
    <el-button type="primary" style="width: 80px;margin-bottom: 10px" @click="subMarker()" size="mini">保存</el-button>
    <el-tabs type="border-card">
      <el-tab-pane label="主产品">
        <el-form ref="purchaseRef" :model="prodValue" label-width="100px" :rules="prodValueRules">
          <el-form-item label="单据类型" prop="fbillTypeId">
            <el-select
              v-model="prodValue.fbillTypeId"
              placeholder="请选择单据类型"
              size="mini"
            >
              <el-option
                v-for="billty in billtypes"
                :key="billty.fbillTypeId"
                :label="billty.fname"
                :value="billty.fbillTypeId"
              />
            </el-select>
          </el-form-item>
          <el-form-item label="销售组织" prop="fsaleOrgId">
            <el-select v-model="prodValue.fsaleOrgId" placeholder="请选择组织" size="mini" @change="fsale">
              <el-option
                v-for="option in teamList"
                :key="option.value"
                :label="option.fname"
                :value="option.forgId"
              />
            </el-select>
          </el-form-item>
          <el-form-item label="单据编号">
            <el-input v-model="prodValue.fbillNo" placeholder="保存自动生成" size="mini" disabled />
          </el-form-item>
          <el-form-item label="客户" prop="fcustId">
            <el-input v-model="prodValue.fname" placeholder="请选择客户" size="mini">
              <i
                slot="suffix"
                class="el-input__icon el-icon-search"
                @click="clientVisiblit=true"
              />
            </el-input>
          </el-form-item>
          <el-form-item label="交货方式" prop="fheadDeliveryWay">
            <el-input v-model="prodValue.fdataValue" placeholder="请选择交货方式" size="mini">
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
              type="datetime"
              value-format="yyyy-MM-dd HH:mm:ss"
              size="mini"
              placeholder="选择日期"
              style="width: 163px"
            />
          </el-form-item>
          <el-form-item label="销售员" prop="fsalerId">
            <el-input v-model="prodValue.fsalerIdName" placeholder="请选择销售员" size="mini">
              <i
                slot="suffix"
                class="el-input__icon el-icon-search"
                @click="marketVisiblit=true"
              />
            </el-input>
          </el-form-item>
          <el-form-item label="收款条件" prop="frecConditionId">
            <el-input v-model="prodValue.frecConditionIdName" placeholder="请选择收款条件" size="mini">
              <i
                slot="suffix"
                class="el-input__icon el-icon-search"
                @click="gatheringVisiblit = true"
              />
            </el-input>
          </el-form-item>
          <el-form-item label="结算币别" prop="fsettleCurrId">
            <el-input v-model="prodValue.fsettleCurrIdName" placeholder="请选择结算币别" size="mini">
              <i
                slot="suffix"
                class="el-input__icon el-icon-search"
                @click="currencyVisiblit = true"
              />
            </el-input>
          </el-form-item>
          <el-form-item label="汇率类型">
            <el-input v-model="prodValue.fxxchangeType" placeholder="请输入汇率类型" disabled size="mini" />
          </el-form-item>
          <el-form-item label="本位币">
            <el-input v-model="prodValue.flocalCurr" placeholder="请输入本位币" disabled size="mini" />
          </el-form-item>
          <el-form-item label="汇率">
            <el-input v-model="prodValue.fexchangeRate" disabled size="mini" />
          </el-form-item>
          <el-form-item label="价目表" prop="fpriceListId">
            <el-input v-model="prodValue.fpriceListIdName" placeholder="请输入价目表" size="mini" disabled />
          </el-form-item>
          <el-form-item label="柜型" prop="fpaezText">
            <el-input v-model.trim="prodValue.fpaezText" placeholder="请输入柜型" size="mini" />
          </el-form-item>
          <el-form-item label="客户订单号" prop="fpaezText1">
            <el-input v-model.trim="prodValue.fpaezText1" placeholder="请输入客户订单号" size="mini" />
          </el-form-item>
          <el-form-item label="客户PO NO" prop="fpaezText2">
            <el-input v-model.trim="prodValue.fpaezText2" placeholder="请输入客户PO NO" size="mini" />
          </el-form-item>
          <el-form-item label="品质标准" prop="fpaezCombo">
            <el-select v-model="prodValue.fpaezCombo" placeholder="请选择品质标准" size="mini">
              <el-option
                v-for="(item, index) in standard"
                :key="index"
                :label="item.fpaezCombo"
                :value="item.fpaezCombo"
              />
            </el-select>
          </el-form-item>
          <el-form-item label="备注" prop="fnote">
            <el-input v-model.trim="prodValue.fnote" type="textarea" placeholder="请填写备注" size="mini" />
          </el-form-item>
          <el-form-item label="是否含税">
            <el-checkbox v-model="prodValue.fisIncludedTax" />
          </el-form-item>
        </el-form>
        <tab :msg="prodValue.fpriceListId" @visible="prodOrder" />
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
    <!--价目列表-->
    <priceList v-if="priceListVisiblit" @priceList="priceListData" />
  </div>
</template>
<script>
import {
  queryTBasBilltype,
  queryFpaezCombo,
  querySalerRate,
  querySalOrderFxxchange,
  insertSalOrder,
  queryOrgList,
  querySalPriceCustomer
} from '@/api/marketManage/marketOrder'
import jumpMateriel from '@/components/JumpMateriel'
import tab from '@/views/market/marketManage/createMarkerOrder/components/tab'
import client from '@/views/market/marketManage/createMarkerOrder/components/client'
import deliver from '@/views/market/marketManage/createMarkerOrder/components/deliver'
import market from '@/views/market/marketManage/createMarkerOrder/components/market'
import currency from '@/views/market/marketManage/createMarkerOrder/components/currency'
import gathering from '@/views/market/marketManage/createMarkerOrder/components/gathering'
import jcTitle from '@/components/Title'
import priceList from '@/views/market/marketManage/createMarkerOrder/components/priceListPagination'

export default {
  name: 'CreateMarkerOrder',
  components: {
    tab,
    client,
    deliver,
    market,
    currency,
    gathering,
    priceList,
    jcTitle
  },
  mixins: [jumpMateriel],
  data() {
    return {
      fid: '', // 价目ID
      clientVisiblit: false, // 客户列表弹窗
      deliveVisiblit: false, // 交货方式弹窗
      marketVisiblit: false, // 销售员弹窗
      currencyVisiblit: false, // 结算币别弹窗
      gatheringVisiblit: false, // 收款条件弹窗
      priceListVisiblit: false, // 价目表弹窗
      tableHeight: '50vh', // 弹框中表格高度
      loading: false, // 加载中
      standard: [], // 品质标准
      billtypes: [], // 单据类型
      teamList: [], // 组织
      prodValue: { // 表单数据
        fdeliveryDate: '', // 要货时间
        fbillTypeId: '', // 单据类型
        fsaleOrgId: '', // 销售组织
        fcustId: '', // 客户id
        fname: '', // 客户
        fdataValue: '', // 交货方式名称
        fheadDeliveryWay: '', // 交货方式编码
        fnote: '', // 备注
        fsettleCurrIdName: '', // 结算币别名称
        fsettleCurrId: '', // 结算币别id
        fbillNo: '', // 单据编号
        fsalerId: '', // 销售员ID
        fsalerIdName: '', // 销售员名称
        fpriceListIdName: '', // 价目表名称
        fpriceListId: 0, // 价目表id
        frecConditionId: '', // 收款条件id
        frecConditionIdName: '', // 收款条件名称
        fisIncludedTax: false, // 是否含税
        fexchangeRate: '', // 汇率
        flocalCurrId: '', // 本位币id
        fxxchangeTypeId: '', // 汇率类型id
        fxxchangeType: '', // 汇率类型
        flocalCurr: '' // 本位币
      },
      fcurrencyId: '', // 汇率类型ID
      frateTypeId: '', // 币别ID
      cellStyle: { padding: '10 10' },
      prodValueRules: { // 提交验证
        fbillTypeId: [
          { required: true, message: '请选择单据类型', trigger: 'change' }
        ], fsaleOrgId: [
          { required: true, message: '请选择销售组织', trigger: 'change' }
        ], fcustId: [
          { required: true, message: '请选择客户', trigger: 'change' }
        ], fheadDeliveryWay: [
          { required: true, message: '请选择交货方式', trigger: 'change' }
        ], fsalerId: [
          { required: true, message: '请选择销售员', trigger: 'change' }
        ], fnote: [
          { required: true, message: '请选择备注', trigger: 'change' }
        ], fsettleCurrId: [
          { required: true, message: '请选择结算币别', trigger: 'change' }
        ], frecConditionId: [
          { required: true, message: '请选择收款条件', trigger: 'change' }
        ], fpaezCombo: [
          { required: true, message: '请选择品质标准', trigger: 'change' }
        ], fpriceListId: [
          { required: true, message: '请选择价目表', trigger: 'blur' }
        ], fpaezText: [
          { required: true, message: '请选择柜型', trigger: 'blur' }
        ], fpaezText1: [
          { required: true, message: '请选择客户订单号', trigger: 'blur' }
        ], fpaezText2: [
          { required: true, message: '请选择客户PO NO', trigger: 'blur' }
        ], fdeliveryDate: [
          { required: true, message: '请选择要货时间', trigger: 'change' }
        ]
      }
    }
  },
  created() {
    this.queryTBasBilltype()
    this.handleGetPurchase()
    this.queryFpaezCombo()
  },
  methods: {
    // 保存
    subMarker() {
      this.loading = true
      this.$refs.purchaseRef.validate(valid => {
        if (!valid) {
          this.loading = false
          return false
        }
        if (!this.prodValue.fexchangeRate) {
          this.$message.error('汇率不能为空')
          this.loading = false
          return false
        }
        for (const item of this.prodValue.saleDetails) {
          if (item.fmaterialId === '' || item.funitId === '' || item.fqty === '') {
            this.$message.error('表格不能为空或删除空行')
            this.loading = false
            return false
          }
        }
        for (const item of this.prodValue.planDetails) {
          if (item.frecAdvanceRate === '' || item.frecAdvanCeamount === '') {
            this.$message.error('表格不能为空')
            this.loading = false
            return false
          }
        }
        const DATA = this.prodValue
        insertSalOrder(DATA).then(res => {
          this.prodValue.fbillNo = res.data
          this.loading = false
          if (res.code === 0) {
            this.$message({
              type: 'success',
              message: '新增成功'
            })
            setTimeout(() => {
              location.reload()
            }, 2000)
          }
        }).catch(error => {
          this.$message.error(error)
        })
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
    // 监听选取组织获取本位币、汇率
    fsale(val) {
      this.teamList.filter(res => {
        if (res.forgId === val) {
          this.frateTypeId = res.frateTypeId
          this.fcurrencyId = res.fcurrencyId
          this.querySalOrderFxxchange()
        }
      })
    },
    // 获取客户数据(子传父)
    clientData(item) {
      this.prodValue.fcustId = item.fcustId
      this.prodValue.fname = item.fname
      this.clientVisiblit = item.isclientlDialog
      if (item.fcustId) {
        const DATA = { fcustId: item.fcustId }
        querySalPriceCustomer(DATA).then(res => {
          this.prodValue.fpriceListId = res.data.fid
          this.prodValue.fpriceListIdName = res.data.fname
        })
      }
    },
    // 获取交货方式数据(子传父)
    deliveData(item) {
      this.prodValue.fdataValue = item.fdataValue
      this.prodValue.fheadDeliveryWay = item.fheadDeliveryWay
      this.deliveVisiblit = item.isdeliverlDialog
    },
    // 获取销售员数据(子传父)
    marketData(item) {
      this.prodValue.fsalerIdName = item.fsalerIdName
      this.prodValue.fsalerId = item.fsalerId
      this.marketVisiblit = item.ismarketlDialog
    },
    // 获取结算币别数据(子传父)
    currencyData(item) {
      this.prodValue.fsettleCurrIdName = item.fsettleCurrIdName
      this.prodValue.fsettleCurrId = item.fsettleCurrId
      this.currencyVisiblit = item.isCurrencyDialog
      // 获取汇率
      this.querySalerRate()
    },
    // 收款条件列表
    gatheringData(item) {
      this.prodValue.frecConditionIdName = item.frecConditionIdName
      this.prodValue.frecConditionId = item.frecConditionId
      this.gatheringVisiblit = false
    },
    // 价目表
    priceListData(item) {
      this.prodValue.fpriceListIdName = item.fpriceListIdName
      this.prodValue.fpriceListId = item.fpriceListId
      this.priceListVisiblit = false
    },
    // 品质标准
    async queryFpaezCombo() {
      const { data: RES } = await queryFpaezCombo()
      this.standard = RES
    },
    // 查询销售订单本位币和汇率类型
    async querySalOrderFxxchange() {
      const DATA = { frateTypeId: this.frateTypeId, fcurrencyId: this.fcurrencyId }
      const { data: RES } = await querySalOrderFxxchange(DATA)
      this.prodValue.flocalCurrId = RES.flocalCurrId
      this.prodValue.fxxchangeTypeId = RES.fxxchangeTypeId
      this.prodValue.flocalCurr = RES.flocalCurr
      this.prodValue.fxxchangeType = RES.fxxchangeType
      this.querySalerRate()
    },
    // 查询销售订单汇率
    async querySalerRate() {
      const DATA = {
        fxxchangeTypeId: this.prodValue.fxxchangeTypeId,
        fsettleCurrId: this.prodValue.fsettleCurrId,
        flocalCurrId: this.prodValue.flocalCurrId
      }
      const { data: RES } = await querySalerRate(DATA)
      if (RES) {
        this.prodValue.fexchangeRate = RES.fexchangeRate
      } else {
        this.prodValue.fexchangeRate = ''
      }
    },
    // 明细信息、收款计划数据(子传父)
    prodOrder(ev) {
      this.prodValue.saleDetails = ev.saleDetails
      this.prodValue.planDetails = ev.planDetails
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
    }
  }
}

.el-input__icon {
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
    min-width: 65px;
    color: #606266;
    line-height: 40px;
  }

  .input-width {
    width: 200px;
    margin-right: 10px;
  }
}
</style>
