<template>
  <div v-if="isVisible" class="polish-panel">
    <div class="panel-header">
      <h3>话术润色</h3>
      <button class="close-button" @click="hide">×</button>
    </div>
    <div class="panel-content">
      <div v-if="isLoading" class="loading-container">
        <div class="loading"></div>
        <span>正在生成润色结果...</span>
      </div>
      <div v-else class="polish-results">
        <div 
          v-for="text in polishedTexts" 
          :key="text.id" 
          class="polish-item"
        >
          <div class="polish-style">{{ text.style }}</div>
          <div class="polish-content">{{ text.content }}</div>
          <div class="polish-actions">
            <button class="action-button apply" @click="applyPolishedText(text.content)">应用</button>
            <button class="action-button copy" @click="copyText(text.content)">复制</button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { defineProps, defineEmits } from 'vue';
import type { PolishedText } from '../../utils/mockData';

const props = defineProps({
  isVisible: {
    type: Boolean,
    default: false,
  },
  isLoading: {
    type: Boolean,
    default: false,
  },
  polishedTexts: {
    type: Array as () => PolishedText[],
    default: () => [],
  },
});

const emit = defineEmits(['hide', 'applyPolishedText']);

const hide = () => {
  emit('hide');
};

const applyPolishedText = (text: string) => {
  emit('applyPolishedText', text);
  hide();
};

const copyText = (text: string) => {
  navigator.clipboard.writeText(text).then(() => {
    alert('已复制到剪贴板');
  });
};
</script>

<style scoped>
.polish-panel {
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

.polish-results {
  max-height: 400px;
  overflow-y: auto;
  padding-right: 8px;
}

/* 滚动条样式 */
.polish-results::-webkit-scrollbar {
  width: 6px;
}

.polish-results::-webkit-scrollbar-track {
  background: var(--secondary-color);
  border-radius: 3px;
}

.polish-results::-webkit-scrollbar-thumb {
  background: var(--border-color);
  border-radius: 3px;
  transition: all var(--transition-normal);
}

.polish-results::-webkit-scrollbar-thumb:hover {
  background: var(--light-text);
}

.polish-item {
  padding: 16px;
  border: 1px solid var(--border-color);
  border-radius: var(--border-radius-md);
  margin-bottom: 16px;
  transition: all var(--transition-normal);
  background-color: var(--secondary-color);
  box-shadow: var(--shadow-sm);
}

.polish-item:hover {
  border-color: var(--primary-color);
  box-shadow: 0 4px 12px rgba(99, 102, 241, 0.1);
  transform: translateY(-2px);
}

.polish-style {
  font-size: 13px;
  font-weight: 600;
  color: var(--primary-color);
  margin-bottom: 10px;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.polish-content {
  font-size: 14px;
  color: var(--text-color);
  margin-bottom: 16px;
  line-height: 1.5;
  font-family: 'Inter', sans-serif;
}

.polish-actions {
  display: flex;
  gap: 10px;
}

.action-button {
  flex: 1;
  padding: 8px 16px;
  border: 1px solid var(--border-color);
  border-radius: var(--border-radius-md);
  background-color: var(--card-background);
  color: var(--text-color);
  font-size: 13px;
  font-weight: 500;
  cursor: pointer;
  transition: all var(--transition-normal);
  font-family: 'Inter', sans-serif;
}

.action-button.apply {
  background-color: var(--primary-color);
  color: white;
  border-color: var(--primary-color);
  box-shadow: var(--shadow-sm);
}

.action-button.apply:hover {
  background-color: var(--primary-hover);
  transform: translateY(-1px);
  box-shadow: var(--shadow-md);
}

.action-button.copy:hover {
  background-color: var(--secondary-color);
  transform: translateY(-1px);
  box-shadow: var(--shadow-sm);
}
</style>
