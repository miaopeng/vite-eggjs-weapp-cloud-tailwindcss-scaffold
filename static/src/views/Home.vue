<template>
  <main>
    <div class="flex justify-between">
      <h2>
        问题列表
        <span class="italic text-sm">Total: {{ questions.length }}</span>
      </h2>
      <div>
        <sl-button @click="addQuestion" size="small">
          <sl-icon slot="prefix" name="plus"></sl-icon>添加问题
        </sl-button>
      </div>
    </div>
    <div class="px-2 py-2 sm:px-0 text-xs">
      <div
        v-for="q in questions"
        :key="q._id"
        class="py-2 border-b flex justify-between"
      >
        <div class="flex">
          <sl-tag size="small">{{ q.level }}</sl-tag>
          <div class="ml-2">
            {{ q.content }}
            <div class="text-gray-600 flex items-center">
              <span v-for="(answer, index) in q.answers" :key="answer._id"
                ><sl-icon
                  name="check2"
                  v-if="!index"
                  style="vertical-align: text-bottom; margin-right: 4px"
                /><sl-icon
                  name="dot"
                  v-if="index"
                  style="vertical-align: text-bottom"
                />{{ answer.content }}</span
              >
            </div>
          </div>
        </div>
        <div class="flex">
          <a
            href="javascript:;"
            class="text-gray-500 flex items-center"
            @click="editQuestion(q)"
          >
            <sl-icon name="pencil-square" />
            <span class="ml-1">编辑</span>
          </a>
          <a
            href="javascript:;"
            class="text-gray-500 flex items-center ml-2"
            @click="removeQuestion(q._id)"
          >
            <sl-icon name="trash" />
            <span class="ml">删除</span>
          </a>
        </div>
      </div>
    </div>
    <sl-dialog
      ref="dialog"
      :label="curQuestion._id ? '编辑问题' : '添加问题'"
      class="dialog-width"
      style="--width: 50vw"
    >
      <form ref="form" class="form-overview" @submit.prevent="onSubmit">
        <label class="block">难度级别: </label>
        <select
          name="level"
          required
          class="border rounded px-2 py-1 mb-2"
          v-model="curQuestion.level"
        >
          <option value="a">A 较难</option>
          <option value="b">B 普通</option>
          <option value="c">C 较易</option>
        </select>
        <br />
        <label class="block">问题: </label>
        <textarea
          name="content"
          type="text"
          required
          v-model="curQuestion.content"
          class="border rounded p-2 w-full"
        ></textarea>
        <br />
        <h3>正确答案</h3>
        <input
          type="text"
          v-model="answers[0].content"
          name="answer"
          class="border p-2"
        />

        <h3>其他答案</h3>
        <ul class="answers">
          <li
            class="my-1"
            v-for="(answer, index) in answers.slice(1)"
            :key="index"
          >
            <input
              type="text"
              v-model="answer.content"
              name="answer"
              class="border p-2"
            />
          </li>
        </ul>
        <br />
        <br />
        <button
          type="submit"
          class="border rounded px-3 py-1 flex items-center"
          :disabled="submitting"
        >
          <sl-spinner class="mr-2" v-if="submitting" />
          保存
        </button>
      </form>
    </sl-dialog>
  </main>
</template>

<script>
import request from '../utils/request';
import { nanoid } from 'nanoid';
export default {
  data() {
    return {
      submitting: false,
      questions: [],
      answers: [{}, {}, {}, {}],
      curQuestion: { content: '', level: null },
    };
  },
  mounted() {
    this.update();
  },
  methods: {
    update() {
      request('/api/questions').then((res) => (this.questions = res.data));
    },
    initAnswers(question) {
      if (question) {
        this.answers = Array.from({ length: 4 }, (v, index) => {
          if (question.answers[index]) {
            return question.answers[index];
          }
          return { _id: nanoid() };
        });
      } else {
        this.answers = Array.from({ length: 4 }, () => ({ _id: nanoid() }));
      }
    },
    openDialog() {
      this.$refs.dialog.show();
    },
    hideDialog() {
      this.$refs.dialog.hide();
    },
    async onSubmit(evt) {
      const { content, level } = evt.target.elements;
      const data = {
        content: content.value,
        level: level.value,
        correct: this.answers[0]._id,
        answers: this.answers,
      };

      const { _id } = this.curQuestion;
      const url = _id ? `/api/questions/${_id}` : '/api/questions';

      this.submitting = true;
      const { errors } = await request(url, {
        method: _id ? 'PUT' : 'POST',
        data,
      });
      this.submitting = false;

      if (!errors) {
        this.hideDialog();
        this.update();
      }
    },

    async addQuestion() {
      this.curQuestion = { content: '', level: null };
      this.initAnswers();
      this.openDialog();
    },

    async editQuestion(question) {
      this.curQuestion = question;
      this.initAnswers(question);
      this.openDialog();
    },

    async removeQuestion(_id) {
      console.log('_id', _id);
      const { errors } = await request(`/api/questions/${_id}`, {
        method: 'DELETE',
      });
      console.log('errors', errors);
      if (!errors) {
        this.update();
      }
    },
  },
};
</script>
