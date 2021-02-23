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
                :src="imageUrl"
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
            <el-input v-model="fweightUnitId" size="mini" class="basic-input" disabled>
              <i slot="suffix" class="el-input__icon el-icon-search" />
            </el-input>
          </div>
        </jc-form>
        <el-divider class="dimensional" />
        <jc-form :option-value="dimensionalValue" :options="dimensional">
          <div slot="slotMateriel" class="basic-content">
            <span class="basic-span">尺寸单位</span>
            <el-input v-model="fvolumeunitId" size="mini" class="basic-input" disabled>
              <i slot="suffix" class="el-input__icon el-icon-search" />
            </el-input>
          </div>
        </jc-form>
      </el-tab-pane>
      <el-tab-pane label="信息" name="information">
        <jc-information
          :information="information"
          :company="company"
          :detail-disabled="true"
          :detail-show="false"
        />
      </el-tab-pane>
      <el-tab-pane label="其它" name="log">
        <jc-form :option-value="otherUrlObject" :options="otherOptions" />
        <jc-table
          :table-header="logTableHeader"
          :table-data="otherLogTableData"
          :cell-style="cellStyle"
          table-height="calc(100vh - 500px)"
        />
        <jc-pagination
          v-show="total > 0"
          :total="total"
          :page.sync="pageNum"
          :limit.sync="size"
          @pagination="handleOther"
        />
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>
import jcForm from '@/components/Form'
import jcTable from '@/components/Table'
import jcPagination from '@/components/Pagination'
import jcInformation from '../createMateriel/Information'
import { queryMaterialDetail, queryMaterialLog } from '@/api/basicManagement/materielList'

