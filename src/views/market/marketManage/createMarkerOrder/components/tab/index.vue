<template>
  <div class="tab">
    <el-tabs v-model="activeName">
      <el-tab-pane label="明细信息" name="first">
        <jc-table
          :table-data="tabTwo.saleDetails"
          :table-header="tableHeader"
          serial
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
            min-width="200px"
            :show-overflow-tooltip="true"
          />
          <el-table-column label="物料型号" prop="fmodel" align="center" min-width="100px" />
          <el-table-column label="销售单位" prop="funitName" align="center" />
          <el-table-column label="销售数量" prop="fqty" min-width="140px" align="center">
            <template slot-scope="scope">
              <el-input-number
                v-model="scope.row.fqty"
                :min="1"
                size="mini"
                @change="handleChange"
              />
            </template>
          </el-table-column>
          <el-table-column label="销售单价" prop="fprice" align="center" />
          <el-table-column label="是否赠品" prop="fisFree" align="center">
            <template slot-scope="scope">
              <el-checkbox
                v-model="scope.row.fisFree"
                :value="scope.row.fisFree"
                @change="handleCheckedCitiesChange(scope.row.fisFree, scope.$index)"
              />
            </template>
          </el-table-column>
          <el-table-column label="税率(%)" prop="fentryTaxRate" min-width="140px" align="center">
            <template slot-scope="scope">
              <el-input-number
                v-model="scope.row.ftaxRate"
                :min="0"
                size="mini"
                :disabled="scope.row.fisFree"
                @change="handleChange1"
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
              <el-button type="primary" size="mini" @click="drawingl(scope.$index)">上传</el-button>
            </template>
          </el-table-column>
          <el-table-column label="操作" prop="fqty" min-width="100px" align="center">
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
    <el-dialog
      title="上传图纸"
      model
      :visible.sync="isdrawinglDialog"
      :close-on-click-modal="false"
      width="60%"
      :before-close="handleClose"
    >
      <el-form label-width="120px">
        <el-form-item label="图纸">
          <el-upload
            class="avatar-uploader"
            :action="actionURL"
            :show-file-list="false"
            :auto-upload="false"
            :on-change="handleAvatarSuccess"
          >
            <img
              v-if="tabTwo.saleDetails[indexSelf].salImage.imageUrl"
              :src="tabTwo.saleDetails[indexSelf].salImage.imageUrl"
              class="avatar"
            >
            <div v-if="tabTwo.saleDetails[indexSelf].salImage.imageUrl" class="magnify">
              <i class="el-icon-search" @click.stop="proviewImg(tabTwo.saleDetails[indexSelf].salImage.imageUrl)" />
              <i class="el-icon-delete" @click.stop="tabTwo.saleDetails[indexSelf].salImage.imageUrl=''" />
            </div>
            <i v-else class="el-icon-plus avatar-uploader-icon" />
          </el-upload>
        </el-form-item>
        <el-form-item label="图纸1">
          <el-upload
            class="avatar-uploader"
            :action="actionURL"
            :show-file-list="false"
            :auto-upload="false"
            :on-change="handleAvatarSuccess1"
          >
            <img
              v-if="tabTwo.saleDetails[indexSelf].salImage.imageUrl1"
              :src="tabTwo.saleDetails[indexSelf].salImage.imageUrl1"
              class="avatar"
            >
            <div v-if="tabTwo.saleDetails[indexSelf].salImage.imageUrl1" class="magnify">
              <i class="el-icon-search" @click.stop="proviewImg(tabTwo.saleDetails[indexSelf].salImage.imageUrl1)" />
              <i class="el-icon-delete" @click.stop="tabTwo.saleDetails[indexSelf].salImage.imageUrl1=''" />
            </div>
            <i v-else class="el-icon-plus avatar-uploader-icon" />
          </el-upload>
        </el-form-item>
        <el-form-item label="图纸2">
          <el-upload
            class="avatar-uploader"
            :action="actionURL"
            :show-file-list="false"
            :auto-upload="false"
            :on-change="handleAvatarSuccess2"
          >
            <img
              v-if="tabTwo.saleDetails[indexSelf].salImage.imageUrl2"
              :src="tabTwo.saleDetails[indexSelf].salImage.imageUrl2"
              class="avatar"
            >
            <div v-if="tabTwo.saleDetails[indexSelf].salImage.imageUrl2" class="magnify">
              <i class="el-icon-search" @click.stop="proviewImg(tabTwo.saleDetails[indexSelf].salImage.imageUrl2)" />
              <i class="el-icon-delete" @click.stop="tabTwo.saleDetails[indexSelf].salImage.imageUrl2=''" />
            </div>
            <i v-else class="el-icon-plus avatar-uploader-icon" />
          </el-upload>
        </el-form-item>
        <el-form-item label="图纸3">
          <el-upload
            class="avatar-uploader"
            :action="actionURL"
            :show-file-list="false"
            :auto-upload="false"
            :on-change="handleAvatarSuccess3"
          >
            <img
              v-if="tabTwo.saleDetails[indexSelf].salImage.imageUrl3"
              :src="tabTwo.saleDetails[indexSelf].salImage.imageUrl3"
              class="avatar"
            >
            <div v-if="tabTwo.saleDetails[indexSelf].salImage.imageUrl3" class="magnify">
              <i class="el-icon-search" @click.stop="proviewImg(tabTwo.saleDetails[indexSelf].salImage.imageUrl3)" />
              <i class="el-icon-delete" @click.stop="tabTwo.saleDetails[indexSelf].salImage.imageUrl3=''" />
            </div>
            <i v-else class="el-icon-plus avatar-uploader-icon" />
          </el-upload>
        </el-form-item>
        <el-form-item label="图纸4">
          <el-upload
            class="avatar-uploader"
            :action="actionURL"
            :show-file-list="false"
            :auto-upload="false"
            :on-change="handleAvatarSuccess4"
          >
            <img
              v-if="tabTwo.saleDetails[indexSelf].salImage.imageUrl4"
              :src="tabTwo.saleDetails[indexSelf].salImage.imageUrl4"
              class="avatar"
            >
            <div v-if="tabTwo.saleDetails[indexSelf].salImage.imageUrl4" class="magnify">
              <i class="el-icon-search" @click.stop="proviewImg(tabTwo.saleDetails[indexSelf].salImage.imageUrl4)" />
              <i class="el-icon-delete" @click.stop="tabTwo.saleDetails[indexSelf].salImage.imageUrl4=''" />
            </div>
            <i v-else class="el-icon-plus avatar-uploader-icon" />
          </el-upload>
        </el-form-item>
        <el-form-item label="图纸5">
          <el-upload
            class="avatar-uploader"
            :action="actionURL"
            :show-file-list="false"
            :auto-upload="false"
            :on-change="handleAvatarSuccess5"
          >
            <img
              v-if="tabTwo.saleDetails[indexSelf].salImage.imageUrl5"
              :src="tabTwo.saleDetails[indexSelf].salImage.imageUrl5"
              class="avatar"
            >
            <div v-if="tabTwo.saleDetails[indexSelf].salImage.imageUrl5" class="magnify">
              <i class="el-icon-search" @click.stop="proviewImg(tabTwo.saleDetails[indexSelf].salImage.imageUrl5)" />
              <i class="el-icon-delete" @click.stop="tabTwo.saleDetails[indexSelf].salImage.imageUrl5=''" />
            </div>
            <i v-else class="el-icon-plus avatar-uploader-icon" />
          </el-upload>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="isdrawinglDialog = false">确 定</el-button>
      </span>
    </el-dialog>
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
import mixinsImg from '@/views/market/marketManage/createMarkerOrder/components/mixinsImg'
import material from '@/views/market/marketManage/createMarkerOrder/components/material'

