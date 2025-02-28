<template>
  <div class="note" @click="$emit('edit', note)">
    <div class="note-content" :style="{ backgroundColor: note.color }">
      {{ note.content || placeholder }}
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
    }
  },
  emits: ['edit', 'action', 'delete']
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
  justify-content: space-between;
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
  content: '';
  position: absolute;
  bottom: 0;
  right: 0;
  left: 0;
  height: 20px;
  background: linear-gradient(transparent, var(--note-color, #fff));
  pointer-events: none;
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
}

.note-content:hover .note-actions {
  opacity: 1;
}
</style> 