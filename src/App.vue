<template>
  <div class="app-container">
    <el-container>
      <el-header>
        <div class="header-content">
          <el-date-picker
            v-model="selectedDate"
            type="date"
            placeholder="选择日期"
            format="YYYY年MM月DD日"
            value-format="YYYY-MM-DD"
            :clearable="true"
            class="date-picker"
            @change="handleDateChange"
          />
          <el-select v-model="currentCategory" placeholder="选择分类" class="category-select">
            <el-option label="全部" :value="0" />
            <el-option
              v-for="category in categories"
              :key="category.id"
              :label="category.name"
              :value="category.id"
            >
              <div class="category-option">
                <span class="category-color" :style="{ backgroundColor: category.color }"></span>
                {{ category.name }}
              </div>
            </el-option>
          </el-select>
          <el-button type="primary" @click="showAddNoteDialog">添加便签</el-button>
        </div>
      </el-header>
      <el-main>
        <el-row :gutter="20">
          <el-col :span="12">
            <Whiteboard
              title="待办事项"
              v-model:notes="filteredTodoNotes"
              :categories="categories"
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
              v-model:notes="filteredDoneNotes"
              :categories="categories"
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

      <!-- 添加便签对话框 -->
      <el-dialog v-model="addDialogVisible" title="添加便签" width="30%">
        <el-form :model="newNote">
          <el-form-item label="分类">
            <el-select v-model="newNote.categoryId" placeholder="选择分类">
              <el-option
                v-for="category in categories"
                :key="category.id"
                :label="category.name"
                :value="category.id"
              >
                <div class="category-option">
                  <span class="category-color" :style="{ backgroundColor: category.color }"></span>
                  {{ category.name }}
                </div>
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="内容">
            <el-input
              type="textarea"
              v-model="newNote.content"
              :rows="6"
              placeholder="请输入内容..."
            ></el-input>
          </el-form-item>
        </el-form>
        <template #footer>
          <span class="dialog-footer">
            <el-button @click="addDialogVisible = false">取消</el-button>
            <el-button type="primary" @click="addNote">确定</el-button>
          </span>
        </template>
      </el-dialog>

      <!-- 编辑便签对话框 -->
      <el-dialog v-model="dialogVisible" title="编辑便签" width="30%">
        <el-form :model="editingNote">
          <el-form-item label="分类">
            <el-select v-model="editingNote.categoryId" placeholder="选择分类">
              <el-option
                v-for="category in categories"
                :key="category.id"
                :label="category.name"
                :value="category.id"
              >
                <div class="category-option">
                  <span class="category-color" :style="{ backgroundColor: category.color }"></span>
                  {{ category.name }}
                </div>
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="内容">
            <el-input
              type="textarea"
              v-model="editingNote.content"
              :rows="6"
              placeholder="请输入内容..."
            ></el-input>
          </el-form-item>
        </el-form>
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
import { Note, Category } from './types';

