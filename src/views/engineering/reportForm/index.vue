<template>
  <div class="content">
    <iframe :src="`http://192.168.1.15:8878/Default.aspx?Name=CBMX&dockey=${parameter}`" height="1200" scrolling="auto" width="1000" frameborder="1" />
  </div>
</template>

<script>
export default {
  name: 'ReportForm',
  computed: {
    parameter() {
      return this.$route.params.id
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
