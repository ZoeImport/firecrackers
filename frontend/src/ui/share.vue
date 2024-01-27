<template>
  <div class="container">
    <div v-for="(url,i) in urls" v-show="index === i">
      <qrcode class="qrcode" :text="url"/>
      <div class="url">{{ url }}</div>
    </div>
    <div class="buttons">
      <el-button circle :icon="ArrowLeftIcon" :disabled="index <= 0" @click="index--"/>
      <el-button circle :icon="ArrowRightIcon" :disabled="index >= urls.length - 1" @click="index++"/>
    </div>
  </div>
</template>

<script setup lang="ts">
import {
  ArrowLeft as ArrowLeftIcon,
  ArrowRight as ArrowRightIcon,
} from '@element-plus/icons-vue'
import Qrcode from './qrcode.vue'
import {getUrls as apiGetUrls} from '../api/system.ts'
import {onMounted, ref} from "vue";

const urls = ref(new Array<string>())
const index = ref(0)

urls.value.push(location.href)

onMounted(() => {
  apiGetUrls().then(response => {
    if (response.data.code === 0) {
      for (const url of response.data.data) {
        if (urls.value.indexOf(url) === -1) {
          urls.value.push(url)
        }
      }
    }
  })
})

</script>

<style scoped>
.container {
  text-align: center;
}

.url {
  margin-top: 15px;
  font-size: 14px;
  word-break: break-all;
}

.qrcode {
  width: 125px;
  height: 125px;
}

.buttons {
  margin-top: 15px;
}
</style>