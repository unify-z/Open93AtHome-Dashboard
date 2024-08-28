<template>
    <div>
        <el-card style="margin-top:20px; display: grid; place-items: center;">
            <el-button type="primary" @click="showDialog()" style="margin: 0 10px;">创建节点</el-button>
            <el-button type="primary" @click="banCluster()" style="margin: 0 10px;">封禁节点</el-button>
            <el-button type="primary" @click="unbanCluster()" style="margin: 0 10px;">解封节点</el-button>
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
import { ref } from 'vue';
import { ElMessageBox, ElMessage, ElButton, ElDialog, ElForm, ElFormItem, ElInput } from 'element-plus';
import axios from 'axios';
const dialogVisible = ref(false);
const clusterName = ref('');
const bandwidth = ref('');
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
        ElMessageBox.alert(`节点创建成功,ClusterId=${resp.clusterId},ClusterSecret=${resp.clusterSecret}`, '提示');
        dialogVisible.value = false;
  } catch (error) {
    ElMessage.error('节点创建失败: ' + error);
    console.error(error);
  }
}
function banCluster(){
    ElMessageBox.prompt('输入要封禁的节点Id', '提示', {
    confirmButtonText: '提交',
    cancelButtonText: '取消',
    placeholder: 'ClusterId'
  })
    .then(async ({ value }) => {
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
      
    })
}
function unbanCluster(){
    ElMessageBox.prompt('输入要解封的节点Id', '提示', {
    confirmButtonText: '提交',
    cancelButtonText: '取消',
    placeholder: 'ClusterId'
  })
    .then(async ({ value }) => {
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
      
    })
}
function showDialog() {
  dialogVisible.value = true;
}

</script>
