<script setup>
import { ref } from 'vue'
import { useUserStore } from '@/stores'
import { useRouter } from 'vue-router'
import { userUpdatePassService } from '@/api/user.js'
const pwdForm = ref({
  old_pwd: '',
  new_pwd: '',
  re_pwd: ''
})

const checkOldSame = (rule, value, cb) => {
  if (value === pwdForm.value.old_pwd) {
    cb(new Error('The old password cannot be the same as the new password!'))
  } else {
    cb()
  }
}

const checkNewSame = (rule, value, cb) => {
  if (value !== pwdForm.value.new_pwd) {
    cb(new Error('The new password is different from the new password that you confirm to enter again!'))
  } else {
    cb()
  }
}
const rules = {
  // 原密码
  old_pwd: [
    { required: true, message: 'Please Enter Password', trigger: 'blur' },
    {
      pattern: /^\S{6,15}$/,
      message: 'Password length has to be 6 to 15 bit non-empty string',
      trigger: 'blur'
    }
  ],
  // 新密码
  new_pwd: [
    { required: true, message: 'Please Enter New Password', trigger: 'blur' },
    {
      pattern: /^\S{6,15}$/,
      message: 'Password length has to be 6 to 15 bit non-empty string',
      trigger: 'blur'
    },
    { validator: checkOldSame, trigger: 'blur' }
  ],
  // 确认新密码
  re_pwd: [
    { required: true, message: 'Please confirm the new password again', trigger: 'blur' },
    {
      pattern: /^\S{6,15}$/,
      message: 'Password length has to be 6 to 15 bit non-empty string',
      trigger: 'blur'
    },
    { validator: checkNewSame, trigger: 'blur' }
  ]
}
const formRef = ref()
const router = useRouter()
const userStore = useUserStore()
const onSubmit = async () => {
  const valid = await formRef.value.validate()
  if (valid) {
    await userUpdatePassService(pwdForm.value)
    ElMessage({ type: 'success', message: 'Reset Password Successfully' })
    userStore.setToken('')
    userStore.setUser({})
    router.push('/login')
  }
}
const onReset = () => {
  formRef.value.resetFields()
}
</script>
<template>
  <page-container title="Reset Password">
    <el-row>
      <el-col :span="12">
        <el-form
          :model="pwdForm"
          :rules="rules"
          ref="formRef"
          label-width="120px"
          size="large"
        >
          <el-form-item label="Old Password" prop="old_pwd">
            <el-input v-model="pwdForm.old_pwd" type="password"></el-input>
          </el-form-item>
          <el-form-item label="New Password" prop="new_pwd">
            <el-input v-model="pwdForm.new_pwd" type="password"></el-input>
          </el-form-item>
          <el-form-item label="New Password" prop="re_pwd">
            <el-input v-model="pwdForm.re_pwd" type="password"></el-input>
          </el-form-item>
          <el-form-item>
            <el-button @click="onSubmit" type="primary">Reset Password</el-button>
            <el-button @click="onReset">Reset</el-button>
          </el-form-item>
        </el-form>
      </el-col>
    </el-row>
  </page-container>
</template>
