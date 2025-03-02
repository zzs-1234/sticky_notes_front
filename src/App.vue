<template>
  <div class="app-container">
    <el-container>
      <el-header>
        <div class="header-content">
          <div class="button-group">
            <el-button type="primary" @click="showAddNoteDialog">添加便签</el-button>
            <el-button type="primary" @click="showLoginDialog">登录</el-button>
            <el-button type="success" @click="showRegisterDialog">注册</el-button>
          </div>
          <el-date-picker
            v-model="selectedDate"
            type="date"
            placeholder="选择日期"
            format="YYYY年MM月DD日"
            value-format="YYYY-MM-DD"
            :clearable="true"
            class="date-picker"
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
        </div>
      </el-header>

      <el-main>
        <div class="boards-container">
          <Whiteboard
            title="待办事项"
            v-model:notes="filteredTodoNotes"
            :categories="categories"
            action-text="完成"
            action-type="success"
            @edit="editNote"
            @action="moveToDone"
            @delete="deleteNote"
          />
          <Whiteboard
            title="已完成"
            v-model:notes="filteredDoneNotes"
            :categories="categories"
            action-text="待办"
            action-type="warning"
            @edit="editNote"
            @action="moveToTodo"
            @delete="deleteNote"
          />
        </div>
      </el-main>
    </el-container>

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

    <Login v-model:visible="loginDialogVisible" @login-success="handleLoginSuccess" />
    <Register v-model:visible="registerDialogVisible" @register-success="handleRegisterSuccess" />
  </div>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue';
import Whiteboard from './components/Whiteboard.vue';
import { noteApi, categoryApi } from './api';
import type { Note, Category } from './types';
import Login from './components/Login.vue';
import Register from './components/Register.vue';

