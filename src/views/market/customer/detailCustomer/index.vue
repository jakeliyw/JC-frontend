<template>
  <div class="content">
    <jc-title />
    <el-tabs v-model="activeName" type="border-card">
      <el-tab-pane label="客户" name="customer" class="layout">
        <div class="header">
          <el-button size="mini" disabled>刷新</el-button>
          <el-button size="mini" type="primary" disabled>保存客户</el-button>
        </div>
        <jc-form :option-value="optionValue" :options="options" />
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>
import jcForm from '@/components/Form'
import jcTitle from '@/components/Title'
export default {
  name: 'DetailCustomer',
  components: {
    jcForm,
    jcTitle
  },
  data() {
    return {
      activeName: 'customer', // 默认在价目
      optionValue: {},
      options: {}
    }
  },
  mounted() {
    this.options = {

    }
  }
}
</script>

<style scoped lang="scss">
.content {
  padding: 20px;
  display: flex;
  flex-direction: column;

  .layout {
    display: flex;
    flex-direction: column;

    .header {
      margin-bottom: 20px;
    }

    .elRow {
      display: flex;
      flex-wrap: wrap;

      .input-width {
        width: 10vw;
      }
    }
  }
}

.el-input__icon {
  cursor: pointer;
}

.icon-jin-rud-ao-bo {
  cursor: pointer;

  &:hover {
    color: #409eff;
  }
}
</style>
