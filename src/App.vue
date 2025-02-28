<template>
  <el-container>
    <el-header>
      <el-button type="primary" @click="addNote">添加便签</el-button>
    </el-header>
    <el-main>
      <el-row :gutter="20">
        <el-col :span="12">
          <h2>待办事项</h2>
          <VueDraggableNext v-model="todoNotes" group="notes" @end="onDragEnd">
            <el-card v-for="note in todoNotes" :key="note.id" :style="{ backgroundColor: note.color }" class="mb-2">
              <el-input type="textarea" v-model="note.content" placeholder="输入内容..."></el-input>
              <div class="card-actions">
                <el-button type="success" @click="moveToDone(note)">完成</el-button>
                <el-button type="danger" @click="deleteNote(note, 'todo')">删除</el-button>
              </div>
            </el-card>
          </VueDraggableNext>
        </el-col>
        <el-col :span="12">
          <h2>已完成</h2>
          <VueDraggableNext v-model="doneNotes" group="notes" @end="onDragEnd">
            <el-card v-for="note in doneNotes" :key="note.id" :style="{ backgroundColor: note.color }" class="mb-2">
              <el-input type="textarea" v-model="note.content" readonly></el-input>
              <div class="card-actions">
                <el-button type="info" @click="moveToTodo(note)">恢复</el-button>
                <el-button type="danger" @click="deleteNote(note, 'done')">删除</el-button>
              </div>
            </el-card>
          </VueDraggableNext>
        </el-col>
      </el-row>
    </el-main>
  </el-container>
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
      colors: ['#feff9c', '#7afcff', '#ff7eb9', '#fff740', '#98ff98']
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
    onDragEnd() {
      // Handle any additional logic after dragging
    }
  }
});
</script>

<style scoped>
.el-card {
  min-height: 150px;
  margin-bottom: 20px;
}
.card-actions {
  display: flex;
  justify-content: space-between;
  margin-top: 10px;
}
</style> 