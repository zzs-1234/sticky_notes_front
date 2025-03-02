<template>
  <div class="board-container">
    <div class="board-title">{{ title }}</div>
    <div class="whiteboard">
      <VueDraggableNext 
        v-model="noteList"
        :group="{ name: 'notes', pull: true, put: true }"
        @change="handleChange"
        item-key="id"
        class="notes-container"
      >
        <NoteItem
          v-for="note in noteList"
          :key="note.id"
          :note="note"
          :placeholder="placeholder"
          :action-type="actionType"
          :action-text="actionText"
          :categories="categories"
          @edit="$emit('edit', note)"
          @action="$emit('action', note)"
          @delete="$emit('delete', note)"
        />
      </VueDraggableNext>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, PropType, computed } from 'vue';
import { VueDraggableNext } from 'vue-draggable-next';
import NoteItem from './NoteItem.vue';
import { Note, Category } from '../types';

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
    },
    categories: {
      type: Array as PropType<Category[]>,
      required: true
    }
  },
  emits: ['update:notes', 'edit', 'action', 'delete', 'change'],
  computed: {
    noteList: {
      get(): Note[] {
        return this.notes;
      },
      set(value: Note[]) {
        this.$emit('update:notes', value);
      }
    }
  },
  methods: {
    handleChange(evt: any) {
      this.$emit('change', evt);
    }
  }
});
</script>

<style scoped>
.board-container {
  height: 100%;
  display: flex;
  flex-direction: column;
  min-height: 400px;
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
  flex: 1;
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
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 15px;
  min-height: 100%;
}

/* 在 1200px 以下显示两列 */
@media (max-width: 1200px) {
  .notes-container {
    grid-template-columns: repeat(2, 1fr);
  }
}

/* 在 1000px 以下变为单列布局 */
@media (max-width: 1000px) {
  .notes-container {
    grid-template-columns: 1fr;
  }
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