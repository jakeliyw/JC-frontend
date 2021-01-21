export default {
  data() {
    return {
    }
  },
  methods: {
    getBase64(file) { // 把图片转成base64编码
      return new Promise(function(resolve, reject) {
        const reader = new FileReader()
        let imgResult = ''
        reader.readAsDataURL(file)
        reader.onload = function() {
          imgResult = reader.result
        }
        reader.onerror = function(error) {
          reject(error)
        }
        reader.onloadend = function() {
          resolve(imgResult)
        }
      })
    },
    // 上传图片
    handleAvatarSuccess(file, fileListe) {
      this.getBase64(file.raw).then(res => {
        this.prodValue.imageUrl = res
      })
    }, handleAvatarSuccess1(file, fileListe) {
      this.getBase64(file.raw).then(res => {
        this.prodValue.imageUrl1 = res
      })
    }, handleAvatarSuccess2(file, fileListe) {
      this.getBase64(file.raw).then(res => {
        this.prodValue.imageUrl2 = res
      })
    }, handleAvatarSuccess3(file, fileListe) {
      this.getBase64(file.raw).then(res => {
        this.prodValue.imageUrl3 = res
      })
    }, handleAvatarSuccess4(file, fileListe) {
      this.getBase64(file.raw).then(res => {
        this.prodValue.imageUrl4 = res
      })
    }, handleAvatarSuccess5(file, fileListe) {
      this.getBase64(file.raw).then(res => {
        this.prodValue.imageUrl5 = res
      })
    }, examine(file, fileListe) {
      this.getBase64(file.raw).then(res => {
        this.prodValue.fapprovalImage = res
      })
    },
    // 修改上传图片
    modifyExamine(file, fileListe) {
      this.getBase64(file.raw).then(res => {
        this.prodValue.fapprovalImage = res
      })
    }
  }
}
