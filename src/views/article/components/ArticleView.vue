<script setup>
import { ref } from 'vue'
const drawer = ref(false)
const openDrawer = (id) => {
  drawer.value = true
  // console.log(row);
}
</script>
<template>
  <el-drawer
    v-model="drawer"
    title="I am the title"
    direction="ttb">
    <span>Hi, there!</span>
  </el-drawer>
</template>