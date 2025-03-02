import request from './request';
import type { LoginDto, RegisterDto } from '../types'; // 确保路径正确

export const userApi = {
    // 登录
    async login(data: LoginDto) {
        return request.post('/auth/login', data);
    },

    // 注册
    async register(data: RegisterDto) {
        return request.post('/auth/register', data);
    }
}; 