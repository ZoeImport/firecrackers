<template>
  <stage class="stage" strand-type="none"/>
  <ui/>
</template>

<script setup lang="ts">
import stage from './stage/index.vue'
import ui from './ui/index.vue'
</script>

<style scoped>
.stage {
  position: fixed;
  left: 0;
  top: 0;
  width: 100%;
  height: 100%;
}
</style>

<style>
.el-dialog__body {
  padding-top: 10px !important;
}
</style>
