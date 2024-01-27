<template>
  <div class="root-container container">
    <div class="item">
      <el-popover placement="left" :width="250" :visible="!collapsed && popoverHelpStep === 1">
        <template #reference>
          <el-tag size="large" round>{{ playerGameData ? playerGameData.player.number : '离线' }}</el-tag>
        </template>
        <template #default>
          <div>当前玩家序号</div>
          <footer class="popover-footer">
            <el-button size="small" @click="popoverHelpStep = 0">关闭</el-button>
            <el-button type="primary" size="small" @click="popoverHelpStep++">下一个</el-button>
          </footer>
        </template>
      </el-popover>
    </div>
    <div class="item">
      <el-popover placement="left" :width="250" :visible="!collapsed && popoverHelpStep === 2">
        <template #reference>
          <el-button circle @click="toggleCollapse" :icon="collapse ? ArrowUpIcon : ArrowDownIcon"/>
        </template>
        <template #default>
          <div>折叠/展开</div>
          <footer class="popover-footer">
            <el-button size="small" @click="popoverHelpStep = 0">关闭</el-button>
            <el-button type="info" size="small" @click="popoverHelpStep--">上一个</el-button>
            <el-button type="primary" size="small" @click="popoverHelpStep++">下一个</el-button>
          </footer>
        </template>
      </el-popover>
    </div>
    <transition name="collapse" @after-enter="collapsed = false" @before-leave="collapsed = true">
      <div class="item container" v-show="!collapse">
        <div class="item">
          <el-popover placement="left" :width="250" :visible="!collapsed && popoverHelpStep === 3">
            <template #reference>
              <el-button :icon="FullScreenIcon" circle :type="isFullscreen ? 'primary' : null"
                         @click="fullScreenStore.toggleFullScreen()"/>
            </template>
            <template #default>
              <div>全屏</div>
              <footer class="popover-footer">
                <el-button size="small" @click="popoverHelpStep = 0">关闭</el-button>
                <el-button type="info" size="small" @click="popoverHelpStep--">上一个</el-button>
                <el-button type="primary" size="small" @click="popoverHelpStep++">下一个</el-button>
              </footer>
            </template>
          </el-popover>
        </div>
        <div class="item">
          <el-popover placement="left" :width="250" :visible="!collapsed && popoverHelpStep === 4">
            <template #reference>
              <el-button :icon="SunnyIcon" circle :type="isNoSleepEnabled ? 'primary' : null"
                         @click="noSleepStore.toggleNoSleep()"/>
            </template>
            <template #default>
              <div>防止熄屏</div>
              <footer class="popover-footer">
                <el-button size="small" @click="popoverHelpStep = 0">关闭</el-button>
                <el-button type="info" size="small" @click="popoverHelpStep--">上一个</el-button>
                <el-button type="primary" size="small" @click="popoverHelpStep++">下一个</el-button>
              </footer>
            </template>
          </el-popover>
        </div>
        <div class="item">
          <el-popover placement="left" :width="250" :visible="!collapsed && popoverHelpStep === 5">
            <template #reference>
              <el-button :icon="BellIcon" circle @click="emit('click', 'audioTest')"/>
            </template>
            <template #default>
              <div>声音测试</div>
              <footer class="popover-footer">
                <el-button size="small" @click="popoverHelpStep = 0">关闭</el-button>
                <el-button type="info" size="small" @click="popoverHelpStep--">上一个</el-button>
                <el-button type="primary" size="small" @click="popoverHelpStep++">下一个</el-button>
              </footer>
            </template>
          </el-popover>
        </div>
        <div class="item">
          <el-popover placement="left" :width="250" :visible="!collapsed && popoverHelpStep === 6">
            <template #reference>
              <el-button :icon="IphonIcon" circle @click="emit('click', 'playerManage')"/>
            </template>
            <template #default>
              <div>玩家管理</div>
              <footer class="popover_help-footer">
                <el-button size="small" @click="popoverHelpStep = 0">关闭</el-button>
                <el-button type="info" size="small" @click="popoverHelpStep--">上一个</el-button>
                <el-button type="primary" size="small" @click="popoverHelpStep++">下一个</el-button>
              </footer>
            </template>
          </el-popover>
        </div>
        <div class="item">
          <el-popover placement="left" :width="250" :visible="!collapsed && popoverHelpStep === 7">
            <template #reference>
              <el-button :icon="RefreshIcon" circle @click="emit('click', 'resetStrands')"/>
            </template>
            <template #default>
              <div>重置鞭炮</div>
              <footer class="popover_help-footer">
                <el-button size="small" @click="popoverHelpStep = 0">关闭</el-button>
                <el-button type="info" size="small" @click="popoverHelpStep--">上一个</el-button>
                <el-button type="primary" size="small" @click="popoverHelpStep++">下一个</el-button>
              </footer>
            </template>
          </el-popover>
        </div>
        <div class="item">
          <el-popover placement="left" :width="250" :visible="!collapsed && popoverHelpStep === 8">
            <template #reference>
              <el-button :icon="ShareIcon" circle @click="emit('click', 'share')"/>
            </template>
            <template #default>
              <div>分享</div>
              <footer class="popover_help-footer">
                <el-button size="small" @click="popoverHelpStep = 0">关闭</el-button>
                <el-button type="info" size="small" @click="popoverHelpStep--">上一个</el-button>
              </footer>
            </template>
          </el-popover>
        </div>
      </div>
    </transition>
    <div class="item">
      <el-button circle @click="showPopoverHelp">?</el-button>
    </div>
  </div>
