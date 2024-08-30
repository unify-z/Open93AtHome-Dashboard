<template>
  <el-container style="height: 100vh;">
    <el-main style="display: flex; justify-content: center; align-items: center;">
      <el-card 
        shadow="hover" 
        class="text-center" 
        style="width: 90%; height: 90%; display: flex; align-items: center; justify-content: center; position: relative;"
      >
        <div v-if="!success && !failure">
          <h1 class="mb-5">93@Home - 登录</h1>
          <p class="mb-10">目前仅支持使用社交账户登录，也许未来也是</p>
            <el-button
              :loading="loading"
              type="primary"
              @click="getcode"
              style="width: 100%;text-align: center;"
            >
            使用 GitHub 登录
            </el-button>
        </div>

        <!-- 登录成功 -->
        <div v-else-if="success">
          <h2 class="mb-5">登录成功！</h2>
          <p>欢迎回来，您已成功登录。</p>
        </div>

        <!-- 登录失败 -->
        <div v-else>
          <h2 class="mb-5">登录失败</h2>
          <p>
            服务器爆啦！<br>
            {{ failurerea.value }}
          </p>
        </div>
      </el-card>
    </el-main>
  </el-container>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import axios from 'axios';
import Cookies from 'js-cookie';
import { ElMessage } from 'element-plus';

const loading = ref(false);
const success = ref(false);
const failure = ref(false);
const username = ref('');
const failurerea = ref('');

const goBack = () => {
  history.back();
};

const redirectToHome = () => {
  location.href = '/dashboard';
};

const getcode = async () => {
  try {
    loading.value = true;
    const response = await axios.get('https://saltwood.top:9393/93AtHome/dashboard/oauth_id');
    const redirect_uri = location.href;
    const redirectUrl = `https://github.com/login/oauth/authorize?client_id=${response.data}&redirect_uri=${encodeURIComponent(redirect_uri)}`;
    location.href = redirectUrl;
  } catch (error) {
    loading.value = false;
    console.error("Failed to get client_id:", error);
  }
};

const callback = async (code) => {
  try {
    const Url = `https://saltwood.top:9393/93AtHome/dashboard/user/oauth`;
    ElMessage("正在登录，别急");
    const response = await axios.get(Url, {
      params: {
        code,
      },
    });

    if (response.status === 200) {
      success.value = true;
      username.value = response.data.username;
      setTimeout(redirectToHome, 3000);
    } else {
      failure.value = true;
      console.log("Login failed with status:", response.status);
      failurerea.value = response.data.error;
    }
  } catch (error) {
    failure.value = true;
    if (error.response && error.response.status === 500) {
      failurerea.value = error.response.data.error;
    } else {
      console.error("Login failed:", error);
      failurerea.value = error;
    }
  } finally {
    loading.value = false;
  }
};

onMounted(() => {
  if (Cookies.get('token')) {
    redirectToHome();
  } else if (new URLSearchParams(location.search).get('code')) {
    loading.value = true;
    callback(new URLSearchParams(location.search).get('code')).finally(() => {
      loading.value = false;
    });
  }
});

defineExpose({
  goBack,
  getcode,
  callback,
  redirectToHome,
});
</script>

<style scoped>
.el-card {
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
}

</style>
