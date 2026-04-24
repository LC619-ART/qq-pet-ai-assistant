<template>
  <div class="chat-window">
    <div class="chat-header">
      <div class="chat-info">
        <h2>{{ chatTitle }}</h2>
        <span class="online-status">在线</span>
      </div>
      <div class="chat-actions">
        <button class="action-button" title="语音通话">📞</button>
        <button class="action-button" title="视频通话">📹</button>
        <button class="action-button" title="更多选项">⋯</button>
      </div>
    </div>
    <div class="chat-messages" ref="messagesContainer">
      <div class="message-list">
        <MessageBubble
          v-for="message in messages"
          :key="message.id"
          :content="message.content"
          :sender="message.sender"
          :timestamp="message.timestamp"
        />
      </div>
      <div class="chat-footer">
        <span class="connection-status">连接正常</span>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, watch, onMounted } from 'vue';
import MessageBubble from './MessageBubble.vue';
import type { Message } from '../../utils/mockData';

const props = defineProps({
  messages: {
    type: Array as () => Message[],
    default: () => [],
  },
  chatTitle: {
    type: String,
    default: '聊天',
  },
});

const messagesContainer = ref<HTMLElement | null>(null);

// 自动滚动到底部
const scrollToBottom = () => {
  if (messagesContainer.value) {
    messagesContainer.value.scrollTop = messagesContainer.value.scrollHeight;
  }
};

// 监听消息变化，自动滚动
watch(
  () => props.messages,
  () => {
    scrollToBottom();
  },
  { deep: true }
);

// 组件挂载后滚动到底部
onMounted(() => {
  scrollToBottom();
});
</script>

<style scoped>
.chat-window {
  display: flex;
  flex-direction: column;
  height: 100%;
  background-color: var(--background-color);
  border-radius: var(--border-radius-lg) var(--border-radius-lg) 0 0;
  overflow: hidden;
  box-shadow: var(--shadow-md);
}

.chat-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px 20px;
  background-color: var(--card-background);
  border-bottom: 1px solid var(--border-color);
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
  position: sticky;
  top: 0;
  z-index: 10;
}

.chat-info {
  display: flex;
  align-items: center;
  gap: 12px;
}

.chat-info h2 {
  font-size: 18px;
  font-weight: 700;
  color: var(--text-color);
  margin: 0;
  font-family: 'Inter', sans-serif;
}

.online-status {
  font-size: 12px;
  color: var(--success-color);
  font-weight: 500;
  display: flex;
  align-items: center;
  gap: 4px;
}

.online-status::before {
  content: '';
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background-color: var(--success-color);
  animation: pulse 2s infinite;
}

@keyframes pulse {
  0% {
    opacity: 1;
  }
  50% {
    opacity: 0.5;
  }
  100% {
    opacity: 1;
  }
}

.chat-actions {
  display: flex;
  gap: 10px;
}

.action-button {
  background: none;
  border: none;
  font-size: 18px;
  cursor: pointer;
  padding: 8px;
  border-radius: var(--border-radius-md);
  transition: all var(--transition-normal);
  display: flex;
  align-items: center;
  justify-content: center;
  width: 36px;
  height: 36px;
}

.action-button:hover {
  background-color: var(--secondary-color);
  transform: translateY(-1px);
  box-shadow: var(--shadow-sm);
}

.chat-messages {
  flex: 1;
  padding: 20px;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
  gap: 12px;
  background-color: var(--background-color);
  background-image: linear-gradient(to bottom right, rgba(99, 102, 241, 0.05), rgba(245, 158, 11, 0.05));
}

.message-list {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.chat-footer {
  margin-top: 16px;
  padding-top: 12px;
  border-top: 1px solid var(--border-color);
  text-align: center;
}

.connection-status {
  font-size: 12px;
  color: var(--light-text);
  font-weight: 500;
}

/* 滚动条样式 */
.chat-messages::-webkit-scrollbar {
  width: 8px;
}

.chat-messages::-webkit-scrollbar-track {
  background: var(--secondary-color);
  border-radius: 4px;
}

.chat-messages::-webkit-scrollbar-thumb {
  background: var(--border-color);
  border-radius: 4px;
  transition: all var(--transition-normal);
}

.chat-messages::-webkit-scrollbar-thumb:hover {
  background: var(--light-text);
}

@media (max-width: 768px) {
  .chat-header {
    padding: 14px 16px;
  }
  
  .chat-info h2 {
    font-size: 16px;
  }
  
  .chat-messages {
    padding: 16px;
  }
  
  .action-button {
    width: 32px;
    height: 32px;
    font-size: 16px;
  }
}
</style>
