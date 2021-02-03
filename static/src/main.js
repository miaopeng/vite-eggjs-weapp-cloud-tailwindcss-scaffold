import { createApp } from 'vue';
import './assets/main.css';
import App from './App.vue';
import { routes } from './routes.js';
import { createRouter, createWebHistory } from 'vue-router';
import { isAuthenticated } from './utils/login';
import { formatTime } from './utils';

let app = createApp(App);
let router = createRouter({
  history: createWebHistory(),
  routes: import.meta.hot ? [] : routes,
});

router.beforeEach((to, from, next) => {
  if (to.name !== 'login' && !isAuthenticated()) next({ name: 'login' });
  next();
});

if (import.meta.hot) {
  let removeRoutes = [];

  for (let route of routes) {
    removeRoutes.push(router.addRoute(route));
  }

  import.meta.hot.acceptDeps('./routes.js', ({ routes }) => {
    for (let removeRoute of removeRoutes) removeRoute();
    removeRoutes = [];
    for (let route of routes) {
      removeRoutes.push(router.addRoute(route));
    }
    router.replace('');
  });
}

app.use(router);
app.config.globalProperties.$utils = {
  formatTime,
};

app.mount('#app');
