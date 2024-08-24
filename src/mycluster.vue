<template>
  <div>
    <el-row :gutter="20">
      <el-col :span="8" v-for="cluster in clusters" :key="cluster.clusterId">
        <el-card>
          <div class="card-title font-weight-black white-text">
            {{ cluster.clusterName }}
          </div>
          <el-divider></el-divider>
          <div class="card-text">
            <p>clusterId:{{ cluster.clusterId }}</p>
            <p>EndPoint:{{ cluster.endPoint }}</p>
          </div>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { ElMessageBox, ElMessage } from 'element-plus';
import axios from 'axios';
import { useRouter } from 'vue-router';

const router = useRouter();
const clusters = ref([]);

function getCookie(name) {
  let cookieArr = document.cookie.split(';');
  
  for (let i = 0; i < cookieArr.length; i++) {
    let cookiePair = cookieArr[i].trim();
    if (cookiePair.indexOf(name + '=') === 0) {
      return cookiePair.substring(name.length + 1, cookiePair.length);
    }
  }
  
  return null;
}

function main() {
  const token = getCookie('token');
  if (token) {
    console.log('Token:', token);
    fetchClusters();
  } else {
    ElMessageBox.alert('用户未登录', '提示', {
      confirmButtonText: '去登录',
      callback: () => {
        router.push('/auth/login');
      },
    });
  }
}

async function fetchClusters() {
  try {
    const response = await axios.get('https://saltwood.top:9393/93AtHome/dashboard/user/clusters', {
      withCredentials: true,
    });
    clusters.value = response.data;
  } catch (error) {
    ElMessage.error('获取节点信息失败');
    console.error(error);
  }
}

onMounted(() => {
  main();
});
</script>

<style scoped>
.card-title {
  font-weight: bold;
  background-color: red;
  color: white;
  padding: 16px;
}

.card-text {
  padding: 16px;
}
</style>
