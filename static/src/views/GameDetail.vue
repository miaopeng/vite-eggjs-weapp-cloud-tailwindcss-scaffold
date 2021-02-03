<template>
  <main v-if="game">
    <h2 class="text-lg mb-4">活动详情</h2>
    <div>名称：{{ game.name }}</div>
    <div>开始时间：{{ $utils.formatTime(game.start_at) }}</div>
    <div>题目条数：{{ game.question_count }}</div>

    <div class="border mb-2 p-2" v-if="question">
      <sl-spinner v-if="loading" />
      <div v-else>
        <div class="q-content mb-2">第{{ index }}题 {{ question.content }}</div>
        <div class="q-answers">
          <div v-for="a in question.answers" :key="a._id">
            <button
              :class="{
                'a-button': true,
                correct:
                  question.status === 'complete' && question.correct === a._id,
                incorrect:
                  question.status === 'complete' &&
                  question.answerId === a._id &&
                  question.correct !== a._id,
              }"
              @click="onClickAnswer(question._id, a._id)"
            >
              {{ a.content }}
            </button>
          </div>
        </div>
      </div>
    </div>
  </main>
</template>

<script>
import request from '../utils/request';

export default {
  data() {
    return {
      submitting: false,
      game: null,
      question: null,
      index: 0,
    };
  },
  mounted() {
    this.update();
  },
  methods: {
    async update() {
      const { data, errors } = await request(
        `/api/games/${this.$route.params._id}`
      );
      if (!errors) {
        this.game = data;
        this.nextQuestion();
      }
    },

    hasNext() {
      return this.game && this.game.questions[this.index];
    },

    nextQuestion() {
      if (!this.hasNext()) {
        alert('答题结束');
        return;
      }
      this.current = this.game.questions[this.index++];
      this.getQuestion(this.current._id);
    },

    async getQuestion(id) {
      this.loading = true;
      const { data, errors } = await request(`/api/questions/${id}`);
      this.loading = false;

      console.log('question', data);
      if (!errors) {
        this.question = data;
      }
    },

    async onClickAnswer(questionId, answerId) {
      if (this.question.status === 'complete') return;

      this.question = { ...this.question, status: 'pending', answerId };
      const { data, errors } = await request(
        `/api/questions/${questionId}/answer`,
        {
          method: 'POST',
        }
      );

      if (!errors) {
        this.question = {
          ...this.question,
          status: 'complete',
          correct: data.correct,
        };

        setTimeout(() => {
          this.nextQuestion();
        }, 1000);
      }
    },
  },
};
</script>

<style l>
.a-button {
  display: inline-block;
  border: none;
  outline: none;
  width: auto;
  color: #555;
  border-radius: 0.4rem;
  line-height: 1;
  font-weight: 600;
  cursor: pointer;
  transition: 100ms all ease-in-out;
  user-select: none;
  padding: 1rem 1rem 1.3rem;
  font-size: 1rem;
  letter-spacing: 0.05rem;
  text-shadow: 0.1rem 0.1rem 0 #ddd;
  background: #eee;
  box-shadow: inset 0 -0.4rem 0 #ddd;
  margin-bottom: 16px;
}
.a-button.correct {
  color: white;
  text-shadow: 0.1rem 0.1rem 0 #70a22c;
  background: #8cc938;
  box-shadow: inset 0 -0.4rem 0 #70a22c;
}
.a-button.incorrect {
  color: rgb(218, 83, 83);
}
.a-button:hover {
  transform: translateY(0.1rem);
}
button:focus {
  outline: 0;
}
</style>
