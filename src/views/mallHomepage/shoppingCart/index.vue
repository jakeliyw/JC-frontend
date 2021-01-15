<template>
  <div class="content">
    <img :src="require('@/assets/img/development.png')" alt="">
    <h2 class="text">程序员拼命开发中……</h2>
  </div>
</template>

<script>
export default {
  name: 'Index'
}
</script>

<style scoped lang="scss">
.content{
  display: flex;
  justify-content: center;
  flex-direction: column;
  align-items: center;
  .text{
    color: rgb(247,151,30);
  }
}
</style>
