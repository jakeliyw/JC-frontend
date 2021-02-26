<template>
  <div class="content">
    <iframe :src="`http://202.105.191.50:8878/Default.aspx?Name=SalErrorOrder&dockey=${id}`" height="500" scrolling="auto" width="1200" frameborder="1" />
  </div>
</template>

<script>
export default {
  name: 'ReportForm',
  data() {
    return {
      id: this.$route.params.id
    }
  }
}
</script>

<style scoped lang="scss">
.content{
  display: flex;
  justify-content: center;
}
</style>
