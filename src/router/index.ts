// 路由配置
import { createRouter, createWebHashHistory } from 'vue-router';
import ChatView from '../views/ChatView.vue';

const router = createRouter({
  history: createWebHashHistory(),
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
