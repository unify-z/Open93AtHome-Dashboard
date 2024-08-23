<template>
  <div>
    <el-row :gutter="20">
      <el-col :span="6">
        <el-card class="card-margin">
          <div slot="header" class="clearfix">
            <span>在线节点数</span>
          </div>
          <div>{{ data.currentNodes }}</div>
        </el-card>
      </el-col>
      <el-col :span="6">
        <el-card class="card-margin">
          <div slot="header" class="clearfix">
            <span>今日请求数</span>
          </div>
          <div>{{ formatCommas(data.hits) }}</div>
        </el-card>
      </el-col>
      <el-col :span="6">
        <el-card class="card-margin">
          <div slot="header" class="clearfix">
            <span>今日流量</span>
          </div>
          <div>{{ formatUnits(data.bytes) }}</div>
        </el-card>
      </el-col>
      <el-col :span="6">
        <el-card class="card-margin">
          <div slot="header" class="clearfix">
            <span>出网带宽</span>
          </div>
          <div>{{ formatCommas(data.bandwidth) }} Mbps</div>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import { ref, onMounted } from 'vue';

export default {
  setup() {
    const data = ref({
      currentNodes: 0,
      hits: 0,
      bytes: 0,
      bandwidth: 0,
    });

    const formatCommas = (num) => {
      return num.toLocaleString();
    };

    const formatUnits = (value) => {
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
    };

    const populatedash = (newData) => {
      if (newData) {
        data.value.currentNodes = newData.currentNodes ?? 0;
        data.value.hits = newData.hits;
        data.value.bytes = newData.bytes;
        data.value.bandwidth = newData.bandwidth;
      } else {
        console.error("populatedash: Received undefined data");
      }
    };

    const fetchData = () => {
      fetch('http://ganzhou-eb7c59a5.ofalias.net:57544/v1/dashboard')
        .then((response) => response.json())
        .then((newData) => {
          console.log('Fetched data:', newData);
          populatedash(newData);
        })
        .catch((error) => {
          console.error('Error:', error);
        });
    };

    onMounted(() => {
      fetchData();
    });

    return {
      data,
      formatCommas,
      formatUnits,
      populatedash,
    };
  },
};
</script>

<style scoped>
.card-margin {
  margin-top: 20px; /* 控制离顶端的距离 */
}
.el-card__header {
  font-weight: bold;
}
</style>
