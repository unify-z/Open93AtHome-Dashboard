<template>
  <div>
    <p></p>
  </div>
</template>

<script setup>
import { onMounted } from 'vue';
import { ElMessageBox } from 'element-plus';
import { useRouter } from 'vue-router'
const router = useRouter()
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

function checkTokenInCookie() {
  const token = getCookie('token');
  if (token) {
    console.log('Token:', token);
  } else {
    ElMessageBox.alert('用户未登录','提示', {
    confirmButtonText: '去登录',
    callback: () => {
      router.push('/auth/login');
    },
  });
  }
}

onMounted(() => {
  checkTokenInCookie();
});
</script>