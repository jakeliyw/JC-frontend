<template>
  <div class="tab">
    <el-tabs v-model="activeName">
      <el-tab-pane class="tabsOne" label="明细信息" name="first">
        <jc-table
          :table-data="tabTwo.saleDetails"
          :table-header="tableHeader"
          serial
          table-height="44vh"
          :cell-style="cellStyle"
        >
          <el-table-column label="物料编码" prop="fmaterialId" align="center" width="200px">
            <template slot-scope="scope">
              <el-input v-model.trim="scope.row.fmaterialIdName" placeholder="请选择物料编码" size="mini">
                <i
                  slot="prefix"
                  class="iconfont icon-jin-rud-ao-bo"
                  @click="sonJumpMateriel(scope.row.fmaterialIdName)"
                />
                <i
                  slot="suffix"
                  class="el-input__icon el-icon-search"
                  @click="handleGetMateriel(scope.row, scope.$index)"
                />
              </el-input>
            </template>
          </el-table-column>
          <el-table-column
            label="物料描述"
            prop="fdescripTion"
            align="center"
            min-width="300px"
            :show-overflow-tooltip="true"
          />
          <el-table-column label="物料型号" prop="fmodel" align="center" min-width="100px" />
          <el-table-column label="单位" prop="funitName" align="center" />
          <el-table-column label="数量" prop="fqty" min-width="100px" align="center">
            <template slot-scope="scope">
              <el-input-number
                v-model="scope.row.fqty"
                :min="1"
                size="mini"
                @change="handleChange(scope.$index)"
              />
            </template>
          </el-table-column>
          <el-table-column label="单价" prop="fprice" align="center" min-width="100px">
            <template slot-scope="scope">
              <el-input-number
                v-model="scope.row.fprice"
                :min="0"
                size="mini"
                @change="handleChange4(scope.$index)"
              />
            </template>
          </el-table-column>
          <el-table-column label="含税单价" prop="ftaxPrice" align="center" min-width="100px" />
          <el-table-column label="金额" prop="famount" align="center" min-width="100px" />
          <el-table-column label="含税金额" prop="ftaxAmount" align="center" min-width="100px" />
          <el-table-column label="结算币别" prop="fsettleCurrId" align="center" min-width="100px">
            <template>
              {{ standardprice.fsettleCurrIdName }}
            </template>
          </el-table-column>
          <el-table-column :label="fdownName" prop="fdownPrice" align="center" min-width="160px" />
          <el-table-column label="是否赠品" prop="fisFree" align="center">
            <template slot-scope="scope">
              <el-checkbox
                v-model="scope.row.fisFree"
                :value="scope.row.fisFree"
                @change="handleCheckedCitiesChange(scope.row.fisFree, scope.$index)"
              />
            </template>
          </el-table-column>
          <el-table-column label="税率(%)" prop="fentryTaxRate" min-width="100px" align="center">
            <template slot-scope="scope">
              <el-input-number
                v-model="scope.row.ftaxRate"
                :min="0"
                size="mini"
                :disabled="scope.row.fisFree"
                @change="handleChange1(scope.$index)"
              />
            </template>
          </el-table-column>
          <el-table-column label="图纸" prop="fpaezCombo" min-width="300px" align="center">
            <template slot-scope="scope">
              <img
                v-for="(item, index) in scope.row.salImage"
                :key="index"
                :src="item"
                style="max-height: 28px"
                @click="proviewImg(item)"
              >
              <el-button type="primary" size="mini" @click="drawingl(scope)">上传</el-button>
            </template>
          </el-table-column>
          <el-table-column label="操作" prop="fqty" min-width="80px" align="center" fixed="right">
            <template slot-scope="scope">
              <el-button type="danger" size="mini" @click="delectSale(scope.$index)">删除</el-button>
            </template>
          </el-table-column>
        </jc-table>
      </el-tab-pane>
      <el-tab-pane label="收款计划" name="second">
        <jc-table
          :table-data="tabTwo.planDetails"
          :table-header="tableHeader"
          serial
          table-height="44vh"
          :cell-style="cellStyle"
        >
          <el-table-column label="是否预收" prop="fqty" align="center" width="80px">
            <template slot-scope="scope">
              <el-checkbox v-model="scope.row.fneedRecAdvance" :value="scope.row.fneedRecAdvance" @change="check" />
            </template>
          </el-table-column>
          <el-table-column label="应收比例%" align="center">
            <template slot-scope="scope">
              <el-input-number
                v-model="scope.row.frecAdvanceRate"
                :min="0"
                :max="100"
                size="mini"
                @change="handleChange2"
              />
            </template>
          </el-table-column>
          <el-table-column label="应收金额" align="center">
            <template slot-scope="scope">
              <el-input-number
                v-model="scope.row.frecAdvanCeamount"
                :min="0"
                size="mini"
                @change="handleChange3"
              />
            </template>
          </el-table-column>
        </jc-table>
      </el-tab-pane>
    </el-tabs>
    <!--    物料弹窗-->
    <material v-if="isMateria" :msg="material" :msg1="fid" @material="materialData" />
    <!--上传图纸-->
    <upload-img v-if="isUploadImg" :msg="salImg" @upload="drawing" />
    <!--图纸预览-->
    <el-dialog
      title="预览"
      model
      :visible.sync="imgVisible"
      append-to-body
      top="10vh"
      width="70%"
    >
      <img :src="priview">
    </el-dialog>
  </div>
