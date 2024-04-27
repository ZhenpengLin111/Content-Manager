<script setup>
import { ref } from 'vue'
import { artGetChannelsService, artDelChannelService } from '@/api/article.js'
import { Edit, Delete } from '@element-plus/icons-vue'
import ChannelEdit from './components/ChannelEdit.vue'
const channelList = ref([])
const loading = ref(false)
const dialog = ref()

const getChannelList = async () => {
  loading.value = true
  const res = await artGetChannelsService()
  channelList.value = res.data.data
  loading.value = false
}
getChannelList()

const onEditChannel = (row) => {
  dialog.value.open(row)
}
const onDelChannel = async (row) => {
  await ElMessageBox.confirm('Are you sure you want to delete this category?', 'Gentle Reminder', {
    type: 'warning',
    confirmButtonText: 'Confirm',
    cancelButtonText: 'Cancel'
  })
  await artDelChannelService(row.id)
  ElMessage.success('Delete Successfully')
  getChannelList()
}
const onAddChannel = () => {
  dialog.value.open({})
}
const onSuccess = () => {
  getChannelList()
}
</script>

<template>
  <page-container title="Article Categories">
    <template #extra>
      <el-button @click="onAddChannel" type="primary">Add A Category</el-button>
    </template>
    <el-table v-loading="loading" :data="channelList" style="width: 100%">
      <el-table-column type="index" label="Index" width="100"></el-table-column>
      <el-table-column prop="cate_name" label="Category Name"></el-table-column>
      <el-table-column prop="cate_alias" label="Category Alias"></el-table-column>
      <el-table-column label="Operation" width="150">
        <!-- row 就是 channelList 的每一项，$index 下标 -->
        <template #default="{ row }">
          <el-button
            :icon="Edit"
            circle
            plain
            type="primary"
            @click="onEditChannel(row)"
          ></el-button>
          <el-button
            :icon="Delete"
            circle
            plain
            type="danger"
            @click="onDelChannel(row)"
          ></el-button>
        </template>
      </el-table-column>
      <template #empty>
        <el-empty description="No Data"></el-empty>
      </template>
    </el-table>

    <channel-edit @success="onSuccess" ref="dialog"></channel-edit>
  </page-container>
</template>

<style lang="scss" scoped></style>
