<script setup>
import { ref } from 'vue'
import { Edit, Delete } from '@element-plus/icons-vue'
import ChannelSelect from './components/ChannelSelect.vue'
import { artGetListService, artDeleteService } from '@/api/article.js'
import { formatTime } from '@/utils/format.js'
import ArticleEdit from './components/ArticleEdit.vue'
import ArticleView from './components/ArticleView.vue'
const articleList = ref([]) // 文章列表
const total = ref(0) // 总条数

const loading = ref(false)
// 定义请求参数对象
const params = ref({
  pagenum: 1, // 当前页
  pagesize: 5, // 当前生效的每页条数
  cate_id: '',
  state: ''
})

// 基于params参数，获取文章列表
const getArticleList = async () => {
  loading.value = true
  const res = await artGetListService(params.value)
  // console.log(res)
  articleList.value = res.data.data
  total.value = res.data.total
  loading.value = false
}
getArticleList()

// 处理分页逻辑
const onSizeChange = (size) => {
  // console.log(size)
  // 只要是每页条数变化了，那么原本正在访问的当前页意义不大了，数据大概率已经不在原来那一页了
  // 重新从第一页渲染即可
  params.value.pagenum = 1
  params.value.pagesize = size
  getArticleList()
}
const onCurrentChange = (page) => {
  // console.log(page)
  // 更新当前页
  params.value.pagenum = page
  getArticleList()
}

// 搜索逻辑 => 按照最新的条件，重新探索，从第一页开始展示
const onSearch = () => {
  params.value.pagenum = 1
  getArticleList()
}
// 重置逻辑
const onReset = () => {
  params.value.pagenum = 1
  params.value.cate_id = ''
  params.value.state = ''
  getArticleList()
}

const articleEditRef = ref()
// 添加文章
const onAddArticle = () => {
  articleEditRef.value.open({})
}

// 编辑逻辑
const onEditArticle = (row) => {
  articleEditRef.value.open(row)
}

// 删除逻辑
const onDeleteArticle = async (row) => {
  console.log(row)
  await ElMessageBox.confirm('Are you sure you want to delete this article?', 'Gentle Reminder', {
    type: 'warning',
    confirmButtonText: 'Confirm',
    cancelButtonText: 'Cancel'
  })
  await artDeleteService(row.id)
  ElMessage.success('Delete Successfully')
  getArticleList()
}

// 添加修改成功
const onSuccess = (type) => {
  if (type === 'add') {
    // 如果是添加，需要跳转渲染最后一页，编辑直接渲染当前页
    const lastPage = Math.ceil((total.value + 1) / params.value.pagesize)
    params.value.pagenum = lastPage
  }
  getArticleList()
}

// 查看文章内容
const articleViewRef = ref()
const onViewArticle = (row) => {
  articleViewRef.value.openDrawer(row)
}

</script>
<template>
  <page-container title="Article Management">
    <template #extra>
      <el-button @click="onAddArticle" type="primary">Add A Article</el-button>
    </template>

    <!-- 表单区域 -->
    <el-form inline>
      <el-form-item label="Article Category:">
        <!-- Vue2 => v-model :value 和 @input 的简写 -->
        <!-- Vue3 => v-model :modelValue 和 @update:modelValue 的简写 -->
        <channel-select v-model="params.cate_id" width="100px"></channel-select>
      </el-form-item>
      <el-form-item label="Publish Status:">
        <!-- 这里后台标记发布状态，就是通过中文标记的，已发布 / 草稿 -->
        <el-select v-model="params.state" style="width: 100px">
          <el-option label="Published" value="已发布"></el-option>
          <el-option label="Draft" value="草稿"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="onSearch">Search</el-button>
        <el-button @click="onReset">Reset</el-button>
      </el-form-item>
    </el-form>

    <!-- 表格区域 -->
    <el-table :data="articleList" v-loading="loading">
      <el-table-column label="Article Title" prop="title">
        <template #default="{ row }">
          <el-link type="primary" :underline="false" @click="onViewArticle(row)">{{ row.title }}</el-link>
        </template>
      </el-table-column>
      <el-table-column label="Category" prop="cate_name"></el-table-column>
      <el-table-column label="Published Date" prop="pub_date">
        <template #default="{ row }">
          {{ formatTime(row.pub_date) }}
        </template>
      </el-table-column>
      <el-table-column label="Status" prop="state">
        <template #default="{ row }">
           {{ row.state === '已发布'? 'Published' : 'Draft' }}
        </template>
      </el-table-column>
      <!-- 利用作用域插槽 row 可以获取当前行的数据 => v-for 遍历 item -->
      <el-table-column label="Operation">
        <template #default="{ row }">
          <el-button
            type="primary"
            circle
            plain
            :icon="Edit"
            @click="onEditArticle(row)"
          ></el-button>
          <el-button
            type="danger"
            circle
            plain
            :icon="Delete"
            @click="onDeleteArticle(row)"
          ></el-button>
        </template>
      </el-table-column>
      <template #empty>
        <el-empty description="No Data"></el-empty>
      </template>
    </el-table>

    <!-- 分页区域 -->
    <el-pagination
      v-model:current-page="params.pagenum"
      v-model:page-size="params.pagesize"
      :page-sizes="[2, 3, 5, 10]"
      :background="true"
      layout="jumper, total, sizes, prev, pager, next"
      :total="total"
      @size-change="onSizeChange"
      @current-change="onCurrentChange"
      style="margin-top: 20px; justify-content: flex-end"
    />

    <!-- 添加编辑抽屉 -->
    <article-edit ref="articleEditRef" @success="onSuccess"></article-edit>

    <!-- 查看文章内容抽屉 -->
    <article-view ref="articleViewRef"></article-view>
  </page-container>
</template>

<style lang="scss" scoped></style>
