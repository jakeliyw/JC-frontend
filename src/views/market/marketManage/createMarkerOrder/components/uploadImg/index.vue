<template>
  <div class="content">
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
              v-if="prodValue.imageUrl"
              :src="prodValue.imageUrl"
              class="avatar"
            >
            <div v-if="prodValue.imageUrl" class="magnify">
              <i class="el-icon-search" @click.stop="proviewImg(prodValue.imageUrl)" />
              <i class="el-icon-delete" @click.stop="prodValue.imageUrl=''" />
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
              v-if="prodValue.imageUrl1"
              :src="prodValue.imageUrl1"
              class="avatar"
            >
            <div v-if="prodValue.imageUrl1" class="magnify">
              <i class="el-icon-search" @click.stop="proviewImg(prodValue.imageUrl1)" />
              <i class="el-icon-delete" @click.stop="prodValue.imageUrl1=''" />
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
              v-if="prodValue.imageUrl2"
              :src="prodValue.imageUrl2"
              class="avatar"
            >
            <div v-if="prodValue.imageUrl2" class="magnify">
              <i class="el-icon-search" @click.stop="proviewImg(prodValue.imageUrl2)" />
              <i class="el-icon-delete" @click.stop="prodValue.imageUrl2=''" />
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
              v-if="prodValue.imageUrl3"
              :src="prodValue.imageUrl3"
              class="avatar"
            >
            <div v-if="prodValue.imageUrl3" class="magnify">
              <i class="el-icon-search" @click.stop="proviewImg(prodValue.imageUrl3)" />
              <i class="el-icon-delete" @click.stop="prodValue.imageUrl3=''" />
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
              v-if="prodValue.imageUrl4"
              :src="prodValue.imageUrl4"
              class="avatar"
            >
            <div v-if="prodValue.imageUrl4" class="magnify">
              <i class="el-icon-search" @click.stop="proviewImg(prodValue.imageUrl4)" />
              <i class="el-icon-delete" @click.stop="prodValue.imageUrl4=''" />
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
              v-if="prodValue.imageUrl5"
              :src="prodValue.imageUrl5"
              class="avatar"
            >
            <div v-if="prodValue.imageUrl5" class="magnify">
              <i class="el-icon-search" @click.stop="proviewImg(prodValue.imageUrl5)" />
              <i class="el-icon-delete" @click.stop="prodValue.imageUrl5=''" />
            </div>
            <i v-else class="el-icon-plus avatar-uploader-icon" />
          </el-upload>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="handleClose">确 定</el-button>
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

import mixinsImg from '@/views/market/marketManage/createMarkerOrder/components/mixinsImg'

export default {
  mixins: [mixinsImg],
  props: {
    msg: {
      type: Object,
      default: function() {
        return {}
      }
    }
  },
  data() {
    return {
      isdrawinglDialog: true,
      actionURL: '', // 图片上传地址
      imgVisible: false, // 预览图片src
      priview: '', // 预览图片
      prodValue: {
        imageUrl: '', // 图片
        imageUrl1: '', // 图片
        imageUrl2: '', // 图片
        imageUrl3: '', // 图片
        imageUrl4: '', // 图片
        imageUrl5: '' // 图片
      }
    }
  },
  created() {
    this.prodValue = this.msg
  },
  methods: {
    // 预览图片
    proviewImg(img) {
      this.imgVisible = true
      this.priview = img
    },
    // 关闭前回调
    handleClose() {
      this.$emit('upload', this.prodValue)
    }
  }
}
</script>
<style scoped lang="scss">
.content {
  @include listBom;

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
