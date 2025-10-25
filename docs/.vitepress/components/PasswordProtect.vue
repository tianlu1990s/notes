<!-- .vitepress/components/PasswordProtect.vue -->
<template>
  <div v-if="!authenticated" class="password-protect">
    <div class="password-modal">
      <h3>🔒 需要访问密码</h3>
      <p>请输入密码查看此文档</p>
      <input
        v-model="password"
        type="password"
        placeholder="输入访问密码"
        @keyup.enter="checkPassword"
        class="password-input"
      />
      <button @click="checkPassword" class="password-btn">进入文档</button>
      <p v-if="error" class="error-msg">{{ error }}</p>
    </div>
  </div>
  <div v-else class="authenticated-content">
    <slot />
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';

const authenticated = ref(false);
const password = ref('');
const error = ref('');

// 简单的哈希函数（不要用于真正的安全场景！）
const simpleHash = (str) => {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = (hash << 5) - hash + char;
    hash = hash & hash; // 转换为32位整数
  }
  return Math.abs(hash).toString();
};

// 存储密码的哈希值而不是明文
// 你可以通过以下步骤生成新密码的哈希：
// 1. 在浏览器控制台运行: simpleHash("你的密码")
// 2. 将得到的哈希值添加到下面的数组中
const validPasswordHashes = [
  '1483766386',
  // 添加更多密码哈希...
];

// 密码验证逻辑 - 你可以修改这个密码
const checkPassword = () => {
  // 默认密码，部署前记得修改！
  //const validPasswords = ['123456', 'demo123'];
  const inputHash = simpleHash(password.value.trim());

  if (validPasswordHashes.includes(inputHash)) {
    authenticated.value = true;
    sessionStorage.setItem('vp_authenticated', 'true');
    sessionStorage.setItem('vp_auth_time', Date.now().toString());
    error.value = '';
  } else {
    error.value = '密码错误，请重试';
    password.value = '';
  }
};

// 检查认证状态（会话级存储）
onMounted(() => {
  const authTime = sessionStorage.getItem('vp_auth_time');
  const now = Date.now();

  // 设置会话超时时间
  if (authTime && now - parseInt(authTime) < 12 * 60 * 60 * 1000) {
    authenticated.value = sessionStorage.getItem('vp_authenticated') === 'true';
  } else {
    // 超时清除认证
    sessionStorage.removeItem('vp_authenticated');
    sessionStorage.removeItem('vp_auth_time');
  }
});
</script>

<style scoped>
.password-protect {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 9999;
}

.password-modal {
  background: white;
  padding: 2rem;
  border-radius: 12px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3);
  text-align: center;
  min-width: 300px;
}

.password-input {
  width: 100%;
  padding: 12px;
  margin: 1rem 0;
  border: 2px solid #e1e5e9;
  border-radius: 6px;
  font-size: 16px;
  box-sizing: border-box;
}

.password-input:focus {
  outline: none;
  border-color: #42b883;
}

.password-btn {
  width: 100%;
  padding: 12px;
  background: #42b883;
  color: white;
  border: none;
  border-radius: 6px;
  font-size: 16px;
  cursor: pointer;
  transition: background 0.3s;
}

.password-btn:hover {
  background: #3aa876;
}

.error-msg {
  color: #ff4757;
  margin-top: 0.5rem;
  font-size: 14px;
}
</style>
