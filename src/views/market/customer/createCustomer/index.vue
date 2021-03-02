<template>
  <div class="content">
    <jc-title />
    <el-card class="header-card">
      <el-button size="mini">刷新</el-button>
      <el-button size="mini" type="primary">提交</el-button>
      <div class="organization">
        <el-form label-width="100px" size="mini" :model="organization">
          <el-row :gutter="30" type="flex" justify="start" class="elRow">
            <el-form-item label="创建组织" prop="fuseOrgId" label-width="100px">
              <el-select v-model="organization.fuseOrgId" placeholder="请选择活动区域">
                <el-option
                  v-for="item in organization.fuseOrgArray"
                  :key="item.fuseOrgId"
                  :label="item.largeName"
                  :value="item.fuseOrgId"
                />
              </el-select>
            </el-form-item>
            <el-form-item label="客户名称" prop="fname">
              <el-input v-model="organization.fname" class="input-width" placeholder="请输入客户名称" />
            </el-form-item>
            <el-form-item label="客户编码" prop="fcode">
              <el-input v-model="organization.fcode" class="input-width" placeholder="请输入客户编码" disabled />
            </el-form-item>
          </el-row>
        </el-form>
      </div>
    </el-card>
    <el-tabs v-model="activeName" type="border-card">
      <el-tab-pane label="基础数据" name="customer" class="customer">
        <span class="title-background">基本信息</span>
        <div class="basic-information">
          <el-form label-width="100px" size="mini" :model="basic" class="spacing">
            <el-form-item label="国家" prop="fcountry">
              <el-input v-model="basic.fcountry" class="input-width" placeholder="请选择国家">
                <i slot="suffix" class="el-input__icon el-icon-search" />
              </el-input>
            </el-form-item>
            <el-form-item label="地区" prop="fprovincial">
              <el-input v-model="basic.fprovincial" class="input-width" placeholder="请选择地区">
                <i slot="suffix" class="el-input__icon el-icon-search" />
              </el-input>
            </el-form-item>
            <el-form-item label="省份" prop="fprovince">
              <el-input v-model="basic.fprovince" class="input-width" placeholder="请选择省份">
                <i slot="suffix" class="el-input__icon el-icon-search" />
              </el-input>
            </el-form-item>
            <el-form-item label="城市" prop="fcity">
              <el-input v-model="basic.fcity" class="input-width" placeholder="请选择城市">
                <i slot="suffix" class="el-input__icon el-icon-search" />
              </el-input>
            </el-form-item>
            <el-form-item label="通讯地址" prop="faddress">
              <el-input v-model="basic.faddress" class="input-width" placeholder="请输入通讯地址" type="textarea">
                <i slot="suffix" class="el-input__icon el-icon-search" />
              </el-input>
            </el-form-item>
            <el-form-item label="公司网站" prop="fwebsite">
              <el-input v-model="basic.fwebsite" class="input-width" placeholder="请输入公司网站" />
            </el-form-item>
          </el-form>
          <el-form label-width="100px" size="mini" :model="administration" class="spacing">
            <el-form-item label="联系电话" prop="ftel">
              <el-input v-model="administration.ftel" class="input-width" placeholder="请输入联系电话" />
            </el-form-item>
            <el-form-item label="传真" prop="ffax">
              <el-input v-model="administration.ffax" class="input-width" placeholder="请输入传真" />
            </el-form-item>
            <el-form-item label="纳税登记号" prop="ftaxregistercode">
              <el-input v-model="administration.ftaxregistercode" class="input-width" placeholder="请输入纳税登记号" />
            </el-form-item>
            <el-form-item label="公司类别" prop="fcompanyclassify">
              <el-input v-model="administration.fcompanyclassify" class="input-width" placeholder="请选择公司类别">
                <i slot="suffix" class="el-input__icon el-icon-search" />
              </el-input>
            </el-form-item>
            <el-form-item label="公司性质" prop="fcompanynature">
              <el-input v-model="administration.fcompanynature" class="input-width" placeholder="请选择公司性质">
                <i slot="suffix" class="el-input__icon el-icon-search" />
              </el-input>
            </el-form-item>
            <el-form-item label="公司规模" prop="fcompanyscale">
              <el-input v-model="administration.fcompanyscale" class="input-width" placeholder="请选择公司规模">
                <i slot="suffix" class="el-input__icon el-icon-search" />
              </el-input>
            </el-form-item>
          </el-form>
          <el-form label-width="100px" size="mini" :model="relevant" class="spacing">
            <el-form-item label="客户类别" prop="fcustTypeId">
              <el-input v-model="relevant.fcustTypeId" class="input-width" placeholder="请选择客户类别">
                <i slot="suffix" class="el-input__icon el-icon-search" />
              </el-input>
            </el-form-item>
            <el-form-item label="客户分组" prop="fgroup">
              <el-input v-model="relevant.fgroup" class="input-width" placeholder="请选择客户分组">
                <i slot="suffix" class="el-input__icon el-icon-search" />
              </el-input>
            </el-form-item>
            <el-form-item label="对应组织" prop="fcorrespondorgId">
              <el-input v-model="relevant.fcorrespondorgId" class="input-width" placeholder="请选择对应组织">
                <i slot="suffix" class="el-input__icon el-icon-search" />
              </el-input>
            </el-form-item>
            <el-form-item label="备注" prop="fdescription">
              <el-input v-model="relevant.fdescription" class="input-width" placeholder="请选择对应组织" type="textarea">
                <i slot="suffix" class="el-input__icon el-icon-search" />
              </el-input>
            </el-form-item>
          </el-form>
        </div>
        <span class="title-background">联系人</span>
        <div class="basic-information">
          <jc-contacts />
        </div>
        <span class="title-background">商务信息</span>
        <div>
          <h2>商务信息</h2>
        </div>
        <span class="title-background">银行信息</span>
        <div>
          <h2>银行信息</h2>
        </div>
      </el-tab-pane>
      <el-tab-pane label="操作记录" name="other" />
    </el-tabs>
  </div>