</template>

<script setup lang="ts">
import {ref} from 'vue'
import {storeToRefs} from 'pinia'
import {
  FullScreen as FullScreenIcon,
  Sunny as SunnyIcon,
  Bell as BellIcon,
  Iphone as IphonIcon,
  Refresh as RefreshIcon,
  Share as ShareIcon,
  ArrowUp as ArrowUpIcon,
  ArrowDown as ArrowDownIcon
} from '@element-plus/icons-vue'
import useFullScreenStore from '../store/full-screen.ts'
import useNoSleepStore from '../store/no-sleep.ts'
import useRoomStore from '../store/room.ts'

const emit = defineEmits<{
  (e: 'click', name: 'audioTest' | 'playerManage' | 'resetStrands' | 'share'): void,
}>()

const roomStore = useRoomStore()
const {playerGameData} = storeToRefs(roomStore)
const fullScreenStore = useFullScreenStore()
const {isFullscreen} = storeToRefs(fullScreenStore)
const noSleepStore = useNoSleepStore()
const {isNoSleepEnabled} = storeToRefs(noSleepStore)

const collapse = ref(true)
const collapsed = ref(true)

const popoverHelpStep = ref(0)

const toggleCollapse = () => {
  if (collapse.value) {
    collapse.value = false
  } else {
    collapse.value = true
    popoverHelpStep.value = 0
  }
}

const showPopoverHelp = () => {
  collapse.value = false
  popoverHelpStep.value = 1
}
</script>

<style scoped>
.root-container {
  position: fixed;
  right: 10px;
  bottom: 10px;
}

.container {
  display: flex;
  flex-flow: column nowrap;
  justify-content: flex-end;
  align-content: center;
  align-items: center;
  overflow: hidden;
}

.item {
  margin-top: 10px;
}

.item:first-child {
  margin-top: 0;
}

.collapse-enter-active,
.collapse-leave-active {
  transition: all 0.5s;
}

.collapse-enter-to,
.collapse-leave-from {
  height: 242px;
  margin-top: 10px;
}

.collapse-enter-from,
.collapse-leave-to {
  height: 0;
  margin-top: 0;
}

.popover_help-footer {
  margin-top: 10px;
}
</style>