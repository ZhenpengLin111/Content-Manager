<script setup>
import { ref } from 'vue'
import { artAddChannelService, artEditChannelService } from '@/api/article.js'
const dialogVisible = ref(false)
const formRef = ref()
const formModel = ref({
  cate_name: '',
  cate_alias: ''
})
const rules = {
  cate_name: [
    { required: true, message: 'Please Enter Category Name', trigger: 'blur' },
    {
      pattern: /^\S{1,10}$/,
      message: 'Category Name has to be 1 to 10 bit non-empty string',
      trigger: 'blur'
    }
  ],
  cate_alias: [
    { required: true, message: 'Please Enter Category Alias', trigger: 'blur' },
    {
      pattern: /^[a-zA-Z0-9]{1,15}$/,
      message: 'Category Alias has to be 1 to 15 bit letter or number',
      trigger: 'blur'
    }
  ]
}
// 组件对外暴露一个方法 open，基于open传来的参数，区分添加还是编辑
// open({}) => 表单无需渲染，说明是添加
// open({ id, cate_name, ... }) => 表单需要渲染，说明是编辑
// open 调用后，可以打开弹窗

const open = (row) => {
  console.log(row)
  formModel.value = { ...row }
  dialogVisible.value = true
}

const emit = defineEmits(['success'])
const onSubmit = async () => {
  await formRef.value.validate()
  const isEdit = formModel.value.id
  if (isEdit) {
    await artEditChannelService(formModel.value)
    ElMessage.success('Edit Successfully')
  } else {
    await artAddChannelService(formModel.value)
    ElMessage.success('Add Successfully')
  }
  dialogVisible.value = false
  emit('success')
}

// 向外暴露方法
defineExpose({
  open
})
</script>

<template>
  <el-dialog
    v-model="dialogVisible"
    :title="formModel.id ? 'Edit Classification' : 'Add Classification'"
    width="500"
  >
    <el-form
      ref="formRef"
      :model="formModel"
      :rules="rules"
      label-width="100px"
      style="padding-right: 30px"
    >
      <el-form-item label="Category Name" prop="cate_name">
        <el-input
          v-model="formModel.cate_name"
          placeholder="Please Enter Category Name"
        ></el-input>
      </el-form-item>
      <el-form-item label="Category Alias" prop="cate_alias">
        <el-input
          v-model="formModel.cate_alias"
          placeholder="Please Enter Category Alias"
        ></el-input>
      </el-form-item>
    </el-form>
    <template #footer>
      <div class="dialog-footer">
        <el-button @click="dialogVisible = false">Cancel</el-button>
        <el-button type="primary" @click="onSubmit">Confirm</el-button>
      </div>
    </template>
  </el-dialog>
</template>