export default {
  name: 'DetailMateriel',
  components: {
    jcForm,
    jcPagination,
    jcInformation,
    jcTable
  },
  data() {
    return {
      activeName: 'basic',
      total: 0, // 总条目
      cellStyle: { padding: '10 10' }, // 行高
      imageUrl: '', // 上传图片
      pageNum: 1, // 当前页
      size: 10, // 每页显示多少条数据
      property: [], // 物料属性
      fweightUnitId: '', // 重量单位
      fvolumeunitId: '', // 尺寸单位
      fmaterialId: '', // id
      otherUrlObject: {}, // 其它审核人
      otherOptions: {}, // 其它审核人控件
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
      organization: {}, // 组织控件
      logTableHeader: [
        { label: '日期', prop: 'createDate', align: 'center' },
        { label: '操作人', prop: 'fname', align: 'center' },
        { label: '部门', prop: 'fdeaprt', align: 'center' },
        { label: 'IP地址', prop: 'fip', align: 'center' },
        { label: '行为', prop: 'fdescribe', align: 'center' }
      ],
      information: {},
      company: {} // 单位
    }
  },
  mounted() {
    this.handleControl()
  },
  methods: {
    handleControl() {
      queryMaterialDetail({ fnumber: this.$route.params.id }).then(RES => {
        if (RES.code === 1) {
          this.$message.error(RES.message)
          return
        }
        this.company.label = RES.data.material.fbaseUnitId
        this.property = RES.data.property
        this.imageUrl = RES.data.material.fimg
        this.fmaterialId = RES.data.material.fmaterialId
        this.information = {
          fdefaultvendor: RES.data.material.fsupplier,
          fpobillTypeName: RES.data.material.fbillType,
          fquotaType: RES.data.material.fquotaType,
          fstockName: RES.data.material.fstock,
          fminStock: RES.data.material.fminStock,
          fsafeStock: RES.data.material.fsafeStock,
          fmaxStock: RES.data.material.fmaxStock,
          position: RES.data.material.fsafeStock
        }
        this.organizationValue = {
          fcreateOrgId: RES.data.material.fcreateOrgId,
          fuseOrg: RES.data.material.fcreateOrgId,
          largeCode: RES.data.subclass.largeName,
          mediumCode: RES.data.subclass.mediumName
        }
        this.organization = {
          fcreateOrgId: {
            label: '创建组织',
            disabled: 'disabled',
            rules: [
              { required: true }
            ]
          },
          fuseOrg: {
            label: '使用组织',
            disabled: 'disabled',
            rules: [
              { required: true }
            ]
          },
          largeCode: {
            label: '一类物料',
            disabled: 'disabled'
          },
          mediumCode: {
            label: '二类物料',
            disabled: 'disabled',
            rules: [
              { required: true }
            ]
          }
        }
        this.basicValue = RES.data.material
        this.basic = {
          fmodel: {
            label: '型号',
            span: 8,
            disabled: 'disabled'
          },
          fnumber: {
            label: '物料编码',
            span: 8,
            disabled: 'disabled'
          },
          foldnumber: {
            label: '旧物料编码',
            span: 8,
            disabled: 'disabled'
          },
          fbarCode: {
            label: '条码',
            span: 8,
            disabled: 'disabled'
          },
          fbaseUnitId: {
            label: '基本单位',
            span: 8,
            disabled: 'disabled'
          },
          fprotect: {
            label: '环保等级',
            span: 8,
            disabled: 'disabled'
          },
          fspecificaTion: {
            label: '物料规格',
            span: 8,
            disabled: 'disabled'
          },
          ferpcls: {
            label: '物料类型',
            span: 8,
            disabled: 'disabled'
          },
          fremarks: {
            label: '物料备注',
            disabled: 'disabled',
            span: 8
          },
          fdescripTion: {
            label: '物料描述',
            disabled: 'disabled',
            span: 24,
            isActive: 'isActive',
            type: 'textarea'
          }
        }
        this.controlValue = {
          fisasset: JSON.parse(RES.data.material.fisasset),
          fisinventory: JSON.parse(RES.data.material.fisinventory),
          fisproduce: JSON.parse(RES.data.material.fisproduce),
          fispurchase: JSON.parse(RES.data.material.fispurchase),
          fissale: JSON.parse(RES.data.material.fissale),
          fissubcontract: JSON.parse(RES.data.material.fissubcontract)
        }
        this.control = {
          fisasset: {
            label: '允许资产',
            type: 'checkbox',
            span: 2,
            disabled: 'disabled'
          },
          fisinventory: {
            label: '允许库存',
            type: 'checkbox',
            span: 2,
            disabled: 'disabled'
          },
          fisproduce: {
            label: '允许生产',
            type: 'checkbox',
            span: 2,
            disabled: 'disabled'
          },
          fispurchase: {
            label: '允许采购',
            type: 'checkbox',
            span: 2,
            disabled: 'disabled'
          },
          fissale: {
            label: '允许销售',
            type: 'checkbox',
            span: 2,
            disabled: 'disabled'
          },
          fissubcontract: {
            label: '允许委外',
            type: 'checkbox',
            span: 2,
            disabled: 'disabled'
          }
        }
        this.weightValue = RES.data.material
        this.weight = {
          fweightUnitId: {
            label: '重量单位',
            disabled: 'disabled'
          },
          fgrossWeight: {
            label: '毛重',
            disabled: 'disabled'
          },
          fnetWeight: {
            label: '净重',
            disabled: 'disabled'
          }
        }
        this.dimensionalValue = RES.data.material
        this.dimensional = {
          fvolumeunitId: {
            label: '尺寸单位',
            disabled: 'disabled'
          },
          fvolume: {
            label: '直径',
            disabled: 'disabled'
          },
          fthickness: {
            label: '厚度',
            disabled: 'disabled'
          },
          flength: {
            label: '长',
            disabled: 'disabled'
          },
          fwidth: {
            label: '宽',
            disabled: 'disabled'
          },
          fheight: {
            label: '高',
            disabled: 'disabled'
          },
          fopenLength: {
            label: '展开长',
            disabled: 'disabled'
          }
        }
      }).catch(error => {
        this.$message.error(error)
      })
    },
    // 获取其它
    async handleOther() {
      const DATA = { pageNum: this.pageNum, pageSize: this.size, fmaterialId: this.fmaterialId }
      const RES = await queryMaterialLog(DATA)
      this.otherUrlObject = RES.data.operator
      this.otherOptions = {
        fcreator: {
          label: '创建人',
          span: 8,
          disabled: 'disabled'
        },
        fdevel: {
          label: '研发审核人',
          span: 8,
          disabled: 'disabled'
        },
        fieid: {
          label: 'IE审核人',
          span: 8,
          disabled: 'disabled'
        },
        fcreateDate: {
          label: '创建时间',
          span: 8,
          disabled: 'disabled'
        }
      }
      this.total = RES.data.total
      this.otherLogTableData = RES.data.array
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
