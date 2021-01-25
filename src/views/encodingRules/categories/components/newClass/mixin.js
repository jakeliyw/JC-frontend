export default {
  data() {
    return {
      // tag标签添加集合
      inputVisible: false, // 中类tag
      inputValue: '', // 中类tag
      inputVisible1: false, // 小类tag
      inputValue1: '', // 小类tag
      inputVisible2: false, // 属性tag
      inputValue2: '', // 属性tag
      newMediumName: '', // 新增中类、小类、属性名称
      newLargeCode: '', // 新增中类编码
      newSerialType: '', // 新增小类编码
      newAttributeType: '', // 新增属性编码
      newClassID: '', // 判断新增中、小、属性
      cenLarge: '', // 大类ID(用于添加小类获取中类)
      serial: [], // 新增小类tag
      inputVisible4: false,
      inputValue4: '' // 新增小类属性tag
    }
  },
  methods: {
    // 删除tag标签
    handleClose(tag, num) {
      if (num === 0) { // 新增删除中类
        this.formLabelAlign.mediumName.splice(this.formLabelAlign.mediumName.indexOf(tag), 1)
      } else if (num === 1) { // 新增小类
        this.formLabelAlign.typeArray.splice(this.formLabelAlign.typeArray.indexOf(tag), 1)
      } else if (num === 2) { // 新增属性
        this.formLabelAlign.attributeArray.splice(this.formLabelAlign.attributeArray.indexOf(tag), 1)
      } else if (num === 4) { // 新增小类(只增小类)
        this.serial.splice(this.serial.indexOf(tag), 1)
      } else if (num === 5) { // 修改删除中类
        this.medium.splice(this.medium.indexOf(tag), 1)
      } else if (num === 6) { // 修改删除属性
        this.attribute.splice(this.attribute.indexOf(tag), 1)
      }
    },
    // 点击New Class(新增标签)
    showInput(num) {
      if (num === 0) {
        this.inputVisible = true
        this.$nextTick(_ => {
          this.$refs.saveTagInput.$refs.input.focus()
        })
      } else if (num === 1) {
        this.inputVisible1 = true
        this.$nextTick(_ => {
          this.$refs.saveTagInput1.$refs.input.focus()
        })
      } else if (num === 2) {
        this.inputVisible2 = true
        this.$nextTick(_ => {
          this.$refs.saveTagInput2.$refs.input.focus()
        })
      } else if (num === 4) {
        this.inputVisible4 = true
        this.$nextTick(_ => {
          this.$refs.saveTagInput4.$refs.input.focus()
        })
      }
    },
    // 添加集合标签
    handleInputConfirm(num) {
      if (num === 0) {
        const inputValue = this.inputValue
        if (inputValue) {
          if (this.msg2) {
            this.medium.push(inputValue)
          } else {
            this.formLabelAlign.mediumName.push(inputValue)
          }
        }
        this.inputVisible = false
        this.inputValue = ''
      } else if (num === 1) {
        const inputValue1 = this.inputValue1
        if (inputValue1) {
          this.formLabelAlign.typeArray.push(inputValue1)
        }
        this.inputVisible1 = false
        this.inputValue1 = ''
      } else if (num === 2) {
        const inputValue2 = this.inputValue2
        if (inputValue2) {
          if (this.msg2) {
            this.attribute.push(inputValue2)
          } else {
            this.formLabelAlign.attributeArray.push(inputValue2)
          }
        }
        this.inputVisible2 = false
        this.inputValue2 = ''
      } else if (num === 4) {
        const inputValue4 = this.inputValue4
        if (inputValue4) {
          this.serial.push(inputValue4)
        }
        this.inputVisible4 = false
        this.inputValue4 = ''
      }
    }
  }
}
