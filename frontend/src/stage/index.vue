<template>
  <div ref="canvasContainer">
    <canvas ref="canvas"></canvas>
  </div>
</template>

<script setup lang="ts">
import {onMounted, onBeforeUnmount, watchEffect, shallowRef} from 'vue'
import {storeToRefs} from 'pinia'
import Stage from './stage.ts'
import useRoomStore from '../store/room.ts'
import {igniteStrands as apiIgniteStrands} from '../api/room.ts'

const roomStore = useRoomStore()
const {playerGameData} = storeToRefs(roomStore)

const canvasContainer = shallowRef()
const canvas = shallowRef()
let stage: Stage | null = null

const resizeObserver = new ResizeObserver(() => {
  stage?.resize(canvasContainer.value.clientWidth, canvasContainer.value.clientHeight)
})

onMounted(() => {
  stage = new Stage({
    canvas: canvas.value,
    width: canvasContainer.value.clientWidth,
    height: canvasContainer.value.clientHeight,
    strandType: 'none'
  })
  stage.addStrandCatchFireListener(() => {
    apiIgniteStrands()
  })
  resizeObserver.observe(canvasContainer.value)
  watchEffect(() => {
    if (stage) {
      if (playerGameData.value) {
        if (stage.getStandType() !== playerGameData.value.strandType || (!playerGameData.value.strandStatus.ignited && stage.isStrandIgnited())) {
          stage.reset(playerGameData.value.strandType)
        }
        if (playerGameData.value.strandStatus.finished) {
          if (!stage.isStrandIgnited() || stage.getStrandPercent() < 0.95) {
            stage.strandForwardToLast()
          }
        } else if (playerGameData.value.strandStatus.ignited) {
          const percent = (playerGameData.value.timeStamp - playerGameData.value.strandStatus.igniteTime!) / playerGameData.value.strandStatus.duration!
          if (!stage.isStrandIgnited() || Math.abs(percent - stage.getStrandPercent()) > 0.5) {
            stage.igniteStrand(playerGameData.value.strandStatus.duration!, percent)
          }
        }
      } else {
        stage.reset('none')
      }
    }
  })
})

onBeforeUnmount(() => {
  resizeObserver.unobserve(canvasContainer.value)
  stage?.dispose()
})
</script>

<style scoped>
</style>