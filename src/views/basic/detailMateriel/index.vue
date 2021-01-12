<template>
  <div class="content">
    <el-card class="header-card">
      <div class="organization">
        <jc-form :option-value="organizationValue" :options="organization" />
      </div>
    </el-card>
    <el-tabs v-model="activeName" type="border-card" @tab-click="handleOther">
      <el-tab-pane label="基础" name="basic">
        <span class="title-background">综合信息</span>
        <div class="information">
          <div class="images">
            <el-upload
              class="upload"
              disabled
              action="/tBdMaterialgroupL/queryTBdMaterialgroupL"
            >
              <img
                v-if="imageUrl"
                :src="`${backstageApi}${imageUrl}`"
                class="avatar"
              >
              <i v-else class="el-icon-plus avatar-uploader-icon" disabled />
            </el-upload>
          </div>
          <div class="basics">
            <jc-form :option-value="basicValue" :options="basic" />
          </div>
        </div>
        <span class="title-background">明细信息</span>
        <jc-form :option-value="controlValue" :options="control" />
        <div class="materielAttribute">
          <div v-for="(item, index) of property" :key="index" class="materielContent">
            <span class="dialog-span">{{ item.attribute }}</span>
            <el-select v-model="item.value" class="width-input" size="mini" disabled />
          </div>
        </div>
        <el-divider class="weight" />
        <jc-form :options="weight" :option-value="weightValue">
          <div slot="slotMateriel" class="basic-content">
            <span class="basic-span">重量单位</span>
            <el-input v-model="FWEIGHTUNITID" size="mini" class="basic-input" disabled>
              <i slot="suffix" class="el-input__icon el-icon-search" />
            </el-input>
          </div>
        </jc-form>
        <el-divider class="dimensional" />
        <jc-form :option-value="dimensionalValue" :options="dimensional">
          <div slot="slotMateriel" class="basic-content">
            <span class="basic-span">尺寸单位</span>
            <el-input v-model="FVOLUMEUNITID" size="mini" class="basic-input" disabled>
              <i slot="suffix" class="el-input__icon el-icon-search" />
            </el-input>
          </div>
        </jc-form>
      </el-tab-pane>
      <el-tab-pane label="其它" name="log">
        <jc-other
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
        </jc-other>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>
import jcForm from '@/components/Form'
import jcOther from '@/components/Other'
import jcPagination from '@/components/Pagination'
import { queryMaterialDetail } from '@/api/basicManagement/materielList'
import { queryMaterialLog } from '@/api/basicManagement/editMateriel'

