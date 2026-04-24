<template>
  <div v-if="isVisible" class="assistant-panel" :style="panelStyle">
    <div class="panel-header">
      <h3>聊天助手</h3>
      <button class="close-button" @click="hide">×</button>
    </div>
    <div class="panel-content">
      <div class="panel-option" @click="handlePolish">
        <span class="option-icon">✏️</span>
        <span class="option-text">话术润色</span>
      </div>
      <div class="panel-option" @click="handleGenerateReply">
        <span class="option-icon">💬</span>
        <span class="option-text">生成回复</span>
      </div>
      <div class="panel-option" @click="handleExtractInfo">
        <span class="option-icon">📝</span>
        <span class="option-text">提取重点</span>
      </div>
      <div class="panel-option" @click="handleTemplates">
        <span class="option-icon">📋</span>
        <span class="option-text">场景模板</span>
      </div>
      <div class="panel-option" @click="handleSettings">
        <span class="option-icon">⚙️</span>
        <span class="option-text">辅助设置</span>
      </div>
    </div>
    <div class="panel-footer">
      <div class="pet-level">
        <span>宠物等级: {{ petLevel }}</span>
        <div class="exp-bar">
          <div class="exp-fill" :style="{ width: `${expProgress}%` }"></div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, defineProps, defineEmits } from 'vue';
import { getPanelStyle } from '../../utils/animation';

const props = defineProps({
  isVisible: {
    type: Boolean,
    default: false,
  },
  position: {
    type: Object as () => { x: number; y: number },
    default: () => ({ x: 0, y: 0 }),
  },
  size: {
    type: Number,
    default: 80,
  },
});

const emit = defineEmits(['hide', 'polish', 'generateReply', 'extractInfo', 'templates', 'settings']);

const panelStyle = computed((): any => {
  return getPanelStyle(props.position, props.size);
});

const petLevel = 3;
const expProgress = 65;

const hide = () => {
  emit('hide');
};

const handlePolish = () => {
  emit('polish');
  hide();
};

const handleGenerateReply = () => {
  emit('generateReply');
  hide();
};

const handleExtractInfo = () => {
  emit('extractInfo');
  hide();
};

const handleTemplates = () => {
  emit('templates');
  hide();
};

const handleSettings = () => {
  emit('settings');
  hide();
};
</script>

<style scoped>
.assistant-panel {
  background: var(--card-background);
  border-radius: var(--border-radius-lg);
  box-shadow: var(--shadow-lg);
  padding: 16px;
  min-width: 220px;
  z-index: 9998;
  border: 1px solid var(--border-color);
  animation: slideIn 0.2s ease-out;
}

.panel-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
  padding-bottom: 12px;
  border-bottom: 1px solid var(--border-color);
}

.panel-header h3 {
  font-size: 16px;
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

.panel-content {
  margin-bottom: 16px;
}

.panel-option {
  display: flex;
  align-items: center;
  padding: 12px 16px;
  border-radius: var(--border-radius-md);
  cursor: pointer;
  transition: all var(--transition-normal);
  margin-bottom: 8px;
  gap: 12px;
  border: 1px solid transparent;
}

.panel-option:hover {
  background-color: var(--secondary-color);
  transform: translateX(6px);
  box-shadow: var(--shadow-md);
  border-color: var(--primary-color);
}

.option-icon {
  font-size: 20px;
  width: 24px;
  text-align: center;
  transition: all var(--transition-normal);
}

.panel-option:hover .option-icon {
  color: var(--primary-color);
  transform: scale(1.1);
}

.option-text {
  font-size: 15px;
  color: var(--text-color);
  font-weight: 600;
  font-family: 'Inter', sans-serif;
  transition: all var(--transition-normal);
}

.panel-option:hover .option-text {
  color: var(--primary-color);
}

.panel-footer {
  padding-top: 12px;
  border-top: 1px solid var(--border-color);
}

.pet-level {
  font-size: 12px;
  color: var(--light-text);
  font-weight: 500;
  margin-bottom: 6px;
}

.exp-bar {
  width: 100%;
  height: 6px;
  background-color: var(--secondary-color);
  border-radius: 3px;
  overflow: hidden;
  box-shadow: inset 0 1px 2px rgba(0, 0, 0, 0.05);
}

.exp-fill {
  height: 100%;
  background-color: var(--primary-color);
  border-radius: 3px;
  transition: width 0.3s ease;
  box-shadow: 0 1px 3px rgba(99, 102, 241, 0.3);
}
</style>
