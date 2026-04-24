<template>
  <div class="chat-view">
    <!-- 侧边栏 -->
    <div class="sidebar">
      <div class="sidebar-header">
        <h1>QQ 聊天</h1>
        <button class="add-button">+</button>
      </div>
      <div class="chat-list">
        <div 
          v-for="chat in chatList" 
          :key="chat.id"
          :class="['chat-item', { active: currentChatId === chat.id }]"
          @click="currentChatId = chat.id"
        >
          <div class="chat-avatar">{{ chat.avatar }}</div>
          <div class="chat-info">
            <div class="chat-name">{{ chat.name }}</div>
            <div class="chat-last-message">{{ chat.lastMessage }}</div>
          </div>
          <div class="chat-time">{{ chat.time }}</div>
        </div>
      </div>
    </div>

    <!-- 聊天区域 -->
    <div class="chat-area">
      <ChatWindow 
        :messages="currentMessages" 
        :chatTitle="currentChatName"
        ref="chatWindowRef"
      />
      <InputBox 
        v-model="inputText"
        @send="sendMessage"
        ref="inputBoxRef"
      />
    </div>

    <!-- QQ 小宠物 -->
    <QQPet 
      :showSuggestionBubble="showSuggestionBubble"
      :suggestionMessage="suggestionMessage"
      @openPanel="(position) => togglePanel(position)"
      @openPetChat="openPetChat"
    />

    <!-- 快捷辅助面板 -->
    <AssistantPanel 
      :isVisible="isPanelVisible"
      :position="petPosition"
      :size="petSize"
      @hide="isPanelVisible = false"
      @polish="handlePolish"
      @generateReply="handleGenerateReply"
      @extractInfo="handleExtractInfo"
      @templates="handleTemplates"
      @settings="handleSettings"
    />

    <!-- 话术润色面板 -->
    <PolishPanel 
      :isVisible="showPolishPanel"
      :isLoading="isLoading"
      :polishedTexts="polishedTexts"
      @hide="showPolishPanel = false"
      @applyPolishedText="applyPolishedText"
    />

    <!-- 信息提取面板 -->
    <ExtractPanel 
      :isVisible="showExtractPanel"
      :isLoading="isLoading"
      :extractedInfo="extractedInfo"
      @hide="showExtractPanel = false"
      @generateReply="handleGenerateReply"
    />

    <!-- 场景模板面板 -->
    <TemplatePanel 
      :isVisible="showTemplatePanel"
      @hide="showTemplatePanel = false"
      @generateContent="applyTemplateContent"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue';
import { useRouter } from 'vue-router';
import ChatWindow from '../components/chat/ChatWindow.vue';
import InputBox from '../components/chat/InputBox.vue';
import QQPet from '../components/pet/QQPet.vue';
import AssistantPanel from '../components/assistant/AssistantPanel.vue';
import PolishPanel from '../components/assistant/PolishPanel.vue';
import ExtractPanel from '../components/assistant/ExtractPanel.vue';
import TemplatePanel from '../components/assistant/TemplatePanel.vue';
import { useChatAssistant } from '../composables/useChatAssistant';
import { mockMessages, mockGroupMessages } from '../utils/mockData';
import type { Message } from '../utils/mockData';

const router = useRouter();

// 聊天列表数据
const chatList = [
  { id: '1', name: '好友', avatar: '👤', lastMessage: '那挺辛苦的，注意休息啊', time: '10:05' },
  { id: '2', name: '班级群', avatar: '👥', lastMessage: '考试时间为2小时', time: '08:03' },
  { id: '3', name: '家人', avatar: '🏠', lastMessage: '记得按时吃饭', time: '昨天' },
  { id: '4', name: '同事', avatar: '💼', lastMessage: '项目进展如何？', time: '昨天' },
];

const currentChatId = ref('1');
const inputText = ref('');
const chatWindowRef = ref<InstanceType<typeof ChatWindow> | null>(null);
const inputBoxRef = ref<InstanceType<typeof InputBox> | null>(null);

// 宠物状态
const petPosition = ref({ x: 100, y: 100 });
const petSize = ref(80);

