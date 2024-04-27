<script setup>
import { userRequestService, userLoginService } from '@/api/user.js'
import { User, Lock } from '@element-plus/icons-vue'
import { ref, watch } from 'vue'
import { useUserStore } from '@/stores'
import { useRouter } from 'vue-router'
const isRegister = ref(false)
const form = ref()
// 整个的用于提交的form数据对象
const formModel = ref({
  username: '',
  password: '',
  repassword: ''
})
// 整个表单的校验规则
// 1. 非空校验 required: true，message消息提示， trigger触发校验的时机 blur change
// 2. 长度校验 min: xx, max: xx
// 3. 正则校验 pattern：正则规则 \S 非空字符
// 4. 自定义校验 => 自己写逻辑校验（校验函数）
//    validator: (rule, value, callback)
//    (1) rule 当前校验规则相关的信息
//    (2) value 所校验的表单元素目前的表单值
//    (3) callback 无论成功还是失败，都需要 callback 回调
//        - callback() 校验成功
//        - callback(new Error(错误信息)) 校验失败
const rules = {
  username: [
    { required: true, message: 'Please Enter Username', trigger: 'blur' },
    { min: 5, max: 10, message: 'Username has to be 5 to 10 bit string', trigger: 'blur' }
  ],
  password: [
    { required: true, message: 'Please Enter Password', trigger: 'blur' },
    {
      pattern: /^\S{6,15}$/,
      message: 'Password has to be 6 to 15 bit non-empty string',
      trigger: 'blur'
    }
  ],
  repassword: [
    { required: true, message: 'Please Enter Password', trigger: 'blur' },
    {
      pattern: /^\S{6,15}$/,
      message: 'Password has to be 6 to 15 bit non-empty string',
      trigger: 'blur'
    },
    {
      validator: (rule, value, callback) => {
        // 判断 value 和 当前 form 中收集的 password 是否一致
        if (value !== formModel.value.password) {
          callback(new Error('The two passwords are inconsistent'))
        } else {
          callback() // 就算校验成功，也需要callback
        }
      },
      trigger: 'blur'
    }
  ]
}

const register = async () => {
  // 注册成功之前，先进行校验，校验成功 -> 请求，校验失败 -> 自动提示
  await form.value.validate()
  await userRequestService(formModel.value)
  ElMessage.success('Registered Successfully')
  isRegister.value = false
}

const userStore = useUserStore()
const router = useRouter()

const login = async () => {
  await form.value.validate()
  const res = await userLoginService(formModel.value)
  userStore.setToken(res.data.token)
  ElMessage.success('Login Successfully')
  router.push('/')
}

// 切换的时候，重置表单内容
watch(isRegister, () => {
  formModel.value = {
    username: '',
    password: '',
    repassword: ''
  }
})
</script>

<template>
  <!-- 
    1. 结构相关
      el-row表示一行，一行分成24份 
       el-col表示列
       （1）:span="12" 表示在一行中，占12份（50%）
       （2）:span="6" 表示在一行中，占6份 （25%)
        (3) :offset="3" 表示在一行中，左侧margin份数

        el-form 整个表单组件
        el-form-item 表单的一行（一个表单域）
        el-input 表单元素（输入框）
    
    2. 校验相关
       （1）el-form => :model="ruleForm" 绑定的整个form的对象数据 { xxx, xxx, xxx }
       （2）el-form => :rules="rules"    绑定的整个rules规则对象  { xxx, xxx, xxx }
       （3）表单元素 => v-model="ruleForm.xxx" 给表单元素，绑定form的子属性
       （4）el-form-item => prop配置生效的是那个校验规则（和rules中的字段要对应）
  -->
  <el-row class="login-page">
    <el-col :span="12" class="bg"></el-col>
    <el-col :span="6" :offset="3" class="form">
      <!-- 注册相关表单 -->
      <el-form
        :model="formModel"
        :rules="rules"
        ref="form"
        size="large"
        autocomplete="off"
        v-if="isRegister"
      >
        <el-form-item>
          <h1>Register</h1>
        </el-form-item>
        <el-form-item prop="username">
          <el-input
            v-model="formModel.username"
            :prefix-icon="User"
            placeholder="Please Enter Username"
          ></el-input>
        </el-form-item>
        <el-form-item prop="password">
          <el-input
            v-model="formModel.password"
            :prefix-icon="Lock"
            type="password"
            placeholder="Please Enter Password"
          ></el-input>
        </el-form-item>
        <el-form-item prop="repassword">
          <el-input
            v-model="formModel.repassword"
            :prefix-icon="Lock"
            type="password"
            placeholder="Please Enter Password Again"
          ></el-input>
        </el-form-item>
        <el-form-item>
          <el-button
            @click="register"
            class="button"
            type="primary"
            auto-insert-space
          >
            Register
          </el-button>
        </el-form-item>
        <el-form-item class="flex">
          <el-link type="info" :underline="false" @click="isRegister = false">
            ← Back
          </el-link>
        </el-form-item>
      </el-form>
      <!-- 登录相关表单 -->
      <el-form
        :model="formModel"
        :rules="rules"
        ref="form"
        size="large"
        autocomplete="off"
        v-else
      >
        <el-form-item>
          <h1>Login</h1>
        </el-form-item>
        <el-form-item prop="username">
          <el-input
            v-model="formModel.username"
            :prefix-icon="User"
            placeholder="Please Enter Username"
          >
          </el-input>
        </el-form-item>
        <el-form-item prop="password">
          <el-input
            v-model="formModel.password"
            name="password"
            :prefix-icon="Lock"
            type="password"
            placeholder="Please Enter Password"
          ></el-input>
        </el-form-item>
        <el-form-item class="flex">
          <div class="flex">
            <el-checkbox>Remember Me</el-checkbox>
            <el-link type="primary" :underline="false">Forgot Password？</el-link>
          </div>
        </el-form-item>
        <el-form-item>
          <el-button
            @click="login"
            class="button"
            type="primary"
            auto-insert-space
            >Login</el-button
          >
        </el-form-item>
        <el-form-item class="flex">
          <el-link type="info" :underline="false" @click="isRegister = true">
            Register →
          </el-link>
        </el-form-item>
      </el-form>
    </el-col>
  </el-row>
</template>

<style lang="scss" scoped>
.login-page {
  height: 100vh;
  background-color: #fff;
  .bg {
    // background:
    //   url('@/assets/logo2.png') no-repeat 60% center / 240px auto,
    //   url('@/assets/login_bg.jpg') no-repeat center / cover;
    // border-radius: 0 20px 20px 0;
    background: url(@/assets/bg2.jpg);
    background-position: center;
    background-size: cover;
    border-radius: 0 20px 20px 0;
  }
  .form {
    display: flex;
    flex-direction: column;
    justify-content: center;
    user-select: none;
    .title {
      margin: 0 auto;
    }
    .button {
      width: 100%;
    }
    .flex {
      width: 100%;
      display: flex;
      justify-content: space-between;
    }
  }
}
</style>
