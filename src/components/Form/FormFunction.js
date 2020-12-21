export default {
  data() {
    return {
      imageUrl: '', // 上传图片
      dialogVisible: false // 展示图片
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
    getFile(file, fileList) { // 上传头像
      this.getBase64(file.raw).then(res => {
        this.imageUrl = res
      })
    }
  }
}