export default {
  components: {
    jcTable,
    material
  },
  mixins: [jumpMateriel, mixinsImg],
  props: {
    msg: {
      type: Number,
      default: 2
    }
  },
  data() {
    return {
      fid: '', // 客户ID
      material: '', // 父传子
      isMateria: false, // 物料弹窗
      actionURL: '', // 图片上传地址
      indexSelf: 0, // 图片下标
      imgVisible: false, // 预览图片src
      priview: '', // 预览图片
      isdrawinglDialog: false, // 图纸弹窗
      activeName: 'first', // 标签tabs名
      tableHeader: [],
      cellStyle: { padding: '10 10' },
      tabTwo: {
        saleDetails: [ // 明细信息
          {
            fmaterialId: '',
            fdescripTion: '',
            funitId: '',
            fqty: '',
            fisFree: false,
            ftaxRate: '',
            fdeliveryDate: '',
            fmaterialIdName: '',
            funitName: '',
            fprice: '',
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
        planDetails: [{ fneedRecAdvance: false, frecAdvanceRate: '0', frecAdvanCeamount: '0' }]
      }
    }
  },
  watch: {
    msg() {
      this.fid = this.msg
    }
  },
  methods: {
    // 打开物料弹窗
    handleGetMateriel(row, index) {
      if (!this.fid) {
        this.$message.error('请先选择客户')
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
            fqty: '',
            fisFree: false,
            ftaxRate: '',
            fdeliveryDate: '',
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
      }
    },
    // 物料数据
    materialData(item) {
      this.tabTwo.saleDetails[this.material].fmaterialId = item.fmaterialId
      this.tabTwo.saleDetails[this.material].fmaterialIdName = item.fnumber
      this.tabTwo.saleDetails[this.material].fdescripTion = item.fdescripTion
      this.tabTwo.saleDetails[this.material].funitId = item.funitId
      this.tabTwo.saleDetails[this.material].funitName = item.funitName
      this.tabTwo.saleDetails[this.material].fmodel = item.fmodel
      this.tabTwo.saleDetails[this.material].fprice = item.fprice
      this.isMateria = item.isMaterialDialog
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
    handleChange(value) {
      this.$emit('visible', this.tabTwo)
    }, // 监听税率
    handleChange1(value) {
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
    drawingl(index) {
      this.indexSelf = index
      this.isdrawinglDialog = true
    },
    // 关闭上传图片弹窗，并向父组件传值
    handleClose() {
      this.isdrawinglDialog = false
      this.$emit('visible', this.tabTwo)
    },
    // 预览图片
    proviewImg(img) {
      this.imgVisible = true
      this.priview = img
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
  .el-table ::v-deep .cell {
    display: flex;
    justify-content: center;
    align-items: center;

    img {
      padding: 0 5px;
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
