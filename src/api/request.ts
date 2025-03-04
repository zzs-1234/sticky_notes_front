import axios from 'axios';
import { ElMessage } from 'element-plus';

const request = axios.create({
    baseURL: 'http://localhost:8000/api',
    timeout: 5000,
    headers: {
        'Content-Type': 'application/json'
    }
});

// 请求拦截器
request.interceptors.request.use(
    config => {
        // 从 localStorage 获取 token
        const token = localStorage.getItem('token');
        
        // 如果有 token 就带上
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        
        return config;
    },
    error => {
        return Promise.reject(error);
    }
);

// 响应拦截器
request.interceptors.response.use(
    response => {
        return response;
    },
    error => {
        // 处理 401 未授权错误
        if (error.response?.status === 401) {
            // 清除 token 和用户数据
            localStorage.removeItem('token');
            // 触发全局事件
            window.dispatchEvent(new CustomEvent('logout'));
            ElMessage.error('登录已过期，请重新登录');
        }
        
        // 显示错误信息
        const message = error.response?.data?.message || error.message;
        ElMessage.error(message);
        
        return Promise.reject(error);
    }
);

export default request; 