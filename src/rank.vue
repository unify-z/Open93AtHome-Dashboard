<template>
  <div class="table-container">
    <el-table :data="tableData">
      <el-table-column prop="rank" label="#" width="100">
        <template #default="{ $index }">
          {{ $index + 1 }}
        </template>
      </el-table-column>
      <el-table-column prop="clusterName" label="节点名称" />
      <el-table-column prop="hits" label="节点请求数" />
      <el-table-column prop="traffic" label="当日流量" />
      <el-table-column prop="ownerName" label="所有者">
      </el-table-column>
      <el-table-column prop="status" label="状态" />
    </el-table>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { ElTable, ElTableColumn,ElMessage } from 'element-plus';
import axios from 'axios';
function formatCommas(num) {
  return num.toLocaleString();
}

function formatUnits(value) {
  let mbValue = value / 1024 / 1024;
  let gbValue = mbValue / 1024;
  let tbValue = gbValue / 1024;

  if (tbValue >= 1) {
    return `${tbValue.toFixed(2)}TB`;
  }
  if (gbValue >= 1) {
    return `${gbValue.toFixed(2)}GB`;
  } else {
    return `${mbValue.toFixed(2)}MB`;
  }
}

const tableData = ref([]);

async function fetchData() {
  try {
    const response = await axios.get('https://saltwood.top:9393/93AtHome/rank');
    const data = response.data;;
    
    tableData.value = data.map((item, index) => {
      let hits = '0';
      let traffic = '0';
      let status = '';

      try {
        hits = formatCommas(item.hits || 0);
      } catch (error) {
        console.error('Error formatting hits:', error);
      }

      try {
        traffic = formatUnits(item.traffic || 0);
      } catch (error) {
        console.error('Error formatting traffic:', error);
      }

      try {
        status = item.isOnline ? '正常工作' : (item.isBanned ? '被封禁' : '离线');
      } catch (error) {
        console.error('Error determining status:', error);
      }

      return {
        rank: index + 1,
        clusterName: item.clusterName || 'null',
        hits,
        traffic,
        bandwidth: item.bandwidth || 0,
        measureBandwidth: item.measureBandwidth || 0,
        pendingTraffic: item.pendingTraffic || 0,
        pendingHits: item.pendingHits || 0,
        status,
        ownerName: item.ownerName || 'null'
      };
    });
  } catch (error) {
    console.error('Failed to fetch data:', error);
    ElMessage({
      message: '拉取数据失败：'+ error,
      type: 'error'
  });
  }
}

onMounted(() => {
  fetchData();
});
</script>

<style scoped>
.table-container {
  width: 80%; 
  margin: 20px auto; 
  background-color: #fff; 
  border-radius: 8px; 
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
}
.table-container{
  background-color: #333!important;
  border-color:#333!important 
}

</style>
