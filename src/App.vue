<template>
  <div class="app-container">
    <el-container>
      <el-header>
        <el-button type="primary" @click="addNote">添加便签</el-button>
      </el-header>
      <el-main>
        <el-row :gutter="20">
          <el-col :span="12">
            <Whiteboard
              title="待办事项"
              v-model:notes="todoNotes"
              placeholder="点击编辑"
              action-type="success"
              action-text="完成"
              @edit="editNote"
              @action="moveToDone"
              @delete="(note) => deleteNote(note, 'todo')"
              @change="handleChange"
            />
          </el-col>
          <el-col :span="12">
            <Whiteboard
              title="已完成"
              v-model:notes="doneNotes"
              placeholder="已完成"
              action-type="info"
              action-text="恢复"
              @edit="editNote"
              @action="moveToTodo"
              @delete="(note) => deleteNote(note, 'done')"
              @change="handleChange"
            />
          </el-col>
        </el-row>
      </el-main>

      <el-dialog v-model="dialogVisible" title="编辑便签" width="30%">
        <el-input
          type="textarea"
          v-model="editingNote.content"
          :rows="6"
          placeholder="请输入内容..."
        ></el-input>
        <template #footer>
          <span class="dialog-footer">
            <el-button @click="dialogVisible = false">取消</el-button>
            <el-button type="primary" @click="saveNote">确定</el-button>
          </span>
        </template>
      </el-dialog>
    </el-container>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import Whiteboard from './components/Whiteboard.vue';

interface Note {
  id: number;
  content: string;
  color: string;
}

export default defineComponent({
  name: 'App',
  components: {
    Whiteboard
  },
  data() {
    return {
      todoNotes: [] as Note[],
      doneNotes: [] as Note[],
      colors: ['#feff9c', '#7afcff', '#ff7eb9', '#fff740', '#98ff98'],
      dialogVisible: false,
      editingNote: {} as Note,
      editingNoteIndex: -1
    };
  },
  methods: {
    addNote() {
      const newNote: Note = {
        id: Date.now(),
        content: '',
        color: this.colors[Math.floor(Math.random() * this.colors.length)]
      };
      this.todoNotes.push(newNote);
    },
    editNote(note: Note) {
      this.editingNote = note;
      this.dialogVisible = true;
    },
    saveNote() {
      const noteList = this.todoNotes.includes(this.editingNote) ? this.todoNotes : this.doneNotes;
      const index = noteList.findIndex(n => n.id === this.editingNote.id);
      if (index !== -1) {
        noteList[index].content = this.editingNote.content;
      }
      this.dialogVisible = false;
    },
    moveToDone(note: Note) {
      this.todoNotes = this.todoNotes.filter(n => n.id !== note.id);
      this.doneNotes.push(note);
    },
    moveToTodo(note: Note) {
      this.doneNotes = this.doneNotes.filter(n => n.id !== note.id);
      this.todoNotes.push(note);
    },
    deleteNote(note: Note, section: string) {
      if (section === 'todo') {
        this.todoNotes = this.todoNotes.filter(n => n.id !== note.id);
      } else {
        this.doneNotes = this.doneNotes.filter(n => n.id !== note.id);
      }
    },
    handleChange(evt: any) {
      if (evt.added) {
        // 处理添加到新列表的情况
        console.log('Item was added to list', evt.added.element);
      }
      if (evt.removed) {
        // 处理从原列表移除的情况
        console.log('Item was removed from list', evt.removed.element);
      }
    }
  }
});
</script>

<style scoped>
.app-container {
  min-height: 100vh;
  background: linear-gradient(135deg, #f5f7fa 0%, #e4e7ed 100%);
  position: relative;
}

.app-container::before {
  content: '';
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: 
    radial-gradient(circle at 15% 50%, rgba(255,255,255,0.1) 0%, transparent 25%),
    radial-gradient(circle at 85% 30%, rgba(255,255,255,0.15) 0%, transparent 30%);
  pointer-events: none;
}

.el-header {
  padding: 20px;
  padding-bottom: 0px;
  text-align: center;
  background: transparent;
  position: relative;
  z-index: 1;
  height: auto !important;
}

.el-main {
  padding: 20px;
  padding-top: 5px;
  background: transparent;
  position: relative;
  z-index: 1;
  height: calc(100vh - 100px);
  overflow: hidden;
}

/* 调整按钮样式以配合背景 */
.el-button--primary {
  background: linear-gradient(135deg, #409eff 0%, #3a8ee6 100%);
  border: none;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.1);
  transition: all 0.3s ease;
}

.el-button--primary:hover {
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
}

/* 对话框样式优化 */
:deep(.el-dialog) {
  border-radius: 8px;
}

:deep(.el-dialog__body) {
  padding: 20px;
}

:deep(.el-textarea__inner) {
  min-height: 150px !important;
  font-size: 14px;
  line-height: 1.5;
  padding: 12px;
  background-color: #f8f9fa;
  border-radius: 4px;
  resize: none;
}

:deep(.el-textarea__inner:focus) {
  background-color: #fff;
}
</style> 