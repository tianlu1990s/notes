<!-- .vitepress/theme/Layout.vue -->
<script setup>
import DefaultTheme from 'vitepress/theme';
import PasswordProtect from '../components/PasswordProtect.vue';

const { Layout } = DefaultTheme;
</script>

<template>
  <PasswordProtect>
    <Layout />
  </PasswordProtect>
</template>
