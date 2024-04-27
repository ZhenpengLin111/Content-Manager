<script setup>
import PageContainer from '@/components/PageContainer.vue'
import { useUserStore } from '@/stores'
import { ref } from 'vue'
import { userUpdateInfoService } from '@/api/user.js'
const {
  user: { id, username, nickname, email },
  getUser
} = useUserStore()
const userInfo = ref({
  id,
  username,
  nickname,
  email
})
const formRef = ref()
const rules = {
  nickname: [
    { required: true, message: 'Please Enter User Nickname', trigger: 'blur' },
    {
      pattern: /^\S{2,10}$/,
      message: 'Nickname has to be 2 to 10 bit non-empty string',
      trigger: 'blur'
    }
  ],
  email: [
    { required: true, message: 'Please Enter User Email', trigger: 'blur' },
    { type: 'email', message: 'Email Format is Incorrect', trigger: 'blur' }
  ]
}
const onSubmit = async () => {
  await formRef.value.validate()
  await userUpdateInfoService(userInfo.value)
  // console.log(res)
  await getUser()
  ElMessage.success('Edit Successfully')
}
</script>
<template>
  <page-container title="Profile">
    <el-row>
      <el-col :span="12">
        <el-form
          ref="formRef"
          :model="userInfo"
          :rules="rules"
          size="large"
          label-width="100px"
        >
          <el-form-item label="Login Name">
            <el-input v-model="userInfo.username" disabled></el-input>
          </el-form-item>
          <el-form-item label="User Name" prop="nickname">
            <el-input v-model="userInfo.nickname"></el-input>
          </el-form-item>
          <el-form-item label="User Email" prop="email">
            <el-input v-model="userInfo.email"></el-input>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="onSubmit">Commit Changes</el-button>
          </el-form-item>
        </el-form>
      </el-col>
    </el-row>
  </page-container>
</template>