// 面板状态
const isPanelVisible = ref(false);

// 使用聊天辅助逻辑
const {
  isLoading,
  polishedTexts,
  extractedInfo,
  replySuggestions,
  showSuggestionBubble,
  suggestionMessage,
  showPolishPanel,
  showExtractPanel,
  showTemplatePanel,
  polishText,
  extractInformation,
  generateReply,
  applyPolishedText,
  applyReplySuggestion,
  applyTemplateContent,
  checkKeywords,
  checkEmotion,
  closeAllPanels,
} = useChatAssistant();

// 当前聊天消息
const messages = ref<Message[]>([...mockMessages]);
const groupMessages = ref<Message[]>([...mockGroupMessages]);

const currentMessages = computed(() => {
  return currentChatId.value === '2' ? groupMessages.value : messages.value;
});

// 当前聊天名称
const currentChatName = computed(() => {
  const chat = chatList.find(c => c.id === currentChatId.value);
  return chat ? chat.name : '聊天';
});

// 发送消息
const sendMessage = (message: string) => {
  // 这里只是模拟，实际项目中会发送到后端
  console.log('发送消息:', message);
  // 检查情绪
  checkEmotion(message);
  
  // 创建新消息
  const newMessage = {
    id: Date.now().toString(),
    content: message,
    sender: 'user' as const,
    timestamp: new Date().toLocaleTimeString(),
  };
  
  // 将消息添加到相应的数据源中
  if (currentChatId.value === '2') {
    groupMessages.value.push(newMessage);
  } else {
    messages.value.push(newMessage);
  }
  
  console.log('消息已添加到聊天记录:', newMessage);
};

// 切换面板
const togglePanel = (position: { x: number; y: number }) => {
  console.log('togglePanel 被调用，当前 isPanelVisible:', isPanelVisible.value);
  console.log('接收到的宠物位置:', position);
  petPosition.value = position;
  isPanelVisible.value = !isPanelVisible.value;
  console.log('切换后 isPanelVisible:', isPanelVisible.value);
  if (!isPanelVisible.value) {
    closeAllPanels();
  }
};

// 打开宠物聊天
const openPetChat = () => {
  router.push('/pet-chat');
};

// 处理话术润色
const handlePolish = () => {
  if (inputText.value.trim()) {
    polishText(inputText.value);
  } else {
    alert('请先输入内容');
  }
};

// 处理生成回复
const handleGenerateReply = () => {
  const context = currentMessages.value.map(m => m.content).join(' ');
  generateReply(context);
  if (replySuggestions.value.length > 0) {
    inputText.value = replySuggestions.value[0];
  }
};

// 处理信息提取
const handleExtractInfo = () => {
  const context = currentMessages.value.map(m => m.content).join('\n');
  extractInformation(context);
};

// 处理场景模板
const handleTemplates = () => {
  showTemplatePanel.value = true;
};

// 处理设置
const handleSettings = () => {
  alert('设置功能开发中');
};

// 监听输入变化
const handleInputChange = (value: string) => {
  inputText.value = value;
  checkKeywords(value);
  checkEmotion(value);
};

// 事件处理函数
const handlePetDragToInput = () => {
  handlePolish();
};

const handlePetDragToChat = () => {
  handleExtractInfo();
};

const handleInputChangeEvent = (event: any) => {
  const text = event.detail?.text || '';
  checkKeywords(text);
  checkEmotion(text);
};

// 组件挂载后初始化
onMounted(() => {
  // 模拟宠物位置初始化
  petPosition.value = {
    x: window.innerWidth - petSize.value - 20,
    y: window.innerHeight - petSize.value - 100,
  };
  
  // 监听宠物拖拽到输入框事件
  window.addEventListener('pet-drag-to-input', handlePetDragToInput);
  
  // 监听宠物拖拽到聊天记录事件
  window.addEventListener('pet-drag-to-chat', handlePetDragToChat);
  
  // 监听输入变化事件，用于智能建议
  window.addEventListener('input-change', handleInputChangeEvent);
});

