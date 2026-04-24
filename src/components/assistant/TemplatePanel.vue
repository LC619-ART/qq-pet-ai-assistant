<template>
  <div v-if="isVisible" class="template-panel">
    <div class="panel-header">
      <h3>场景模板</h3>
      <button class="close-button" @click="hide">×</button>
    </div>
    <div class="panel-content">
      <div class="template-categories">
        <button 
          v-for="category in categories" 
          :key="category"
          :class="['category-button', { active: selectedCategory === category }]"
          @click="selectedCategory = category"
        >
          {{ category }}
        </button>
      </div>
      <div class="template-list">
        <div 
          v-for="template in filteredTemplates" 
          :key="template.id"
          class="template-item"
          @click="selectTemplate(template)"
        >
          <h4>{{ template.title }}</h4>
          <p class="template-preview">{{ template.content.substring(0, 50) }}...</p>
        </div>
      </div>
      <div v-if="selectedTemplate" class="template-details">
        <h4>模板详情</h4>
        <div class="template-content">{{ selectedTemplate.content }}</div>
        <div class="placeholder-form">
          <div 
            v-for="placeholder in selectedTemplate.placeholders" 
            :key="placeholder"
            class="form-group"
          >
            <label>{{ placeholder }}:</label>
            <input 
              type="text" 
              v-model="placeholders[placeholder]"
              class="form-input"
            />
          </div>
        </div>
        <button class="generate-button" @click="generateContent">生成内容</button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue';
import { mockTemplates } from '../../utils/mockData';
import type { Template } from '../../utils/mockData';

const props = defineProps({
  isVisible: {
    type: Boolean,
    default: false,
  },
});

const emit = defineEmits(['hide', 'generateContent']);

const selectedCategory = ref('学生专属');
const selectedTemplate = ref<Template | null>(null);
const placeholders = ref<Record<string, string>>({});

const categories = ['学生专属', '职场专属', '日常社交', '长辈专属'];

const filteredTemplates = computed(() => {
  return mockTemplates.filter(template => template.category === selectedCategory.value);
});

const hide = () => {
  emit('hide');
  resetState();
};

const selectTemplate = (template: Template) => {
  selectedTemplate.value = template;
  // 重置占位符
  const newPlaceholders: Record<string, string> = {};
  template.placeholders.forEach(placeholder => {
    newPlaceholders[placeholder] = '';
  });
  placeholders.value = newPlaceholders;
};

const generateContent = () => {
  if (!selectedTemplate.value) return;
  
  let content = selectedTemplate.value.content;
  for (const [key, value] of Object.entries(placeholders.value)) {
    content = content.replace(new RegExp(`\\{${key}\\}`, 'g'), value || key);
  }
  
  // 触发生成内容事件
  emit('generateContent', content);
  hide();
};

const resetState = () => {
  selectedCategory.value = '学生专属';
  selectedTemplate.value = null;
  placeholders.value = {};
};

// 监听isVisible变化，当面板关闭时重置状态
watch(() => props.isVisible, (newValue) => {
  if (!newValue) {
    resetState();
  }
});
</script>

<style scoped>
.template-panel {
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  background: var(--card-background);
  border-radius: var(--border-radius-lg);
  box-shadow: var(--shadow-lg);
  padding: 20px;
  width: 90%;
  max-width: 550px;
  z-index: 9999;
  border: 1px solid var(--border-color);
  animation: slideIn 0.2s ease-out;
  max-height: 80vh;
  overflow-y: auto;
}

/* 滚动条样式 */
.template-panel::-webkit-scrollbar {
  width: 6px;
}

.template-panel::-webkit-scrollbar-track {
  background: var(--secondary-color);
  border-radius: 3px;
}

.template-panel::-webkit-scrollbar-thumb {
  background: var(--border-color);
  border-radius: 3px;
  transition: all var(--transition-normal);
}

.template-panel::-webkit-scrollbar-thumb:hover {
  background: var(--light-text);
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

.template-categories {
  display: flex;
  gap: 10px;
  margin-bottom: 20px;
  overflow-x: auto;
  padding-bottom: 10px;
  scrollbar-width: none;
  -ms-overflow-style: none;
}

.template-categories::-webkit-scrollbar {
  display: none;
}

.category-button {
  padding: 8px 16px;
  border: 1px solid var(--border-color);
  border-radius: 20px;
  background-color: var(--card-background);
  color: var(--text-color);
  font-size: 13px;
  font-weight: 500;
  cursor: pointer;
  transition: all var(--transition-normal);
  white-space: nowrap;
  box-shadow: var(--shadow-sm);
  font-family: 'Inter', sans-serif;
}

.category-button:hover {
  transform: translateY(-1px);
  box-shadow: var(--shadow-md);
}

.category-button.active {
  background-color: var(--primary-color);
  color: white;
  border-color: var(--primary-color);
  box-shadow: 0 4px 12px rgba(99, 102, 241, 0.3);
}

.template-list {
  margin-bottom: 24px;
}

.template-item {
  padding: 16px;
  border: 1px solid var(--border-color);
  border-radius: var(--border-radius-md);
  margin-bottom: 10px;
  cursor: pointer;
  transition: all var(--transition-normal);
  background-color: var(--secondary-color);
  box-shadow: var(--shadow-sm);
}

.template-item:hover {
  border-color: var(--primary-color);
  box-shadow: 0 4px 12px rgba(99, 102, 241, 0.1);
  transform: translateY(-2px);
}

.template-item h4 {
  font-size: 15px;
  font-weight: 600;
  color: var(--text-color);
  margin-bottom: 6px;
  font-family: 'Inter', sans-serif;
}

.template-preview {
  font-size: 13px;
  color: var(--light-text);
  line-height: 1.5;
  font-family: 'Inter', sans-serif;
}

.template-details {
  padding-top: 20px;
  border-top: 1px solid var(--border-color);
}

.template-details h4 {
  font-size: 16px;
  font-weight: 600;
  color: var(--text-color);
  margin-bottom: 16px;
  font-family: 'Inter', sans-serif;
}

.template-content {
  padding: 16px;
  background-color: var(--secondary-color);
  border-radius: var(--border-radius-md);
  margin-bottom: 20px;
  font-size: 14px;
  line-height: 1.5;
  border: 1px solid var(--border-color);
  font-family: 'Inter', sans-serif;
}

.placeholder-form {
  margin-bottom: 20px;
}

.form-group {
  margin-bottom: 16px;
}

.form-group label {
  display: block;
  font-size: 13px;
  color: var(--light-text);
  margin-bottom: 6px;
  font-weight: 500;
  font-family: 'Inter', sans-serif;
}

.form-input {
  width: 100%;
  padding: 10px 16px;
  border: 1px solid var(--border-color);
  border-radius: var(--border-radius-md);
  font-size: 14px;
  outline: none;
  transition: all var(--transition-normal);
  background-color: var(--card-background);
  color: var(--text-color);
  font-family: 'Inter', sans-serif;
}

.form-input:focus {
  border-color: var(--primary-color);
  box-shadow: 0 0 0 3px rgba(99, 102, 241, 0.1);
}

.generate-button {
  width: 100%;
  padding: 12px;
  background-color: var(--primary-color);
  color: white;
  border: none;
  border-radius: var(--border-radius-md);
  font-size: 15px;
  font-weight: 600;
  cursor: pointer;
  transition: all var(--transition-normal);
  box-shadow: var(--shadow-sm);
  font-family: 'Inter', sans-serif;
}

.generate-button:hover {
  background-color: var(--primary-hover);
  transform: translateY(-1px);
  box-shadow: var(--shadow-md);
}
</style>
