<template>
  <div class="content">
    <jc-title />
    <div>
      <el-button type="primary" style="width: 80px;margin-bottom: 10px" size="mini" @click="subMarker('E')">暂存</el-button>
      <el-button type="success" style="width: 80px;margin-bottom: 10px" size="mini" @click="subMarker('A')">下单</el-button>
    </div>
    <el-tabs type="border-card" @tab-click="handleOther">
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
            <el-input v-model.trim="prodValue.fpaezText" placeholder="请输入柜型" size="mini" />
          </el-form-item>
          <el-form-item label="客户订单号" prop="fpaezText1">
            <el-input v-model.trim="prodValue.fpaezText1" placeholder="请输入客户订单号" size="mini" />
          </el-form-item>
          <el-form-item label="客户PO NO" prop="fpaezText2">
            <el-input v-model.trim="prodValue.fpaezText2" placeholder="请输入客户PO NO" size="mini" />
          </el-form-item>
          <el-form-item label="品质标准" prop="fpaezCombo">
            <el-select v-model="prodValue.fpaezCombo" placeholder="请选择品质标准" size="mini" filterable>
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
          <el-form-item v-if="false" label="是否含税">
            <el-checkbox v-model="prodValue.fisIncludedTax" />
          </el-form-item>
          <el-form-item v-if="button('salOrder:type')" label="单据类型">
            <el-button class="btnType" type="primary" size="mini" @click="prodValue.saler = !prodValue.saler">切换</el-button>
            <el-tag v-if="prodValue.saler" type="success">正常订单</el-tag>
            <el-tag v-if="!prodValue.saler" type="danger">特批订单</el-tag>
          </el-form-item>
        </el-form>
        <tab :msg="saleDetails" :msg1="planDetails" :msg2="prodValue" :standard-price="standardPrice" @visible="handlechange" />
      </el-tab-pane>
      <el-tab-pane label="其他">
        <jc-marker
          other-height="calc(100vh - 425px)"
          :other-url-object="otherUrlObject"
          :other-log-table-data="otherLogTableData"
        >
          <div slot="slotPagination">
            <jc-pagination
              v-show="total > 0"
              :total="total"
              :page.sync="pageNum"
              :limit.sync="size"
              @pagination="handleOther"
            />
          </div>
        </jc-marker>
      </el-tab-pane>
      <el-tab-pane label="审批图片" class="disRow">
        <div class="positRe">
          <el-upload
            class="avatar-uploader"
            :action="actionURL"
            :show-file-list="false"
            :auto-upload="false"
            :on-change="modifyExamine"
          >
            <img
              v-if="prodValue.fapprovalImage"
              :src="prodValue.fapprovalImage"
              class="avatar"
            >
            <div v-if="prodValue.fapprovalImage" class="magnify">
              <i class="el-icon-search" @click.stop="proviewImg(prodValue.fapprovalImage)" />
              <i class="el-icon-delete" @click.stop="prodValue.fapprovalImage=''" />
            </div>
            <i v-else class="el-icon-plus avatar-uploader-icon"><span>点击上传</span></i>
          </el-upload>
        </div>
      </el-tab-pane>
    </el-tabs>
    <!--交货方式列表-->
    <deliver v-if="deliveVisiblit" @delive="deliveData" />
    <!--销售员列表-->
    <market v-if="marketVisiblit" @market="marketData" />
    <!--结算币别列表-->
    <currency v-if="currencyVisiblit" @currency="currencyData" />
    <!--收款条件列表-->
    <gathering v-if="gatheringVisiblit" @gathering="gatheringData" />
    <!--图纸预览-->
    <el-dialog
      title="预览"
      model
      :visible.sync="imgVisible"
      append-to-body
      top="10vh"
      width="60%"
    >
      <img :src="priview">
    </el-dialog>
  </div>
</template>
<script>
import {
  queryTBasBilltype,
  queryFpaezCombo,
  querySalerRate,
  queryTSalOrderNtry,
  updateSalOrder,
  queryOrgList,
  querySalOrderLog
} from '@/api/marketManage/marketOrder'
import jumpMateriel from '@/components/JumpMateriel'
import jcPagination from '@/components/Pagination'
import jcMarker from '@/components/marker'
import tab from '@/views/market/marketManage/marketRevising/components/tab'
import deliver from '@/views/market/marketManage/createMarkerOrder/components/deliver'
import market from '@/views/market/marketManage/createMarkerOrder/components/market'
import currency from '@/views/market/marketManage/createMarkerOrder/components/currency'
import gathering from '@/views/market/marketManage/createMarkerOrder/components/gathering'
import jcTitle from '@/components/Title'
import mixinsImg from '@/views/market/marketManage/createMarkerOrder/components/mixinsImg'

