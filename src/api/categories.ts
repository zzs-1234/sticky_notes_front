import request from './request';
import type { Category } from '../types';
import { AxiosResponse } from 'axios';

export const categoryApi = {
    // 获取所有分类
    async getAllCategories() {
        const response: AxiosResponse<Category[]> = await request.get<Category[]>('/categories');
        return response.data;
    },

    // 获取单个分类
    async getCategoryById(id: number) {
        const response = await request.get<Category>(`/categories/${id}`);
        return response.data;
    },

    // 创建分类
    async createCategory(category: Omit<Category, 'id'>) {
        const response = await request.post<Category>('/categories', category);
        return response.data;
    },

    // 更新分类
    async updateCategory(id: number, category: Omit<Category, 'id'>) {
        const response = await request.put<Category>(`/categories/${id}`, category);
        return response.data;
    },

    // 删除分类
    async deleteCategory(id: number) {
        return request.delete(`/categories/${id}`);
    }
}; 