</template>

<script>
import jcTable from '@/components/Table'
import jumpMateriel from '@/components/JumpMateriel'
import material from '@/views/market/marketManage/createMarkerOrder/components/material'
import uploadImg from '@/views/market/marketManage/createMarkerOrder/components/uploadImg'
import { querySalDownPrice } from '@/api/marketManage/marketOrder'

export default {
  components: {
    jcTable,
    material,
    uploadImg
  },
  mixins: [jumpMateriel],
  props: {
    msg: { // 价目表ID
      type: Number,
      default: 2
    },
    msg2: { // 汇率
      type: [Number, String],
      default: 0 || '0'
    },
    standardprice: {
      type: Object,
      default: function() {
        return {}
      }
    }
  },
  data() {
    return {
      fdownName: '销售基准价',
      fsysmbol: this.standardprice.fsysmbol,
      imgVisible: false, // 预览图片src
      priview: '', // 预览图片
      salImg: {},
      fid: '', // 客户ID
      material: '', // 父传子
      isMateria: false, // 物料弹窗
      indexSelf: 0, // 图片下标
      isUploadImg: false, // 图纸弹窗
      activeName: 'first', // 标签tabs名
      tableHeader: [],
      cellStyle: { padding: '10 10' },
      tabTwo: {
        saleDetails: [ // 明细信息
          {
            fmaterialId: '',
            fdescripTion: '',
            funitId: '',
            fqty: 1,
            fisFree: false,
            ftaxRate: '',
            fdeliveryDate: '',
            fmaterialIdName: '',
            funitName: '',
            fprice: '',
            ftaxPrice: '',
            famount: '',
            ftaxAmount: '',
            salImage: {
              imageUrl: '', // 图片
              imageUrl1: '', // 图片
              imageUrl2: '', // 图片
              imageUrl3: '', // 图片
              imageUrl4: '', // 图片
              imageUrl5: '' // 图片
            }
          }
        ],
        // 收款计划
        planDetails: [{ fneedRecAdvance: false, frecAdvanceRate: '0', frecAdvanCeamount: '0' }],
        shuliang: 0.6 // 数量
      }
    }
  },
  watch: {
    msg() {
      this.fid = this.msg
    },
    msg2() {
      this.rate = this.msg2
    },
    standardprice: {
      handler() {
        if (this.tabTwo.saleDetails[0].fmaterialId) {
          this.querySalDownPrice()
        }
      },
      deep: true
    }
  },
  methods: {
    // 打开物料弹窗
    handleGetMateriel(row, index) {
      if (!this.fid) {
        this.$message.error('请先选择客户')
        return false
      }
      if (!this.rate) {
        this.$message.error('请先选择销售组织和结算币别，获取汇率。')
        return false
      }
      this.isMateria = true
      this.material = index
      // 新增一行
      if (index === this.tabTwo.saleDetails.length - 1) {
        this.tabTwo.saleDetails.push(
          {
            fmaterialId: '',
            fdescripTion: '',
            funitId: '',
            fqty: 1,
            fprice: '',
            fisFree: false,
            ftaxRate: '',
            fdeliveryDate: '',
            salImage: {
              imageUrl: '', // 图片
              imageUrl1: '', // 图片
              imageUrl2: '', // 图片
              imageUrl3: '', // 图片
              imageUrl4: '', // 图片
              imageUrl5: '' // 图片
            }
          }
        )
      }
    },
    // 物料数据
    materialData(item) {
      if (item.fmaterialId) {
        this.tabTwo.saleDetails[this.material].fmaterialId = item.fmaterialId
        this.tabTwo.saleDetails[this.material].fmaterialIdName = item.fnumber
        this.tabTwo.saleDetails[this.material].fdescripTion = item.fdescripTion
        this.tabTwo.saleDetails[this.material].funitId = item.funitId
        this.tabTwo.saleDetails[this.material].funitName = item.funitName
        this.tabTwo.saleDetails[this.material].fmodel = item.fmodel
        this.tabTwo.saleDetails[this.material].deliveryPrice = item.deliveryPrice
        this.tabTwo.saleDetails[this.material].fid = item.fid
        this.isMateria = item.isMaterialDialog
        this.querySalDownPrice()
      } else {
        this.isMateria = item.isMaterialDialog
      }
    },
    // 监听是否勾选赠品
    handleCheckedCitiesChange(val, index) {
      this.rateIndex = index
      if (val) {
        this.tabTwo.saleDetails[this.rateIndex].ftaxRate = ''
      }
      this.$emit('visible', this.tabTwo)
    },
    // 删除明细空行
    delectSale(index) {
      if (index === 0) {
        this.$message.error('不能删除首行数据')
        return false
      }
      this.tabTwo.saleDetails.splice(index, 1)
      this.$emit('visible', this.tabTwo)
    },
    // 监听销售数量
    handleChange(index) {
      this.material = index
      const fqty = this.tabTwo.saleDetails[index].fqty
      const fprice = this.tabTwo.saleDetails[index].fprice
      const ftaxRate = this.tabTwo.saleDetails[index].ftaxRate
      this.tabTwo.saleDetails[index].famount = (fprice * fqty).toFixed(4)
      this.tabTwo.saleDetails[index].ftaxAmount = (fqty * fprice * (1 + ftaxRate / 100)).toFixed(4)
      this.$emit('visible', this.tabTwo)
      this.fqtyPrice()
    },
    handleChange4(index) {
      this.material = index
      const fqty = this.tabTwo.saleDetails[index].fqty
      const fprice = this.tabTwo.saleDetails[index].fprice
      const ftaxRate = this.tabTwo.saleDetails[index].ftaxRate
      this.tabTwo.saleDetails[index].famount = (fprice * fqty).toFixed(4)
      this.tabTwo.saleDetails[index].ftaxAmount = (fqty * fprice * (1 + ftaxRate / 100)).toFixed(4)
      this.tabTwo.saleDetails[index].ftaxPrice = (fprice * (1 + ftaxRate / 100)).toFixed(4)
      this.$emit('visible', this.tabTwo)
    },
    // 监听税率
    handleChange1(index) {
      this.material = index
      const fqty = this.tabTwo.saleDetails[index].fqty
      const fprice = this.tabTwo.saleDetails[index].fprice
      const ftaxRate = this.tabTwo.saleDetails[index].ftaxRate
      this.tabTwo.saleDetails[index].ftaxAmount = (fqty * fprice * (1 + ftaxRate / 100)).toFixed(4)
      this.tabTwo.saleDetails[index].ftaxPrice = (fprice * (1 + ftaxRate / 100)).toFixed(4)
      this.$emit('visible', this.tabTwo)
    }, // 监听应收比例
    handleChange2(value) {
      this.$emit('visible', this.tabTwo)
    }, // 监听应收金额
    handleChange3(value) {
      this.$emit('visible', this.tabTwo)
    }, // 监听是否预收
    check(value) {
      this.$emit('visible', this.tabTwo)
    }, // 打开上传图片弹窗
    drawingl(scope) {
      this.salImg = scope.row.salImage
      this.indexSelf = scope.$index
      this.isUploadImg = true
    },
    // 预览图片
    proviewImg(img) {
      this.imgVisible = true
      this.priview = img
    },
    // 获取图片
    drawing(ev) {
      this.isUploadImg = false
      this.tabTwo.saleDetails[this.indexSelf].salImage = ev
      this.$emit('visible', this.tabTwo)
    },
    // 获取对应的销售基准价
    async querySalDownPrice() {
      const DATA = {
        fxxchangeTypeId: this.standardprice.fxxchangeTypeId,
        fsettleCurrId: this.standardprice.fsettleCurrId,
        flocalCurrId: this.standardprice.flocalCurrId,
        fid: this.tabTwo.saleDetails[this.material].fid,
        fmaterialId: this.tabTwo.saleDetails[this.material].fmaterialId
      }
      const { data: RES } = await querySalDownPrice(DATA)
      this.tabTwo.saleDetails[this.material].fdownPrice = RES.fdownPrice
      this.tabTwo.saleDetails[this.material].fdownPrices = RES.fdownPrice
      this.fdownName = '销售基准价' + '(' + this.standardprice.fsettleCurrIdName + ')'
      this.fqtyPrice()
    },
    fqtyPrice() {
      const fqty = this.tabTwo.saleDetails[this.material].fqty
      this.shuliang = 0.6
      if (fqty <= 100) {
        this.shuliang = 0.6
      } else if (fqty > 100 && fqty <= 500) {
        this.shuliang = 0.65
      } else if (fqty > 500) {
        this.shuliang = 0.7
      }
      const fdownPrice = this.tabTwo.saleDetails[this.material].fdownPrices
      this.tabTwo.saleDetails[this.material].fdownPrice = (fdownPrice / this.shuliang).toFixed(4)
    }
  }
}
</script>
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
<style scoped lang="scss">
.tab {
  // 图纸单元格居中
  .el-table ::v-deep td{
    &:nth-last-child(2) .cell {
      display: flex;
      justify-content: center;
      align-items: center;
      img {
        padding: 0 5px;
      }
    }
  }
  .tabsOne{
    .el-table{
      &::v-deep .el-input-number .el-input__inner{
        position: relative;
        left: -25px;
        padding: 0;
        width: 80px;
      }
    }
  }
   .el-table{
     &::v-deep .el-input-number .el-input__inner{
       padding: 0;
       width: 140px;
     }
     &::v-deep .el-input-number__increase{
       display: none;
     }
     &::v-deep .el-input-number__decrease{
       display: none;
     }
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
}
</style>
