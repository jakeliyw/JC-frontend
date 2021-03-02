<template>
  <div class="content">
    <jc-title />
    <el-card class="header-card">
      <el-button size="mini">刷新</el-button>
      <el-button size="mini" type="primary">提交</el-button>
    </el-card>
    <el-tabs v-model="activeName" type="border-card">
      <el-tab-pane label="客户基础数据" name="customer">
        <el-form label-width="100px" size="mini" :model="basic" class="spacing">
          <el-row :gutter="30" type="flex" justify="start" class="el-row">
            <el-col :span="6">
              <el-form-item label="国家" prop="fcountry">
                <el-input v-model="basic.fcountry" class="input-width" placeholder="请选择国家">
                  <i slot="suffix" class="el-input__icon el-icon-search" />
                </el-input>
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item label="邮政编码" prop="fzip">
                <el-input v-model="basic.fzip" class="input-width" placeholder="请输入邮政编码" />
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item label="公司网站" prop="fwebsite">
                <el-input v-model="basic.fwebsite" class="input-width" placeholder="请输入公司网站" />
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item label="通讯地址" prop="faddress">
                <el-input v-model="basic.faddress" class="input-width" placeholder="请输入通讯地址" type="textarea" />
              </el-form-item>
            </el-col>
          </el-row>
        </el-form>
        <el-form label-width="100px" size="mini" :model="administration" class="spacing">
          <el-row :gutter="30" type="flex" justify="start" class="el-row">
            <el-col :span="6">
              <el-form-item label="联系电话" prop="ftel">
                <el-input v-model="administration.ftel" placeholder="请输入联系电话" class="input-width" />
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item label="传真" prop="ffax">
                <el-input v-model="administration.ffax" placeholder="请输入传真" class="input-width" />
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item label="纳税登记号" prop="ftaxregistercode">
                <el-input v-model="administration.ftaxregistercode" placeholder="请输入纳税登记号" class="input-width" />
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item label="公司类别" prop="fcompanyclassify">
                <el-input v-model="administration.fcompanyclassify" placeholder="请选择公司类别" class="input-width">
                  <i slot="suffix" class="el-input__icon el-icon-search" />
                </el-input>
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item label="公司性质" prop="fcompanynature">
                <el-input v-model="administration.fcompanynature" placeholder="请选择公司性质" class="input-width">
                  <i slot="suffix" class="el-input__icon el-icon-search" />
                </el-input>
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item label="公司规模" prop="fcompanyscale">
                <el-input v-model="administration.fcompanyscale" placeholder="请选择公司规模" class="input-width">
                  <i slot="suffix" class="el-input__icon el-icon-search" />
                </el-input>
              </el-form-item>
            </el-col>
          </el-row>
        </el-form>
        <el-form label-width="100px" :model="relevant" size="mini" class="spacing">
          <el-row :gutter="30" type="flex" justify="start" class="el-row">
            <el-col :span="6">
              <el-form-item label="客户类别" prop="fcustTypeId">
                <el-input v-model="relevant.fcustTypeId" placeholder="请选择客户类别" class="input-width">
                  <i slot="suffix" class="el-input__icon el-icon-search" />
                </el-input>
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item label="客户分组" prop="fgroup">
                <el-input v-model="relevant.fgroup" placeholder="请选择客户分组" class="input-width">
                  <i slot="suffix" class="el-input__icon el-icon-search" />
                </el-input>
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item label="备注" prop="fdescription">
                <el-input v-model="relevant.fdescription" class="input-width" placeholder="请输入备注" type="textarea" />
              </el-form-item>
            </el-col>
          </el-row>
        </el-form>
      </el-tab-pane>
      <el-tab-pane label="操作记录" name="other" />
    </el-tabs>
  </div>
</template>

<script>
import JcTitle from '@/components/Title'
export default {
  name: 'CreateCustomer',
  components: {
    JcTitle
  },
  data() {
    return {
      activeName: 'customer', // 默认基本信息
      // 表单值
      basic: {
        fuseOrgId: '', // 创建组织
        fname: '', // 客户名称
        fcountry: '', // 国家
        faddress: '', // 通讯地址
        fzip: '', // 邮政编码
        fwebsite: '', // 公司网站
        fcontacts: '' // 联系人
      },
      administration: {
        ftel: '', // 联系电话
        ffax: '', // 传真
        ftaxregistercode: '', // 纳税登记号
        fcompanyclassify: '', // 公司类别
        fcompanynature: '', // 公司性质
        fcompanyscale: '' // 公司规模
      },
      relevant: {
        fcustTypeId: '', // 客户类别  1
        fgroup: '', // 客户分组  1
        fdescription: ''// 备注
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.input-width{
  width: 10vw;
  .el-icon-search{
    cursor: pointer;
  }
}
.title-background {
  color: wheat;
  display: table-cell;
  font-weight: 800;
  background-color: #848383;
  width: 90vw;
  height: 30px;
  font-size: 14px;
  line-height: 30px;
  border-left: groove;
  letter-spacing: 5px;
  text-indent: 10px;
}
.content{
  padding: 20px;
  display: flex;
  flex-direction: column;
  .header-card{
    margin-bottom: 20px;
  }
  .spacing{
    margin-top: 20px;
    .el-row{
      display: flex;
      flex-wrap: wrap;
    }
  }
}
</style>
