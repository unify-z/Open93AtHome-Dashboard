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
      <el-menu-item index="1" @click="navigateTo('/')">主页</el-menu-item>
      <el-menu-item index="2" @click="navigateTo('/rank')">排行榜</el-menu-item> 
      <el-menu-item index="3" @click="navigateTo('/my/clusters')">我的节点</el-menu-item>
      <el-menu-item>
          <el-button @click="switchThemes()">
            <el-icon><moon/></el-icon>
          </el-button>
      </el-menu-item>
      <el-menu-item>
          <el-button @click="navigateTo('/auth/login')" type="primary">登录</el-button>
        </el-menu-item>

    </el-menu>
    <router-view v-wechat-title="$route.meta.title"></router-view>
  </div>
</template>


<script lang="ts" setup>
import { Moon } from '@element-plus/icons-vue'
import {ElementPlus,ElMessage} from 'element-plus'
import { useRouter } from 'vue-router'
import { ref, onMounted  } from 'vue'
const activeIndex = ref('1')
import 'element-plus/theme-chalk/dark/css-vars.css'
import {useDark, useToggle} from '@vueuse/core'
const router = useRouter()

const navigateTo = (path: string) => {
  router.push(path)
}

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