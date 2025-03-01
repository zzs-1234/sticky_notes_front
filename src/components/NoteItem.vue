<template>
  <div class="note" @click="$emit('edit', note)">
    <div class="note-content" :style="{ backgroundColor: note.color }">
      <div class="note-tags">
        <div class="note-date tag">{{ note.createTime }}</div>
        <div class="note-category tag" :style="{ backgroundColor: getCategoryColor() }">
          {{ getCategoryName() }}
        </div>
      </div>
      <div class="note-text">{{ note.content || placeholder }}</div>
      <div class="note-actions">
        <el-button 
          size="small" 
          :type="actionType" 
          @click.stop="$emit('action', note)"
        >
          {{ actionText }}
        </el-button>
        <el-button 
          size="small" 
          type="danger" 
          @click.stop="$emit('delete', note)"
        >
          删除
        </el-button>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, PropType } from 'vue';

interface Note {
  id: number;
  content: string;
  color: string;
  categoryId: number;
  createTime: string;
}

export default defineComponent({
  name: 'NoteItem',
  props: {
    note: {
      type: Object as PropType<Note>,
      required: true
    },
    placeholder: {
      type: String,
      default: '点击编辑'
    },
    actionType: {
      type: String,
      default: 'success'
    },
    actionText: {
      type: String,
      default: '完成'
    },
    categories: {
      type: Array as PropType<{ id: number; name: string; color: string }[]>,
      required: true
    }
  },
  emits: ['edit', 'action', 'delete'],
  methods: {
    getCategoryColor() {
      const category = this.categories.find(c => c.id === this.note.categoryId);
      return category?.color || '#dcdcdc';
    },
    getCategoryName() {
      const category = this.categories.find(c => c.id === this.note.categoryId);
      return category?.name || '未分类';
    }
  }
});
</script>

<style scoped>
.note {
  width: 100%;
  margin: 0;
  cursor: move;
  display: inline-block;
  position: relative;
}

.note-content {
  min-height: 200px;
  padding: 15px;
  border-radius: 2px;
  box-shadow: 2px 2px 5px rgba(0,0,0,0.2);
  position: relative;
  word-wrap: break-word;
  transition: transform 0.2s;
  transform: rotate(-1deg);
  margin: 5px;
  display: flex;
  flex-direction: column;
}

.note:nth-child(even) .note-content {
  transform: rotate(1deg);
}

.note-content:hover {
  transform: scale(1.05) rotate(0);
  z-index: 2;
}

.note-text {
  min-height: 120px;
  margin-bottom: 40px;
  white-space: pre-wrap;
  font-size: 14px;
  line-height: 1.5;
  color: #333;
  overflow: hidden;
  display: -webkit-box;
  -webkit-line-clamp: 6;
  -webkit-box-orient: vertical;
  position: relative;
}

.note-text::after {
  display: none;
}

.note-actions {
  position: absolute;
  bottom: 10px;
  left: 0;
  right: 0;
  display: flex;
  justify-content: space-around;
  padding: 0 10px;
  opacity: 0;
  transition: opacity 0.2s;
  background: transparent;
}

.note-content:hover .note-actions {
  opacity: 1;
}

.note-tags {
  position: absolute;
  top: -5px;
  right: -5px;
  display: flex;
  gap: 5px;
}

.tag {
  padding: 2px 8px;
  border-radius: 4px;
  font-size: 12px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.note-category {
  color: #fff;
}

.note-date {
  background-color: #f2f2f2;
  color: #666;
}
</style> 