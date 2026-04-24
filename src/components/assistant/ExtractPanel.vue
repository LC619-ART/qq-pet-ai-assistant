<template>
  <div v-if="isVisible" class="extract-panel">
    <div class="panel-header">
      <h3>信息提取</h3>
      <button class="close-button" @click="hide">×</button>
    </div>
    <div class="panel-content">
      <div v-if="isLoading" class="loading-container">
        <div class="loading"></div>
        <span>正在提取信息...</span>
      </div>
      <div v-else-if="extractedInfo" class="extract-results">
        <div class="extract-section">
          <h4>重要通知</h4>
          <ul>
            <li v-for="(item, index) in extractedInfo.important" :key="index">{{ item }}</li>
          </ul>
        </div>
        <div class="extract-section">
          <h4>待办事项</h4>
          <ul>
            <li v-for="(item, index) in extractedInfo.todo" :key="index">{{ item }}</li>
          </ul>
        </div>
        <div class="extract-section">
          <h4>截止时间</h4>
          <p>{{ extractedInfo.deadline }}</p>
        </div>
        <div class="extract-section">
          <h4>核心要求</h4>
          <ul>
            <li v-for="(item, index) in extractedInfo.requirements" :key="index">{{ item }}</li>
          </ul>
        </div>
        <div class="extract-actions">
          <button class="action-button copy" @click="copyInfo">复制全部</button>
          <button class="action-button reply" @click="generateReply">生成回复</button>
        </div>
      </div>
      <div v-else class="empty-state">
        <p>请选择聊天记录后再提取信息</p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { defineProps, defineEmits } from 'vue';
import type { ExtractedInfo } from '../../utils/mockData';

const props = defineProps({
  isVisible: {
    type: Boolean,
    default: false,
  },
  isLoading: {
    type: Boolean,
    default: false,
  },
  extractedInfo: {
    type: Object as () => ExtractedInfo | null,
    default: null,
  },
});

const emit = defineEmits(['hide', 'generateReply']);

const hide = () => {
  emit('hide');
};

const copyInfo = () => {
  if (!props.extractedInfo) return;
  
  const infoText = `重要通知:\n${props.extractedInfo.important.join('\n')}\n\n待办事项:\n${props.extractedInfo.todo.join('\n')}\n\n截止时间:\n${props.extractedInfo.deadline}\n\n核心要求:\n${props.extractedInfo.requirements.join('\n')}`;
  
  navigator.clipboard.writeText(infoText).then(() => {
    alert('已复制到剪贴板');
  });
};

const generateReply = () => {
  emit('generateReply');
  hide();
};
</script>

<style scoped>
.extract-panel {
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  background: var(--card-background);
  border-radius: var(--border-radius-lg);
  box-shadow: var(--shadow-lg);
  padding: 20px;
  width: 90%;
  max-width: 450px;
  z-index: 9999;
  border: 1px solid var(--border-color);
  animation: slideIn 0.2s ease-out;
}

.panel-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
  padding-bottom: 16px;
  border-bottom: 1px solid var(--border-color);
}

.panel-header h3 {
  font-size: 18px;
  font-weight: 700;
  color: var(--text-color);
  margin: 0;
  font-family: 'Inter', sans-serif;
}

.close-button {
  background: none;
  border: none;
  font-size: 20px;
  cursor: pointer;
  color: var(--light-text);
  padding: 4px;
  width: 28px;
  height: 28px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  transition: all var(--transition-normal);
}

.close-button:hover {
  background-color: var(--secondary-color);
  transform: rotate(90deg);
}

.loading-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 50px 0;
}

.loading {
  margin-bottom: 16px;
  width: 28px;
  height: 28px;
}

.loading-container span {
  font-size: 14px;
  color: var(--light-text);
  font-weight: 500;
}

.empty-state {
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 50px 0;
  color: var(--light-text);
  font-size: 14px;
  font-weight: 500;
}

.extract-results {
  max-height: 400px;
  overflow-y: auto;
  padding-right: 8px;
}

/* 滚动条样式 */
.extract-results::-webkit-scrollbar {
  width: 6px;
}

.extract-results::-webkit-scrollbar-track {
  background: var(--secondary-color);
  border-radius: 3px;
}

.extract-results::-webkit-scrollbar-thumb {
  background: var(--border-color);
  border-radius: 3px;
  transition: all var(--transition-normal);
}

.extract-results::-webkit-scrollbar-thumb:hover {
  background: var(--light-text);
}

.extract-section {
  margin-bottom: 20px;
  padding: 16px;
  background-color: var(--secondary-color);
  border-radius: var(--border-radius-md);
  box-shadow: var(--shadow-sm);
  border: 1px solid var(--border-color);
  transition: all var(--transition-normal);
}

.extract-section:hover {
  box-shadow: var(--shadow-md);
  transform: translateY(-2px);
}

.extract-section h4 {
  font-size: 14px;
  font-weight: 600;
  color: var(--primary-color);
  margin-bottom: 10px;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  font-family: 'Inter', sans-serif;
}

.extract-section ul {
  list-style: none;
  padding-left: 0;
}

.extract-section li {
  font-size: 14px;
  color: var(--text-color);
  margin-bottom: 6px;
  padding-left: 20px;
  position: relative;
  line-height: 1.4;
  font-family: 'Inter', sans-serif;
}

.extract-section li::before {
  content: '✓';
  position: absolute;
  left: 0;
  color: var(--success-color);
  font-weight: bold;
  font-size: 12px;
  background-color: rgba(16, 185, 129, 0.1);
  width: 16px;
  height: 16px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  top: 2px;
}

.extract-section p {
  font-size: 14px;
  color: var(--text-color);
  font-family: 'Inter', sans-serif;
  line-height: 1.4;
}

.extract-actions {
  display: flex;
  gap: 10px;
  margin-top: 24px;
  padding-top: 20px;
  border-top: 1px solid var(--border-color);
}

.action-button {
  flex: 1;
  padding: 10px 16px;
  border: 1px solid var(--border-color);
  border-radius: var(--border-radius-md);
  background-color: var(--card-background);
  color: var(--text-color);
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: all var(--transition-normal);
  font-family: 'Inter', sans-serif;
}

.action-button.copy:hover {
  background-color: var(--secondary-color);
  transform: translateY(-1px);
  box-shadow: var(--shadow-sm);
}

.action-button.reply {
  background-color: var(--primary-color);
  color: white;
  border-color: var(--primary-color);
  box-shadow: var(--shadow-sm);
}

.action-button.reply:hover {
  background-color: var(--primary-hover);
  transform: translateY(-1px);
  box-shadow: var(--shadow-md);
}
</style>