export default {
  name: 'DetailMateriel',
  components: {
    jcForm,
    jcOther,
    jcPagination
  },
  data() {
    return {
      activeName: 'basic',
      total: 0, // 总条目
      imageUrl: '', // 上传图片
      pageNum: 1, // 当前页
      size: 10, // 每页显示多少条数据
      property: [], // 物料属性
      FWEIGHTUNITID: '', // 重量单位
      FVOLUMEUNITID: '', // 尺寸单位
      otherUrlObject: {}, // 其它审核人
      otherLogTableData: [], // 日志数据
      imagesValue: {}, // 图片值
      imagesOptions: {}, // 图片控件
      dimensionalValue: {}, // 尺寸值
      dimensional: {}, // 尺寸控件
      weightValue: {}, // 重量数据
      weight: {}, // 重量控件
      controlValue: {}, // 控制数据
      control: {}, // 控制控件
      basicValue: {}, // 基本数据
      basic: {}, // 基本控件
      organizationValue: {}, // 组织值
      organization: {} // 组织控件
    }
  },
  mounted() {
    this.handleControl()
  },
  methods: {
    handleControl() {
      queryMaterialDetail({ fnumber: this.$route.params.id }).then(RES => {
        this.property = RES.data.property
        this.imageUrl = RES.data.material.FIMG
        this.organizationValue = {
          FCREATEORG: RES.data.material.FCREATEORGID,
          FUSEORG: RES.data.material.FUSEORGID,
          LargeCode: RES.data.subclass.largeName,
          MediumCode: RES.data.subclass.mediumName
        }
        this.organization = {
          FCREATEORG: {
            label: '创建组织',
            disabled: 'disabled',
            rules: [
              { required: true }
            ]
          },
          FUSEORG: {
            label: '使用组织',
            disabled: 'disabled',
            rules: [
              { required: true }
            ]
          },
          LargeCode: {
            label: '一类物料',
            disabled: 'disabled'
          },
          MediumCode: {
            label: '二类物料',
            disabled: 'disabled',
            rules: [
              { required: true }
            ]
          }
        }
        this.basicValue = RES.data.material
        this.basic = {
          FMODEL: {
            label: '型号',
            span: 8,
            disabled: 'disabled'
          },
          FNUMBER: {
            label: '物料编码',
            span: 8,
            disabled: 'disabled'
          },
          FOLDNUMBER: {
            label: '旧物料编码',
            span: 8,
            disabled: 'disabled'
          },
          FBASEUNITID: {
            label: '基本单位',
            span: 8,
            disabled: 'disabled'
          },
          FSPECIFICATION: {
            label: '物料规格',
            span: 8,
            disabled: 'disabled'
          },
          FBARCODE: {
            label: '条码',
            span: 8,
            disabled: 'disabled'
          },
          FDESCRIPTION: {
            label: '物料描述',
            disabled: 'disabled',
            span: 24,
            isActive: 'isActive',
            type: 'textarea'
          }
        }
        this.controlValue = {
          FISASSET: JSON.parse(RES.data.material.FISASSET),
          FISINVENTORY: JSON.parse(RES.data.material.FISINVENTORY),
          FISPRODUCE: JSON.parse(RES.data.material.FISPRODUCE),
          FISPURCHASE: JSON.parse(RES.data.material.FISPURCHASE),
          FISSALE: JSON.parse(RES.data.material.FISSALE),
          FISSUBCONTRACT: JSON.parse(RES.data.material.FISSUBCONTRACT)
        }
        this.control = {
          FISASSET: {
            label: '允许资产',
            type: 'checkbox',
            span: 2,
            disabled: 'disabled'
          },
          FISINVENTORY: {
            label: '允许库存',
            type: 'checkbox',
            span: 2,
            disabled: 'disabled'
          },
          FISPRODUCE: {
            label: '允许生产',
            type: 'checkbox',
            span: 2,
            disabled: 'disabled'
          },
          FISPURCHASE: {
            label: '允许采购',
            type: 'checkbox',
            span: 2,
            disabled: 'disabled'
          },
          FISSALE: {
            label: '允许销售',
            type: 'checkbox',
            span: 2,
            disabled: 'disabled'
          },
          FISSUBCONTRACT: {
            label: '允许委外',
            type: 'checkbox',
            span: 2,
            disabled: 'disabled'
          }
        }
        this.weightValue = RES.data.material
        this.weight = {
          FWEIGHTUNITID: {
            label: '重量单位',
            disabled: 'disabled'
          },
          FGROSSWEIGHT: {
            label: '毛重',
            disabled: 'disabled'
          },
          FNETWEIGHT: {
            label: '净重',
            disabled: 'disabled'
          }
        }
        this.dimensionalValue = RES.data.material
        this.dimensional = {
          FVOLUMEUNITID: {
            label: '尺寸单位',
            disabled: 'disabled'
          },
          FVOLUME: {
            label: '直径',
            disabled: 'disabled'
          },
          FTHICKNESS: {
            label: '厚度',
            disabled: 'disabled'
          },
          FLENGTH: {
            label: '长',
            disabled: 'disabled'
          },
          FWIDTH: {
            label: '宽',
            disabled: 'disabled'
          },
          FHEIGHT: {
            label: '高',
            disabled: 'disabled'
          }
        }
      }).catch(error => {
        this.$message.error(error)
      })
    },
    // 获取其它
    async handleOther() {
      const id = this.$route.params.id
      const DATA = { pageNum: this.pageNum, pageSize: this.size, FMATERIALID: id }
      const RES = await queryMaterialLog(DATA)
      this.otherUrlObject = RES.operator
      this.total = RES.total
      this.otherLogTableData = RES.log
    }
  }
}
</script>

<style scoped lang="scss">
.content{
  @include createMateriel;
}
.upload {
  @include upLoad;
}

</style>