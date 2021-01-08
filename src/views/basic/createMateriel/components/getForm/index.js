import {
  queryMaterialAttributes,
  queryTOrgOrganizationsL,
  queryUnitList,
  queryMaterialDetail
} from '@/api/basicManagement/createMateriel'

export default {
  data() {
    return {
      protect: [
        {
          label: 'A级',
          value: 'A级'
        },
        {
          label: 'B级',
          value: 'B级'
        },
        {
          label: 'C级',
          value: 'C级'
        }
      ]
    }
  },
  methods: {
    async getMateriel() {
      const { data: RES } = await queryMaterialDetail({ fnumber: this.$route.params.id })
      return RES
    },
    // 获取组织
    async getOrganization() {
      const { data: RES } = await queryTOrgOrganizationsL()
      return RES.map(item => {
        this.useOrganization = item.FNAME
        return { label: item.FNAME, value: item.FPKID }
      })
    },
    // 获取环境
    async getKit() {
      return this.protect
    },
    // 基本单位
    async getBasicUnit() {
      const { data: RES } = await queryUnitList()
      return RES.map(item => {
        return { label: item.FNAME, value: item.FBASEUNITID }
      })
    },
    // 获取物料类型
    async getMaterielType() {
      const { data: RES } = await queryMaterialAttributes()
      return RES.map(item => {
        return { label: item.FCAPTION, value: item.FERPCLSID }
      })
    },
    // Form表单
    async handleControl() {
      const organizationRes = await this.getOrganization()
      const kitRes = await this.getKit()
      this.basicUnit = await this.getBasicUnit()
      const materielType = await this.getMaterielType()
      this.organizationValue = {
        FCREATEORG: 1,
        FUSEORG: this.useOrganization
      }
      this.organization = {
        FCREATEORG: {
          label: '创建组织',
          type: 'select',
          span: 12,
          selectItems: organizationRes,
          rules: [
            { required: true }
          ]
        },
        FUSEORG: {
          label: '使用组织',
          span: 12,
          disabled: 'disabled',
          rules: [
            { required: true }
          ]
        }
      }
      this.oneMaterialValue = {
        LargeCode: ''
      }
      this.oneMaterial = {
        LargeCode: {
          label: '一类物料',
          type: 'slot',
          rules: [
            { required: true, message: '请选择一类物料', trigger: 'change' }
          ]
        }
      }
      this.toMaterialValue = {
        MediumCode: ''
      }
      this.toMaterial = {
        MediumCode: {
          label: '二类物料',
          type: 'slot',
          rules: [
            { required: true, message: '请选择二类物料', trigger: 'change' }
          ]
        }
      }
      this.basicValue = {
        FBASEUNITID: '',
        FNUMBER: '',
        FOLDNUMBER: '',
        FBARCODE: '',
        FERPCLSID: '',
        FPROTECT: '',
        FMODEL: '',
        FDESCRIPTION: '',
        FREMARKS: ''
      }
      this.basic = {
        FMODEL: {
          label: '型号',
          span: 8,
          rules: [
            { required: true, message: '型号不能为空', trigger: 'blur' }
          ]
        },
        FNUMBER: {
          label: '物料编码',
          span: 8,
          disabled: 'disabled'
        },
        FOLDNUMBER: {
          label: '旧物料编码',
          span: 8,
          rules: [
            { required: true, message: '旧物料编码不能为空', trigger: 'blur' }
          ]
        },
        FBARCODE: {
          label: '条码',
          span: 8,
          rules: [
            { required: true, message: '条码不能为空', trigger: 'blur' }
          ]
        },
        FBASEUNITID: {
          label: '基本单位',
          type: 'slot',
          span: 8,
          rules: [
            { required: true, message: '请选择基本单位', trigger: 'change' }
          ]
        },
        FPROTECT: {
          label: '环保等级',
          type: 'select',
          selectItems: kitRes,
          span: 8,
          rules: [
            { required: true, message: '请选择环保等级', trigger: 'change' }
          ]
        },
        FERPCLSID: {
          label: '物料类型',
          span: 8,
          type: 'select',
          selectItems: materielType,
          rules: [
            { required: true, message: '请选择物料类型', trigger: 'blur' }
          ]
        },
        FREMARKS: {
          label: '物料备注',
          span: 16
        },
        FDESCRIPTION: {
          label: '物料描述',
          disabled: 'disabled',
          isActive: 'isActive',
          type: 'textarea',
          rules: [
            { required: true, message: '请输入物料描述', trigger: 'blur' }
          ]
        }
      }
      this.weightValue = {
        FNAME: '',
        FGROSSWEIGHT: '',
        FNETWEIGHT: ''
      }
      this.weight = {
        FNAME: {
          label: '重量单位',
          type: 'slot',
          rules: [
            { required: true, message: '请选择重量单位', trigger: 'blur' }
          ]
        },
        FGROSSWEIGHT: {
          label: '毛重',
          type: 'number'
        },
        FNETWEIGHT: {
          label: '净重',
          type: 'number'
        }
      }
      this.dimensionalValue = {
        FNAME: '',
        FLENGTH: 0.0,
        FWIDTH: 0.0,
        FHEIGHT: 0.0,
        FVOLUME: 0.0,
        FTHICKNESS: 0.0
      }
      this.dimensional = {
        FNAME: {
          label: '尺寸单位',
          type: 'slot',
          span: 8,
          rules: [
            { required: true, message: '请选择尺寸单位', trigger: 'blur' }
          ]
        },
        FVOLUME: {
          label: '直径',
          type: 'number',
          span: 8
        },
        FTHICKNESS: {
          label: '厚度',
          span: 8,
          type: 'number'
        },
        FLENGTH: {
          label: '长',
          span: 8,
          type: 'number'
        },
        FWIDTH: {
          label: '宽',
          span: 8,
          type: 'number'
        },
        FHEIGHT: {
          label: '高',
          span: 8,
          type: 'number'
        }
      }
    }
  }
}
