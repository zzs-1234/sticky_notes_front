<template>
  <el-dialog v-model="dialogVisible" title="注册" width="30%">
    <el-form 
      :model="form" 
      :rules="rules"
      ref="formRef"
      label-width="80px"
      @submit.prevent="handleRegister"
    >
      <el-form-item label="邮箱" prop="email">
        <el-input 
          v-model="form.email" 
          placeholder="请输入邮箱"
          type="email"
        ></el-input>
      </el-form-item>
      <el-form-item label="密码" prop="password">
        <el-input 
          v-model="form.password" 
          placeholder="请输入密码"
          type="password"
          show-password
        ></el-input>
      </el-form-item>
      <el-form-item label="确认密码" prop="confirmPassword">
        <el-input 
          v-model="form.confirmPassword" 
          placeholder="请确认密码"
          type="password"
          show-password
        ></el-input>
      </el-form-item>
    </el-form>
    <template #footer>
      <span class="dialog-footer">
        <el-button @click="handleClose">取消</el-button>
        <el-button type="primary" @click="handleRegister">注册</el-button>
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
  name: 'Register',
  props: {
    visible: {
      type: Boolean,
      required: true
    }
  },
  emits: ['update:visible', 'register-success'],
  setup(props, { emit }) {
    const dialogVisible = ref(props.visible);
    const formRef = ref<FormInstance>();
    
    const form = ref({
      email: '',
      password: '',
      confirmPassword: ''
    });

    const validatePass2 = (rule: any, value: string, callback: any) => {
      if (value === '') {
        callback(new Error('请再次输入密码'));
      } else if (value !== form.value.password) {
        callback(new Error('两次输入密码不一致!'));
      } else {
        callback();
      }
    };

    const rules = {
      email: [
        { required: true, message: '请输入邮箱', trigger: 'blur' },
        { type: 'email', message: '请输入正确的邮箱格式', trigger: 'blur' }
      ],
      password: [
        { required: true, message: '请输入密码', trigger: 'blur' },
        { min: 6, message: '密码长度不能小于6位', trigger: 'blur' }
      ],
      confirmPassword: [
        { required: true, message: '请再次输入密码', trigger: 'blur' },
        { validator: validatePass2, trigger: 'blur' }
      ]
    };

    watch(() => props.visible, (newVal) => {
      dialogVisible.value = newVal;
      if (!newVal) {
        formRef.value?.resetFields();
      }
    });

    watch(() => dialogVisible.value, (newVal) => {
      emit('update:visible', newVal);
      if (!newVal) {
        formRef.value?.resetFields();
      }
    });

    const handleClose = () => {
      emit('update:visible', false);
    };

    const handleRegister = async () => {
      if (!formRef.value) return;
      
      await formRef.value.validate(async (valid, fields) => {
        if (valid) {
          try {
            await userApi.register(form.value);
            ElMessage.success('注册成功');
            emit('register-success');
            emit('update:visible', false);
          } catch (error) {
            ElMessage.error('注册失败：' + (error as Error).message);
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
      handleRegister,
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