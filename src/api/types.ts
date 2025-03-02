export interface Category {
    id: number;
    name: string;
    color: string;
}

export interface Note {
    id: number;
    content: string;
    color: string;
    createTime: string;
    isDone: boolean;
    categoryId: number;
}

export interface CreateNoteDto {
    content: string;
    color: string;
    createTime: string;
    categoryId: number;
    isDone: boolean;
}

export interface UpdateNoteDto {
    content: string;
    color: string;
    categoryId: number;
} 