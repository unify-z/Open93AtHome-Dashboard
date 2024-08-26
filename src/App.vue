<template>
  <div class="layout-container">
    <el-menu
      :default-active="activeIndex"
      class="el-menu-demo"
      mode="horizontal"
      :ellipsis="false"
      @select="handleSelect"
    >
      <el-menu-item index="0">
        <el-text class="mx-1" type="primary">93@Home-Dash</el-text>
      </el-menu-item>
      <el-menu-item index="1" @click="router.push('/')">主页</el-menu-item>
      <el-menu-item index="2" @click="router.push('/rank')">排行榜</el-menu-item> 
      <el-menu-item index="3" @click="router.push('/myclusters')">我的节点</el-menu-item>
      <el-menu-item>
          <el-button @click="switchThemes()">
            <el-icon><Moon/></el-icon>
          </el-button>
      </el-menu-item>
      <el-menu-item>
        <el-button v-if="!isTokenPresent()" @click="router.push('/auth/login')" type="primary">登录</el-button>
        <div v-else style="display: flex; align-items: center;">
          <img :src="userInfo.avatar_url" alt="Avatar" style="width: 40px; height: 40px; border-radius: 50%;">
          <span style="margin-left: 8px;">{{ userInfo.login }}</span>
        </div>
      </el-menu-item>
    </el-menu>
    <router-view></router-view>
  </div>
</template>

<script lang="ts" setup>
import { Moon } from '@element-plus/icons-vue'
import {ElMessage} from 'element-plus'
import { useRouter } from 'vue-router'
import { ref, onMounted  } from 'vue'
import 'element-plus/theme-chalk/dark/css-vars.css'
import {useDark, useToggle} from '@vueuse/core'
import axios from 'axios'
import Cookies from 'js-cookie'

const activeIndex = ref('1')
const router = useRouter()

const isTokenPresent = (): boolean => {
  const token = Cookies.get('token');
  return !!token; 
}

const userInfo = ref({
  avatar_url: '',
  login: ''
})

const getuserinfo = async () => {
  try {
    const response = await axios.get('https://saltwood.top:9393/93AtHome/dashboard/user/profile', {
      withCredentials: true,
    });
    userInfo.value = response.data;
  } catch (error) {
    console.error('Error:', error);
  }
};

const handleSelect = (key: string, keyPath: string[]) => {
  console.log(key, keyPath)
}

const toggledarkmode = useToggle(useDark())
const isDarkMode = useDark()
const switchThemes = () => {
  console.log(isDarkMode.value)
  if (isDarkMode.value) {
    ElMessage({
      message: '已切换为浅色模式',
      type: 'success'
    });
  } else if (!isDarkMode.value) {
    ElMessage({
      message: '已切换为深色模式',
      type: 'success'
    });
  }
  toggledarkmode()
}

onMounted(() => {
  if (isTokenPresent()) {
    getuserinfo();
  }
})
</script>

<style>
.layout-container {
  display: flex;
  flex-direction: column;
}

.el-menu-demo {
  width: 100%;
}

.el-menu--horizontal > .el-menu-item:nth-child(1) {
  margin-right: auto; 
}
</style>