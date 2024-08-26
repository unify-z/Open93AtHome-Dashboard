<template>
  <div>
    <el-button type="primary" @click="bindCluster" class="bind-button">绑定节点</el-button>
    <el-row :gutter="20">
      <el-col :span="8" v-for="cluster in clusters" :key="cluster.clusterId">
        <el-card :class="{'card-online': isOnline(cluster), 'card-offline': !isOnline(cluster)}">
          <div class="card-title font-weight-black white-text">
            {{ cluster.clusterName }}
          </div>
          <el-divider></el-divider>
          <div class="card-text">
            <p>ID: {{ cluster.clusterId }}</p>
            <p>EndPoint: {{ cluster.endPoint }}</p>
            <p>上传速率: {{ cluster.bandwidth }}</p>
            <p>创建日期: {{ cluster.createdAt }}</p>
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

async function bindCluster() {
  try {
    const { value } = await ElMessageBox.prompt('请输入你的ClusterId和Secret', '绑定节点', {
      confirmButtonText: '绑定',
      cancelButtonText: '取消',
      inputPattern: /^.+$/,
      inputErrorMessage: '输入不能为空',
      inputPlaceholder: 'ClusterId,ClusterSecret',
    });

    const [clusterId, clusterSecret] = value.split(',');

    await axios.post('https://saltwood.top:9393/93AtHome/dashboard/user/bindCluster', {
        clusterId: clusterId,
        clusterSecret: clusterSecret,
      }, {
        withCredentials: true,
      });

    ElMessage.success('节点绑定成功');
    fetchClusters(); 
  } catch (error) {
    ElMessage.error('节点绑定失败: ' + error);
    console.error(error);
  }
}

function isOnline(cluster) {

  return cluster.isOnline === 'online'; 
}

onMounted(() => {
  main();
});
</script>

<style scoped>
.card-title {
  font-weight: bold;
  color: white;
  padding: 16px;
}
.card {
  margin-top: 10px;
  margin-left: 10px;
}
.card-text {
  padding: 16px;
}
.bind-button {
  margin-top: 20px;
  margin-left: 10px;
}

.card-online {
  background-color: #00cc66; 
}

.card-offline {
  background-color: #ff6666;
}
</style>
