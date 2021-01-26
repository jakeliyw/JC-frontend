<template>
  <div class="content">
    <jc-title />
    <el-tabs type="border-card">
      <el-tab-pane label="利润报表">
        <div class="header">
          <div class="header-name">
            <span class="parentItemNo">部门</span>
            <el-select v-model="value" placeholder="请输入部门" size="small" class="input-content">
              <el-option
                v-for="item in options"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              />
            </el-select>
            <span class="parentItemNo">交货日期</span>
            <el-date-picker
              v-model="dateValue"
              size="small"
              type="daterange"
              class="input-content"
              value-format="yyyy-MM-dd"
              range-separator="至"
              start-placeholder="开始日期"
              end-placeholder="结束日期"
            />
            <el-button type="primary" class="btn" size="small" @click="browse">浏览</el-button>
          </div>
        </div>
        <div class="iframe-content">
          <iframe
            :src="url"
            height="1000"
            scrolling="auto"
            width="1500"
            frameborder="1"
          />
        </div>
      </el-tab-pane>
      <el-tab-pane label="基准价报表">基准价报表</el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>
import jcTitle from '@/components/Title/index'
export default {
  name: 'Index',
  components: {
    jcTitle
  },
  data() {
    return {
      url: '',
      dateValue: '',
      value: '',
      options: [
        { label: '内销', value: 'NX' },
        { label: '外销', value: 'WX' }
      ]
    }
  },
  methods: {
    browse() {
      const START = this.dateValue[0]
      const END = this.dateValue[1]
      this.url = `http://202.105.191.50:8878/Reprot.aspx?Name=SalPriceInfo&dockey=${this.value}&sd=${START}&ed=${END}`
    }
  }
}
</script>

<style scoped lang="scss">
.content {
  @include listBom;
}
.iframe-content{
  margin: 20px 0;
  display: flex;
  justify-content: center;
}
</style>
