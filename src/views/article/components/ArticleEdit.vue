<script setup>
import { ref } from 'vue'
import ChannelSelect from './ChannelSelect.vue'
import { Plus } from '@element-plus/icons-vue'
import { QuillEditor } from '@vueup/vue-quill'
import '@vueup/vue-quill/dist/vue-quill.snow.css'
import {
  artPublishService,
  artGetDetailService,
  artEditService
} from '@/api/article.js'
import { baseURL } from '@/utils/request.js'
import axios from 'axios'
const visibleDrawer = ref(false)

const defaultForm = {
  title: '',
  cate_id: '',
  content: '',
  cover_img: '',
  state: ''
}
const formModel = ref({ ...defaultForm })
const rules = {
  title: [
    { required: true, message: 'Please Enter Article Title', trigger: 'blur' },
    {
      pattern: /^\S{1,10}$/,
      message: 'Title has to be 1 to 10 bit non-empty string',
      trigger: 'blur'
    }
  ],
  cate_id: [{ required: true, message: 'Please Select Article Category', trigger: 'blur' }],
  content: [{ required: true, message: 'Please Enter Article Content', trigger: 'blur' }],
  cover_img: [{ required: true, message: 'Please Upload Cover Image', trigger: 'blur' }]
}

// 图片上传相关逻辑
const imgUrl = ref('')
const onUpoadFile = (uploadFile) => {
  // console.log(uploadFile)
  imgUrl.value = URL.createObjectURL(uploadFile.raw)
  formModel.value.cover_img = uploadFile.raw
  // console.log(imgUrl.value, formModel.value)
}
// 组件对外暴露一个方法 open，基于open传来的参数，区分添加还是编辑
// open({}) => 表单无需渲染，说明是添加
// open({ id, cate_name, ... }) => 表单需要渲染，说明是编辑
// open 调用后，可以打开抽屉
const editorRef = ref()
const formRef = ref()
const open = async (row) => {
  visibleDrawer.value = true
  // console.log(row)
  if (row.id) {
    // console.log('编辑回显')
    const res = await artGetDetailService(row.id)
    // console.log(res)
    formModel.value = res.data.data
    imgUrl.value = baseURL + formModel.value.cover_img
    formModel.value.cover_img = await imageUrlToFile(
      imgUrl.value,
      formModel.value.cover_img
    )
  } else {
    // console.log('添加')
    formModel.value = { ...defaultForm }
    imgUrl.value = ''
    editorRef.value.setHTML('')
  }
}

// 将网络图片地址转换为File对象
async function imageUrlToFile(url, fileName) {
  try {
    // 第一步：使用axios获取网络图片数据
    const response = await axios.get(url, { responseType: 'arraybuffer' })
    const imageData = response.data

    // 第二步：将图片数据转换为Blob对象
    const blob = new Blob([imageData], {
      type: response.headers['content-type']
    })

    // 第三步：创建一个新的File对象
    const file = new File([blob], fileName, { type: blob.type })

    return file
  } catch (error) {
    console.error('An error occurred while converting the image to a File object:', error)
    throw error
  }
}

// 发布文章
const emit = defineEmits(['success'])
const onPublish = async (state) => {
  await formRef.value.validate()
  formModel.value.state = state
  const fd = new FormData()
  for (let key in formModel.value) {
    fd.append(key, formModel.value[key])
  }
  // console.log(fd)
  if (formModel.value.id) {
    // console.log('编辑文章')
    await artEditService(fd)
    ElMessage.success('Edit Successfully')
    visibleDrawer.value = false
    emit('success', 'edit')
  } else {
    await artPublishService(fd)
    ElMessage.success('Published Successfully')
    visibleDrawer.value = false
    emit('success', 'add')
  }
}

defineExpose({
  open
})
</script>
<template>
  <el-drawer
    v-model="visibleDrawer"
    :title="formModel.id ? 'Edit Article' : 'Publish Article'"
    direction="rtl"
    size="50%"
  >
    <!-- 发表文章表单 -->
    <el-form
      :model="formModel"
      ref="formRef"
      label-width="120px"
      :rules="rules"
    >
      <el-form-item label="Article Title" prop="title">
        <el-input v-model="formModel.title" placeholder="Please Enter Title"></el-input>
      </el-form-item>
      <el-form-item label="Article Category" prop="cate_id">
        <channel-select
          v-model="formModel.cate_id"
          width="100%"
        ></channel-select>
      </el-form-item>
      <el-form-item label="Article Cover" prop="cover_img">
        <el-upload
          class="avatar-uploader"
          :auto-upload="false"
          :show-file-list="false"
          :on-change="onUpoadFile"
        >
          <img v-if="imgUrl" :src="imgUrl" class="avatar" />
          <el-icon v-else class="avatar-uploader-icon"><Plus /></el-icon>
        </el-upload>
      </el-form-item>
      <el-form-item label="Article Content" prop="content">
        <div class="editor">
          <quill-editor
            ref="editorRef"
            theme="snow"
            v-model:content="formModel.content"
            contentType="html"
          ></quill-editor>
        </div>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="onPublish('已发布')">Publish</el-button>
        <el-button type="info" @click="onPublish('草稿')">Draft</el-button>
      </el-form-item>
    </el-form>
  </el-drawer>
</template>

<style lang="scss" scoped>
.avatar-uploader {
  :deep() {
    .avatar {
      width: 178px;
      height: 178px;
      display: block;
    }
    .el-upload {
      border: 1px dashed var(--el-border-color);
      border-radius: 6px;
      cursor: pointer;
      position: relative;
      overflow: hidden;
      transition: var(--el-transition-duration-fast);
    }
    .el-upload:hover {
      border-color: var(--el-color-primary);
    }
    .el-icon.avatar-uploader-icon {
      font-size: 28px;
      color: #8c939d;
      width: 178px;
      height: 178px;
      text-align: center;
    }
  }
}
.editor {
  width: 100%;
  :deep(.ql-editor) {
    min-height: 200px;
  }
}
</style>