export default {
  name: 'CreateMarkerOrder',
  components: {
    tab,
    jcPagination,
    jcMarker,
    deliver,
    market,
    currency,
    gathering,
    jcTitle
  },
  mixins: [jumpMateriel, mixinsImg],
  inject: ['reload'],
  data() {
    return {
      priview: '', // 预览图片
      imgVisible: false, // 预览图片
      actionURL: '',
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
      fapprovalImage: '',
      saleDetails: [], // 明细数据
      planDetails: [], // 明细数据
      otherUrlObject: {}, // 其它审核人
      otherLogTableData: [], // 日志数据
      pageNum: 1,
      size: 10,
      total: 0,
      standardPrice: {
        fsettleCurrIdName: '',
        fsysmbol: '',
        fexchangeRate: '',
        flocalCurrId: '',
        fsettleCurrId: '',
        fxxchangeTypeId: '',
        cutMoney: ''
      }
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
      if (RES.fsalType === 0) {
        RES.saler = true
      } else {
        RES.saler = false
      }
      this.prodValue = RES
      this.saleDetails = RES.saleDetails
      this.planDetails = RES.planDetails
      this.standardPrice.fsysmbol = RES.fsysmbol
      this.standardPrice.fsettleCurrIdName = RES.fsettleCurr
      this.standardPrice.fexchangeRate = RES.fexchangeRate
      this.standardPrice.fxxchangeTypeId = RES.fxxchangeTypeId
      this.standardPrice.fsettleCurrId = RES.fsettleCurrId
      this.standardPrice.flocalCurrId = RES.flocalCurrId
      // 修改自动添加一条空数据
      this.saleDetails.push(
        {
          fmaterialId: '',
          fdescripTion: '',
          funitId: '',
          fqty: 1,
          fprice: '',
          fisFree: false,
          ftaxRate: '',
          fdownPrice: '',
          salImage: {
            imageUrl: '', // 图片
            imageUrl1: '', // 图片
            imageUrl2: '', // 图片
            imageUrl3: '', // 图片
            imageUrl4: '', // 图片
            imageUrl5: ''
          }
        }
      )
    },
    // 保存
    subMarker(ev) {
      // 订单类型
      if (this.prodValue.saler) {
        this.prodValue.fsalType = 0
      } else {
        this.prodValue.fsalType = 1
      }
      // 暂存、下单
      this.prodValue.fdocumentStatus = ev
      const DATA = this.prodValue
      this.prodValue.planDetails = this.planDetails
      this.prodValue.saleDetails = this.saleDetails
      // 表格不能为空
      for (const item of this.prodValue.saleDetails) {
        if (item.fmaterialId === '' || item.funitId === '' || item.fqty === '') {
          this.$message.error('表格不能为空或删除空行')
          return false
        }
        if (this.prodValue.fsalType === 0) {
          if (ev === 'A') {
            if (Number(item.ftaxPrice) < Number(item.ftaxDownPrice) && Number(item.ftaxDownPrice) !== 0) {
              this.$alert('物料： ' + item.fnumber + ' 销售单价小于基准价,请先点击暂存,找蒋总审批后,上传审批图片,再提交.', '提示', {
                confirmButtonText: '确定'
              })
              return false
            }
          }
        } else {
          if (!this.prodValue.fapprovalImage) {
            this.$message.error('请上传审批图片')
            return false
          }
          if (Number(item.fprice) < Number(item.deliveryPrice) && Number(item.deliveryPrice) !== 0) {
            this.$message.error('销售单价不能小于近成本价')
            return false
          }
        }
      }
      updateSalOrder(DATA).then(res => {
        if (res.code === 0) {
          this.$message({
            type: 'success',
            message: '操作成功'
          })
          setTimeout(() => {
            this.reload()
          }, 1000)
        } else {
          this.$message.error(res.message)
        }
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
    // 获取交货方式数据(子传父)
    deliveData(item) {
      if (item.fheadDeliveryWay) {
        this.prodValue.fheadDeliveryWayName = item.fdataValue
        this.prodValue.fheadDeliveryWay = item.fheadDeliveryWay
        this.deliveVisiblit = item.isdeliverlDialog
      } else {
        this.deliveVisiblit = item.isdeliverlDialog
      }
    },
    // 获取销售员数据(子传父)
    marketData(item) {
      if (item.fsalerId) {
        this.prodValue.fsaler = item.fsalerIdName
        this.prodValue.fsalerId = item.fsalerId
        this.marketVisiblit = item.ismarketlDialog
      } else {
        this.marketVisiblit = item.ismarketlDialog
      }
    },
    // 获取结算币别数据(子传父)
    currencyData(item) {
      if (item.fsettleCurrId) {
        this.prodValue.fsettleCurr = item.fsettleCurrIdName
        this.prodValue.fsettleCurrId = item.fsettleCurrId
        this.currencyVisiblit = item.isCurrencyDialog
        this.standardPrice.fsysmbol = item.fsysmbol
        this.standardPrice.fsettleCurrId = item.fsettleCurrId
        this.standardPrice.fsettleCurrIdName = item.fsettleCurrIdName
        this.standardPrice.cutMoney = '结算币别切换'
        // 获取汇率
        this.querySalerRate()
      } else {
        this.currencyVisiblit = item.isCurrencyDialog
      }
    },
    // 收款条件列表
    gatheringData(item) {
      if (item.fsettleCurrId) {
        this.prodValue.frecCondition = item.frecConditionIdName
        this.prodValue.frecConditionId = item.frecConditionId
        this.gatheringVisiblit = false
      } else {
        this.gatheringVisiblit = false
      }
    },
    // 品质标准
    async queryFpaezCombo() {
      const { data: RES } = await queryFpaezCombo()
      this.standard = RES
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
        this.prodValue.fexchangeRate = Number(RES.fexchangeRate)
        this.standardPrice.fexchangeRate = RES.fexchangeRate
      } else {
        this.prodValue.fexchangeRate = 0
      }
    },
    // 明细信息、收款计划数据
    handlechange(ev) {
      this.prodValue.saleDetails = ev.saleDetails
      this.prodValue.planDetails = ev.planDetails
    },
    // 获取其它
    async handleOther() {
      const id = this.$route.params.id
      const DATA = { pageNum: this.pageNum, pageSize: this.size, fid: id }
      const { data: RES } = await querySalOrderLog(DATA)
      this.otherUrlObject = RES.operator
      this.total = RES.total
      this.otherLogTableData = RES.array
    },
    // 预览图片
    proviewImg(img) {
      this.imgVisible = true
      this.priview = img
    }
  }
}
</script>
<style scoped lang="scss">
.content {
  @include listBom;
  .el-tabs {
    .disRow {
      height: calc(100vh - 300px);
      .positRe {
        position: relative;
        margin-left: 100px;
        margin-top: 20px;

        .avatar-uploader .el-upload {
          height: 300px;
          border: 1px dashed #d9d9d9;
          border-radius: 6px;
          cursor: pointer;
          position: relative;
          overflow: hidden;
        }

        .avatar-uploader .el-upload:hover {
          border-color: #409EFF;
        }

        .avatar-uploader-icon {
          font-size: 18px;
          color: #8c939d;
          width: 230px;
          height: 300px;
          line-height: 300px;
          text-align: center;
          border: 1px solid #aaa;
          border-radius: 6px;
          background: #eee;

          span {
            color: #409EFF;
          }
        }

        .avatar {
          width: 230px;
          height: 300px;
          display: block;
          border-radius: 6px;
        }

        .avatar-uploader {
          width: 230px;
          height: 100%;
          transition: all 1s;
        }

        .avatar-uploader:hover .magnify {
          display: block;
        }

        .magnify {
          display: none;
          height: 300px;
          width: 230px;
          background-color: rgba(0, 0, 0, .4);
          position: absolute;
          top: 0;
          line-height: 300px;
          border-radius: 6px;

          i {
            font-size: 24px;
            color: #fff;
            padding: 0 15px;
          }
        }
      }
    }
    .el-form {
      display: flex;
      flex-wrap: wrap;

      .el-form-item {
        width: 16.6%;
        min-width: 246px;
        margin-bottom: 0px;
        .btnType{
          margin-right: 20px;
        }
        .el-date-editor.el-input{
          width: 100% !important;
        }
        .el-select{
          width: 100%;
        }
      }
    }
  }
}

.el-input__icon {
  cursor: pointer;
}

</style>
