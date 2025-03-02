import request from './request';
import type { Note, CreateNoteDto, UpdateNoteDto } from '../types';

export const noteApi = {
    // 获取所有便签
    getAllNotes() {
        return request.get<Note[]>('/notes');
    },

    // 获取待办便签
    getTodoNotes() {
        return request.get<Note[]>('/notes', {
            params: { isDone: false }
        });
    },

    // 获取已完成便签
    getDoneNotes() {
        return request.get<Note[]>('/notes', {
            params: { isDone: true }
        });
    },

    // 按日期获取便签
    getNotesByDate(date: string) {
        return request.get<Note[]>('/notes', {
            params: { date }
        });
    },

    // 按分类和状态获取便签
    getNotesByCategoryAndStatus(categoryId: number, isDone: boolean) {
        return request.get<Note[]>('/notes', {
            params: { categoryId, isDone }
        });
    },

    // 创建便签
    createNote(note: CreateNoteDto) {
        return request.post<Note>('/notes', note);
    },

    // 更新便签
    updateNote(id: number, note: UpdateNoteDto) {
        return request.put<Note>(`/notes/${id}`, note);
    },

    // 删除便签
    deleteNote(id: number) {
        return request.delete(`/notes/${id}`);
    },

    // 切换便签状态
    toggleNoteStatus(id: number) {
        return request.put<Note>(`/notes/${id}/toggle`);
    }
}; 