<template>
  <el-form ref="formEl" label-width="75" :model="form" v-loading="loading">
    <el-form-item prop="username" label="用户名" :rules="[{required:true, message:'用户名不能为空'}]">
      <el-input v-model="form.username"/>
    </el-form-item>
    <el-form-item prop="password" label="密码" :rules="[{required:true, message:'密码不能为空'}]">
      <el-input v-model="form.password" show-password/>
    </el-form-item>
    <el-form-item>
      <el-button type="primary" @click="submit">提交</el-button>
    </el-form-item>
  </el-form>
</template>

<script setup lang="ts">
import {ref} from 'vue'
import useAuthenticationStore from '../store/authentication.ts'
import useRoomStore from '../store/room.ts'
import LoadingController from "../utils/loading-controller.ts"

const authenticationStore = useAuthenticationStore()
const roomStore = useRoomStore()

const loadingController = new LoadingController()
const loading = loadingController.getLoading()

const formEl = ref()
const form = ref({
  username: '',
  password: ''
})

const submit = () => {
  formEl.value?.validate((valid: boolean) => {
    if (valid) {
      loadingController.exec(() => authenticationStore.login(form.value.username, form.value.password)).then(() => {
        roomStore.connect()
      })
    }
  })
}
</script>

<style scoped>
</style>