export default defineComponent({
  name: 'App',
  components: {
    Whiteboard,
    Login,
    Register
  },
  data() {
    return {
      todoNotes: [] as Note[],
      doneNotes: [] as Note[],
      categories: [] as Category[],
      currentCategory: 0,
      selectedDate: '',
      dialogVisible: false,
      addDialogVisible: false,
      editingNote: {} as Note,
      newNote: {
        content: '',
        categoryId: 1
      },
      loginDialogVisible: false,
      registerDialogVisible: false,
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
  async created() {
    try {
      // 获取所有分类
      const categories = await categoryApi.getAllCategories();
      this.categories = categories;
      // 获取待办和已完成便签
      const [todoNotes, doneNotes] = await Promise.all([
        noteApi.getTodoNotes(),
        noteApi.getDoneNotes()
      ]);
      
      this.todoNotes = todoNotes.data;
      this.doneNotes = doneNotes.data;
      console.log(this.todoNotes);
      console.log(this.doneNotes);
    } catch (error) {
      console.error('初始化数据失败:', error);
    }
  },
  methods: {
    getRandomColor(): string {
      const hue = Math.floor(Math.random() * 360); // 随机色相
      const saturation = (Math.random() * 20 + 40).toFixed(2); // 饱和度范围 40% - 60%，保留两位小数
      const lightness = (Math.random() * 30 + 70).toFixed(2); // 亮度范围 70% - 100%，保留两位小数
      return `hsl(${hue}, ${saturation}%, ${lightness}%)`; // 返回 HSL
    },
    showAddNoteDialog() {
      this.newNote = {
        content: '',
        categoryId: 1
      };
      this.addDialogVisible = true;
    },
    async addNote() {
      try {
        const category = this.categories.find(c => c.id === this.newNote.categoryId);
        if (!category) return;

        const today = new Date();
        const createTime = `${today.getFullYear()}年${String(today.getMonth() + 1).padStart(2, '0')}月${String(today.getDate()).padStart(2, '0')}日`;
        let temp = {
          content: this.newNote.content,
          categoryId: this.newNote.categoryId,
          color: this.getRandomColor(),
          isDone: false,
          createTime
        }
        const newNote = await noteApi.createNote(temp);
        this.todoNotes.push(newNote.data);
        this.addDialogVisible = false;
        this.newNote = {
          content: '',
          categoryId: 1
        };
      } catch (error) {
        console.error('添加便签失败:', error);
      }
    },
    editNote(note: Note) {
      this.editingNote = note;
      console.log(this.editingNote);
      this.dialogVisible = true;
    },
    async saveNote() {
      try {
        const updatedNote = {
          ...this.editingNote
        };
        console.log(updatedNote);
        await noteApi.updateNote(this.editingNote.id, updatedNote);

        const noteList = this.todoNotes.includes(this.editingNote) ? this.todoNotes : this.doneNotes;
        const index = noteList.findIndex(n => n.id === this.editingNote.id);
        if (index !== -1) {
          noteList[index] = updatedNote;
        }

        this.dialogVisible = false;
      } catch (error) {
        console.error('更新便签失败:', error);
      }
    },
    async deleteNote(note: Note, section: string) {
      try {
        await noteApi.deleteNote(note.id);
        if (section === 'todo') {
          this.todoNotes = this.todoNotes.filter(n => n.id !== note.id);
        } else {
          this.doneNotes = this.doneNotes.filter(n => n.id !== note.id);
        }
      } catch (error) {
        console.error('删除便签失败:', error);
      }
    },
    async moveToDone(note: Note) {
      try {
        const updatedNote = await noteApi.toggleNoteStatus(note.id);
        const index = this.todoNotes.findIndex(n => n.id === note.id);
        if (index !== -1) {
          this.todoNotes.splice(index, 1);
          this.doneNotes.push(updatedNote.data);
        }
      } catch (error) {
        console.error('更新便签状态失败:', error);
      }
    },
    async moveToTodo(note: Note) {
      try {
        const updatedNote = await noteApi.toggleNoteStatus(note.id);
        const index = this.doneNotes.findIndex(n => n.id === note.id);
        if (index !== -1) {
          this.doneNotes.splice(index, 1);
          this.todoNotes.push(updatedNote.data);
        }
      } catch (error) {
        console.error('更新便签状态失败:', error);
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
    },
    showLoginDialog() {
      this.loginDialogVisible = true;
    },
    showRegisterDialog() {
      this.registerDialogVisible = true;
    },
    handleLoginSuccess() {
      console.log('登录成功');
    },
    handleRegisterSuccess() {
      console.log('注册成功');
    }
  }
});
</script>

<style scoped>
.app-container {
  height: 100vh;
  background-color: #f0f2f5;
  min-width: 375px;
  overflow-x: auto;
}

.el-container {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}

.el-header {
  padding: 0;
  background-color: white;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  position: sticky;
  top: 0;
  height: auto !important;
}

.header-content {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 20px;
  padding: 10px 20px;
  flex-wrap: wrap;
  min-height: 60px;
}

.el-main {
  flex: 1;
  padding: 20px;
  overflow-y: auto; /* 允许内容区域滚动 */
}

.boards-container {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 20px;
  min-height: calc(100vh - 180px); /* 减去header和padding的高度 */
}

.date-picker,
.category-select {
  width: 200px;
  min-width: 150px;
}

.button-group {
  display: flex;
  gap: 10px;
  flex-wrap: nowrap; /* 防止按钮换行 */
  justify-content: center;
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

/* 在 1000px 以下变为单列 */
@media (max-width: 1000px) {
  .boards-container {
    grid-template-columns: 1fr;
  }
}

/* 小屏幕适配 */
@media (max-width: 480px) {
  .header-content {
    flex-direction: column;
    align-items: stretch;
    padding: 10px;
    gap: 10px;
  }

  .date-picker,
  .category-select {
    width: 100%;
  }

  .button-group {
    justify-content: center;
    width: auto;
    margin: 0 auto;
    padding: 5px 0;
  }

  .el-button {
    padding: 8px 15px; /* 可选：调整按钮大小 */
    font-size: 14px; /* 可选：调整字体大小 */
  }

  .el-main {
    padding: 10px;
  }
}
</style> 