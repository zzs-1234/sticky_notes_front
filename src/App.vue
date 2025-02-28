<template>
  <div class="app-container">
    <el-container>
      <el-header>
        <el-button type="primary" @click="addNote">添加便签</el-button>
      </el-header>
      <el-main>
        <el-row :gutter="20">
          <el-col :span="12">
            <div class="board-container">
              <div class="board-title">待办事项</div>
              <div class="whiteboard">
                <VueDraggableNext 
                  v-model="todoNotes" 
                  :group="{ name: 'notes', pull: true, put: true }"
                  @change="handleChange"
                  item-key="id"
                  class="notes-container"
                >
                  <div v-for="note in todoNotes" :key="note.id" class="note" @click="editNote(note)">
                    <div class="note-content" :style="{ backgroundColor: note.color }">
                      {{ note.content || '点击编辑' }}
                      <div class="note-actions">
                        <el-button size="small" type="success" @click.stop="moveToDone(note)">完成</el-button>
                        <el-button size="small" type="danger" @click.stop="deleteNote(note, 'todo')">删除</el-button>
                      </div>
                    </div>
                  </div>
                </VueDraggableNext>
              </div>
            </div>
          </el-col>
          <el-col :span="12">
            <div class="board-container">
              <div class="board-title">已完成</div>
              <div class="whiteboard">
                <VueDraggableNext 
                  v-model="doneNotes" 
                  :group="{ name: 'notes', pull: true, put: true }"
                  @change="handleChange"
                  item-key="id"
                  class="notes-container"
                >
                  <div v-for="note in doneNotes" :key="note.id" class="note" @click="editNote(note)">
                    <div class="note-content" :style="{ backgroundColor: note.color }">
                      {{ note.content || '已完成' }}
                      <div class="note-actions">
                        <el-button size="small" type="info" @click.stop="moveToTodo(note)">恢复</el-button>
                        <el-button size="small" type="danger" @click.stop="deleteNote(note, 'done')">删除</el-button>
                      </div>
                    </div>
                  </div>
                </VueDraggableNext>
              </div>
            </div>
          </el-col>
        </el-row>
      </el-main>

      <!-- 编辑对话框 -->
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
import { VueDraggableNext } from 'vue-draggable-next';

interface Note {
  id: number;
  content: string;
  color: string;
}

export default defineComponent({
  components: {
    VueDraggableNext
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
      this.editingNote = { ...note };
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

.board-container {
  padding: 20px;
  height: calc(100vh - 120px); /* 减去header和padding的高度 */
}

.board-title {
  font-size: 22px; /* 稍微增大标题字号 */
  font-weight: bold;
  margin-bottom: 20px; /* 增加底部间距 */
  color: #333;
  text-shadow: 1px 1px 0 rgba(255, 255, 255, 0.8); /* 添加文字阴影 */
}

.whiteboard {
  background: rgba(255, 255, 255, 0.95);
  border: 1px solid #e4e7ed;
  border-radius: 12px; /* 增加圆角 */
  box-shadow: 
    0 4px 12px rgba(0, 0, 0, 0.05),
    0 1px 2px rgba(0, 0, 0, 0.08),
    inset 0 0 20px rgba(0, 0, 0, 0.02); /* 添加内阴影效果 */
  height: calc(100% - 40px);
  padding: 25px; /* 增加内边距 */
  position: relative;
  overflow-y: auto;
  transition: box-shadow 0.3s ease; /* 添加过渡效果 */
}

.whiteboard:hover {
  box-shadow: 
    0 6px 16px rgba(0, 0, 0, 0.08),
    0 2px 4px rgba(0, 0, 0, 0.12),
    inset 0 0 20px rgba(0, 0, 0, 0.02); /* 悬停时加深阴影 */
}

.notes-container {
  min-height: 100%;
  position: relative;
  z-index: 1;
  display: grid;
  grid-template-columns: repeat(3, 1fr); /* 每行三个便签 */
  gap: 15px;
  align-items: start;
}

.note {
  width: 100%; /* 改为100%以适应网格布局 */
  margin: 0; /* 移除margin，使用grid的gap */
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
  margin: 5px; /* 添加一些间距 */
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

/* 其他样式保持不变 */
.note:nth-child(even) .note-content {
  transform: rotate(1deg);
}

.note-content:hover {
  transform: scale(1.05) rotate(0);
  z-index: 2;
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

.el-header {
  padding: 20px;
  padding-bottom: 0px;
  text-align: center;
  background: transparent;
  position: relative;
  z-index: 1;
  height: auto !important; /* 覆盖 Element Plus 的默认高度 */
}

.el-main {
  padding: 20px;
  padding-top: 5px;
  background: transparent;
  position: relative;
  z-index: 1;
  height: calc(100vh - 100px); /* 设置主容器高度 */
  overflow: hidden; /* 防止出现双滚动条 */
}

/* 磁铁效果 */
.whiteboard::after {
  content: '';
  position: absolute;
  top: 15px; /* 调整位置 */
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
</style> 