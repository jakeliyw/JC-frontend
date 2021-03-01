<template>
  <div class="Particules">
    <jc-title />
    <el-tabs type="border-card" @tab-click="handleOther">
      <el-tab-pane label="订单详情">
        <div class="header-card">
          <div class="organization">
            <jc-form :option-value="organizationValue" :options="organization" />
          </div>
        </div>
        <el-tabs>
          <el-tab-pane label="明细信息">
            <jc-table
              :table-data="saleDetails"
              :table-header="tableHeader"
              serial
              :cell-style="cellStyle"
              :table-height="tableHeight"
            >
              <el-table-column prop="fnumber" label="物料编码" min-width="150px" align="center" :show-overflow-tooltip="true">
                <template slot-scope="scope">
                  <el-input v-model="scope.row.fnumber" size="mini" disabled>
                    <i slot="prefix" class="iconfont icon-jin-rud-ao-bo" @click="sonJumpMateriel(scope.row.fnumber)" />
                  </el-input>
                </template>
              </el-table-column>
              <el-table-column prop="fdescripTion" label="物料描述" min-width="300px" align="center" :show-overflow-tooltip="true" />
              <el-table-column prop="funit" label="基本单位" min-width="80px" align="center" />
              <el-table-column prop="fqty" label="数量" align="center" />
              <el-table-column v-if="false" prop="fprice" label="单价" align="center" />
              <el-table-column label="销售单价" prop="ftaxPrice" align="center" min-width="100px" />
              <el-table-column :label="fdownName" prop="ftaxDownPrice" align="center" min-width="160px">
                <template slot="header">
                  {{ fdownName }}
                </template>
                <template slot-scope="scope">
                  {{ scope.row.ftaxDownPrice }}
                </template>
              </el-table-column>
              <el-table-column v-if="false" label="金额" prop="famount" align="center" min-width="100px" />
              <el-table-column label="销售金额" prop="ftaxAmount" align="center" min-width="100px" />
              <el-table-column prop="fsettleCurr" label="结算币别" align="center" />
              <el-table-column v-if="false" prop="fdownPrice" :label="fdownName" align="center" min-width="140" />
              <el-table-column prop="fisFree" label="是否赠品" align="center">
                <template slot-scope="scope">
                  <el-checkbox v-model="scope.row.fisFree" disabled />
                </template>
              </el-table-column>
              <el-table-column prop="ftaxRate" label="税率(%)" align="center" />
              <el-table-column prop="fdeliveryDate" label="图纸" min-width="230px" align="center">
                <template slot-scope="scope">
                  <img v-for="(item, index) in scope.row.salImage" :key="index" :src="item" style="max-height: 28px;padding: 0 3px" @click="proviewImg(item)">
                </template>
              </el-table-column>
            </jc-table>
          </el-tab-pane>
          <el-tab-pane label="收款计划">
            <jc-table
              :table-data="planDetails"
              :table-header="tableHeader1"
              :table-height="tableHeight"
              serial
              :cell-style="cellStyle"
            >
              <el-table-column label="是否预收" prop="fqty" align="center" width="80px">
                <template slot-scope="scope">
                  <el-checkbox v-model="scope.row.fneedRecAdvance" :value="scope.row.fneedRecAdvance" disabled />
                </template>
              </el-table-column>
              <el-table-column label="应收比例%" align="center">
                <template slot-scope="scope">
                  <el-input-number
                    v-model="scope.row.frecAdvanceRate"
                    :min="0"
                    :max="100"
                    size="mini"
                    disabled
                  />
                </template>
              </el-table-column>
              <el-table-column label="应收金额" align="center">
                <template slot-scope="scope">
                  <el-input-number
                    v-model="scope.row.frecAdvanCeamount"
                    :min="0"
                    size="mini"
                    disabled
                  />
                </template>
              </el-table-column>
            </jc-table>
          </el-tab-pane>
        </el-tabs>
      </el-tab-pane>
      <el-tab-pane label="其他">
        <jc-marker
          other-height="calc(100vh - 310px)"
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
            :on-change="examine"
            disabled
          >
            <img
              v-if="organizationValue.fapprovalImage"
              :src="organizationValue.fapprovalImage"
              class="avatar"
            >
            <div v-if="organizationValue.fapprovalImage" class="magnify">
              <i class="el-icon-search" @click.stop="proviewImg(organizationValue.fapprovalImage)" />
            </div>
            <i v-else class="el-icon-plus avatar-uploader-icon"><span>点击上传</span></i>
          </el-upload>
        </div>
      </el-tab-pane>
    </el-tabs>
    <el-dialog title="预览" model :visible.sync="imgVisible" append-to-body top="10vh">
      <img :src="priview" style="max-height: 600px;max-width: 100%">
    </el-dialog>
  </div>
</template>

<script>
import jcTable from '@/components/Table'
import jcForm from '@/components/Form'
import {
  queryTSalOrderNtry,
  querySalOrderLog
} from '@/api/marketManage/marketOrder'
import jcMarker from '@/components/marker'
import jcPagination from '@/components/Pagination'
import jumpMateriel from '@/components/JumpMateriel'
import jcTitle from '@/components/Title'
import mixinsImg from '@/views/market/marketManage/createMarkerOrder/components/mixinsImg'