// 组件卸载前清理
onUnmounted(() => {
  window.removeEventListener('pet-drag-to-input', handlePetDragToInput);
  window.removeEventListener('pet-drag-to-chat', handlePetDragToChat);
  window.removeEventListener('input-change', handleInputChangeEvent);
});
</script>

<style scoped>
.chat-view {
  display: flex;
  height: 100vh;
  background-color: var(--background-color);
  overflow: hidden;
}

/* 侧边栏 */
.sidebar {
  width: 260px;
  background-color: var(--card-background);
  border-right: 1px solid var(--border-color);
  display: flex;
  flex-direction: column;
  box-shadow: var(--shadow-md);
  z-index: 10;
  transition: all var(--transition-normal);
}

.sidebar:hover {
  box-shadow: var(--shadow-lg);
}

.sidebar-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px 20px;
  border-bottom: 1px solid var(--border-color);
  background-color: var(--card-background);
  position: sticky;
  top: 0;
  z-index: 1;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
}

.sidebar-header h1 {
  font-size: 20px;
  font-weight: 700;
  color: var(--text-color);
  margin: 0;
  font-family: 'Inter', sans-serif;
}

.add-button {
  width: 32px;
  height: 32px;
  border-radius: 50%;
  background-color: var(--primary-color);
  color: white;
  border: none;
  font-size: 20px;
  font-weight: bold;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all var(--transition-normal);
  box-shadow: var(--shadow-sm);
}

.add-button:hover {
  background-color: var(--primary-hover);
  transform: translateY(-1px);
  box-shadow: var(--shadow-md);
}

.chat-list {
  flex: 1;
  overflow-y: auto;
  padding: 8px 0;
}

/* 自定义滚动条 */
.chat-list::-webkit-scrollbar {
  width: 6px;
}

.chat-list::-webkit-scrollbar-track {
  background: var(--secondary-color);
}

.chat-list::-webkit-scrollbar-thumb {
  background: var(--border-color);
  border-radius: 3px;
}

.chat-list::-webkit-scrollbar-thumb:hover {
  background: var(--light-text);
}

.chat-item {
  display: flex;
  align-items: center;
  padding: 14px 20px;
  cursor: pointer;
  transition: all var(--transition-normal);
  border-bottom: 1px solid var(--border-color);
  margin: 0 8px;
  border-radius: var(--border-radius-md);
  margin-bottom: 4px;
}

.chat-item:hover {
  background-color: var(--secondary-color);
  transform: translateX(4px);
}

.chat-item.active {
  background-color: rgba(99, 102, 241, 0.1);
  border-left: 4px solid var(--primary-color);
}

.chat-avatar {
  width: 44px;
  height: 44px;
  border-radius: 50%;
  background-color: var(--secondary-color);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 20px;
  margin-right: 14px;
  transition: all var(--transition-normal);
  box-shadow: var(--shadow-sm);
}

.chat-item:hover .chat-avatar {
  transform: scale(1.05);
  box-shadow: var(--shadow-md);
}

.chat-info {
  flex: 1;
  min-width: 0;
}

.chat-name {
  font-size: 15px;
  font-weight: 600;
  color: var(--text-color);
  margin-bottom: 4px;
  font-family: 'Inter', sans-serif;
}

.chat-last-message {
  font-size: 13px;
  color: var(--light-text);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  line-height: 1.3;
}

.chat-time {
  font-size: 12px;
  color: var(--light-text);
  margin-left: 12px;
  font-weight: 500;
}

/* 聊天区域 */
.chat-area {
  flex: 1;
  display: flex;
  flex-direction: column;
  background-color: var(--background-color);
  position: relative;
  overflow: hidden;
}

/* 响应式设计 */
@media (max-width: 1024px) {
  .sidebar {
    width: 220px;
  }
  
  .chat-item {
    padding: 12px 16px;
  }
  
  .sidebar-header {
    padding: 14px 16px;
  }
}

@media (max-width: 768px) {
  .sidebar {
    display: none;
  }
  
  .chat-view {
    flex-direction: column;
  }
  
  .chat-item {
    padding: 16px;
  }
  
  .chat-avatar {
    width: 48px;
    height: 48px;
  }
}
</style>
