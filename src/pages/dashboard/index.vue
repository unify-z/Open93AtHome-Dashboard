<template>
  <el-row :gutter="20">
    <el-col :span="12">
      <el-card style="margin-top: 20px;">
        <el-row>
          <el-col :span="24">
            <div ref="hitsChart" style="width: 100%; height: 250px;"></div>
          </el-col>
        </el-row>
      </el-card>
    </el-col>
    <el-col :span="12">
      <el-card style="margin-top: 20px;">
        <el-row>
          <el-col :span="24">
            <div ref="bytesChart" style="width: 100%; height: 250px;"></div>
          </el-col>
        </el-row>
      </el-card>
    </el-col>
  </el-row>
</template>
<script setup>
import { ref, onMounted } from 'vue';
import axios from 'axios';
import * as echarts from 'echarts';
import {useDark, useToggle} from '@vueuse/core';
const isDarkMode = useDark();
import {ElMessage} from 'element-plus';
const hitsChart = ref(null);
const bytesChart = ref(null);

const initHitsChart = (dailyHits) => {
  if (hitsChart.value) {
    const chartInstance = echarts.init(hitsChart.value);
    const option = {
      title: { text: '日请求数' ,textStyle: { color: isDarkMode.value ? '#ffffff' : '#000000' }},
      xAxis: { type: 'category', data: Array.from({ length: dailyHits.length }, (_, i) => `${i + 1}`) },
      yAxis: { type: 'value' },
      series: [{ name: '日请求数', type: 'line', data: dailyHits}],
    };
    chartInstance.setOption(option);
  }
};

const initBytesChart = (dailyBytes) => {
  if (bytesChart.value) {
    const chartInstance = echarts.init(bytesChart.value);
    const option = {
      title: { text: '日流量', textStyle: { color: isDarkMode.value ? '#ffffff' : '#000000' }},
      xAxis: { type: 'category', data: Array.from({ length: dailyBytes.length }, (_, i) => `${i + 1}`) },
      yAxis: { type: 'value' },
      series: [{ name: '日流量', type: 'line', data: dailyBytes}],
    };
    chartInstance.setOption(option);
  }
};


const fetchData = async () => {
  try {
    const response = await axios.get('https://saltwood.top:9393/93AtHome/centerStatistics');
    const data = response.data;
    initHitsChart(data.dailyHits);
    initBytesChart(data.dailyBytes);
  } catch (error) {
    console.error('Failed to fetch data:', error);
    ElMessage({
      message: '拉取数据失败：'+ error,
      type: 'error'
  });
  }
};

onMounted(() => {
  fetchData();
});
</script>



