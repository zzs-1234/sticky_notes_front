<template>
  <el-dialog v-model="dialogVisible" title="登录" width="30%">
    <el-form 
      :model="form" 
      :rules="rules"
      ref="formRef"
      label-width="80px"
      @submit.prevent="handleLogin"
    >
      <el-form-item label="用户名" prop="username">
        <el-input 
          v-model="form.username" 
          placeholder="请输入用户名"
          @keyup.enter="handleLogin"
        ></el-input>
      </el-form-item>
      <el-form-item label="密码" prop="password">
        <el-input 
          v-model="form.password" 
          placeholder="请输入密码"
          type="password"
          show-password
          @keyup.enter="handleLogin"
        ></el-input>
      </el-form-item>
    </el-form>
    <template #footer>
      <span class="dialog-footer">
        <el-button @click="handleClose">取消</el-button>
        <el-button type="primary" @click="handleLogin">登录</el-button>
      </span>
    </template>
  </el-dialog>
</template>

<script lang="ts">
import { defineComponent, ref, watch } from 'vue';
import { userApi } from '../api';
import type { FormInstance } from 'element-plus';
import { ElMessage } from 'element-plus';

export default defineComponent({
  name: 'Login',
  props: {
    visible: {
      type: Boolean,
      required: true
    }
  },
  emits: ['update:visible', 'login-success'],
  setup(props, { emit }) {
    const dialogVisible = ref(props.visible);
    const formRef = ref<FormInstance>();
    
    const form = ref({
      username: '',
      password: ''
    });

    const rules = {
      username: [
        { required: true, message: '请输入用户名', trigger: 'blur' },
        { min: 3, message: '用户名长度不能小于3位', trigger: 'blur' }
      ],
      password: [
        { required: true, message: '请输入密码', trigger: 'blur' },
        { min: 6, message: '密码长度不能小于6位', trigger: 'blur' }
      ]
    };

    // 监听 props.visible 的变化
    watch(() => props.visible, (newVal) => {
      dialogVisible.value = newVal;
      if (!newVal) {
        formRef.value?.resetFields();
      }
    });

    // 监听 dialogVisible 的变化
    watch(() => dialogVisible.value, (newVal) => {
      emit('update:visible', newVal);
      if (!newVal) {
        formRef.value?.resetFields();
      }
    });

    const handleClose = () => {
      emit('update:visible', false);
    };

    const handleLogin = async () => {
      if (!formRef.value) return;
      
      await formRef.value.validate(async (valid, fields) => {
        if (valid) {
          try {
            const res = await userApi.login(form.value);
            // 存储 token
            localStorage.setItem('token', res.data.token);
            ElMessage.success('登录成功');
            emit('login-success');
            emit('update:visible', false);
          } catch (error) {
            ElMessage.error('登录失败：' + (error as Error).message);
          }
        } else {
          console.error('验证失败:', fields);
        }
      });
    };

    return {
      dialogVisible,
      form,
      formRef,
      rules,
      handleLogin,
      handleClose
    };
  }
});
</script>

<style scoped>
.dialog-footer {
  display: flex;
  justify-content: flex-end;
  gap: 10px;
}
</style> 