export default defineComponent({
  name: 'App',
  components: {
    Whiteboard
  },
  data() {
    return {
      todoNotes: [] as Note[],
      doneNotes: [] as Note[],
      categories: [
        { id: 1, name: '工作', color: this.getRandomColor() },
        { id: 2, name: '学习', color: this.getRandomColor() },
        { id: 3, name: '生活', color: this.getRandomColor() },
        { id: 4, name: '娱乐', color: this.getRandomColor() },
        { id: 5, name: '健康', color: this.getRandomColor() },
        { id: 6, name: '其他', color: this.getRandomColor() }
      ] as Category[],
      currentCategory: 0,
      selectedDate: '',
      dialogVisible: false,
      addDialogVisible: false,
      editingNote: {} as Note,
      newNote: {
        content: '',
        categoryId: 1
      }
    };
  },
  computed: {
    filteredTodoNotes: {
      get(): Note[] {
        let notes = this.todoNotes;
        
        if (this.currentCategory !== 0) {
          notes = notes.filter(note => note.categoryId === this.currentCategory);
        }
        
        if (this.selectedDate) {
          notes = notes.filter(note => note.createTime === this.selectedDate);
        }
        
        return notes;
      },
      set(value: Note[]) {
        if (this.currentCategory === 0 && !this.selectedDate) {
          this.todoNotes = value;
        }
      }
    },
    filteredDoneNotes: {
      get(): Note[] {
        let notes = this.doneNotes;
        
        if (this.currentCategory !== 0) {
          notes = notes.filter(note => note.categoryId === this.currentCategory);
        }
        
        if (this.selectedDate) {
          notes = notes.filter(note => note.createTime === this.selectedDate);
        }
        
        return notes;
      },
      set(value: Note[]) {
        if (this.currentCategory === 0 && !this.selectedDate) {
          this.doneNotes = value;
        }
      }
    }
  },
  methods: {
    getRandomColor(): string {
      const hue = Math.random() * 360;
      const saturation = 60 + Math.random() * 20;
      const lightness = 80 + Math.random() * 10;
      return `hsl(${hue}, ${saturation}%, ${lightness}%)`;
    },
    showAddNoteDialog() {
      this.newNote = {
        content: '',
        categoryId: 1
      };
      this.addDialogVisible = true;
    },
    addNote() {
      const category = this.categories.find(c => c.id === this.newNote.categoryId);
      if (!category) return;
      
      const today = new Date();
      const createTime = `${today.getFullYear()}年${String(today.getMonth() + 1).padStart(2, '0')}月${String(today.getDate()).padStart(2, '0')}日`;
      const newNote: Note = {
        id: Date.now(),
        content: this.newNote.content,
        categoryId: this.newNote.categoryId,
        color: this.getRandomColor(),
        createTime: createTime
      };

      this.todoNotes = [...this.todoNotes, newNote];
      this.addDialogVisible = false;
      this.newNote = {
        content: '',
        categoryId: 1
      };
    },
    editNote(note: Note) {
      this.editingNote = note;
      this.dialogVisible = true;
    },
    saveNote() {
      const noteList = this.todoNotes.includes(this.editingNote) ? this.todoNotes : this.doneNotes;
      const index = noteList.findIndex(n => n.id === this.editingNote.id);
      if (index !== -1) {
        const category = this.categories.find(c => c.id === this.editingNote.categoryId);
        noteList[index] = {
          ...this.editingNote,
          color: category?.color || this.categories[0].color
        };
      }
      this.dialogVisible = false;
    },
    moveToDone(note: Note) {
      const index = this.todoNotes.findIndex(n => n.id === note.id);
      if (index !== -1) {
        this.todoNotes.splice(index, 1);
        this.doneNotes.push({ ...note });
      }
    },
    moveToTodo(note: Note) {
      const index = this.doneNotes.findIndex(n => n.id === note.id);
      if (index !== -1) {
        this.doneNotes.splice(index, 1);
        this.todoNotes.push({ ...note });
      }
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
        const note = evt.added.element;
        if (evt.added.newIndex !== undefined) {
          if (this.todoNotes.includes(note)) {
            this.moveToTodo(note);
          } else if (this.doneNotes.includes(note)) {
            this.moveToDone(note);
          }
        }
      }
    },
    handleDateChange(date: string) {
      if (!date) {
        this.selectedDate = '';
        return;
      }
      
      const dateObj = new Date(date);
      this.selectedDate = `${dateObj.getFullYear()}年${String(dateObj.getMonth() + 1).padStart(2, '0')}月${String(dateObj.getDate()).padStart(2, '0')}日`;
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

.header-content {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 20px;
}

.date-picker {
  width: 200px;
}

.category-select {
  width: 200px;
}

.category-option {
  display: flex;
  align-items: center;
  gap: 8px;
}

.category-color {
  width: 16px;
  height: 16px;
  border-radius: 4px;
}
</style> 