<template>
  <main>
    <div class="flex justify-between">
      <h2>
        活动列表
        <span class="italic text-sm">Total: {{ games.length }}</span>
      </h2>
      <div>
        <sl-button @click="addGame" size="small">
          <sl-icon slot="prefix" name="plus"></sl-icon>添加活动
        </sl-button>
      </div>
    </div>
    <div class="px-2 py-2 sm:px-0 text-xs">
      <div
        v-for="g in games"
        :key="g._id"
        class="py-2 border-b flex justify-between"
      >
        <div class="flex items-center">
          <router-link :to="`/games/${g._id}`" class="text-blue-500">{{
            g.name
          }}</router-link>
          <div class="ml-2">
            开始时间: {{ $utils.formatTime(g.start_at) }} (<sl-relative-time
              :date="g.start_at"
              locale="zh-CN"
            ></sl-relative-time
            >)<br />
          </div>
        </div>
        <div class="flex">
          <a
            href="javascript:;"
            class="text-gray-500 flex items-center"
            @click="editGame(g)"
          >
            <sl-icon name="pencil-square" />
            <span class="ml-1">编辑</span>
          </a>
          <a
            href="javascript:;"
            class="text-gray-500 flex items-center ml-2"
            @click="removeConfirm(g)"
          >
            <sl-icon name="trash" />
            <span class="ml">删除</span>
          </a>
        </div>
      </div>
    </div>
    <sl-dialog
      ref="dialog"
      :label="curGame._id ? '编辑活动' : '添加活动'"
      class="dialog-width"
      style="--width: 50vw"
    >
      <form ref="form" class="form-overview" @submit.prevent="onSubmit">
        <label class="block">活动名称: </label>
        <input
          type="text"
          required
          v-model="curGame.name"
          class="border rounded p-2 w-full"
        />
        <label class="block mt-4">开始时间: </label>
        <date-picker
          :value="new Date(curGame.start_at)"
          @change="onChange"
          type="datetime"
        ></date-picker>
        <label class="block mt-4">题目数量: </label>
        <input
          type="number"
          required
          v-model="curGame.question_count"
          class="border rounded p-2"
        />
        <br />
        <br />
        <button
          type="submit"
          class="border rounded px-3 py-1 flex items-center mt-3"
          :disabled="submitting"
        >
          <sl-spinner class="mr-2" v-if="submitting" />
          保存
        </button>
      </form>
    </sl-dialog>
    <sl-dialog ref="removeConfirm" label="确定要删除此活动吗？">
      <div class="mb-4" v-if="willDelete">
        <div>名称：{{ willDelete.name }}</div>
        <div>开始时间：{{ $utils.formatTime(willDelete.start_at) }}</div>
      </div>
      <sl-button type="danger" @click="removeGame(willDelete._id)"
        >确定</sl-button
      >
    </sl-dialog>
  </main>
</template>

<script>
import request from '../utils/request';
import DatePicker from 'vue2-datepicker';
import 'vue2-datepicker/index.css';

export default {
  components: { DatePicker },
  data() {
    return {
      submitting: false,
      games: [],
      curGame: { name: '', start_at: '' },
      pickerFormat: {
        // Date to String
        stringify: (date) => {
          return date ? this.$utils.formatTime(date) : null;
          // return date ? new Date(date).toString() : null;
        },
        // String to Date
        parse: (value) => {
          return value ? new Date(value) : null;
        },
      },
      willDelete: null,
    };
  },
  mounted() {
    this.update();
  },
  methods: {
    async update() {
      const { data, errors } = await request('/api/games');
      if (!errors) {
        this.games = data;
      }
    },
    onChange(event) {
      this.curGame.start_at = new Date(event).toISOString();
    },
    openDialog() {
      this.$refs.dialog.show();
    },
    hideDialog() {
      this.$refs.dialog.hide();
    },
    addGame() {
      this.curGame = { name: '' };
      this.openDialog();
    },
    editGame(game) {
      this.curGame = { ...game };
      this.openDialog();
    },
    removeConfirm(game) {
      this.willDelete = { ...game };
      this.$refs.removeConfirm.show();
    },
    async removeGame(_id) {
      const { errors } = await request(`/api/games/${_id}`, {
        method: 'DELETE',
      });
      if (!errors) {
        this.$refs.removeConfirm.hide();
        this.update();
      }
    },
    async onSubmit() {
      console.log('curGame', JSON.stringify(this.curGame));
      if (!this.curGame) return;
      if (!this.curGame.start_at) {
        alert('请选择活动开始时间');
        return;
      }

      const { _id } = this.curGame;
      const url = _id ? `/api/games/${_id}` : '/api/games';

      this.submitting = true;
      const { errors } = await request(url, {
        method: _id ? 'PUT' : 'POST',
        data: { ...this.curGame },
      });
      this.submitting = false;

      if (!errors) {
        this.hideDialog();
        this.update();
      }
    },
  },
};
</script>
