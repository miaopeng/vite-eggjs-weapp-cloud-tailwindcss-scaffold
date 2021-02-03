import Home from './views/Home.vue';
import Game from './views/Game.vue';
import GameDetail from './views/GameDetail.vue';
import Login from './views/Login.vue';
import NotFound from './views/NotFound.vue';

/** @type {import('vue-router').RouterOptions['routes']} */
export let routes = [
  { path: '/', name: 'index', component: Home, meta: { title: 'Questions' } },
  { path: '/games', name: 'games', component: Game, meta: { title: 'Games' } },
  { path: '/games/:_id', component: GameDetail },
  { path: '/login', name: 'login', component: Login, meta: { title: 'Login' } },
  { path: '/:path(.*)', component: NotFound },
];
