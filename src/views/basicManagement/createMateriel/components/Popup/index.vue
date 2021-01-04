<template>
  <div>
    <el-dialog
      class="dialogClass"
      :width="width"
      :title="dialogTitle"
      modal
      :close-on-click-modal="false"
      :visible.sync="openDialog"
      :before-close.sync="closeDialog"
      close-on-press-escape
      @close="closeFun"
    >
      <div class="content">
        <div class="header-form">
          <span class="query-criteria">{{ popupTitle }}</span>
          <el-input
            v-model="value"
            size="mini"
            class="input-width"
            placeholder="请输入搜索条件"
            @input="$emit('input', value)"
            @keyup.enter.native="handleSearch"
          />
          <el-button size="mini" type="primary" class="btn-search" @click="handleSearch">搜索</el-button>
        </div>
        <slot name="content" />
        <slot name="pagination" />
      </div>
    </el-dialog>
  </div>
</template>

<script>
export default {
  name: 'Index',
  model: {
    prop: 'initValue',
    event: 'input'
  },
  props: {
    initValue: {
      type: String,
      default: ''
    },

    width: {
      type: String,
      default: '60vw'
    },
    dialogTitle: {
      type: String,
      required: true
    },
    popupTitle: {
      type: String,
      required: true
    },
    openDialog: {
      type: Boolean,
      required: true,
      default: false
    }
  },
  data() {
    return {
      value: this.initValue
    }
  },
  methods: {
    // 关闭弹窗
    closeDialog() {
      this.$emit('closeDialog')
    },
    closeFun() {
      this.value = ''
      this.$emit('emptyForm')
    },
    // 搜索
    handleSearch() {
      this.$emit('handleSearch')
    }
  }
}
</script>

<style scoped lang="scss">
.content {
  display: flex;
  flex-direction: column;
  .header-form {
    display: flex;
    justify-content: flex-start;
    flex-wrap: wrap;
    align-items: center;
    margin-bottom: 20px;
    .query-criteria{
      margin-right: 10px;
    }
    .input-width {
      width: 200px;
      margin-right: 10px;
    }
    .btn-search{
      margin-right: 10px;
    }
  }
}
.dialogClass ::v-deep .el-dialog__body {
  padding: 0 20px;
}
</style>