export default {
  components: {
    jcTable,
    jcForm,
    jcMarker,
    jcPagination,
    jcTitle
  },
  mixins: [jumpMateriel, mixinsImg],
  data() {
    return {
      fdownName: '销售基准价',
      actionURL: '',
      priview: '',
      imgVisible: false,
      // 表头
      cellStyle: { padding: '1px 0' }, // 行高
      saleDetails: [], // 销售数据
      tableHeader: [],
      planDetails: [], // 收款计划
      tableHeader1: [],
      tableHeight: '500px',
      // 表单
      organizationValue: {}, // 表单组织值
      organization: {}, // 表单组织控件
      otherUrlObject: {}, // 其它审核人
      otherLogTableData: [], // 日志数据
      pageNum: 1,
      size: 10,
      total: 0
    }
  },
  created() {
    this.queryTSalOrderNtry()
    this.tableHeight = window.innerWidth > 1440 ? 'calc(100vh - 420px)' : '500px'
  },
  methods: {
    // 获取订单列表数据
    async queryTSalOrderNtry() {
      const id = this.$route.params.id
      const DATA = { fid: id }
      const { data: RES } = await queryTSalOrderNtry(DATA)
      this.saleDetails = RES.saleDetails
      this.planDetails = RES.planDetails
      if (RES.fcloseStatus === 'A') {
        RES.fcloseStatus = '正常'
      } else {
        RES.fcloseStatus = '已关闭'
      }
      if (RES.fsalType === '0') {
        RES.fsalType = '正常订单'
      } else {
        RES.fsalType = '特批订单'
      }
      this.organizationValue = RES
      this.fdownName = this.fdownName + '(' + RES.fsettleCurr + ')'
      this.organization = {
        fcreateDate: {
          label: '订单时间',
          disabled: 'disabled'
        }, fbillType: {
          label: '单据类型',
          disabled: 'disabled'
        }, fsaleOrg: {
          label: '销售组织',
          disabled: 'disabled'
        }, fbillNo: {
          label: '单据编号',
          disabled: 'disabled'
        }, customer: {
          label: '客户',
          disabled: 'disabled'
        }, fdeliveryDate: {
          label: '要货时间',
          disabled: 'disabled'
        }, fsaleDept: {
          label: '销售部门',
          disabled: 'disabled'
        }, fsaler: {
          label: '销售员',
          disabled: 'disabled'
        }, frecCondition: {
          label: '收款条件',
          disabled: 'disabled'
        }, fsettleCurr: {
          label: '结算货币',
          disabled: 'disabled'
        }, fexchangeType: {
          label: '汇率类型',
          disabled: 'disabled'
        }, flocalCurr: {
          label: '本位币',
          disabled: 'disabled'
        }, fexchangeRate: {
          label: '汇率',
          disabled: 'disabled'
        }, fpriceList: {
          label: '价目表',
          disabled: 'disabled'
        }, fpaezText: {
          label: '柜型',
          disabled: 'disabled'
        }, fpaezText1: {
          label: '客户订单号',
          disabled: 'disabled'
        }, fpaezText2: {
          label: '客户PO NO',
          disabled: 'disabled'
        }, fpaezCombo: {
          label: '品质标准',
          disabled: 'disabled'
        }, fcloseStatus: {
          label: '关闭状态',
          disabled: 'disabled'
        }, fnote: {
          label: '备注',
          type: 'textarea',
          disabled: 'disabled'
        }, fsalType: {
          label: '订单类型',
          disabled: 'disabled'
        }
        // fisIncludedTax: {
        //   label: '是否含税',
        //   type: 'checkbox',
        //   disabled: 'disabled'
        // },
      }
    },
    // 预览图片
    proviewImg(img) {
      this.imgVisible = true
      this.priview = img
    },
    // 获取其它
    async handleOther() {
      const id = this.$route.params.id
      const DATA = { pageNum: this.pageNum, pageSize: this.size, fid: id }
      const { data: RES } = await querySalOrderLog(DATA)
      this.otherUrlObject = RES.operator
      this.total = RES.total
      this.otherLogTableData = RES.array
    }
  }
}
</script>
<style lang="scss">
.Particules{
  .el-form{
    .el-form-item{
      height: 35px;
      margin-bottom: 0px;
    }
    .el-form-item__label{
      width: 100px!important;
    }
    .el-form-item__content{
      margin-left: 100px!important;
    }
    .el-input__inner{
      width: 143px;
    }
  }
  .el-col-6{
    width: 243px;
  }
}
</style>
<style lang="scss">
.el-dialog__body {
  overflow: auto;
  img{
    max-width: 1000px;
    position: relative;
    left: 50%;
    transform: translateX(-50%);
  }
}
</style>
<style lang="scss" scoped>
.Particules {
  @include listBom;
  .el-tabs {
    &::v-deep .el-tabs__content {
      padding: 5px 10px;
    }
      .el-tabs ::v-deep .el-tabs__header{
        margin: 0 0 5px;
    }

    .disRow {
      height: calc(100vh - 225px);
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
        height: 35px;
        width: 16.6%;
        min-width: 246px;
        margin-bottom: 0px;
        .btnType{
          margin-right: 20px;
        }
        //&::v-deep .el-input--mini .el-input__inner{
        //  height: 22px;
        //}
        .el-date-editor.el-input{
          width: 100% !important;
        }
        .el-select{
          width: 100%;
        }
      }
    }
  }
  .inTheBtn {
    transform: translateY(-15px);
  }

  .tag-mar {
    margin-right: 3px;
    margin-bottom: 3px;
  }

  .tag-mar:hover {
    cursor: pointer;
  }

  .el-tag + .el-tag {
    margin-left: 10px;
  }

  .button-new-tag {
    margin-left: 10px;
    height: 32px;
    line-height: 30px;
    padding-top: 0;
    padding-bottom: 0;
  }

  .input-new-tag {
    width: 90px;
    margin-left: 10px;
    vertical-align: bottom;
  }
}
</style>
