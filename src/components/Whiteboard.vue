<template>
  <div class="board-container">
    <div class="board-title">{{ title }}</div>
    <div class="whiteboard">
      <VueDraggableNext 
        v-model="notes" 
        :group="{ name: 'notes', pull: true, put: true }"
        @change="$emit('change', $event)"
        item-key="id"
        class="notes-container"
      >
        <NoteItem
          v-for="note in notes"
          :key="note.id"
          :note="note"
          :placeholder="placeholder"
          :action-type="actionType"
          :action-text="actionText"
          @edit="$emit('edit', note)"
          @action="$emit('action', note)"
          @delete="$emit('delete', note)"
        />
      </VueDraggableNext>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, PropType } from 'vue';
import { VueDraggableNext } from 'vue-draggable-next';
import NoteItem from './NoteItem.vue';

interface Note {
  id: number;
  content: string;
  color: string;
}

export default defineComponent({
  name: 'Whiteboard',
  components: {
    VueDraggableNext,
    NoteItem
  },
  props: {
    title: {
      type: String,
      required: true
    },
    notes: {
      type: Array as PropType<Note[]>,
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
  emits: ['update:notes', 'edit', 'action', 'delete', 'change']
});
</script>

<style scoped>
.board-container {
  padding: 20px;
  height: calc(100vh - 120px);
}

.board-title {
  font-size: 22px;
  font-weight: bold;
  margin-bottom: 20px;
  color: #333;
  text-shadow: 1px 1px 0 rgba(255, 255, 255, 0.8);
}

.whiteboard {
  background: rgba(255, 255, 255, 0.95);
  border: 1px solid #e4e7ed;
  border-radius: 12px;
  box-shadow: 
    0 4px 12px rgba(0, 0, 0, 0.05),
    0 1px 2px rgba(0, 0, 0, 0.08),
    inset 0 0 20px rgba(0, 0, 0, 0.02);
  height: calc(100% - 40px);
  padding: 25px;
  position: relative;
  overflow-y: auto;
  transition: box-shadow 0.3s ease;
}

.whiteboard:hover {
  box-shadow: 
    0 6px 16px rgba(0, 0, 0, 0.08),
    0 2px 4px rgba(0, 0, 0, 0.12),
    inset 0 0 20px rgba(0, 0, 0, 0.02);
}

.notes-container {
  min-height: 100%;
  position: relative;
  z-index: 1;
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 15px;
  align-items: start;
}

/* 自定义滚动条样式 */
.whiteboard::-webkit-scrollbar {
  width: 10px;
}

.whiteboard::-webkit-scrollbar-track {
  background: #f8f9fa;
  border-radius: 6px;
}

.whiteboard::-webkit-scrollbar-thumb {
  background: #dcdfe6;
  border-radius: 6px;
  border: 2px solid #f8f9fa;
}

.whiteboard::-webkit-scrollbar-thumb:hover {
  background: #c0c4cc;
}

/* 磁铁效果 */
.whiteboard::after {
  content: '';
  position: absolute;
  top: 15px;
  left: 15px;
  width: 10px;
  height: 10px;
  background: #666;
  border-radius: 50%;
  box-shadow: 
    0 0 3px rgba(0,0,0,0.4),
    calc(100% - 30px) 0 0 #666,
    0 calc(100% - 30px) 0 #666,
    calc(100% - 30px) calc(100% - 30px) 0 #666;
}
</style> 