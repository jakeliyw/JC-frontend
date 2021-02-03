<template>
  <div class="tab">
    <el-tabs v-model="activeName">
      <!--明细表格-->
      <el-tab-pane label="明细信息" class="tabOne" name="first">
        <jc-table
          :table-data="tabTwo.saleDetails"
          :table-header="tableHeader"
          serial
          table-height="44vh"
          :cell-style="cellStyle"
        >
          <el-table-column label="物料编码" prop="fmaterialId" align="center" width="200px">
            <template slot-scope="scope">
              <el-input v-model.trim="scope.row.fnumber" placeholder="请选择物料编码" size="mini">
                <i slot="prefix" class="iconfont icon-jin-rud-ao-bo" @click="sonJumpMateriel(scope.row.fnumber)" />
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
          <el-table-column label="型号" prop="fmodel" align="center" min-width="100px" />
          <el-table-column label="单位" prop="funit" align="center" />
          <el-table-column label="数量" prop="fqty" min-width="100px" align="center">
            <template slot-scope="scope">
              <el-input-number
                v-model="scope.row.fqty"
                :min="0"
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
              {{ standardPrice.fsettleCurrIdName }}
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
      <!--收款计划表格-->
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
    <!--    上传图纸-->
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
    uploadImg,
    material
  },
  mixins: [jumpMateriel],
  props: {
    msg: { // 明细信息
      type: Array,
      required: true
    },
    msg1: { // 收款计划
      type: Array,
      required: true
    },
    msg2: { // 表单数据
      type: Object,
      required: true
    },
    standardPrice: {
      type: Object,
      default: function() {
        return {}
      }
    }
  },
  data() {
    return {
      fdownName: '销售基准价',
      fid: '', // 价目ID
      isMateria: false, // 物料弹窗组件
      isUploadImg: false, // 上传图片组件
      salImg: {},
      indexSelf: 0, // 图片下标
      imgVisible: false, // 预览图片
      priview: '',
      isdrawinglDialog: false, // 图纸弹窗
      activeName: 'first',
      tableHeader: [],
      isMaterielDialog: false,
      cellStyle: { padding: '10 10' },
      // 点击行的序号
      material: 0,
      rateIndex: '', // 行序号(第几行)
      tabTwo: {
        // 明细信息
        saleDetails: [{
          salImage: {
            imageUrl: '', // 图片
            imageUrl1: '', // 图片
            imageUrl2: '', // 图片
            imageUrl3: '', // 图片
            imageUrl4: '', // 图片
            imageUrl5: ''
          }
        }],
        // 收款计划
        planDetails: []
      },
      shuliang: 0.6
    }
  },
  watch: {
    msg() {
      this.tabTwo.saleDetails = this.msg
      this.tabTwo.planDetails = this.msg1
      this.fid = this.msg2.fpriceListId
    },
    standardPrice: {
      handler() {
        this.querySalDownPrice()
      },
      deep: true
    }
  },
  methods: {
    // 物料弹窗选中
    materialData(item) {
      if (item.fmaterialId) {
        console.log(this.material)
        this.tabTwo.saleDetails[this.material].fmaterialId = item.fmaterialId
        this.tabTwo.saleDetails[this.material].fnumber = item.fnumber
        this.tabTwo.saleDetails[this.material].fdescripTion = item.fdescripTion
        this.tabTwo.saleDetails[this.material].funitId = item.funitId
        this.tabTwo.saleDetails[this.material].funit = item.funitName
        this.tabTwo.saleDetails[this.material].fmodel = item.fmodel
        this.tabTwo.saleDetails[this.material].deliveryPrice = item.deliveryPrice
        this.tabTwo.saleDetails[this.material].fid = item.fid
        this.isMateria = false
        this.querySalDownPrice()
      } else {
        this.isMateria = false
      }
    },
    // 打开物料编码
    async handleGetMateriel(row, index) {
      if (!this.fid) {
        this.$message.error('请先选择客户')
        return false
      }
      this.isMateria = true
      this.material = index
      console.log(index)
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
    }, // 监听单价
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
    },
    // 获取当前行下标
    drawingl(scope) {
      this.salImg = scope.row.salImage
      this.indexSelf = scope.$index
      this.isUploadImg = true
    },
    // 获取图片
    drawing(ev) {
      this.isUploadImg = false
      this.tabTwo.saleDetails[this.indexSelf].salImage = ev
      this.$emit('visible', this.tabTwo)
    },
    // 预览图片
    proviewImg(img) {
      this.imgVisible = true
      this.priview = img
    },
    // 获取对应的销售基准价
    async querySalDownPrice() {
      const DATA = {
        fxxchangeTypeId: this.standardPrice.fxxchangeTypeId,
        fsettleCurrId: this.standardPrice.fsettleCurrId,
        flocalCurrId: this.standardPrice.flocalCurrId,
        fid: this.tabTwo.saleDetails[this.material].fid,
        fmaterialId: this.tabTwo.saleDetails[this.material].fmaterialId
      }
      const { data: RES } = await querySalDownPrice(DATA)
      this.tabTwo.saleDetails[this.material].fdownPrice = RES.fdownPrice
      this.tabTwo.saleDetails[this.material].fdownPrices = RES.fdownPrice
      this.fdownName = '销售基准价' + '(' + this.standardPrice.fsettleCurrIdName + ')'
      this.fqtyPrice()
    },
    fqtyPrice() {
      const fqty = this.tabTwo.saleDetails[this.material].fqty
      this.shuliang = 0.6
      if (fqty <= 500) {
        this.shuliang = 0.6
      } else if (fqty > 500 && fqty <= 1000) {
        this.shuliang = 0.65
      } else if (fqty > 1000) {
        this.shuliang = 0.7
      }
      const fdownPrice = this.tabTwo.saleDetails[this.material].fdownPrices
      if (!fdownPrice) {
        this.tabTwo.saleDetails[this.material].fdownPrices = this.tabTwo.saleDetails[this.material].fdownPrice
        this.fdownName = '销售基准价' + '(' + this.standardPrice.fsettleCurrIdName + ')'
        return
      }
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
.el-table {
  &::v-deep .el-input-number .el-input__inner {
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
.tab {
  .tabOne{
    .el-table{
      &::v-deep .el-input-number .el-input__inner{
        padding: 0;
        width: 80px;
        position: relative;
        left: -25px;
      }

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
  .el-form {
    display: flex;
    flex-wrap: wrap;
  }
  .avatar-uploader .el-upload {
    height: 78px;
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
    font-size: 28px;
    color: #8c939d;
    width: 78px;
    height: 78px;
    line-height: 78px;
    text-align: center;
    border: 1px dashed #aaa;
    border-radius: 6px;
  }

  .avatar {
    width: 78px;
    height: 78px;
    display: block;
    border-radius: 6px;
  }

  .avatar-uploader {
    transition: all 1s;
  }

  .avatar-uploader:hover .magnify {
    display: block;
  }

  .magnify {
    display: none;
    height: 78px;
    background-color: rgba(0, 0, 0, .4);
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    line-height: 78px;
    border-radius: 6px;

    i {
      font-size: 18px;
      color: #fff;
      padding: 0 5px;
    }
  }
}
</style>
