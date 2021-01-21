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
import { queryCustomerDetails } from '@/api/marketManage/customer/detailCustomer'
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
    this.getForm()
  },
  methods: {
    async getForm() {
      const ID = this.$route.params.id
      const { data: RES } = await queryCustomerDetails({ fcustId: ID })
      this.optionValue = RES
      this.options = {
        fname: {
          label: '客户名称',
          disabled: 'disabled'
        },
        fcountryName: {
          label: '国家',
          disabled: 'disabled'
        },
        fcustType: {
          label: '客户类别',
          disabled: 'disabled'
        },
        fgroupName: {
          label: '客户分组',
          disabled: 'disabled'
        },
        fcurrency: {
          label: '结算币别',
          disabled: 'disabled'
        },
        ftaxTypeName: {
          label: '税分类',
          disabled: 'disabled'
        },
        finvoiceTypeName: {
          label: '发票类型',
          disabled: 'disabled'
        },
        freccondiTion: {
          label: '收款条件',
          disabled: 'disabled'
        },
        ftaxRateName: {
          label: '默认税率',
          disabled: 'disabled'
        },
        fsettleType: {
          label: '结算方式',
          disabled: 'disabled'
        },
        fiscreditcheck: {
          label: '启用信用管理',
          type: 'checkbox',
          disabled: 'disabled'
        }
      }
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

</style>
