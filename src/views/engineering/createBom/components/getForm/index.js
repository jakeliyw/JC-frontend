export default {
  methods: {
    // Form表单
    handleSetForm() {
      // 物料form
      this.prodValue = {
        FNUMBER: '',
        FDESCRIPTION: '',
        FSPECIFICATION: '',
        FLABORCOST: '',
        FMATERIALCOST: '',
        FUNIT: '',
        FGROSSWEIGHT: '',
        FNETWEIGHT: '',
        FWEIGHTUNIT: '',
        FVOLUME: '',
        FOLDNUMBER: '',
        FBARCODE: '',
        FMAKINGS: '',
        FDEFAULTROUTING: '',
        FTAXRATE: ''
      }
      this.prodOptions = {
        FNUMBER: {
          label: '物料编码',
          type: 'slot'
        },
        FDESCRIPTION: {
          label: '物料描述',
          disabled: 'disabled'
        },
        FSPECIFICATION: {
          label: '物料规格',
          disabled: 'disabled'
        },
        FLABORCOST: {
          label: '人工成本',
          type: 'number',
          precision: 2,
          min: 0.01,
          step: 0.1
        },
        FMATERIALCOST: {
          label: '物料成本',
          disabled: 'disabled'
        },
        FUNIT: {
          label: '物料单位',
          disabled: 'disabled'
        },
        FGROSSWEIGHT: {
          label: '毛重',
          disabled: 'disabled'
        },
        FNETWEIGHT: {
          label: '净重',
          disabled: 'disabled'
        },
        FWEIGHTUNIT: {
          label: '重量单位',
          disabled: 'disabled'
        },
        FVOLUME: {
          label: '体积',
          disabled: 'disabled'
        },
        FOLDNUMBER: {
          label: '旧物料编码',
          disabled: 'disabled'
        },
        FBARCODE: {
          label: '条码',
          disabled: 'disabled'
        },
        FMAKINGS: {
          label: '材质',
          disabled: 'disabled'
        },
        FDEFAULTROUTING: {
          label: '工艺',
          disabled: 'disabled'
        },
        FTAXRATE: {
          label: '税率',
          disabled: 'disabled'
        }
      }
    }
  }
}