</template>

<script>
import JcTitle from '@/components/Title'
import JcContacts from '@/views/market/customer/createCustomer/contacts'
export default {
  name: 'CreateCustomer',
  components: {
    JcTitle,
    JcContacts
  },
  data() {
    return {
      activeName: 'customer', // 默认基本信息
      // 头部信息
      organization: {
        fuseOrgArray: [],
        fuseOrgId: '', // 创建组织
        fname: '', // 客户名称
        fcode: '' // 客户编码
      },
      // 基础数据
      basic: {
        fcountry: '', // 国家
        fprovincial: '', // 地区
        fprovince: '', // 省份
        fcity: '', // 城市
        faddress: '', // 通讯地址
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
        fcustTypeId: '', // 客户类别
        fgroup: '', // 客户分组
        fcorrespondorgId: '', // 对应组织
        fdescription: ''// 备注
      },
      // 联系人
      contacts: {
        flegalContacts: '', // 法人
        flegalTels: '', // 法人电话
        flegalMailbox: '', // 法人邮箱
        fbusinessContacts: '', // 业务联系人
        fbusinessTels: '', // 业务电话
        fbusinessMailbox: '', // 业务邮箱
        ffinanceContacts: '', // 财务联系人
        ffinanceTels: '', // 财务电话
        ffinanceMailbox: '' // 财务邮箱
      },
      // 商务信息
      business: {
        ftradingCurrId: '', // 结算币别  1
        fsaldeptId: '', // 销售部门
        fsalgroupId: '', // 销售组
        fseller: '', // 销售员
        fsettleTypeId: '', // 结算方式  1
        freccondiTionId: '', // 收款条件  1
        fpricelistid: '', // 价目表
        fdiscountlistid: '', // 折扣表
        ftransleadTime: '', // 运输提前期
        ftaxType: '', // 税分类  1
        finvoiceType: '', // 发票类型   1
        ftaxRate: '', // 默认税率  1
        fcontacts: '', // 联系人
        ftels: '', // 联系人电话
        fmailbox: ''// 联系人邮箱
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
  width: 80vw;
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
    margin-bottom: 10px;
    .organization{
      margin-top: 10px;
      display: flex;
      flex-direction: row;
    }
  }
  .customer{
    display: flex;
    flex-direction: column;
  }
  .basic-information{
    margin-top: 10px;
    display: flex;
    justify-content: space-between;
  }
    .spacing{
      width: 300px;
    }
}
</style>
