<script setup>
import { ref } from 'vue'
import { artGetDetailService } from '@/api/article.js'
import { baseURL } from '@/utils/request.js'
import { formatTime } from '@/utils/format.js'
const drawer = ref(false)
const imgUrl = ref('')
const articleInfo = ref({})
const openDrawer = async (row) => {
  drawer.value = true
  // console.log(row.id);
  const res = await artGetDetailService(row.id)
  articleInfo.value = res.data.data
  console.log(articleInfo.value);
  imgUrl.value = baseURL + articleInfo.value.cover_img
}
defineExpose({
  openDrawer
})
</script>
<template>
  <el-drawer
    v-model="drawer"
    title="Article Preview"
    direction="ltr"
    size="50%"
    >
    <div class="drawerBody">
      <div class="cover_img">
        <img :src="imgUrl" alt="cover_img">
      </div>
      <div>
        <h1>{{ articleInfo.title }}</h1>
      </div>
      <div v-html="articleInfo.content" class="content"></div>
      <div class="footer">
        <span class="pub_date">{{ formatTime(articleInfo.pub_date)}}</span>
        <span>{{ articleInfo.state === '已发布'? 'Published' : 'Draft'}}</span>
      </div>
      
    </div>
    
  </el-drawer>
</template>

<style scoped>
.cover_img {
  width: 100%;
}
.cover_img img {
  width: 100%;
  height: 200px;
  object-fit: cover;
}
.drawerBody {
  padding: 0px 80px;
  text-align: center;
}
h1 {
  font-size: 3.5em;
  margin-top: 20px;
}
.pub_date {
  margin-right: 50px;
}
.footer {
  margin-top: 50px;
}
.content {
  text-align: left;
}
</style>