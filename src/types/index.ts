export interface Category {
  id: number;
  name: string;
  color: string;
}

export interface Note {
  id: number;
  content: string;
  color: string;
  categoryId: number;
  createTime: string;
} 