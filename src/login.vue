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
          <p>服务器爆啦！</p>
        </div>
      </el-card>
    </el-main>
  </el-container>
</template>

<script>
import axios from 'axios';
export default {
  name: 'login',
  data() {
    return {
      loading: false,
      success: false,
      failure: false,
    };
  },
  created() {
    if (this.$route.query.code) {
      this.loading = true;
      this.callback(this.$route.query.code).finally(() => {
        this.loading = false;
      });
    }
  },
  methods: {
    goBack() {
      this.$router.go(-1);
    },
    async getcode() {
      try {
        this.loading = true;
        const response = await axios.get('https://saltwood.top:9393/93AtHome/dashboard/oauth_id');
        const redirect_uri = window.location.href;
        const redirectUrl = `https://github.com/login/oauth/authorize?client_id=${response.data}&redirect_uri=${encodeURIComponent(redirect_uri)}`;
        window.location.href = redirectUrl;
      } catch (error) {
        this.loading = false;
        console.error("Failed to get client_id:", error);
      }
    },
    async callback(code) {
      try {
        const Url = `/93AtHome/dashboard/user/oauth`;
        const response = await axios.get(Url, {
          params: {
            code: code,
          },
        });

        if (response.status === 200) {
          this.success = true;
          this.loading = false;
        } else {
          this.failure = true;
          console.log(response.data);
          console.log("Login failed with status:", response.status);
          this.loading = false;
        }
      } catch (error) {
        this.failure = true;
        console.error("Login failed:", error);
        this.loading = false;
      }
    },
  },
};
</script>
