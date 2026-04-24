<template>
  <div class="pet-chat-view">
    <!-- 聊天头部 -->
    <div class="chat-header">
      <button class="back-button" @click="goBack">←</button>
      <div class="chat-info">
        <div class="pet-avatar">🐶</div>
        <div class="chat-title">
          <h2>QQ 小宠物</h2>
          <span class="online-status">在线</span>
        </div>
      </div>
      <div class="chat-actions">
        <button class="action-button">📞</button>
        <button class="action-button">⋯</button>
      </div>
    </div>

    <!-- 聊天消息区域 -->
    <div class="chat-messages" ref="messagesContainer">
      <!-- 欢迎消息 -->
      <div class="welcome-message">
        <p>你好！我是你的 QQ 小宠物，有什么可以帮你的吗？</p>
        <p>你可以问我问题、让我帮你润色话术，或者只是聊聊天。</p>
      </div>

      <!-- 聊天消息 -->
      <MessageBubble
        v-for="message in messages"
        :key="message.id"
        :content="message.content"
        :sender="message.sender"
        :timestamp="message.timestamp"
      />

      <!-- 加载状态 -->
      <div v-if="isLoading" class="loading-message">
        <div class="loading"></div>
        <span>小宠物正在思考...</span>
      </div>
    </div>

    <!-- 输入区域 -->
    <div class="input-area">
      <textarea
        v-model="inputText"
        class="input-box"
        placeholder="输入你的问题或需求..."
        @keydown.enter.exact="sendMessage"
        @keydown.enter.shift=""
      ></textarea>
      <button
        class="send-button"
        :disabled="!inputText.trim() || isLoading"
        @click="sendMessage"
      >
        ➤
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, watch, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import MessageBubble from '../components/chat/MessageBubble.vue';
import { useChatAssistant } from '../composables/useChatAssistant';
import type { Message } from '../utils/mockData';

const router = useRouter();

const inputText = ref('');
const messages = ref<Message[]>([]);
const isLoading = ref(false);
const messagesContainer = ref<HTMLElement | null>(null);

const { getPetReply } = useChatAssistant();

// 自动滚动到底部
const scrollToBottom = () => {
  if (messagesContainer.value) {
    messagesContainer.value.scrollTop = messagesContainer.value.scrollHeight;
  }
};

// 监听消息变化，自动滚动
watch(
  () => messages.value,
  () => {
    scrollToBottom();
  },
  { deep: true }
);

// 发送消息
const sendMessage = async () => {
  if (!inputText.value.trim() || isLoading.value) return;

  // 添加用户消息
  const userMessage: Message = {
    id: Date.now().toString(),
    content: inputText.value,
    sender: 'user',
    timestamp: new Date().toLocaleTimeString('zh-CN', { hour: '2-digit', minute: '2-digit' }),
  };
  messages.value.push(userMessage);

  // 清空输入框
  inputText.value = '';

  // 显示加载状态
  isLoading.value = true;

  // 模拟宠物思考
  await new Promise(resolve => setTimeout(resolve, 1000));

  // 添加宠物回复
  const petMessage: Message = {
    id: (Date.now() + 1).toString(),
    content: getPetReply(userMessage.content),
    sender: 'pet',
    timestamp: new Date().toLocaleTimeString('zh-CN', { hour: '2-digit', minute: '2-digit' }),
  };
  messages.value.push(petMessage);

  // 隐藏加载状态
  isLoading.value = false;
};

// 返回上一页
const goBack = () => {
  router.push('/');
};

// 组件挂载后滚动到底部
onMounted(() => {
  scrollToBottom();
});
</script>

<style scoped>
.pet-chat-view {
  display: flex;
  flex-direction: column;
  height: 100vh;
  background-color: var(--secondary-color);
}

/* 聊天头部 */
.chat-header {
  display: flex;
  align-items: center;
  padding: 12px 16px;
  background-color: var(--white);
  border-bottom: 1px solid var(--border-color);
}

.back-button {
  background: none;
  border: none;
  font-size: 18px;
  cursor: pointer;
  padding: 8px;
  border-radius: 50%;
  margin-right: 12px;
  transition: background-color 0.2s ease;
}

.back-button:hover {
  background-color: var(--secondary-color);
}

.chat-info {
  flex: 1;
  display: flex;
  align-items: center;
}

.pet-avatar {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background-color: var(--accent-color);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 20px;
  margin-right: 12px;
}

.chat-title h2 {
  font-size: 16px;
  font-weight: 600;
  color: var(--text-color);
  margin-bottom: 2px;
}

.online-status {
  font-size: 12px;
  color: var(--success-color);
}

.chat-actions {
  display: flex;
  gap: 8px;
}

.action-button {
  background: none;
  border: none;
  font-size: 16px;
  cursor: pointer;
  padding: 4px;
  border-radius: 4px;
  transition: background-color 0.2s ease;
}

.action-button:hover {
  background-color: var(--secondary-color);
}

/* 聊天消息区域 */
.chat-messages {
  flex: 1;
  padding: 16px;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.welcome-message {
  background-color: rgba(0, 132, 255, 0.1);
  border-radius: 8px;
  padding: 12px;
  align-self: center;
  max-width: 80%;
  text-align: center;
  font-size: 14px;
  line-height: 1.4;
  color: var(--text-color);
}

.loading-message {
  display: flex;
  align-items: center;
  gap: 8px;
  align-self: flex-start;
  padding: 8px 12px;
  background-color: var(--white);
  border-radius: 8px;
  font-size: 14px;
  color: var(--light-text);
}

/* 输入区域 */
.input-area {
  background-color: var(--white);
  border-top: 1px solid var(--border-color);
  padding: 8px;
  display: flex;
  align-items: flex-end;
  gap: 8px;
}

.input-box {
  flex: 1;
  min-height: 36px;
  max-height: 120px;
  padding: 8px 12px;
  border: 1px solid var(--border-color);
  border-radius: 18px;
  resize: none;
  outline: none;
  font-size: 14px;
  font-family: inherit;
  transition: border-color 0.2s ease;
}

.input-box:focus {
  border-color: var(--primary-color);
}

.send-button {
  width: 36px;
  height: 36px;
  border-radius: 50%;
  background-color: var(--primary-color);
  color: white;
  border: none;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: background-color 0.2s ease;
  font-size: 16px;
  font-weight: bold;
}

.send-button:hover:not(:disabled) {
  background-color: #0073E6;
}

.send-button:disabled {
  background-color: var(--light-text);
  cursor: not-allowed;
}

/* 滚动条样式 */
.chat-messages::-webkit-scrollbar {
  width: 6px;
}

.chat-messages::-webkit-scrollbar-track {
  background: var(--secondary-color);
}

.chat-messages::-webkit-scrollbar-thumb {
  background: var(--light-text);
  border-radius: 3px;
}

.chat-messages::-webkit-scrollbar-thumb:hover {
  background: var(--text-color);
}

/* 响应式设计 */
@media (max-width: 768px) {
  .chat-header {
    padding: 10px 16px;
  }
  
  .chat-title h2 {
    font-size: 18px;
  }
  
  .chat-messages {
    padding: 12px;
  }
  
  .input-area {
    padding: 10px;
  }
  
  .input-box {
    font-size: 16px;
    min-height: 40px;
  }
  
  .send-button {
    width: 40px;
    height: 40px;
  }
}
</style>
