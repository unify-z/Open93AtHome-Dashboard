<template>
  <div>
    <el-button type="primary" @click="bindCluster" class="bind-button">绑定节点</el-button>
    <el-col :span="8" v-for="cluster in clusters" :key="cluster.clusterId">
      <el-card class="card" :body-style="{ padding: '0px' }">
        <template #header>
          <div class="card-header">
            <span v-if="isenabled(cluster)" class="card-title font-weight-black" style="text-align: left;">
              ✅ {{ cluster.clusterName }}
            </span>
            <span v-else class="card-title font-weight-black" style="text-align: left;">
              ❌ {{ cluster.clusterName }}
            </span>
          </div>
        </template>
        <div>
          <div class="card-text">
            ID<br />
            {{ cluster.clusterId }}
          </div>
          <div class="card-text">
            Endpoint<br />
            {{ cluster.endPoint || 'null' }}
          </div>
          <div class="card-text">
            上行带宽<br />
            {{ cluster.bandwidth }}
          </div>
          <div class="card-text">
            创建日期<br />
            {{ cluster.createdAt || 'null' }}
          </div>
          <div class="card-button">
            <el-button @click="showcluster(cluster.clusterId)">
              <el-icon>
                <InfoFilled />
              </el-icon>
              查看节点详细
            </el-button>
            <el-button @click="showEditDialog(cluster.clusterId)">
              <el-icon>
                <Setting />
              </el-icon>
              修改节点信息
            </el-button>
            <el-button type="danger" @click="unbindcluster(cluster.clusterId)">
              <el-icon><Delete /></el-icon>
              解绑节点
            </el-button>
          </div>
        </div>
      </el-card>
    </el-col>
    <el-dialog v-model="dialogVisible" title="修改节点信息" width="50%">
      <el-form label-position="top" label-width="100px">
        <el-form-item label="节点名称">
          <el-input v-model="clusterName" placeholder="节点名称"></el-input>
        </el-form-item>
        <el-form-item label="带宽">
          <el-input v-model="bandwidth" placeholder="带宽"></el-input>
        </el-form-item>
        <el-form-item label="赞助商">
          <el-input v-model="sponsor" placeholder="赞助商"></el-input>
        </el-form-item>
        <el-form-item label="赞助商网址">
          <el-input v-model="sponsorUrl" placeholder="赞助商网址"></el-input>
        </el-form-item>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="dialogVisible = false">取消</el-button>
          <el-button type="primary" @click="handleEditSubmit">提交</el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, onMounted, h } from 'vue';
import { ElMessageBox, ElMessage, ElButton, ElDialog, ElForm, ElFormItem, ElInput } from 'element-plus';
import axios from 'axios';
import { useRouter } from 'vue-router';

const router = useRouter();
const clusters = ref([]);
const dialogVisible = ref(false);
const clusterIdToEdit = ref(null);
const clusterName = ref('');
const bandwidth = ref('');
const sponsor = ref('');
const sponsorUrl = ref('');

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
async function showcluster(id) {
  const url = `https://saltwood.top:9393/93AtHome/dashboard/user/clusters?clusterId=${id}`
  const response = await axios.get(url, {
    withCredentials: true
  });
  const resp = response.data;
  console.log(resp);


  ElMessageBox.alert(`
节点名称: ${resp.clusterName || 'null'}<br>
ID: ${resp.clusterId}<br>
Endpoint: ${resp.Endpoint || 'null'}<br>
Port: ${resp.port || 'null'}<br>
节点带宽: ${resp.bandwidth || 'null'}<br>
实际测量带宽: ${resp.measureBandwidth || 'null'}<br>
所有者: ${resp.owner || 'null'}<br>
赞助商: ${resp.sponsor || 'null'}<br>
赞助商网址: ${resp.sponsorUrl || 'null'}<br>
创建日期: ${resp.createdAt || 'null'}<br>
状态: ${resp.isOnline ? '启用' : '离线'}<br>
离线原因: ${resp.downreason}<br>
请求数: ${resp.hits}<br>
流量: ${resp.traffic}<br>
待处理请求数: ${resp.pendingHits}<br>
待处理流量: ${resp.pendingTraffic}<br>
`, '节点详细信息', {
    dangerouslyUseHTMLString: true,
    confirmButtonText: '确定',
  });
}

async function editcluster(id) {
  const url = `https://saltwood.top:9393/93AtHome/dashboard/user/cluster/profile?clusterId=${id}`;
  try {
    await axios.post(url, {
      clusterName: clusterName.value,
      bandwidth: bandwidth.value,
      sponsor: sponsor.value,
      sponsorUrl: sponsorUrl.value,
    }, {
      withCredentials: true,
    });

    ElMessage.success('信息修改成功');
    dialogVisible.value = false;
    fetchClusters();
  } catch (error) {
    ElMessage.error('信息修改失败: ' + error);
    console.error(error);
  }
}
function unbindcluster(id){
  const url = `https://saltwood.top:9393/93AtHome/dashboard/user/unbindCluster`;
  try {
    ElMessageBox.confirm(
      '此操作不可逆,是否继续?',
      'Warning',
      {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
    }
  )
      .then(async () => {
        await axios.post(url,{
          clusterId:id
        })
        ElMessage({
          type: 'success',
          message: '解绑成功',
      })
    })
  } catch (error) {
      ElMessage({
        type: 'error',
        message: '解绑失败:'+error,
  })
  }
}
function showEditDialog(id) {
  clusterIdToEdit.value = id;
  dialogVisible.value = true;
}

function handleEditSubmit() {
  editcluster(clusterIdToEdit.value);
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
        router.push('/dashboard/auth/login');
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

function isenabled(cluster) {
  return cluster.isOnline === 'online';
}
onMounted(() => {
  main();
});

</script>

<style scoped>
.card-title {
  font-weight: bold;
  padding: 16px;
}

.card-button {
  display: flex;
  align-items: center;
  margin-bottom: 10px;
  margin-left: 15px
}

.card {
  margin-top: 15px;
  margin-left: 10px;
}

.card-text {
  border: 1px solid #ccc;
  /* 设置边框宽度、样式和颜色 */
  padding: 16px;
  /* 设置内部填充 */
  margin: 16px;
  /* 设置外边距 */

}

.bind-button {
  margin-top: 20px;
  margin-left: 10px;
}


.el-dialog__header {
  display: flex;
  justify-content: center;
  align-items: center;
}

.el-input {
  width: 100%;
}</style>