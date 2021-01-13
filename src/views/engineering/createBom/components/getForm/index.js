export default {
  // 材料成本
  Summation() {
    const num = this.sonTableData.map(item => {
      item.money = item.FPRICE * item.FDOSAGE
      return item.money
    })
    const total = num.reduce((total, num) => {
      return total + num
    }, 0)
    return parseInt(total * 100) / 100
  },
  methods: {
    // Form表单
    handleSetForm() {
      // 物料form
      this.prodValue = {
        FNUMBER: '',
        FDESCRIPTION: '',
        FSPECIFICATION: '',
        FLABORCOST: '',
        FMATERIALCOST: 0,
        FUNIT: '',
        FGROSSWEIGHT: 0,
        FNETWEIGHT: '',
        FWEIGHTUNIT: '',
        FVOLUME: 0,
        FOLDNUMBER: '',
        FBARCODE: '',
        FMAKINGS: '',
        FDEFAULTROUTING: '',
        FTAXRATE: ''
      }
      this.prodOptions = {
        FMATERIALCOST: {
          label: '物料成本',
          disabled: 'disabled'
        },
        FLABORCOST: {
          label: '人工成本',
          type: 'number',
          precision: 4,
          min: 0.0000,
          step: 0.0001
        },
        FBARCODE: {
          label: '条码',
          disabled: 'disabled'
        },
        FOLDNUMBER: {
          label: '旧物料编码',
          disabled: 'disabled'
        },
        FUNIT: {
          label: '物料单位',
          disabled: 'disabled'
        },
        FTAXRATE: {
          label: '税率',
          disabled: 'disabled'
        },
        FDEFAULTROUTING: {
          label: '工艺',
          disabled: 'disabled'
        },
        FMAKINGS: {
          label: '材质',
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
        FNUMBER: {
          label: '物料编码',
          type: 'slot'
        },
        FSPECIFICATION: {
          label: '物料规格',
          disabled: 'disabled'
        },
        FDESCRIPTION: {
          label: '物料描述',
          type: 'textarea',
          disabled: 'disabled'
        }
      }
    }
  }
}
