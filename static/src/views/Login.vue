<template>
  <div>
    登录中...<span v-if="hasError" class="text-red-500">登录出现问题!</span>
  </div>
</template>

<script>
import login from '../utils/login';
export default {
  data: () => ({
    hasError: false,
  }),
  async created() {
    try {
      const { data, errors } = await login();
      if (!errors) {
        this.$router.push({ path: '/' });
      } else {
        console.log('errors', errors);
      }
    } catch (err) {
      console.log('error', err);
      this.hasError = true;
    }
  },
};
</script>
