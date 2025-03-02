import axios from 'axios';

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
        // 在这里可以添加认证信息等
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
        // 统一错误处理
        console.error('请求错误:', error);
        return Promise.reject(error);
    }
);

export default request; 