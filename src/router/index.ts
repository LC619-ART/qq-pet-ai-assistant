// 路由配置
import { createRouter, createWebHistory } from 'vue-router';
import ChatView from '../views/ChatView.vue';

const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: '/',
      name: 'chat',
      component: ChatView,
    },
    {
      path: '/pet-chat',
      name: 'pet-chat',
      component: () => import('../views/PetChatView.vue'),
    },
  ],
});

export default router;
