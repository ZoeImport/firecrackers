<template>
  <img :src="qrcodeDataUrl"/>
</template>

<script setup lang="ts">
import {onMounted, ref, watchEffect} from 'vue'
import {toDataURL} from 'qrcode/lib/browser.js'

const props = defineProps<{
  text: string
}>()

const qrcodeDataUrl = ref('')

onMounted(() => {
  watchEffect(() => {
    toDataURL(props.text, {
      width: 256,
      margin: 0
    }, (error, url) => {
      if (!error) {
        qrcodeDataUrl.value = url
      }
    })
  })
})
</script>

<style scoped>
</style>