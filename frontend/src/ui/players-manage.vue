<template>
  <div v-loading="loading">
    <header>
      <div class="header">
        <el-button :icon="RefreshIcon" v-if="!sorting" @click="fetchPlayers">刷新</el-button>
        <el-button :icon="RefreshIcon" v-if="!sorting" @click="resetPlayerNumbers">重置编号</el-button>
        <el-button :icon="SortIcon" v-if="!sorting" @click="startSorting">排序</el-button>
        <el-button v-if="sorting" @click="cancelSorting">取消</el-button>
        <el-button type="success" v-if="sorting" @click="commitSorting">确定</el-button>
      </div>
    </header>
    <transition-group tag="div" name="fade" class="list">
      <div class="item" v-for="(player,index) in (sorting ? sortingPlayers : players)" :key="player.id">
        <div class="item-inner">
          <el-tag size="large" round>{{ player.number }}</el-tag>
          <el-tag class="item-inner-online_tag" size="large" :type="player.connected ? 'success' : 'danger'">
            {{ player.connected ? '在线' : '离线' }}
          </el-tag>
          <el-tag class="item-inner-online_tag" size="large" type="warning"
                  v-if="player.id === playerGameData?.player.id">我
          </el-tag>
        </div>
        <div class="item-suffix">
          <el-popconfirm v-if="!sorting" title="确定要删除？" confirm-button-text="确定" cancel-button-text="取消"
                         @confirm="removePlayer(player.id)">
            <template #reference>
              <el-button type="danger">删除</el-button>
            </template>
          </el-popconfirm>
          <el-button v-if="sorting" :icon="ArrowUpIcon" circle @click="moveUp(index)"/>
          <el-button v-if="sorting" :icon="ArrowDownIcon" circle @click="moveDown(index)"/>
        </div>
      </div>
    </transition-group>
    <div class="tip">
      <info-filled-icon class="tip-icon"/>
      <span class="tip-text">鞭炮将按照该列表从上到下的顺序燃放</span>
    </div>
  </div>
</template>

<script setup lang="ts">
import {onMounted, ref} from 'vue'
import {storeToRefs} from 'pinia'
import {
  Refresh as RefreshIcon,
  Sort as SortIcon,
  ArrowUp as ArrowUpIcon,
  ArrowDown as ArrowDownIcon,
  InfoFilled as InfoFilledIcon
} from '@element-plus/icons-vue'
import useRoomStore from '../store/room.ts'
import {
  getPlayers as apiGetPlayers,
  removePlayer as apiRemovePlayer,
  sortPlayers as apiSortPlayers,
  resetPlayerNumbers as apiResetPlayerNumbers
} from '../api/room.ts'
import LoadingController from '../utils/loading-controller.ts'
import {PlayerDto} from '../model.ts'

const roomStore = useRoomStore()
const {playerGameData} = storeToRefs(roomStore)

const players = ref<Array<PlayerDto>>(new Array<PlayerDto>())
const sorting = ref(false)
const sortingPlayers = ref(new Array<PlayerDto>())
const loadingController = new LoadingController()
const loading = loadingController.getLoading()

const fetchPlayers = () => {
  loadingController.exec(() => apiGetPlayers()).then(response => {
    if (response.data.code === 0) {
      players.value = response.data.data
    }
  })
}

onMounted(() => {
  fetchPlayers()
})

const removePlayer = (playerId: string) => {
  loadingController.exec(() => apiRemovePlayer(playerId)).then(() => {
    fetchPlayers()
  }).catch(() => {
    fetchPlayers()
  })
}

const startSorting = () => {
  sorting.value = true
  sortingPlayers.value = players.value.slice()
}

const commitSorting = () => {
  loadingController.exec(() => apiSortPlayers(sortingPlayers.value.map<string>(player => player.id))).then(() => {
    sorting.value = false
    sortingPlayers.value = new Array<PlayerDto>()
    fetchPlayers()
  }).catch(() => {
    sorting.value = false
    sortingPlayers.value = new Array<PlayerDto>()
    fetchPlayers()
  })
}

const cancelSorting = () => {
  sorting.value = false
  sortingPlayers.value = new Array<PlayerDto>()
}

const moveUp = (index: number) => {
  if (index - 1 >= 0) {
    const temp = sortingPlayers.value[index - 1]
    sortingPlayers.value[index - 1] = sortingPlayers.value[index]
    sortingPlayers.value[index] = temp
  }
}

const moveDown = (index: number) => {
  if (index + 1 < sortingPlayers.value.length) {
    const temp = sortingPlayers.value[index + 1]
    sortingPlayers.value[index + 1] = sortingPlayers.value[index]
    sortingPlayers.value[index] = temp
  }
}

const resetPlayerNumbers = () => {
  loadingController.exec(() => apiResetPlayerNumbers()).then(() => {
    fetchPlayers()
  }).catch(() => {
    fetchPlayers()
  })
}
</script>

<style scoped>
.header {
  display: flex;
  flex-flow: row nowrap;
  justify-content: flex-end;
  align-content: center;
  align-items: center;
}

.list {
  display: flex;
  flex-flow: column nowrap;
  justify-content: flex-start;
  align-content: stretch;
  align-items: stretch;
  margin-top: 20px;
  overflow: hidden;
}

.item {
  display: flex;
  flex-flow: row nowrap;
  justify-content: flex-start;
  align-content: center;
  align-items: center;
  margin-top: 10px;
  background-color: white;
}

.item:first-child {
  margin-top: 0;
}

.item-inner {
  display: flex;
  flex-flow: row nowrap;
  justify-content: flex-start;
  align-content: center;
  align-items: center;
  flex-grow: 1;
}

.item-suffix {
  display: flex;
  flex-flow: row nowrap;
  justify-content: flex-start;
  align-content: center;
  align-items: center;
}

.item-inner-online_tag {
  margin-left: 10px;
}

.fade-move {
  transition: all 0.5s cubic-bezier(0.55, 0, 0.1, 1);
}

.tip {
  margin-top: 15px;
}

.tip-icon {
  width: 15px;
  height: 15px;
  vertical-align: middle;
}

.tip-text {
  vertical-align: middle;
  margin-left: 5px;
}
</style>