<template>
  <el-row :gutter="20">
    <el-col :span="8">
      <el-card class="card-margin" style="margin-top: 20px;">
        <div slot="header" class="clearfix">
          <span>在线节点数</span>
        </div>
        <div>{{ data.onlines }}</div>
      </el-card>
    </el-col>
    <el-col :span="8">
      <el-card class="card-margin" style="margin-top: 20px;">
        <div slot="header" class="clearfix">
          <span>今日请求数</span>
        </div>
        <div>{{ formatCommas(data.today.hits) }}</div>
      </el-card>
    </el-col>
    <el-col :span="8">
      <el-card class="card-margin" style="margin-top: 20px;">
        <div slot="header" class="clearfix">
          <span>今日流量</span>
        </div>
        <div>{{ formatUnits(data.today.bytes) }}</div>
      </el-card>
    </el-col>
    <el-col :span="12">
      <el-card style="margin-top: 10px;">
        <el-row>
          <el-col :span="24">
            <div ref="hitsChart" style="width: 100%; height: 250px;"></div>
          </el-col>
        </el-row>
      </el-card>
    </el-col>
    <el-col :span="12">
      <el-card style="margin-top: 10px;">
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
import { useDark, useToggle } from '@vueuse/core';
import { ElMessage } from 'element-plus';
const data = ref({
    "dailyHits": [],
    "dailyBytes": [],
    "today": {
        "hits": 0,
        "bytes": 0
    },
    "onlines": 0
  });

function formatCommas(num) {
  return num.toLocaleString();
}

function formatUnits(value) {
  let mbValue = value / 1024 / 1024;
  let gbValue = mbValue / 1024;
  let tbValue = gbValue / 1024;

  if (tbValue >= 1) {
    return `${tbValue.toFixed(2)} TB`;
  }
  if (gbValue >= 1) {
    return `${gbValue.toFixed(2)} GB`;
  } else {
    return `${mbValue.toFixed(2)} MB`;
  }
}

const isDarkMode = useDark();
const hitsChart = ref(null);
const bytesChart = ref(null);

const initHitsChart = (dailyHits) => {
  if (hitsChart.value) {
    const chartInstance = echarts.init(hitsChart.value);
    const option = {
      tooltip: {
        trigger: 'axis',
        formatter: function (params) {
          return params[0].name + '<br/>' + params[0].seriesName + ': ' + formatCommas(params[0].value);
        }
      },
      title: { text: '日请求数', textStyle: { color: isDarkMode.value ? '#ffffff' : '#000000' }},
      xAxis: { type: 'category', data: Array.from({ length: dailyHits.length }, (_, i) => `${i + 1} 号`) },
      yAxis: { type: 'value' },
      series: [{ name: '日请求数', type: 'line', data: dailyHits }],
    };
    chartInstance.setOption(option);
  }
};

const initBytesChart = (dailyBytes) => {
  if (bytesChart.value) {
    const chartInstance = echarts.init(bytesChart.value);
    const option = {
      tooltip: {
        trigger: 'axis',
        formatter: function (params) {
          return params[0].name + '<br/>' + params[0].seriesName + ': ' + formatUnits(params[0].value);
        }
      },
      title: { text: '日流量', textStyle: { color: isDarkMode.value ? '#ffffff' : '#000000' }},
      xAxis: { type: 'category', data: Array.from({ length: dailyBytes.length }, (_, i) => `${i + 1} 号`) },
      yAxis: {
        type: 'value',
        axisLabel: {
          formatter: function (value) {
            return formatUnits(value);
          }
        }
      },
      series: [{ name: '日流量', type: 'line', data: dailyBytes }],
    };
    chartInstance.setOption(option);
  }
};

const fetchData = async () => {
  try{
    const response = await axios.get('https://saltwood.top:9393/93AtHome/centerStatistics');
    data.value = response.data;
    initHitsChart(data.value.dailyHits);
    initBytesChart(data.value.dailyBytes);
  }catch(error){
    ElMessage("拉取数据失败："+error)
    console.error('Error:', error);
  }
};

onMounted(() => {
  fetchData();
  console.log(data)
});
</script>