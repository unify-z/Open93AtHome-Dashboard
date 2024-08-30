<template>
    <div>
        <el-card style="margin-top:20px; display: grid">
            <el-button type="primary" @click="showDialog()" style="margin: 0 10px;">创建节点</el-button>
            <el-table :data="clusterlist" style="width: 100%,margin-top:10px">
              <el-table-column prop="id" label="ClusterId" width="180" />
              <el-table-column prop="name" label="节点名称" width="180" />
              <el-table-column prop="bandwidth" label="节点带宽" />
              <el-table-column prop="isBanned" label="封禁状态" />
              <el-table-column label="操作">
                  <el-button v-if="clusterlist.iaBanned === 1" type="primary" @click="unbanCluster(cluster.id)">解封</el-button>
                  <el-button v-if="clusterlist.iaBanned === 0" type="primary" @click="banCluster(cluster.id)">封禁</el-button>
                  <el-button type="danger" @click="removecluster(cluster.id)">删除</el-button>
              </el-table-column>
            </el-table>
        </el-card>
        <el-dialog v-model="dialogVisible" title="创建节点" width="50%">
            <el-form label-position="top" label-width="100px">
              <el-form-item label="节点名称">
                <el-input v-model="clusterName" placeholder="节点名称"></el-input>
              </el-form-item>
              <el-form-item label="带宽">
                <el-input v-model="bandwidth" placeholder="带宽"></el-input>
              </el-form-item>
            </el-form>
            <template #footer>
              <span class="dialog-footer">
                <el-button @click="dialogVisible = false">取消</el-button>
                <el-button type="primary" @click="createCluster">提交</el-button>
              </span>
            </template>
          </el-dialog>
    </div>
</template>

<script setup lang="js">
import { ref , onMounted} from 'vue';
import { ElMessageBox, ElMessage, ElButton, ElDialog, ElForm, ElFormItem, ElInput } from 'element-plus';
import axios from 'axios';
const dialogVisible = ref(false);
const clusterName = ref('');
const bandwidth = ref('');
const clusterlist = ref([]);
async function createCluster(){
    const url = `https://saltwood.top:9393/93AtHome/super/cluster/create`
    try {
        const response = await axios.post(url, {
        clusterName: clusterName.value,
        bandwidth: bandwidth.value,
    }, {
        withCredentials: true,
        });
        const resp = response.data;
        console.log(resp)
        ElMessageBox.alert(
            `节点创建成功, ClusterId=${resp.clusterId}, ClusterSecret=${resp.clusterSecret}`,
            '提示'
          );
        dialogVisible.value = false;
  } catch (error) {
    ElMessage.error('节点创建失败: ' + error);
    console.error(error);
  }
}
async function banCluster(){
        const url = `https://saltwood.top:9393/93AtHome/super/cluster/ban`
        try{
            await axios.post(url, {
              ban: true,
              clusterId: value,
            }, {
              withCredentials: true,
            });
            ElMessage.success('节点封禁成功');
        }catch(error){
            ElMessage.error('节点封禁失败: ' + error);
            console.log(error)
        }
    
}
async function unbanCluster(id){
      const url = `https://saltwood.top:9393/93AtHome/super/cluster/ban`
        try{
            await axios.post(url, {
              ban: false,
              clusterId: value,
            }, {
              withCredentials: true,
            });
            ElMessage.success('节点解封成功');
        }catch(error){
            ElMessage.error('节点封禁失败: ' + error);
            console.log(error)
        }
          
}
async function removecluster(id){
  ElMessageBox.confirm(
    '节点将会被删除，确定?',
    '警告',
    {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning',
    }
  )
    .then(async () => {
      try{
        const url = `https://saltwood.top:9393/93AtHome/super/cluster/remove`
        await axios.post(url, {
        clusterId: id,
    }, {
        withCredentials: true,
    });
        ElMessage.success('节点删除成功');
        fetchclusterlist();
      }catch(error){
        ElMessage.error('节点删除失败: ' + error);
  }
    })

}
async function fetchclusterlist(){
  resp = await axios.get(`https://saltwood.top:9393/93AtHome/list_clusters`, {
    withCredentials: true,
  })
  clusterlist.value = resp.data
}
function showDialog() {
  dialogVisible.value = true;
}
onMounted(() => {
  fetchclusterlist();
});

</script>
